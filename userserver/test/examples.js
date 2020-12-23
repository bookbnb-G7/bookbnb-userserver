//In this file there are examples of users, ratings, reviews
//and bookings that emulate what a real user would
//want to post, get, patch or delete in the server
//This examples are used for testing

//NOTE: The userExample and bookingExample need to have an
// initial ID set by the user, it is not set automatically as the ones
// in reviews and ratings. This makes necessary to be
// updating the examples of user and booking each time we need to post a new one.

const bigId = 1431655764; // 2^31*(2/3) rounded down

// User example: (We need to set the initial ID manually)
const userExample = { 
  id: bigId,
  firstname: 'nico', 
  lastname: 'fandos', 
  email: 'nico@nico.com', 
  country: 'Argentina', 
  phonenumber: '541111111111', 
  birthdate: '1998-12-06' 
};

// Updates email to generate a different one and the id to have a different one as well
function updateUserExample(userExample){	
  userExample.email = userExample.id.toString() + '@email.com';
  userExample.id = userExample.id + 1;
};

exports.userExample = userExample;
exports.updateUserExample = updateUserExample;

//Guest review example:
const guestReviewExample = { 
  review: 'Muy buen guest', 
  reviewer: 'Facu T', 
  reviewer_id: 2 
};

exports.guestReviewExample = guestReviewExample;

//Guest rating example:
const guestRatingExample = { 
  rating: '5', 
  reviewer: 'Facu T', 
  reviewer_id: 2 
};

exports.guestRatingExample = guestRatingExample;

//Host review example:
const hostReviewExample = { 
  review: 'Muy buen host', 
  reviewer: 'Facu T', 
  reviewer_id: 2 
};

exports.hostReviewExample = hostReviewExample;

//Host rating example:
const hostRatingExample = { 
  rating: '5', 
  reviewer: 'Facu T', 
  reviewer_id: 2
};

exports.hostRatingExample = hostRatingExample;

//Booking example: (We need to set the initial ID manually)
const bookingExample = { 
  booking_id: bigId, 
  room_id: 7 
};

// Updates the id to have a different one
function updateBookingExample(bookingExample){
	bookingExample.booking_id = bookingExample.booking_id + 1;
}

exports.bookingExample = bookingExample;
exports.updateBookingExample = updateBookingExample;
