class PhoneNumber {
  constructor(country, number) {
    this._country = country;
    this._number = number;
  }

  get country() {
    return this._country;
  }

  get number() {
    return this._number;
  }

}

module.exports = PhoneNumber;