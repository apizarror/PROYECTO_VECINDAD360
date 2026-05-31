import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "inmueble" };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
