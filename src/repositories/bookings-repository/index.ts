import { prisma } from "@/config";

async function findRoomById(id: number) {
    return await prisma.room.findUnique({ where: { id }});
}

async function insertBooking(userId: number, roomId: number) {
    return await prisma.booking.create({ data: { userId, roomId } });
}

async function vacancyStatus(roomId: number) {
    const { capacity } = await prisma.room.findUnique({ where: { id: roomId } });
    const occupancy = await prisma.booking.count({ where: { roomId } });

    if (occupancy === capacity) {
        return false;
    }
    
    return true;
}

export const bookingsRepository = {
    findRoomById,
    vacancyStatus,
    insertBooking
};
