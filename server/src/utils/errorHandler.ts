import { CustomError } from "./customError";
import { PrismaClientKnownRequestError } from "../../prisma/generated/runtime/client";

interface IErrorResponse {
  message: string;
  status: number;
}

export default function errorHandler(err: unknown): IErrorResponse {
  if (err instanceof PrismaClientKnownRequestError) {
    return { message: err.message, status: 400 };
  } else if (err instanceof CustomError) {
    return { message: err.message, status: err.status };
  } else {
    return { message: "Internal Server Error", status: 500 };
  }
}
