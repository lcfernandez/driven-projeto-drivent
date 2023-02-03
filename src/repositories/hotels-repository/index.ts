import { prisma } from "@/config";

async function findAll() {
    return await prisma.hotel.findMany();
}

async function findById(id: number) {
    return await prisma.hotel.findUnique({ where: { id } });
}

async function findAllRoomsById(hotelId: number) {
    return await prisma.room.findMany({ where: { hotelId } });
}

const hotelsRepository = {
    findAll,
    findById,
    findAllRoomsById
};

export default hotelsRepository;
