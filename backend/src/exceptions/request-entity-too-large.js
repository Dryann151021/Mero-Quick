import ClientError from './client-error.js';

class RequestEntityTooLargeError extends ClientError {
  constructor(message) {
    super(message, 413);
    this.name = 'RequestEntityTooLargeError';
  }
}

export default RequestEntityTooLargeError;
