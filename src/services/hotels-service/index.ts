import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotelRooms(id: number) {
    const hotel = hotelsRepository.findById(id);

    if (!hotel) {
        throw notFoundError();
    }

    return await hotelsRepository.findAllRoomsById(id);
}

async function getHotels() {
    return await hotelsRepository.findAll();
}

const hotelsService = {
    getHotelRooms,
    getHotels
};

export default hotelsService;
