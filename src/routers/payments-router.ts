import { createPaymentForTicket, getPaymentByTicket } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { createPaymentsSchema } from "@/schemas/payments-schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicket)
  .post("/process", validateBody(createPaymentsSchema), createPaymentForTicket);

export { paymentsRouter };
