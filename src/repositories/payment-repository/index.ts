import { prisma } from "@/config";
import { Payment } from "@/protocols";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId }
  });
}

async function createPayment(data: PaymentCreate) {
  return prisma.payment.create({
    data,
  });
}

export type PaymentCreate = Omit<Payment, "id">

const paymentRepository = { findPaymentByTicketId, createPayment };

export default paymentRepository;
