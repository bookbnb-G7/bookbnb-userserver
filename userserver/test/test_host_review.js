let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { userExample, updateUserExample, hostReviewExample } = require('./examples');

chai.use(chaiHttp);
const url = 'http://localhost:8080';

const api_key = 'fake_api_key';


//Post
describe('Post a new Host review', () => {
  it('should create a new review and return it', (done) => {
    updateUserExample(userExample)
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a new host review (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/host_reviews')
          .set('api-key', api_key)
          .send(hostReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('review');
            expect(res.body).to.have.property('reviewer');
            expect(res.body).to.have.property('reviewer_id');
            expect(res.body).to.have.property('id');
            //Delete the user
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

describe('Post a host review to a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .post('/users/-1/host_reviews')
      .set('api-key', api_key)
      .send(hostReviewExample)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      }) 
  })
})

describe('Post a host review without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .post('/users/-1/host_reviews')
      .send(hostReviewExample)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      }) 
  })
})

describe('Post a host review with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .post('/users/-1/host_reviews')
      .set('api-key', 'asdasd')
      .send(hostReviewExample)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      }) 
  })
})

describe('Post an invalid host review', () => {
  it('should return an error', (done) => {
    updateUserExample(userExample)
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid host review (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/host_reviews')
          .set('api-key', api_key)
          .send({ reviewer: 'NombreLoco' })
          .end((err, res) => {
            expect(res).to.have.status(400);
            //Delete the user
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
  
//Get all  
describe('Get all the host reviews of a user', () => {
  it('should return a list of the host reviews of a user with a given ID', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host review
        chai.request(url)
          .post('/users/' + userID + '/host_reviews')
          .set('api-key', api_key)
          .send(hostReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Get all the host reviews of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/host_reviews')
              .set('api-key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userId');
								expect(res.body.userId).to.equal(userID.toString());
								expect(res.body).to.have.property('amount');
								expect(res.body.amount).to.not.equal(0);
								expect(res.body).to.have.property('reviews');
                expect(res.body.reviews).to.be.an('array').that.is.not.empty;
                //Delete the review
                chai.request(url)
                  .delete('/users/' + userID + '/host_reviews/' + reviewID)
                  .set('api-key', api_key)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
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
  })
})

describe('Get all the host reviews of a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/host_reviews')
      .set('api-key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
          done();
      }) 
  })
})
  
describe('Get all the host reviews of a user without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/host_reviews')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
          done();
      }) 
  })
})

describe('Get all the host reviews of a user with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/host_reviews')
      .set('api-key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
          done();
      }) 
  })
})

//Get 
describe('Get a specific host review by ID', () => {
  it('should return a specific host review of a specific user ID', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host review
        chai.request(url)
          .post('/users/' + userID + '/host_reviews')
          .set('api-key', api_key)
          .send(hostReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Get the host review of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/host_reviews/' + reviewID)
              .set('api-key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('review');
                expect(res.body).to.have.property('reviewer');
                expect(res.body).to.have.property('reviewer_id');
                //Delete the review
                chai.request(url)
                  .delete('/users/' + userID + '/host_reviews/' + reviewID)
                  .set('api-key', api_key)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
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
  })
})
  
describe('Get a specific host review by an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/host_reviews/1')
      .set('api-key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})
  
describe('Get a specific host review without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/host_reviews/1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

describe('Get a specific host review with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/host_reviews/1')
      .set('api-key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

//Delete
describe('Delete a host review', () => {
  it('should delete a review by ID and a get should return a "not found" error', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host review
        chai.request(url)
          .post('/users/' + userID + '/host_reviews')
          .set('api-key', api_key)
          .send(hostReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Delete the review (what we want to test)
              chai.request(url)
                .delete('/users/' + userID + '/host_reviews/' + reviewID)
                .set('api-key', api_key)
                .send()
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  // If we try to get the deleted review we get a not found error
                  chai.request(url)
                    .get('/users/' + userID + '/host_reviews/' + reviewID)
                    .set('api-key', api_key)
                    .send()
                    .end((err, res) => {
                      expect(res).to.have.status(404);
                      //Delete the user
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
  })
})

describe('Delete a host review with an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .delete('/users/1/host_reviews/-1')
      .set('api-key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Delete a host review without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .delete('/users/1/host_reviews/-1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

describe('Delete a host review with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .delete('/users/1/host_reviews/-1')
      .set('api-key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})
