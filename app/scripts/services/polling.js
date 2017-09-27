'use strict';

app.factory('Polling', function ($http, Constants) {

	const realTimePolling = firebase.database().ref('/PollingState')

	const determineSession = ({ pollingPeriods, showAfternoonTab }) => {
		const morning = pollingPeriods[0];
		const afternoon = pollingPeriods[1];

		if (compareTime(morning)) {
			return { open: true, sessions: 'morning', showAfternoonTab };
		} else if (compareTime(afternoon)) {
			return { open: true, sessions: 'afternoon', showAfternoonTab };
		} else {
			return { open: false, sessions: 'morning', showAfternoonTab };
		}
	}

	const compareTime = (period) => {
		const start = period.startTime.split(':'); // ["8", "00"]
		const end = period.endTime.split(':'); // ["9", "15"]

		const startTime = new Date().setHours(Number(start[0]), Number(start[1]));
		const endTime = new Date().setHours(Number(end[0]), Number(end[1]));

		// Diff1 needs to be negative because small num - bigger num
		// Diff2 needs to be positive because bigger num - smaller num
		const diff1 = startTime - new Date();
		const diff2 = endTime - new Date();

		if(diff1 < 0 && diff2 > 0) {
		    return true;
		} else {
			return false;
		}

	};

	const setShowAfternoonTab = (status) => {
		return $http.patch(`${Constants.firebaseUrl}/PollingState.json`, { showAfternoonTab: status })
		.catch(console.error);
	};

	return { determineSession,  realTimePolling, setShowAfternoonTab };

});
