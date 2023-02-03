async function getHotelRooms(id: Number) {
    return await hotelsRepository.findAllRoomsById;
}

async function getHotels() {
    return await hotelsRepository.findAll;
}

const hotelsService = {
    getHotelRooms,
    getHotels
};

export default hotelsService;
