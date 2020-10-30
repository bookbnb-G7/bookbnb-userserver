let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:8080';

//Post:
describe('Insert an user: ',()=>{
	it('should insert an user', (done) => {
 		chai.request(url)
 			.post('/users')
			.send({ firstname: "facu", 
					lastname:"ndo", 
					email:"email@gmail.com", 
					birthdate:"1919-01-01",
					phonenumber:"1919",
					country:"Arg" })
 			.end((err, res) => {
 				console.log(res.body)
 				expect(res).to.have.status(201);
 				done();
			});
	});
});


describe('Insert an user with error: ',() =>{
	it('should receive an error', (done) => {
		chai.request(url)
			.post('/users')
 			.send({ username: "facu" })
 			.end(function(err,res){
 				console.log(res.body)
 				expect(res).to.have.status(500);
 				done();
 			});
 	});
});


//Put:
describe('Update an User by ID: ', () => {
	it('should update/create an user', (done) => {
		chai.request(url)
			.put('/users/id/1')
			.send({ firstname: "facu", 
					lastname:"ndo", 
					email:"email@gmail.com", 
					birthdate:"1919-01-01",
					phonenumber:"1919",
					country:"Arg" })
			.end((err, res) => {
				console.log(res.body)
				expect(res).to.have.status(201);
				done();
		   });
	});
})

describe('Update an User by ID with not enough information: ', () => {
	it('should receive an error', (done) => {
		chai.request(url)
			.put('/users/id/1')
			.send({ firstname: "facu",  
					email:"email@gmail.com", 
					birthdte:"1919-01-01",
					phonenumber:"1919",
					country:"Arg" })
			.end((err, res) => {
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
		   });
	});
})

//Get:
describe('Get a created User: ', () => {
	it('should receive some user attributes', (done) => {
		chai.request(url)
			.get('/users/id/1')
			.send()
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('firstname');
				expect(res.body).to.have.property('lastname');
				expect(res.body).to.have.property('email');
				expect(res.body).to.have.property('country');
				done();
			})
	})
})

describe('Get a User with a wrong id: ', () => {
	it('should receive an error', (done) => {
		chai.request(url)
			.get('/users/id/-1')
			.send()
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	})
})

//Get Privileged:
describe('Get a created User as Self: ', () => {
	it('should receive all user attributes', (done) => {
		chai.request(url)
			.get('/users/id/1/self')
			.send()
			.end(function(err, res) {
				console.log(res.body)
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


//Patch:
describe('Update a specific User field: ', () => {
	it('should update some user attributes', (done) => {
		chai.request(url)
			.patch('/users/id/1')
			.send({ birthdate: "2020-03-20" })
			.end(function(err, res) {
				console.log(res.body);
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('birthdate');
				expect(res.body.birthdate).eql("2020-03-20");
				done();
			})
	})
})


//Delete:
describe('Remove a created User: ', () => {
	it('should receive user attributes', (done) => {
		chai.request(url)
			.delete('/users/id/1')
			.send()
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			})
	})
})


describe('Remove an inexisting created User: ', () => {
	it('should receive an error', (done) => {
		chai.request(url)
			.delete('/users/id/-1')
			.send()
			.end(function(err, res) {
				console.log(res.body)
				expect(res).to.have.status(404);
				done();
			})
	})
})
