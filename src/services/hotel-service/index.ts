import { invalidDataError, notFoundError, paymentError, unprocessableEntityError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import { Enrollment, Hotel, Room, Ticket, TicketStatus } from "@prisma/client";
import roomRepository from "@/repositories/room-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number): Promise<Hotel[]> {
  await checkCredentialsByUserId(userId);
  const hotels = await hotelRepository.findAllHotels();
  return hotels;
}

async function getHotelRoomsByHotelIdWithNoBookings(hotelId: number, userId: number): Promise<Room[]> {
  await checkCredentialsByUserId(userId);
  if (isNaN(hotelId)) {
    throw unprocessableEntityError();
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

async function checkEnrollmentByUserId(userId: number): Promise<Enrollment> {
  const enrollment = await enrollmentRepository.findWithoutAddressByUserId(userId);
  if(!enrollment) {
    throw invalidDataError(["User must have a enrollment"]);
  }
  return enrollment;
}

async function checkTicketByEnrollmentId(enrollmentId: number): Promise<Ticket> {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);
  if(!ticket) {
    throw invalidDataError(["User must have a ticket"]);
  }
  if(ticket.status!==TicketStatus.PAID) {
    throw paymentError();
  }
  if(!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw invalidDataError(["Ticket must include hotel or must not be remote"]);
  }
  return ticket;
}

async function checkCredentialsByUserId(userId: number) {
  const enrollment = await checkEnrollmentByUserId(userId);
  await checkTicketByEnrollmentId(enrollment.id);
}

const hotelServices = {
  getHotels, getHotelRoomsByHotelIdWithNoBookings, checkCredentialsByUserId
};

export default hotelServices;
