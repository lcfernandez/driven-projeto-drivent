import { AuthenticatedRequest } from "@/middlewares";
import { bookingsService } from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingsService.getBooking(userId);

    res.status(httpStatus.OK).send(booking);
  } catch (err) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const { id } = await bookingsService.postBooking(userId, roomId);

    res.status(httpStatus.CREATED).send({ bookingId: id });
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = Number(req.params.bookingId);

  try {
    const { id } = await bookingsService.putBooking(userId, bookingId, roomId);

    res.status(httpStatus.CREATED).send({ bookingId: id });
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.sendStatus(httpStatus.FORBIDDEN);
  }
}
