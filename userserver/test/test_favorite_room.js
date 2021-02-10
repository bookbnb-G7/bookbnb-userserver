let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { userExample, updateUserExample, favoriteRoomExample } = require('./examples');

chai.use(chaiHttp);
const url = 'http://localhost:8080';

const api_key = 'fake_api_key';


//Post
describe('Post a new favorite room', () => {
  it('should create a new favorite room and return it', (done) => {
    updateUserExample(userExample)
    //Create a new User for the test
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a new favorite room (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/favorite_rooms')
          .set('api-key', api_key)
          .send(favoriteRoomExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('room_id');
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

describe('Post a favorite room to a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .post('/users/-1/favorite_rooms')
      .set('api-key', api_key)
      .send(favoriteRoomExample)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      }) 
  })
})

describe('Post a favorite room to a user without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .post('/users/-1/favorite_rooms')
      .send(favoriteRoomExample)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      }) 
  })
})

describe('Post a favorite room to a user with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .post('/users/-1/favorite_rooms')
      .set('api-key', 'asdasd')
      .send(favoriteRoomExample)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      }) 
  })
})

describe('Post an invalid favorite room', () => {
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
        //Post an invalid favorite room (what we want to test):
        chai.request(url)
          .post('/users/' + userID + '/favorite_rooms')
          .set('api-key', api_key)
          .send({ roomId: 'roomId' })
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
describe('Get all the favorite rooms of a user', () => {
  it('should return a list of the favorite rooms of a user with a given ID', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a favorite room
        chai.request(url)
          .post('/users/' + userID + '/favorite_rooms')
          .set('api-key', api_key)
          .send(favoriteRoomExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            favoriteID = res.body.id;
            //Get all the favorite rooms of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/favorite_rooms')
              .set('api-key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userId');
								expect(res.body.userId).to.equal(userID.toString());
								expect(res.body).to.have.property('amount');
								expect(res.body.amount).to.not.equal(0);
								expect(res.body).to.have.property('favorites');
                expect(res.body.favorites).to.be.an('array').that.is.not.empty;
                //Delete the favorite room
                chai.request(url)
                  .delete('/users/' + userID + '/favorite_rooms/' + favoriteID)
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

describe('Get all the favorite rooms of a user that doesnt exist', () => {
  it('should return a "user not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/favorite_rooms')
      .set('api-key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
          done();
      }) 
  })
})

describe('Get all the favorite rooms of a user without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/favorite_rooms')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
          done();
      }) 
  })
})

describe('Get all the favorite rooms of a user with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/favorite_rooms')
      .set('api-key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
          done();
      }) 
  })
})

//Get 
describe('Get a specific favorite room by ID', () => {
  it('should return a specific favorite room of a specific user ID', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a favorite room
        chai.request(url)
          .post('/users/' + userID + '/favorite_rooms')
          .set('api-key', api_key)
          .send(favoriteRoomExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            favoriteID = res.body.id;
            //Get the favorite room of the user (what we want to test)
            chai.request(url)
              .get('/users/' + userID + '/favorite_rooms/' + favoriteID)
              .set('api-key', api_key)
              .send()
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('room_id');
                //Delete the favorite room
                chai.request(url)
                  .delete('/users/' + userID + '/favorite_rooms/' + favoriteID)
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
  
describe('Get a specific favorite room by an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .get('/users/-1/favorite_rooms/1')
      .set('api-key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Get a specific favorite room without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/favorite_rooms/1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

describe('Get a specific favorite room with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .get('/users/-1/favorite_rooms/1')
      .set('api-key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

//Delete
describe('Delete a favorite room', () => {
  it('should delete a favorite room by ID and a get should return a "not found" error', (done) => {
    updateUserExample(userExample)
    //Create a user
    chai.request(url)
      .post('/users')
      .set('api-key', api_key)
      .send(userExample)
      .end((err, res) => {
        expect(res).to.have.status(201);
        let userID = res.body.id;
        //Post a favorite room
        chai.request(url)
          .post('/users/' + userID + '/favorite_rooms')
          .set('api-key', api_key)
          .send(favoriteRoomExample)
          .end((err, res) => {
            expect(res).to.have.status(201);
            favoriteID = res.body.id;
            //Delete the favorite room (what we want to test)
              chai.request(url)
                .delete('/users/' + userID + '/favorite_rooms/' + favoriteID)
                .set('api-key', api_key)
                .send()
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  // If we try to get the deleted favorite room we get a not found error
                  chai.request(url)
                    .get('/users/' + userID + '/favorite_rooms/' + favoriteID)
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

describe('Delete a favorite room with an invalid ID', () => {
  it('should return a "not found" error', (done) => {
    chai.request(url)
      .delete('/users/1/favorite_rooms/-1')
      .set('api-key', api_key)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      })
  })
})

describe('Delete a favorite room without permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .delete('/users/1/favorite_rooms/-1')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})

describe('Delete a favorite room with wrong permission', () => {
  it('should return a unauthorized error', (done) => {
    chai.request(url)
      .delete('/users/1/favorite_rooms/-1')
      .set('api-key', 'asdasd')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
  })
})
