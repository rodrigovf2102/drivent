import { request } from "@/utils/request";
import { notFoundError } from "@/errors";
import addressRepository, { CreateAddressParams } from "@/repositories/address-repository";
import enrollmentRepository, { CreateEnrollmentParams } from "@/repositories/enrollment-repository";
import { exclude } from "@/utils/prisma-utils";
import { Ticket, TicketType } from "@prisma/client";
import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketsTypes(): Promise<TicketType[]> {
  const ticketsTypes = await ticketsRepository.findManyTicketsInfo();

  return ticketsTypes;
}

async function getTicketByEnrollmentId(userId: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithoutAddressByUserId(userId);
  if(!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) {
    throw notFoundError();
  }
  return ticket;
}

const ticketsService = { getTicketsTypes, getTicketByEnrollmentId };

export default ticketsService;
