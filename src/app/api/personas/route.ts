import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "persona", include: { contactos: true, vinculaciones: { include: { inmueble: true } } } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
