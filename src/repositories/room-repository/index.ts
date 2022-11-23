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

const roomRepository = { findHotelRoomsByHotelIdWithNoBookings };

export default roomRepository;
