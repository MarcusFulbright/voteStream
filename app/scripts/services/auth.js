'use strict';

app.factory('AuthService', function ($http, Constants) {

	//ajax call to firebase pulling out Users objects from the json
	//used in signin.js
	const getAllUsers = () => {
		return $http.get(`${Constants.firebaseUrl}/.json`)
		.then(data => data.data.Users)
		.catch(console.error);
	};

	return { getAllUsers };

});
