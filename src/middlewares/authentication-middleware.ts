import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

import { unauthorizedError } from "@/errors";
import { prisma } from "@/config";

export async function authenticateTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId }
    });

    if (!enrollment) return generateNotFoundResponse(res);

    const ticket = await prisma.ticket.findFirst({
      where: { enrollmentId: enrollment.id },
      include: {
        TicketType: true
      }
    });

    if (!ticket) return generateNotFoundResponse(res);

    if (ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      return generatePaymentRequiredResponse(res);
    }
    
    return next();
  } catch (err) {
    return generateNotFoundResponse(res);
  }
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return generateUnauthorizedResponse(res);

  const token = authHeader.split(" ")[1];
  if (!token) return generateUnauthorizedResponse(res);

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.session.findFirst({
      where: {
        token,
      },
    });
    if (!session) return generateUnauthorizedResponse(res);

    req.userId = userId;
    //TODO mudar aqui
    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

function generateNotFoundResponse(res: Response) {
  res.status(httpStatus.NOT_FOUND).send(unauthorizedError());
}

function generatePaymentRequiredResponse(res: Response) {
  res.status(httpStatus.PAYMENT_REQUIRED).send(unauthorizedError());
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: number;
};
