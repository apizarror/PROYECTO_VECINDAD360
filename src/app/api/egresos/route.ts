import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "egreso", include: { cuentaBancaria: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
