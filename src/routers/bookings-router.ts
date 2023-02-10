import { authenticateTicket, authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getBooking, postBooking, putBooking } from "@/controllers";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", authenticateTicket, postBooking)
  .put("/:bookingId", putBooking);

export { bookingsRouter };
