class HttpError extends Error {
  httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
