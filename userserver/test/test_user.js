let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:8080';

//Post:
describe('Post a new User',() => {
	it('should create a user and return it', (done) => {
		chai.request(url)
			.post('/users')
			.send({ firstname: 'nico', lastname: 'fandos', email: 'nico@nico.com', country: 'Argentina', phonenumber: '541111111111', birthdate: '1998-12-06' })
			.end((err, res) => {
				console.log(res.body);
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('firstname');
				expect(res.body).to.have.property('lastname');
				expect(res.body).to.have.property('email');
				expect(res.body).to.have.property('country');
				expect(res.body).to.have.property('phonenumber');
				expect(res.body).to.have.property('birthdate');
 				done();
			});
	});
});

describe('Post an invalid user',() => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users')
			.send({ firstname: 'nico' })
			.end((err, res) => {
				console.log(res.body);
				expect(res).to.have.status(500);
 				done();
			});
	});
});


describe('Post a new Host review', () => {
	it('should create a new review and return it', (done) => {
		chai.request(url)
			.post('/users/1/host_reviews')
			.send({ review: 'Muy buen host', reviewer: 'Facu T', reviewer_id: '2' })
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('review');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Post an invalid host review', () => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users/1/host_reviews')
			.send({ reviewer: 'NombreLoco' })
			.end((err, res) => {
				expect(res).to.have.status(500);
				done();
			})
	})
})

describe('Post a new Host rating', () => {
	it('should create a new rating and return it', (done) => {
		chai.request(url)
			.post('/users/1/host_ratings')
			.send({ rating: '5', reviewer: 'Facu T', reviewer_id: '2' })
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('rating');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Post an invalid host rating', () => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users/1/host_ratings')
			.send({ rating: 'a', reviewer: 'NombreLoco', reviewer_id: '5' })
			.end((err, res) => {
				expect(res).to.have.status(500);
				done();
			})
	})
})

describe('Post an host rating without enough arguments', () => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users/1/host_ratings')
			.send({ reviewer: 'NombreLoco', reviewer_id: '5' })
			.end((err, res) => {
				expect(res).to.have.status(500);
				done();
			})
	})
})

describe('Post a new Guest review', () => {
	it('should create a new review and return it', (done) => {
		chai.request(url)
			.post('/users/1/guest_reviews')
			.send({ review: 'Muy buen guest', reviewer: 'Facu T', reviewer_id: '2' })
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('review');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Post an invalid guest review', () => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users/1/guest_reviews')
			.send({ reviewer: 'NombreLoco' })
			.end((err, res) => {
				expect(res).to.have.status(500);
				done();
			})
	})
})

describe('Post a new Guest rating', () => {
	it('should create a new rating and return it', (done) => {
		chai.request(url)
			.post('/users/1/guest_ratings')
			.send({ rating: '5', reviewer: 'Facu T', reviewer_id: '2' })
			.end((err, res) => {
				expect(res).to.have.status(201);
				expect(res.body).to.have.property('rating');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Post an invalid guest rating', () => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users/1/guest_ratings')
			.send({ rating: 'a', reviewer: 'NombreLoco', reviewer_id: '5' })
			.end((err, res) => {
				expect(res).to.have.status(500);
				done();
			})
	})
})

describe('Post an guest rating without enough arguments', () => {
	it('should return an error', (done) => {
		chai.request(url)
			.post('/users/1/guest_ratings')
			.send({ reviewer: 'NombreLoco', reviewer_id: '5' })
			.end((err, res) => {
				expect(res).to.have.status(500);
				done();
			})
	})
})

//Get:
describe('Get an user by ID', () => {
	it('should return an user as a json', (done) => {
		chai.request(url)
			.get('/users/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('firstname');
				expect(res.body).to.have.property('lastname');
				expect(res.body).to.have.property('email');
				expect(res.body).to.have.property('country');
				expect(res.body).to.have.property('phonenumber');
				expect(res.body).to.have.property('birthdate');
				done();
			})
	})
})

describe('Get an invalid user by ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get all the host reviews of an user', () => {
	it('should return a list of the host reviews of an user with a given ID', (done) => {
		chai.request(url)
			.get('/users/1/host_reviews')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('array');
				done();
			})
	})
})

describe('Get all the host reviews of an invalid user', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/host_reviews')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get all the host ratings of an user', () => {
	it('should return a list of the host ratings of an user with a given ID', (done) => {
		chai.request(url)
			.get('/users/1/host_ratings')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('array');
				done();
			})
	})
})

describe('Get all the host ratings of an invalid user', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/host_ratings')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})


describe('Get all the guest reviews of an user', () => {
	it('should return a list of the guest reviews of an user with a given ID', (done) => {
		chai.request(url)
			.get('/users/1/guest_reviews')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('array');
				done();
			})
	})
})

describe('Get all the guest reviews of an invalid user', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/guest_reviews')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get all the guest ratings of an user', () => {
	it('should return a list of the guest ratings of an user with a given ID', (done) => {
		chai.request(url)
			.get('/users/1/guest_ratings')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('array');
				done();
			})
	})
})

describe('Get all the guest ratings of an invalid user', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/guest_ratings')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get an specific host review by ID', () => {
	it('should return a specific host review of a specific user ID', (done) => {
		chai.request(url)
			.get('/users/1/host_reviews/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('review');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Get an specific host review by an invalid ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/host_reviews/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get an specific host rating by ID', () => {
	it('should return a specific host rating of a specific user ID', (done) => {
		chai.request(url)
			.get('/users/1/host_ratings/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('rating');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Get an specific host rating by an invalid ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/host_ratings/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})


describe('Get an specific guest review by ID', () => {
	it('should return a specific guest review of a specific user ID', (done) => {
		chai.request(url)
			.get('/users/1/guest_reviews/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('review');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Get an specific guest review by an invalid ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/guest_reviews/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})

describe('Get an specific guest rating by ID', () => {
	it('should return a specific guest rating of a specific user ID', (done) => {
		chai.request(url)
			.get('/users/1/guest_ratings/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('rating');
				expect(res.body).to.have.property('reviewer');
				expect(res.body).to.have.property('reviewer_id');
				done();
			})
	})
})

describe('Get an specific guest rating by an invalid ID', () => {
	it('should return a "not found" error', (done) => {
		chai.request(url)
			.get('/users/-1/guest_ratings/1')
			.send()
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			})
	})
})
