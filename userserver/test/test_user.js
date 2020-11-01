let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:8080';

//Post:
describe('placeholder',()=>{
	it('should pass', (done) => {
 		expect(true).to.be.true;
 		done();
	});
});