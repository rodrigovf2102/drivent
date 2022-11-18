import { prisma } from "@/config";

async function findManyTicketsInfo() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentId },
    include: { TicketType: true }
  });
}

const ticketsRepository = { findManyTicketsInfo, findTicketByEnrollmentId };

export default ticketsRepository;
