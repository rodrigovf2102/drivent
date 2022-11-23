import { invalidDataError, notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import { Hotel } from "@prisma/client";

async function getHotels(): Promise<Hotel[]> {
  const hotels = await hotelRepository.findAllHotels();
  return hotels;
}

async function getHotelById(hotelId: number): Promise<Hotel> {
  if (isNaN(hotelId)) {
    throw invalidDataError(["hotelId is not a number"]);
  }
  const hotel = await hotelRepository.findHotelById(hotelId);
  if(!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelServices = {
  getHotels, getHotelById
};

export default hotelServices;
