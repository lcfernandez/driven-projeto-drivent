import { prisma } from "@/config";

async function findBookingById(id: number) {
  return await prisma.booking.findFirst({ where: { id } });
}

async function findBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({ where: { userId }, include: { Room: true } });
}

async function findRoomById(id: number) {
  return await prisma.room.findUnique({ where: { id } });
}

async function insertBooking(userId: number, roomId: number) {
  return await prisma.booking.create({ data: { userId, roomId } });
}

async function updateBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({ where: { id: bookingId }, data: { roomId } });
}

async function vacancyStatus(roomId: number) {
  const { capacity } = await prisma.room.findUnique({ where: { id: roomId } });
  const occupancy = await prisma.booking.count({ where: { roomId } });

  if (occupancy < capacity) {
    return true;
  }

  return false;
}

export const bookingRepository = {
  findBookingById,
  findBookingByUserId,
  findRoomById,
  updateBooking,
  vacancyStatus,
  insertBooking
};
