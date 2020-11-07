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

const guestReviewExample = { review: 'Muy buen guest', 
                             reviewer: 'Facu T', 
                             reviewer_id: '2' }

//Post
describe('Post a new Guest review', () => {
  it('should create a new review and return it', (done) => {
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a new guest review (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/guest_reviews')
          .send(guestReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('review');
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
  
describe('Post an invalid guest review', () => {
  it('should return an error', (done) => {
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid guest review (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/guest_reviews')
          .send({ reviewer: 'NombreLoco' })
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
describe('Get all the guest reviews of an user', () => {
  it('should return a list of the guest reviews of an user with a given ID', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest review
        chai.request(url)
          .post('/users/' + userID + '/guest_reviews')
          .send(guestReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Get all the guest reviews of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/guest_reviews')
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.is.not.empty;
                //Delete the review
                chai.request(url)
                  .delete('/users/' + userID + '/guest_reviews/' + reviewID)
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
describe('Get an specific guest review by ID', () => {
  it('should return a specific guest review of a specific user ID', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest review
        chai.request(url)
          .post('/users/' + userID + '/guest_reviews')
          .send(guestReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Get the guest review of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/guest_reviews/' + reviewID)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('review');
                expect(res.body).to.have.property('reviewer');
                expect(res.body).to.have.property('reviewer_id');
                //Delete the review
                chai.request(url)
                  .delete('/users/' + userID + '/guest_reviews/' + reviewID)
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
  
//Patch
describe('Update a guest review of a user by ID', () => {
  it('should update the indicated fields of the guest review of the user', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest review
        chai.request(url)
          .post('/users/' + userID + '/guest_reviews')
          .send(guestReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Patch the guest review of the user (what we want to test)
            chai.request(url)
              .patch('/users/' + userID + '/guest_reviews/' + reviewID)
              .send({ review: 'review loca', invalidField: 'i shouldnt be added' })
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('review');
                expect(res.body.review).to.equal('review loca');
                expect(res.body).to.have.property('reviewer');
                expect(res.body).to.have.property('reviewer_id');
                expect(res.body).to.have.property('id');
                expect(res.body).to.not.have.property('invalidField');
                //Delete the review
                chai.request(url)
                  .delete('/users/' + userID + '/guest_reviews/' + reviewID)
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

describe('Update a guest review user with an invalid user ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .patch('/users/-1/guest_reviews/1')
      .send({ review: 'otra review' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Update a guest review user with an invalid review ID', () => {
  it('should return a "not found" error', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Patch an invalid review (what we want to test):
        chai.request(url)
          .patch('/users/' + userID + '/guest_reviews/-1')
          .send({ review: 'no existo jaja' })
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
describe('Delete a guest review', () => {
  it('should delete a review by ID and a get should return a "not found" error', (done) => {
    //Create a user
    chai.request(url)
      .post('/users')
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a guest review
        chai.request(url)
          .post('/users/' + userID + '/guest_reviews')
          .send(guestReviewExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            reviewID = res.body.id;
            //Delete the review (what we want to test)
              chai.request(url)
                .delete('/users/' + userID + '/guest_reviews/' + reviewID)
                .send()
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  // If we try to get the deleted review we get a not found error
                  chai.request(url)
                    .get('/users/' + userID + '/guest_reviews' + reviewID)
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

describe('Delete a guest review with an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .delete('/users/1/guest_reviews/-1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})
