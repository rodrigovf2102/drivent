import hotelRepository from "@/repositories/hotel-repository";
import { Hotel } from "@prisma/client";

async function getHotels(): Promise<Hotel[]> {
  const hotels = await hotelRepository.findAllHotels();
  return hotels;
}

async function getHotelById(hotelId: number): Promise<Hotel> {
  const hotel = await hotelRepository.findHotelById(hotelId);
  return hotel;
}

const hotelServices = {
  getHotels, getHotelById
};

export default hotelServices;
