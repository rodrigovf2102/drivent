import { prisma } from "@/config";

async function findAllHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    }
  });
}

const hotelRepository = { findAllHotels, findHotelById };

export default hotelRepository;
