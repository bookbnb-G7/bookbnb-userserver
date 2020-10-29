class Email {
	constructor(address) {
    this._address = address;
  }

  get address() {
   return this._address
  }
}

module.exports = Email;