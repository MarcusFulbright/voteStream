'use strict';

app.factory('Admin', function ($http, $q, Constants, SessionListing) {

  const selectSessions = (indexArr) => {
    return SessionListing.getAllSessions().then( (data) => {
      const allIndexes = data.map( (sessions, index) => index);

      return $q.all(allIndexes.map(i => {
        let obj = indexArr.includes(i) ? {selected: true} : {selected: false};

        return $http.patch(`${Constants.firebaseUrl}/Sessions/${i}.json`, obj);
      }));
    })
    .catch(console.error);
  };

  // This will populate a preexisting schedule.
  const mapSessions = (sessions, schedules) => {
      return sessions.map((session) => {
        schedules.find((schedule) => {
          if (schedule.Title === session.Title && schedule["Last Name"] === session["Last Name"]) {
            session.Room = schedule.Room;
            session.Time = schedule.Time;
          }
      });

      // This session will be returned to the new array created with sessions.map
      return session;
    });
  };

  const updateScheduleToFirebase = (timeOfDay, schedule) =>{
    const scheduleIndexes = schedule.map(each => each.index);

    return $http.put(`${Constants.firebaseUrl}/Schedules/${timeOfDay}.json`, schedule)
    .then(() => {
        //index array has to match index in firebase
        return selectSessions(scheduleIndexes);
    })
    .then(() => {
        alert(`${timeOfDay} schedule has been updated.`)
    })
    .catch(() => {
        alert(`Something went wrong with saving the ${timeOfDay} schedule.`);
    });
  };

  return { mapSessions, updateScheduleToFirebase };

});
