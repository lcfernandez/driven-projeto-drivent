import { notFoundError, unauthorizedError } from "@/errors";
import { NewPayment } from "@/protocols";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { exclude } from "@/utils/prisma-utils";

async function createPaymentForTicket(newPayment: NewPayment, userId: number) {
  const ticket = await ticketRepository.findTicketById(newPayment.ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }
  
  const payment = await paymentRepository.createPaymentForTicket(newPayment, ticket.TicketType.price);

  await ticketRepository.updateTicketStatus(newPayment.ticketId);
  
  return payment;
}

async function getPaymentByUser(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const payment = await paymentRepository.findPaymentByTicket(ticketId);

  if (payment.Ticket.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  return exclude(payment, "Ticket");
}

const paymentsService = {
  createPaymentForTicket,
  getPaymentByUser
};

export default paymentsService;
