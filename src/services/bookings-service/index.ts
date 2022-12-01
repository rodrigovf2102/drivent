import { invalidDataError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import { Booking } from "@prisma/client";
import hotelServices from "../hotel-service";

async function getBooking(userId: number): Promise<Booking> {
  const booking = await bookingRepository.findBookingByUserId(userId);
  await hotelServices.checkCredentialsByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBooking(userId: number, roomId: number): Promise<Booking> {
  await hotelServices.checkCredentialsByUserId(userId);
  await checkRoom(roomId);

  const booking = await bookingRepository.createBooking(userId, roomId);

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number): Promise<Booking> {
  await hotelServices.checkCredentialsByUserId(userId);
  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) {
    throw invalidDataError(["user does not have a booking"]);
  }
  if (booking.userId !== userId) {
    throw invalidDataError(["booking is not of the user"]);
  }
  await checkRoom(roomId);
  const updateBooking = await bookingRepository.updateBooking(roomId, bookingId);
  return updateBooking;
}

async function checkRoom(roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) {
    throw invalidDataError(["room is full"]);
  }
}

const bookingServices = {
  getBooking, postBooking, updateBooking
};

export default bookingServices;
