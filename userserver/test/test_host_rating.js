let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
let randomstring = require("randomstring");

chai.use(chaiHttp);
const url = 'http://localhost:8080';

const access_token = '68b41bb674a4ae2a2fc0ca5193cdadb0';

const userExample = { id: 1,
                      firstname: 'nico', 
                      lastname: 'fandos', 
                      email: 'nico@nico.com', 
                      country: 'Argentina', 
                      phonenumber: '541111111111', 
                      birthdate: '1998-12-06' };

// Updates email to generate a random one and the id to have a different one
function updateUserExample(userExample){	
	userExample.email = randomstring.generate(7) + '@email.com';
	userExample.id = userExample.id + 1;
}

const hostRatingExample = { rating: '5', 
                             reviewer: 'Facu T', 
                             reviewer_id: '2' }


//Post
describe('Post a new Host rating', () => {
  it('should create a new rating and return it', (done) => {
    updateUserExample(userExample)
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a new host rating (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send(hostRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('rating');
            expect(res.body).to.have.property('reviewer');
            expect(res.body).to.have.property('reviewer_id');
            expect(res.body).to.have.property('id');
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('access_token', access_token)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
          })
      })    
  })
})

describe('Post a host rating to a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .post('/users/-1/host_ratings')
      .set('access_token', access_token)
      .send(hostRatingExample)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      }) 
  })
})
  
describe('Post a host rating to a user without permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .post('/users/-1/host_ratings')
      .send(hostRatingExample)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      }) 
  })
})

describe('Post a host rating to a user with wrong permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .post('/users/-1/host_ratings')
      .set('access_token', 'asdasd')
      .send(hostRatingExample)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      }) 
  })
})

describe('Post an invalid host rating', () => {
  it('should return an error', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid host rating (what we want to test)
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send({ rating: 'a', reviewer: 'NombreLoco', reviewer_id: '5' })
          .end((err, res) => {
            expect(res).to.have.status(500);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('access_token', access_token)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
          })
      })
  })
})
  
describe('Post a host rating without enough arguments', () => {
  it('should return an error', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid host rating (what we want to test)
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send({ reviewer: 'NombreLoco', reviewer_id: '5' })
          .end((err, res) => {
            expect(res).to.have.status(500);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('access_token', access_token)
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
describe('Get all the host ratings of a user', () => {
  it('should return a list of the host ratings of a user with a given ID', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host rating
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send(hostRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Get all the host ratings of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/host_ratings')
              .set('access_token', access_token)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userId');
								expect(res.body.userId).to.equal(userID.toString());
								expect(res.body).to.have.property('amount');
								expect(res.body.amount).to.not.equal(0);
								expect(res.body).to.have.property('ratings');
                expect(res.body.ratings).to.be.an('array').that.is.not.empty;
                //Delete the rating
                chai.request(url)
                  .delete('/users/' + userID + '/host_ratings/' + ratingID)
                  .set('access_token', access_token)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
                      .set('access_token', access_token)
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

describe('Get all the host ratings of a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/host_ratings')
      .set('access_token', access_token)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
          done();
      }) 
  })
})

describe('Get all the host ratings of a user without permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .get('/users/-1/host_ratings')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
          done();
      }) 
  })
})

describe('Get all the host ratings of a user with wrong permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .get('/users/-1/host_ratings')
      .set('access_token', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
          done();
      }) 
  })
})

//Get  
describe('Get a specific host rating by ID', () => {
  it('should return a specific host rating of a specific user ID', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host rating
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send(hostRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Get the host rating of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/host_ratings/' + ratingID)
              .set('access_token', access_token)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('rating');
                expect(res.body).to.have.property('reviewer');
                expect(res.body).to.have.property('reviewer_id');
                //Delete the rating
                chai.request(url)
                  .delete('/users/' + userID + '/host_ratings/' + ratingID)
                  .set('access_token', access_token)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
                      .set('access_token', access_token)
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
  
describe('Get a specific host rating by an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/host_ratings/1')
      .set('access_token', access_token)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Get a specific host rating without permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .get('/users/-1/host_ratings/1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      })
  })
})

describe('Get a specific host rating with wrong permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .get('/users/-1/host_ratings/1')
      .set('access_token', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      })
  })
})

//Patch
describe('Update a host rating of a user by ID', () => {
  it('should update the indicated fields of the host rating of the user', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host rating
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send(hostRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Patch the host rating of the user (what we want to test)
            chai.request(url)
              .patch('/users/' + userID + '/host_ratings/' + ratingID)
              .set('access_token', access_token)
              .send({ rating: '3', invalidField: 'i shouldnt be added' })
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('rating');
                expect(res.body.rating).to.equal('3');
                expect(res.body).to.have.property('reviewer');
                expect(res.body).to.have.property('reviewer_id');
                expect(res.body).to.have.property('id');
                expect(res.body).to.not.have.property('invalidField');
                //Delete the rating
                chai.request(url)
                  .delete('/users/' + userID + '/host_ratings/' + ratingID)
                  .set('access_token', access_token)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
                      .set('access_token', access_token)
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

describe('Update a host rating user with an invalid user ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .patch('/users/-1/host_ratings/1')
      .set('access_token', access_token)
      .send({ rating: '2' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Update a host rating user without permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .patch('/users/-1/host_ratings/1')
      .send({ rating: '2' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      })
  })
})

describe('Update a host rating user with wrong permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .patch('/users/-1/host_ratings/1')
      .set('access_token', 'asdasd')
      .send({ rating: '2' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      })
  })
})

describe('Update a host rating user with an invalid rating ID', () => {
  it('should return a "not found" error', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Patch an invalid rating (what we want to test):
        chai.request(url)
          .patch('/users/' + userID + '/host_ratings/-1')
          .set('access_token', access_token)
          .send({ rating: '4' })
          .end((err, res) => {
            expect(res).to.have.status(404);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('access_token', access_token)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
         })
      })
  })
})

//Delete
describe('Delete a host rating', () => {
  it('should delete a rating by ID and a get should return a "not found" error', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('access_token', access_token)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a host rating
        chai.request(url)
          .post('/users/' + userID + '/host_ratings')
          .set('access_token', access_token)
          .send(hostRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Delete the rating (what we want to test)
              chai.request(url)
                .delete('/users/' + userID + '/host_ratings/' + ratingID)
                .set('access_token', access_token)
                .send()
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  // If we try to get the deleted rating we get a not found error
                  chai.request(url)
                    .get('/users/' + userID + '/host_ratings' + ratingID)
                    .set('access_token', access_token)
                    .send()
                    .end((err, res) => {
                      expect(res).to.have.status(404);
                      //Delete the user
                      chai.request(url)
                        .delete('/users/' + userID)
                        .set('access_token', access_token)
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

describe('Delete a host rating with an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .delete('/users/1/host_ratings/-1')
      .set('access_token', access_token)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Delete a host rating without permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .delete('/users/1/host_ratings/-1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      })
  })
})

describe('Delete a host rating with wrong permission', () => {
  it('should return a forbidden error', (done) => {
    chai.request(url)
      .delete('/users/1/host_ratings/-1')
      .set('access_token', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      })
  })
})
