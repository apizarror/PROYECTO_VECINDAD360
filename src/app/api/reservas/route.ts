import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "reserva", include: { areaComun: true, persona: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
