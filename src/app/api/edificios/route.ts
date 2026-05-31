import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "edificio" };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
