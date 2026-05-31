import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-helpers";

const options = { model: "ingreso", include: { cuentaBancaria: true, persona: true } };

export const GET = createGetHandler(options);
export const PUT = createUpdateHandler(options);
export const DELETE = createDeleteHandler(options);
