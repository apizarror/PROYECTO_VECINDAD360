import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "visita", include: { persona: true, inmueble: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
