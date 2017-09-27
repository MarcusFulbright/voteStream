'use strict';

app.factory('Constants', function () {

  const maxVotes = 4;
  const firebaseUrl = 'https://nashvillebarcamp.firebaseio.com';

  return { maxVotes, firebaseUrl };

});
