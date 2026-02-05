export class CustomError extends Error {
  public status: number = 500;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends CustomError {
  constructor(message?: string) {
    super(message || "NotFound", 404);
  }
}

export class BadRequestError extends CustomError {
  constructor(message?: string) {
    super(message || "BadRequest", 400);
  }
}
