import { invalidDataError, notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import { Hotel, Room } from "@prisma/client";
import roomRepository from "@/repositories/room-repository";

async function getHotels(): Promise<Hotel[]> {
  const hotels = await hotelRepository.findAllHotels();
  return hotels;
}

async function getHotelRoomsByHotelIdWithNoBookings(hotelId: number): Promise<Room[]> {
  if (isNaN(hotelId)) {
    throw invalidDataError(["hotelId is not a number"]);
  }
  const hotel = await hotelRepository.findHotelById(hotelId);
  
  if(!hotel) {
    throw invalidDataError(["hotelId doesnt exist"]);
  }
  const rooms = await roomRepository.findHotelRoomsByHotelIdWithNoBookings(hotelId);
  if(rooms.length===0) {
    throw notFoundError();
  }
  return rooms;
}

const hotelServices = {
  getHotels, getHotelRoomsByHotelIdWithNoBookings
};

export default hotelServices;
