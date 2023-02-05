import { authenticateTicket, authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getHotels, getHotelRooms } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken, authenticateTicket)
  .get("/", getHotels)
  .get("/:id", getHotelRooms);

export { hotelsRouter };
