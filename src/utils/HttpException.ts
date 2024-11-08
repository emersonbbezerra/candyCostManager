export class HttpException extends Error {
  constructor(
    public status: number,
    public message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    const error = {
      status: this.status,
      message: this.message,
    };

    if (this.details) {
      return { ...error, details: this.details };
    }

    return error;
  }
}
