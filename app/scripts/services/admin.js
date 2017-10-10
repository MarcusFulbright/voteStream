'use strict';

app.factory('Admin', function ($http, $q, Constants, SessionListing) {

  const selectSessions = (indexArr) => {
    return SessionListing.getAllSessions().then( (data) => {
      const allIndexes = data.map( (sessions, index) => index);
      return $q.all(allIndexes.map( i => {
        let obj = indexArr.includes(i) ? {selected: true} : {selected: false};
        return $http.patch(`${Constants.firebaseUrl}/Sessions/${i}.json`, obj).catch( err => console.log('err', err));
      })).catch( err => console.log('err', err));
    });
  };
  const mapSessions = (sessions, schedules) => {
      return sessions.map((session) => {
        schedules.find((schedule) => {
          if (schedule.Title === session.Title && schedule["Last Name"] === session["Last Name"]) {
            session.Room = schedule.Room;
            session.Time = schedule.Time;
        }
      });
          return session;
    });
  };

  return { selectSessions, mapSessions };

});
