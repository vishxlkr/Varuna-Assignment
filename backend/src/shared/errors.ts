export class NotFoundError extends Error {
  status = 404 as const;
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends Error {
  status = 400 as const;
  constructor(message = 'Bad request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class ConflictError extends Error {
  status = 409 as const;
  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

