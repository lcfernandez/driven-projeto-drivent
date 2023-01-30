import { prisma } from "@/config";

async function findAllTicketTypes() {
  return await prisma.ticketType.findMany();
}

const ticketRepository = {
  findAllTicketTypes
};

export default ticketRepository;
