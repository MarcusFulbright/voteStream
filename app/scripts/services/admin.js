'use strict';

app.factory('Admin', function ($http, $q, Constants, SessionListing, Polling) {

  const selectSessions = (indexArr, timeOfDay) => {
    return SessionListing.getAllSessions().then( (data) => {
      const allIndexes = data.map( (sessions, index) => index);

      return $q.all(allIndexes.map(i => {
        const obj = indexArr.includes(i) ? {selected: timeOfDay} : {selected: false};

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
        // if (timeOfDay === 'Morning') {
            return selectSessions(scheduleIndexes, timeOfDay);
        // }
    })
    .then(() => {
        alert(`${timeOfDay} schedule has been updated.`)

        if (timeOfDay === 'Morning') {
            return Polling.setShowAfternoonTab(true);
        }
    })
    .catch((err) => {
        alert(`Something went wrong with saving the ${timeOfDay} schedule.`);
    });
  };

  return { mapSessions, updateScheduleToFirebase };

});
