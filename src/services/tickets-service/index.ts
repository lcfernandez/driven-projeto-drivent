import ticketRepository from "@/repositories/ticket-repository";

async function getAllTicketTypes() {
  const ticketTypes = await ticketRepository.findAllTicketTypes();
  
  return ticketTypes;
}

const ticketsService = {
  getAllTicketTypes
};

export default ticketsService;
