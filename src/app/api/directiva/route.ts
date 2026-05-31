import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "miembroDirectiva", include: { persona: true } };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
