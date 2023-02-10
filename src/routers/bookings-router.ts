import { authenticateTicket, authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";
import { getBooking, postBooking, putBooking } from "@/controllers";
import { createBookingSchema } from "@/schemas/bookings-schema";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", authenticateTicket, validateBody(createBookingSchema), postBooking)
  .put("/:bookingId", putBooking);

export { bookingsRouter };
