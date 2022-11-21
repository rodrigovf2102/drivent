import { invalidDataError, notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Payment, Ticket } from "@prisma/client";
import paymentRepository, { PaymentCreate } from "@/repositories/payment-repository";
import ticketsRepository, { TicketId, TicketUpdateStatus } from "@/repositories/tickets-repository";
import { PaymentPost } from "@/protocols";

async function getPaymentByUserIdTicketId(userId: number, ticketIdString: string): Promise<Payment> {
  const ticketId = Number(ticketIdString);
  const ticket = await getTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  await checkEnrollmentId(userId, ticket.enrollmentId);
  const payment = await paymentRepository.findPaymentByTicketId(ticketId);

  return payment;
}

async function createPayment(userId: number, paymentInfo: PaymentPost): Promise<Payment> {
  const ticket = await getTicketById(paymentInfo.ticketId);
  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
  await checkEnrollmentId(userId, ticket.enrollmentId);
  const cardLastDigits = paymentInfo.cardData.number.toString().slice(-4);
  const createTicket: PaymentCreate = {
    ticketId: ticket.id,
    value: ticketType.price,
    cardIssuer: paymentInfo.cardData.issuer,
    cardLastDigits,
  };
  const payment = await paymentRepository.createPayment(createTicket);
  const ticketId: TicketId = { id: ticket.id };
  const ticketStatus: TicketUpdateStatus = { status: "PAID" };
  await ticketsRepository.updateStatusByTicketId(ticketId, ticketStatus);
  return payment;
}

async function checkEnrollmentId(userId: number, enrollmentId: number) {
  const enrollment = await enrollmentRepository.findWithoutAddressByUserId(userId);
  if (enrollmentId !== enrollment.id) {
    const error = [];
    error[0] = "User id is not associated with ticket";
    throw invalidDataError(error);
  }
}

async function getTicketById(ticketId: number): Promise<Ticket> {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

const paymentsService = { getPaymentByUserIdTicketId, createPayment };

export default paymentsService;
