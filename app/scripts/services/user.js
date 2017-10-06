'use strict';

app.factory('User', function($http, Constants) {

	let user;

	// getter
	const getUser = () => {
		return new Promise(function(resolve, reject) {
			if (user === null || user === undefined) {
				reject();
			}
			resolve(user)
			.catch(console.error);
		});
	};

	const checkAdminUser = () => {
		return $http.get(`${Constants.firebaseUrl}/AdminUsers.json`)
		.then(({ data }) => {
			const userId = data.find(({ username }) => username.toUpperCase() === user);

			return (userId) ? true : false;
		})
		.catch(console.error);
	};

	// setter
	const setUser = (badgeId) => {
		user = badgeId;
	};

	//logout
	const userLogout = () => {
		user = '';
	};

	return { getUser, checkAdminUser, setUser, userLogout };

});
