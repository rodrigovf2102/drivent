import { notFoundError } from "@/errors";
import enrollmentRepository, { CreateEnrollmentParams } from "@/repositories/enrollment-repository";
import { Enrollment, Ticket, TicketType } from "@prisma/client";
import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketsTypes(): Promise<TicketType[]> {
  const ticketsTypes = await ticketsRepository.findManyTicketsInfo();

  return ticketsTypes;
}

async function getTicketByEnrollmentId(userId: number): Promise<Ticket> {
  const enrollment = await getEnrollmentByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) {
    throw notFoundError();
  }
  return ticket;
}

async function postTicketByUserIdTicketTypeId(userId: number, ticketTypeId: number): Promise<Ticket> {
  await getTicketTypeById(ticketTypeId);
  const enrollmentId = (await getEnrollmentByUserId(userId)).id;
  const status = "RESERVED";
  return ticketsRepository.createNewTicket({ ticketTypeId, enrollmentId, status });
}

async function getEnrollmentByUserId(userId: number): Promise<Enrollment> {
  const enrollment = await enrollmentRepository.findWithoutAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return enrollment;
}

async function getTicketTypeById(ticketTypeId: number): Promise<TicketType> {
  const ticketType = await ticketsRepository.findTicketTypeById(ticketTypeId);
  if (!ticketType) {
    throw notFoundError();
  }
  return ticketType;
}

export type TicketPost = Pick<Ticket, "ticketTypeId">;

const ticketsService = { getTicketsTypes, getTicketByEnrollmentId, postTicketByUserIdTicketTypeId };

export default ticketsService;
