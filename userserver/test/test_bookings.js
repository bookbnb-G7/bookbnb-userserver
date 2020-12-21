let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { userExample, updateUserExample, bookingExample, updateBookingExample } = require('./examples');

chai.use(chaiHttp);
const url = 'http://localhost:8080';

const api_key = 'fake_api_key';


//Post
describe('Post a new room booking', () => {
  it('should create a new booking and return it', (done) => {
    updateUserExample(userExample)
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .set('api_key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a new room booking (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/bookings')
          .set('api_key', api_key)
          .send(bookingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('booking_id');
            expect(res.body).to.have.property('room_id');
            expect(res.body).to.have.property('userId');
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('api_key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
          })
      })    
  })
})

describe('Post a room booking to a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .post('/users/-1/bookings')
      .set('api_key', api_key)
      .send(bookingExample)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      }) 
  })
})
  
describe('Post a room booking to a user without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .post('/users/-1/bookings')
      .send(bookingExample)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      }) 
  })
})

describe('Post a room booking to a user with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .post('/users/-1/bookings')
      .set('api_key', 'asdasd')
      .send(bookingExample)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      }) 
  })
})

describe('Post an invalid room booking', () => {
  it('should return an error', (done) => {
    updateUserExample(userExample)
    updateBookingExample(bookingExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api_key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid room booking (what we want to test)
        chai.request(url)
          .post('/users/' + userID + '/bookings')
          .set('api_key', api_key)
          .send({ id: 'a' })
          .end((err, res) => {
            expect(res).to.have.status(500);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('api_key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                done();
              })
          })
      })
  })
})
  
describe('Post a room booking without enough arguments', () => {
  it('should return an error', (done) => {
    updateUserExample(userExample)
    updateBookingExample(bookingExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api_key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post an invalid room booking (what we want to test)
        chai.request(url)
          .post('/users/' + userID + '/bookings')
          .set('api_key', api_key)
          .send({ room_id: '66', invalidField: 'hahaha' })
          .end((err, res) => {
            expect(res).to.have.status(500);
            //Delete the user
            chai.request(url)
              .delete('/users/' + userID)
              .set('api_key', api_key)
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
describe('Get all the room bookings of a user', () => {
  it('should return a list of the room bookings of a user with a given ID', (done) => {
    updateUserExample(userExample)
    updateBookingExample(bookingExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api_key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a room booking
        chai.request(url)
          .post('/users/' + userID + '/bookings')
          .set('api_key', api_key)
          .send(bookingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            bookingID = res.body.booking_id;
            //Get all the room bookings of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/bookings')
              .set('api_key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userId');
								expect(res.body.userId).to.equal(userID.toString());
								expect(res.body).to.have.property('amount');
								expect(res.body.amount).to.not.equal(0);
								expect(res.body).to.have.property('bookings');
                expect(res.body.bookings).to.be.an('array').that.is.not.empty;
                //Delete the booking
                chai.request(url)
                  .delete('/users/' + userID + '/bookings/' + bookingID)
                  .set('api_key', api_key)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
                      .set('api_key', api_key)
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

describe('Get all the bookings of a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/bookings')
      .set('api_key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
          done();
      }) 
  })
})

describe('Get all the bookings of a user without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/bookings')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
          done();
      }) 
  })
})

describe('Get all the bookings of a user with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/bookings')
      .set('api_key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
          done();
      }) 
  })
})

//Get  
describe('Get a specific room booking by ID', () => {
  it('should return a specific room booking of a specific user ID', (done) => {
    updateUserExample(userExample)
    updateBookingExample(bookingExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api_key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a room booking
        chai.request(url)
          .post('/users/' + userID + '/bookings')
          .set('api_key', api_key)
          .send(bookingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            bookingID = res.body.booking_id;
            //Get the room booking of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/bookings/' + bookingID)
              .set('api_key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userId');
                expect(res.body).to.have.property('booking_id');
                expect(res.body).to.have.property('room_id');
                //Delete the booking
                chai.request(url)
                  .delete('/users/' + userID + '/bookings/' + bookingID)
                  .set('api_key', api_key)
                  .send()
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    //Delete the user
                    chai.request(url)
                      .delete('/users/' + userID)
                      .set('api_key', api_key)
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
  
describe('Get a specific room booking by an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/bookings/1')
      .set('api_key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Get a specific room booking without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/bookings/1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

describe('Get a specific room booking with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/bookings/1')
      .set('api_key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

//Delete
describe('Delete a room booking', () => {
  it('should delete a booking by ID and a get should return a "not found" error', (done) => {
    updateUserExample(userExample)
    updateBookingExample(bookingExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api_key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a booking
        chai.request(url)
          .post('/users/' + userID + '/bookings')
          .set('api_key', api_key)
          .send(bookingExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            bookingID = res.body.booking_id;
            //Delete the booking (what we want to test)
              chai.request(url)
                .delete('/users/' + userID + '/bookings/' + bookingID)
                .set('api_key', api_key)
                .send()
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  // If we try to get the deleted booking we get a not found error
                  chai.request(url)
                    .get('/users/' + userID + '/bookings/' + bookingID)
                    .set('api_key', api_key)
                    .send()
                    .end((err, res) => {
                      expect(res).to.have.status(404);
                      //Delete the user
                      chai.request(url)
                        .delete('/users/' + userID)
                        .set('api_key', api_key)
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

describe('Delete a room booking with an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .delete('/users/1/bookings/-1')
      .set('api_key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Delete a room booking without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .delete('/users/1/bookings/-1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

describe('Delete a room booking with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .delete('/users/1/bookings/-1')
      .set('api_key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})
