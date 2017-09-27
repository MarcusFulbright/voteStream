'use strict';

app.factory('User', function($http) {

	let user;

	// getter
	const getUser = () => {
		return new Promise(function(resolve, reject) {
			if (user === null || user === undefined) {
				reject();
			}
			resolve(user);
		});
	}

	// setter
	const setUser = (badgeId) => {
		user = badgeId;
	}

	//logout
	const userLogout = () => {
		user = '';
	}

	return {getUser, setUser, userLogout};

});
