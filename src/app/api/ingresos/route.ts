import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "ingreso", include: { cuentaBancaria: true, persona: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
