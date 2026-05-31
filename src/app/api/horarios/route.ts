import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "horario", include: { empleado: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
