import { forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-repository";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  
  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room
  };
}

async function postBooking(userId: number, roomId: number) {
  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }
  
  const vacancy = await bookingRepository.vacancyStatus(roomId);

  if (!vacancy) {
    throw forbiddenError();
  }
  
  return await bookingRepository.insertBooking(userId, roomId);
}

async function putBooking(userId: number, bookingId: number, roomId: number) {
  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    throw notFoundError();
  }

  if (booking.userId !== userId) {
    throw forbiddenError();
  }

  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }
  
  const vacancy = await bookingRepository.vacancyStatus(roomId);

  if (!vacancy) {
    throw forbiddenError();
  }
  
  return await bookingRepository.updateBooking(bookingId, roomId);
}

export const bookingService = {
  getBooking,
  postBooking,
  putBooking
};
