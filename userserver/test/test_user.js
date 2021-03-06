let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

const { userExample, updateUserExample } = require('./examples');

chai.use(chaiHttp);
const url = 'http://localhost:8080';

const api_key = 'fake_api_key';

//Post:
describe('Post a new User',() => {
	it('should create a user and return it', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send(userExample)
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('firstname');
				expect(res.body).to.have.property('lastname');
				expect(res.body).to.have.property('email');
				expect(res.body).to.have.property('country');
				expect(res.body).to.have.property('phonenumber');
				expect(res.body).to.have.property('birthdate');
				expect(res.body).to.have.property('id');
				//Delete the created user
				let userID = res.body.id;
				chai.request(url)
					.delete('/users/' + userID)
					.set('api-key', api_key)
					.send()
					.end((err, res) => {
						expect(res).to.have.status(200);
						done();
					})
			});
	});
});

describe('Post a user with the email of another that already exists',() => {
	it('should return an error', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send(userExample)
			.end((err, res) => {
				expect(res).to.have.status(201);
				userExample.id = userExample.id + 1;
				chai.request(url)
					.post('/users')
					.set('api-key', api_key)
					.send(userExample)
					.end((err, res) => {
						expect(res).to.have.status(400);
						done();
					})
			});
	});
});

describe('Post an invalid user',() => {
	it('should return an error', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send({ firstname: 'nico' })
			.end((err, res) => {
				expect(res).to.have.status(400);
 				done();
			});
	});
});

describe('Post an user without permission',() => {
	it('should return a unauthorized error', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.post('/users')
			.send({ firstname: 'nico' })
			.end((err, res) => {
				expect(res).to.have.status(401);
 				done();
			});
	});
});

describe('Post an user with wrong permission',() => {
	it('should return a unauthorized error', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.post('/users')
			.set('api-key', 'asdasd')
			.send({ firstname: 'nico' })
			.end((err, res) => {
				expect(res).to.have.status(401);
 				done();
			});
	});
});

//Get All:
describe('Get all the users', () => {
	it('should return a JSON with a list of users', (done) => {
		updateUserExample(userExample);
		//Create a first user:
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send(userExample)
			.end((err, res) => {
				expect(res).to.have.status(201)
				let userID1 = res.body.id;
				updateUserExample(userExample);
				//Create a second user:
				chai.request(url)
					.post('/users')
					.set('api-key', api_key)
					.send(userExample)
					.end((err, res) => {
						expect(res).to.have.status(201)
						let userID2 = res.body.id;
						//Get the users (what we want to test):
						chai.request(url)
							.get('/users')
							.set('api-key', api_key)
							.send()
							.end((err, res) => {
								expect(res).to.have.status(200);
								expect(res.body).to.have.property('amount');
								expect(res.body.amount).to.not.equal(0);
								expect(res.body).to.have.property('users');
								expect(res.body.users).to.be.an('array').that.is.not.empty;
								expect(res.body.users[0]).to.have.property('firstname');
								expect(res.body.users[0]).to.have.property('lastname');
								expect(res.body.users[0]).to.have.property('email');
								expect(res.body.users[0]).to.have.property('country');
								expect(res.body.users[0]).to.have.property('phonenumber');
								expect(res.body.users[0]).to.have.property('birthdate');
								expect(res.body.users[0]).to.have.property('photo');
								expect(res.body.users[0]).to.have.property('id');
								//Delete the users that we used for the test:
								chai.request(url)
									.delete('/users/' + userID2)
									.set('api-key', api_key)
									.send()
									.end((err, res) => {
										expect(res).to.have.status(200);
										chai.request(url)
											.delete('/users/' + userID1)
											.set('api-key', api_key)
											.send()
											.end((err, res) => {
												expect(res).to.have.status(200);
												done();
											})
									})
							})
					})
			})
	})
})

describe('Get all users without permission',() => {
	it('should return a unauthorized error', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.get('/users')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
 				done();
			});
	});
});

describe('Get all users with wrong permission',() => {
	it('should return a unauthorized error', (done) => {
		updateUserExample(userExample);
		chai.request(url)
			.get('/users')
			.set('api-key', 'asdasd')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
 				done();
			});
	});
});

//Get:
describe('Get an user by ID', () => {
	it('should return an user as a json', (done) => {
		updateUserExample(userExample);
		//Create a user first:
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send(userExample)
			.end((err, res) => {
				expect(res).to.have.status(201)
				let userID = res.body.id;
				//Get the user by ID (what we want to test):
				chai.request(url)
					.get('/users/' + userID)
					.set('api-key', api_key)
					.send()
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.have.property('id');
						expect(res.body).to.have.property('firstname');
						expect(res.body).to.have.property('lastname');
						expect(res.body).to.have.property('email');
						expect(res.body).to.have.property('country');
						expect(res.body).to.have.property('phonenumber');
						expect(res.body).to.have.property('birthdate');
						expect(res.body).to.have.property('photo');
						//Delete the user that we used for the test:
						chai.request(url)
							.delete('/users/' + userID)
							.set('api-key', api_key)
							.send()
							.end((err, res) => {
								done();
							})
					})
			})
	})
})

describe('Get an invalid user by ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1')
			.set('api-key', api_key)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get a user without permission', () => {
	it('should return a unauthorized error', (done) => {
		chai.request(url)
			.get('/users/-1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			})
	})
})

describe('Get a user with wrong permission', () => {
	it('should return a unauthorized error', (done) => {
		chai.request(url)
			.get('/users/-1')
			.set('api-key', 'asdasd')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			})
	})
})

//Patch
describe('Update a user by ID', () => {
	it('should update the indicated fields of the user', (done) => {
		updateUserExample(userExample);
		//Create a user
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send(userExample)
			.end((err, res) => {
				expect(res).to.have.status(201);
				let userID = res.body.id;
				//Patch the user (what we want to test):
				chai.request(url)
					.patch('/users/' + userID)
					.set('api-key', api_key)
					.send({ firstname: "loco", photo: 'https://picsum.photos/200/300', invalidField: "i shouldnt be added" })
					.end((err, res) => {
						expect(res).to.have.status(200);
						expect(res.body).to.have.property('firstname');
						expect(res.body).to.have.property('photo');
						expect(res.body.photo).to.equal('https://picsum.photos/200/300');
						expect(res.body.firstname).equal('loco');
						expect(res.body).to.not.have.property('invalidField');
						//Delete the user:
						chai.request(url)
							.delete('/users/' + userID)
							.set('api-key', api_key)
							.send()
							.end((err, res) => {
								expect(res).to.have.status(200);
								done();
							})
					})
			})
	})
})

describe('Update a user with an invalid ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.patch('/users/-1')
			.set('api-key', api_key)
			.send({firstname: "pepe"})
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Update a user without permission', () => {
	it('should return a unauthorized error', (done) => {
		chai.request(url)
			.patch('/users/-1')
			.send({firstname: "pepe"})
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			})
	})
})

describe('Update a user with wrong permission', () => {
	it('should return a unauthorized error', (done) => {
		chai.request(url)
			.patch('/users/-1')
			.set('api-key', 'asdasd')
			.send({firstname: "pepe"})
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			})
	})
})

//Delete
describe('Delete a user', () => {
	it('should delete a user by ID and a get should return a "not found" error', (done) => {
		updateUserExample(userExample);
		//Create a user
		chai.request(url)
			.post('/users')
			.set('api-key', api_key)
			.send(userExample)
			.end((err, res) => {
				expect(res).to.have.status(201);
				let userID = res.body.id;
				//Delete a user (what we want to test):
				chai.request(url)
					.delete('/users/' + userID)
					.set('api-key', api_key)
					.send()
					.end((err, res) => {
						expect(res).to.have.status(200);
						//Now if we want to get the user we will get a not found error:
						chai.request(url)
							.get('/users/' + userID)
							.set('api-key', api_key)
							.send()
							.end((err, res) => {
								expect(res).to.have.status(404);
								done();
							})
					})
			})
	})
})

describe('Delete a user with an invalid ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.delete('/users/-1')
			.set('api-key', api_key)
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Delete a user without permission', () => {
	it('should return a unauthorized error', (done) => {
		chai.request(url)
			.delete('/users/-1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			})
	})
})

describe('Delete a user with wrong permission', () => {
	it('should return a unauthorized error', (done) => {
		chai.request(url)
			.delete('/users/-1')
			.set('api-key', 'asdasd')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(401);
				done();
			})
	})
})
