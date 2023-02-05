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
    const hotels = await hotelsRepository.findAll();

    if (!hotels.length) {
        throw notFoundError();
    }
    
    return hotels;
}

const hotelsService = {
    getHotelRooms,
    getHotels
};

export default hotelsService;
