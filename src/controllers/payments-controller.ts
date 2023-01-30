import { AuthenticatedRequest } from "@/middlewares";
import { NewPayment } from "@/protocols";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createPaymentForTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const newPayment = req.body as NewPayment;

  try {
    const payment = await paymentsService.createPaymentForTicket(newPayment, userId);

    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getPaymentByTicket(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const { userId } = req;

  try {
    const payment = await paymentsService.getPaymentByUser(ticketId, userId);

    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
