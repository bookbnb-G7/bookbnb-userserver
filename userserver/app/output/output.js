exports.userCreated = (res, id, user) => {
    res.status(201)
    //TODO: Return user Jsonized
    res.json({ success: true, 
                id,
                firstname: user.firstname, 
                lastname: user.lastname,
                email: user.email,
                birthdate: user.birthdate,
                phonenumber: user.phonenumber });
}

exports.error = (res, status, error) => {
    res.status(status);
    res.json({ success: false, error: error.message });
}

exports.one_user = (res, user) => {
    res.status(200);
    res.json(user);
}

exports.deleted = (res, id) => {
    res.status(200);
    let response = 'User ' + id + ' deleted';
    res.json({ success: true, message: response })
}

exports.removeAll = (res) => {
    res.status(200);
    res.json({ success: true })
}

exports.userPatched = (res, id, user) => {
    res.status(200)
    //TODO: Return user Jsonized
    res.json({ success: true, 
                id,
                firstname: user.firstname, 
                lastname: user.lastname,
                email: user.email,
                birthdate: user.birthdate,
                phonenumber: user.phonenumber });
}