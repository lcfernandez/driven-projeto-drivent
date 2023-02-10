import { forbiddenError, notFoundError } from "@/errors";
import { bookingsRepository } from "@/repositories/bookings-repository";

async function gettBooking() {
  
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
  gettBooking,
  postBooking,
  putBooking
};
