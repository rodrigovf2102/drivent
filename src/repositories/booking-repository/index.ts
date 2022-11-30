import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true }
  });
}

async function findBookingByIdByRoomId(userId: number, roomId: number) {
  return prisma.booking.findFirst({
    where: { userId, roomId },
    include: { Room: true }
  });
}

async function findBookingById(id: number) {
  return prisma.booking.findFirst({
    where: { id },
    include: { Room: true }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId }
  });
}

async function updateBooking(roomId: number, id: number) {
  return prisma.booking.update({
    where: { id },
    data: { roomId }
  });
}

const bookingRepository = { findBookingByUserId, findBookingById, createBooking, updateBooking, findBookingByIdByRoomId };

export default bookingRepository;
