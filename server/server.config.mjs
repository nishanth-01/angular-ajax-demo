export default class Config {
  static #port = 8080;
  static #host = 'localhost';

  static get port() {
    return this.#port;
  }

  static get host() {
    return this.#host;
  }
}
