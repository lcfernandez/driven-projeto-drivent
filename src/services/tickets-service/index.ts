import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

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
  getAllTicketsByUser,
  getAllTicketTypes
};

export default ticketsService;
