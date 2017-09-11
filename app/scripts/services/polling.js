'use strict';

app.factory('Polling', function ($q, $http, Constants) {

	const realTimePolling = firebase.database().ref('/PollingState')

	const determineSession = (periods) => {
		const morning = periods[0];
		const afternoon = periods[1];

		if (compareTime(morning)) {
			return {open: true, sessions: 'morning'};
		} else if (compareTime(afternoon)) {
			return {open: true, sessions: 'afternoon'};
		} else {
			return {open: false, sessions: 'morning'};
		}
	}

	const compareTime = (period) => {

		const start = period.startTime.split(':'); // ["8", "00"]
		const end = period.endTime.split(':'); // ["9", "15"]

		const startTime = new Date().setHours(start[0], start[1]);
		const endTime = new Date().setHours(end[0], end[1]);

		const diff1 = startTime - new Date().getHours();	
		const diff2 = endTime - new Date().getHours();
	
		if(diff1 < 0 && diff2 > 0 ) 
		{
		    return true;
		} else {

			return false;
		}

	};

	return { determineSession,  realTimePolling };

});
