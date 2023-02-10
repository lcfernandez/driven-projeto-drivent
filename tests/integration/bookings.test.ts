import app, { init } from "@/app";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";
import { createEnrollmentWithAddress, createHotel, createTicket, createUser, generateCreditCardData } from "../factories";
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

    // it("should respond with status 200 and with booking data", async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await prisma.ticketType.create({
    //     data: {
    //       name: faker.name.findName(),
    //       price: faker.datatype.number(),
    //       isRemote: false,
    //       includesHotel: true
    //     }
    //   });
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    //   // not using createPayment because the function does not update ticket status
    //   const body = { ticketId: ticket.id, cardData: generateCreditCardData() };
    //   await server.post("/payments/process").set("Authorization", `Bearer ${token}`).send(body);

    //   const hotel = await createHotel();
    // });
  });
});

// describe("POST /booking", () => {
  
// });

// describe("PUT /booking/:bookingId", () => {
  
// });