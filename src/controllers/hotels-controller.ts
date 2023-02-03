import { Request, Response } from "express";
import httpStatus from "http-status";

export function getHotelRooms(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
        const rooms = hotelsService.getHotelRooms(id);

        res.status(httpStatus.OK).send(rooms);
    } catch(err) {
        if (err.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NO_CONTENT);
        }

        res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export function getHotels(req: Request, res: Response) {
    try {
        const hotels = hotelsService.getHotels();

        res.status(httpStatus.OK).send(hotels);
    } catch(err) {
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
}
