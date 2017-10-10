'use strict';

app.factory('SessionListing', function ($q, $http, Constants) {

	const realTimeSessions = firebase.database().ref('/Sessions')

	const getAllSessions = () => {
		return $http.get(`${Constants.firebaseUrl}/Sessions.json`)
		.then(data => data.data)
		.catch(console.error);
	};

	return { getAllSessions };
});
