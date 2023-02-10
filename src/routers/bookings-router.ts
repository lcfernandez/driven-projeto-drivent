import { authenticateTicket, authenticateToken, validateBody, validateParams } from "@/middlewares";
import { Router } from "express";
import { getBooking, postBooking, putBooking } from "@/controllers";
import { createBookingSchema, updateBookingSchema } from "@/schemas/bookings-schemas";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", authenticateTicket, validateBody(createBookingSchema), postBooking)
  .put("/:bookingId", validateBody(createBookingSchema), validateParams(updateBookingSchema), putBooking);

export { bookingsRouter };
