class User {
	constructor(name, email, phonenumber, birthdate) {
		this._name = name
		this._email = email
		this._phonenumber = phonenumber
		this._birthdate = birthdate
	}

  get email() {
    return this._email.address
  }

  get firstname() {
    return this._name.firstname
  }

  get lastname() {
    return this._name.lastname
  }

  get phonenumber() {
    return this._phonenumber.number
  }

  get country() {
    return this._phonenumber.country
  }

  get birthdate() {
    return this._birthdate
  }

}

module.exports = User;