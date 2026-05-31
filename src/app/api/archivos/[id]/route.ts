import { createGetHandler, createUpdateHandler, createDeleteHandler } from "@/lib/api-helpers";

const options = { model: "archivo" };

export const GET = createGetHandler(options);
export const PUT = createUpdateHandler(options);
export const DELETE = createDeleteHandler(options);
