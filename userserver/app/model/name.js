class Name {
	constructor(firstname, lastname) {
		this._firstname = firstname;
    this._lastname = lastname;
	}

  get firstname() {
    return this._firstname;
  }

  get lastname() {
    return this._lastname;
  }
}

module.exports = Name;