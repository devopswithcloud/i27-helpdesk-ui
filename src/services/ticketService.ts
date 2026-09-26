import api from "@/lib/api";

/* =========================
   Types
========================= */

export interface CreateTicketPayload {
  title: string;
  description: string;
  email: string;
  priority: string;
}

export interface CreateTicketResponse {
  ticketCode: string;
  status: string;
}

/* =========================
   API Calls
========================= */

export async function createTicket(
  payload: CreateTicketPayload
): Promise<CreateTicketResponse> {
  const response = await api.post("/tickets", payload);
  return response.data;
}
