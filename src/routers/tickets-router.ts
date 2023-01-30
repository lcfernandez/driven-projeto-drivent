import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicket, getTicketTypes, getTicketsByUser } from "@/controllers";
import { createTicketsSchema } from "@/schemas/tickets-schemas";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", getTicketsByUser)
  .get("/types", getTicketTypes)
  .post("/", validateBody(createTicketsSchema), createTicket);

export { ticketsRouter };
