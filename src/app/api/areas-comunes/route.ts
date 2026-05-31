import { createListHandler, createCreateHandler } from "@/lib/api-helpers";

const options = { model: "areaComun" };

export const GET = createListHandler(options);
export const POST = createCreateHandler(options);
