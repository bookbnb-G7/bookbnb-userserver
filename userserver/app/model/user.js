class User {
	constructor(name, email, phonenumber, birthdate) {
		this.name = name
		this.email = email
		this.phonenumber = phonenumber
		this.birthdate = birthdate
	}

  get email() {
    return this.email.adress
  }

  get firstname() {
    return this.name.firstname
  }

  get lastname() {
    return this.name.lastname
  }

  get phonenumber() {
    return this.phonenumber.number
  }

  get country() {
    return this.phonenumber.country
  }

  get birthdate() {
    return this.birthdate
  }

}