import { prisma } from "@/config";

async function findHotelRoomsByHotelIdWithNoBookings(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
      Booking: undefined
    },
    include: { Booking: true }
  });
}

async function findRoomById(id: number) {
  return prisma.room.findFirst({
    where: { id },
    include: { Booking: true }
  });
}

const roomRepository = { findHotelRoomsByHotelIdWithNoBookings, findRoomById };

export default roomRepository;
