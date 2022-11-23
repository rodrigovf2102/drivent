import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findManyTicketsInfo() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentId },
    include: { TicketType: true }
  });
}

async function findTicketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findFirst({
    where: { id: ticketTypeId }
  });
}

async function createNewTicket(data: TicketCreate) {
  return prisma.ticket.create({
    data,
    include: { TicketType: true }
  });
}

async function findTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: { id }
  });
}

async function updateStatusByTicketId(ticketId: TicketId, ticketStatus: TicketUpdateStatus ) {
  return prisma.ticket.update({
    where: ticketId,
    data: ticketStatus
  });
}

export type TicketUpdateStatus = Pick<Ticket, "status">
export type TicketId = Pick<Ticket, "id">
export type TicketCreate = Pick<Ticket, "ticketTypeId" | "enrollmentId" | "status" >

const ticketsRepository = { findManyTicketsInfo, findTicketByEnrollmentId, findTicketTypeById,
  createNewTicket, findTicketById, updateStatusByTicketId };

export default ticketsRepository;
