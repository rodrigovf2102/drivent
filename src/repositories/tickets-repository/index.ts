import { prisma } from "@/config";
import { Prisma, TicketType } from "@prisma/client";

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

async function createNewTicket(data: Prisma.TicketUncheckedCreateInput) {
  return prisma.ticket.create({
    data,
  });
}

const ticketsRepository = { findManyTicketsInfo, findTicketByEnrollmentId, findTicketTypeById, createNewTicket };

export default ticketsRepository;
