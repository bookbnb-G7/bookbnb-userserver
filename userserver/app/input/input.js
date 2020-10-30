const User = require('../model/user');
const Name = require('../model/name');
const Email = require('../model/email');
const PhoneNumber = require('../model/phonenumber');

const input = {}

exports.create = (body) => {
    let name = new Name(body.firstname, body.lastname);
    let email = new Email(body.email);
    let phonenumber = new PhoneNumber(body.country, body.phonenumber);
    return new User(name, email, phonenumber, body.birthdate);
}

exports.readId = (req) => {
    const { id } = req.params;
    return id
}


