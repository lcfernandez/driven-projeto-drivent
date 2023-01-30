import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketsByUser } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTicketsByUser)
  .get("/types", getTicketTypes);

export { ticketsRouter };
