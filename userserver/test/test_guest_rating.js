let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:8080';

const userExample = { firstname: 'nico', 
                      lastname: 'fandos', 
                      email: 'nico@nico.com', 
                      country: 'Argentina', 
                      phonenumber: '541111111111', 
                      birthdate: '1998-12-06' };

const guestRatingExample = { rating: '5', 
                             reviewer: 'Facu T', 
                             reviewer_id: '2' }

//Post
describe('Post a new Guest rating', () => {
  it('should create a new rating and return it', (done) => {
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a new guest rating (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send(guestRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('rating');
            expect(res.body).to.have.property('reviewer');
            expect(res.body).to.have.property('reviewer_id');
            expect(res.body).to.have.property('id');
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
          })
      })    
  })
})
  
describe('Post an invalid guest rating', () => {
  it('should return an error', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid guest rating (what we want to test)
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send({ rating: 'a', reviewer: 'NombreLoco', reviewer_id: '5' })
          .end((err, res) => {
            expect(res).to.have.status(500);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
          })
      })
  })
})
  
describe('Post an guest rating without enough arguments', () => {
  it('should return an error', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid guest rating (what we want to test)
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send({ reviewer: 'NombreLoco', reviewer_id: '5' })
          .end((err, res) => {
            expect(res).to.have.status(500);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
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
describe('Get all the guest ratings of an user', () => {
  it('should return a list of the guest ratings of an user with a given ID', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest rating
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send(guestRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Get all the guest ratings of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/guest_ratings')
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userId');
								expect(res.body.userId).to.equal(userID.toString());
								expect(res.body).to.have.property('ratings');
                expect(res.body.ratings).to.be.an('array').that.is.not.empty;
                //Delete the rating
                chai.request(url)
                  .delete('/users/' + userID + '/guest_ratings/' + ratingID)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
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

//Get  
describe('Get an specific guest rating by ID', () => {
  it('should return a specific guest rating of a specific user ID', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest rating
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send(guestRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Get the guest rating of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/guest_ratings/' + ratingID)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('rating');
                expect(res.body).to.have.property('reviewer');
                expect(res.body).to.have.property('reviewer_id');
                //Delete the rating
                chai.request(url)
                  .delete('/users/' + userID + '/guest_ratings/' + ratingID)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
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

//Patch
describe('Update a guest rating of a user by ID', () => {
  it('should update the indicated fields of the guest rating of the user', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest rating
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send(guestRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Patch the guest rating of the user (what we want to test)
            chai.request(url)
              .patch('/users/' + userID + '/guest_ratings/' + ratingID)
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
                  .delete('/users/' + userID + '/guest_ratings/' + ratingID)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
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

describe('Update a guest rating user with an invalid user ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .patch('/users/-1/guest_ratings/1')
      .send({ rating: '2' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Update a guest rating user with an invalid rating ID', () => {
  it('should return a "not found" error', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Patch an invalid rating (what we want to test):
        chai.request(url)
          .patch('/users/' + userID + '/guest_ratings/-1')
          .send({ rating: '4' })
          .end((err, res) => {
            expect(res).to.have.status(404);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
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
describe('Delete a guest rating', () => {
  it('should delete a rating by ID and a get should return a "not found" error', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest rating
        chai.request(url)
          .post('/users/' + userID + '/guest_ratings')
          .send(guestRatingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            ratingID = res.body.id;
            //Delete the rating (what we want to test)
              chai.request(url)
                .delete('/users/' + userID + '/guest_ratings/' + ratingID)
                .send()
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  // If we try to get the deleted rating we get a not found error
                  chai.request(url)
                    .get('/users/' + userID + '/guest_ratings' + ratingID)
                    .send()
                    .end((err, res) => {
                      expect(res).to.have.status(404);
                      //Delete the user
                      chai.request(url)
                        .delete('/users/' + userID)
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

describe('Delete a guest rating with an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .delete('/users/1/guest_ratings/-1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})
