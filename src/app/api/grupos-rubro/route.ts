import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "grupoRubro", include: { servicios: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
