export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
} 