'use strict';

app.factory('RoomsAndTimes', function ($http, Constants) {

    const getRooms = () => {
        return $http.get(`${Constants.firebaseUrl}/Rooms.json`)
        .then(res => res.data)
        .catch(console.error);
    };

    const getTimes = () => {
        return $http.get(`${Constants.firebaseUrl}/TimeSlots.json`)
        .then(res => res.data)
        .catch(console.error);
    };

    return { getRooms, getTimes };

});
