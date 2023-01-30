import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function createTicket(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.createTicket(ticketTypeId, enrollment.id);
  
  return ticket;
}

async function getAllTicketsByUser(userId: number) {
  const ticket = await ticketRepository.findTicketByUser(userId);

  if (!ticket) {
    throw notFoundError();
  }
  
  return ticket;
}

async function getAllTicketTypes() {
  const ticketTypes = await ticketRepository.findAllTicketTypes();
  
  return ticketTypes;
}

const ticketsService = {
  createTicket,
  getAllTicketsByUser,
  getAllTicketTypes
};

export default ticketsService;
