import app, { init } from "@/app";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createRoom,
  createTicket,
  createTicketType,
  createTicketTypeRemote,
  createTicketTypeWithHotel,
  createUser,
  generateCreditCardData
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have a booking yet", async () => {
      const token = await generateValidToken();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      // not using createPayment because the function does not update ticket status
      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
      await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const booking = await createBooking(user.id, room.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        }
      })
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 when ticket was not paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 402 when ticket was paid but it is remote", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      // not using createPayment because the function does not update ticket status
      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
      await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 402 when ticket was paid, isnt remote but hotel is not included", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: false
        }
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      // not using createPayment because the function does not update ticket status
      const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
      await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    describe("when ticket is valid", () => {
      it("should respond with status 400 when roomId is not present in body", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        // not using createPayment because the function does not update ticket status
        const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
        await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({});

        expect(response.status).toEqual(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 400 when roomId is not valid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        // not using createPayment because the function does not update ticket status
        const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
        await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: faker.name.firstName() });

        expect(response.status).toEqual(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 404 when roomId doesnt exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        // not using createPayment because the function does not update ticket status
        const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
        await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: 0 });

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it("should respond with status 403 when there are no vacancy", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        // not using createPayment because the function does not update ticket status
        const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
        await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

        const hotel = await createHotel();
        const room = await createRoom(hotel.id, 1);

        await createBooking(user.id, room.id);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
      });

      it("should respond with status 201 and with bookingId", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        // not using createPayment because the function does not update ticket status
        const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
        await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toEqual(httpStatus.CREATED);
        expect(response.body).toEqual(
          expect.objectContaining({ bookingId: expect.any(Number)})
        )
      });
    });
  });
});

// describe("PUT /booking/:bookingId", () => {
  
// });
