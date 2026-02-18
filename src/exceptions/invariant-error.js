import ClientError from "./client-error.js";

class InvariantError extends ClientError {
  constructor(message) {
    super(message);

    this.name = "Invariant Error";
  }
}

export default InvariantError;
