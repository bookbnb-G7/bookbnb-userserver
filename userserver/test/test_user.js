let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000';

describe('Insert a user: ',()=>{
	it('should insert a user', (done) => {
 		chai.request(url)
 			.post('/users')
 			.send({username: "facu", firstname:"facu", lastname:"escrack"})
 			.end((err, res) => {
 				console.log(res.body)
 				expect(res).to.have.status(200);
 				done();
			});
	});
});


describe('Insert a country with error: ',()=>{
	it('should receive an error', (done) => {
		chai.request(url)
			.post('/users')
 			.send({username: "facu"})
 			.end( function(err,res){
 				console.log(res.body)
 				expect(res).to.have.status(500);
 				done();
 			});
 	});
});

