import { forbiddenError, notFoundError } from "@/errors";
import { bookingsRepository } from "@/repositories/bookings-repository";

async function getBooking(userId: number) {
  const booking = await bookingsRepository.findBookingByUserId(userId);
  
  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room
  };
}

async function postBooking(userId: number, roomId: number) {
  const room = await bookingsRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }
  
  const vacancy = await bookingsRepository.vacancyStatus(roomId);

  if (!vacancy) {
    throw forbiddenError();
  }
  
  return await bookingsRepository.insertBooking(userId, roomId);
}

async function putBooking(previousRoomId: number, newRoomId: number) {
  
}

export const bookingsService = {
  getBooking,
  postBooking,
  putBooking
};
