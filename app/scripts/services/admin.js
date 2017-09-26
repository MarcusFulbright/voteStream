'use strict';

app.factory('AdminService', function ($http, Constants) {

	// Return room names
	const getRoomNames = () => {
		return $http.get(`${Constants.firebaseUrl}/Rooms.json`)
		.then(data => data.data);
	};

	// Return time slots
	const getTimeSlots = () => {
		return $http.get(`${Constants.firebaseUrl}/TimeSlots.json`)
		.then(data => data.data);
	}

	return { getRoomNames, getTimeSlots };



});
