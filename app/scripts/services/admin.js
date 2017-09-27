'use strict';

app.factory('Admin', function ($http, $q, Constants, SessionListing) {

  const selectSessions = (indexArr) => {
    SessionListing.getAllSessions().then( (data) => {
      const allIndexes = data.map( (sessions, index) => index);
      $q.all(allIndexes.map( i => {
        let obj = indexArr.includes(i) ? {selected: true} : {selected: false};
        $http.patch(`${Constants.firebaseUrl}/Sessions/${i}.json`, obj).catch( err => console.log('err', err));
      })).catch( err => console.log('err', err));
    });
  };

  return { selectSessions };

});
