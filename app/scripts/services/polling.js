'use strict';

app.factory('Polling', function ($http, Constants) {

	const getPollingPeriods = () => {
		return $http.get(`${Constants.firebaseUrl}/PollingState.json`)
			.then(data => {
				const periods = data.data.pollingPeriods;
				return determineSession(periods);
		})
	}

	const determineSession = (periods) => {

		const morning = periods[0];
		const afternoon = periods[1];

		if (compareTime(morning)) {
			return {open: true, sessions: 'morning'};
		} else if (compareTime(afternoon)) {
			return {open: true, sessions: 'afternoon'};
		} else {
			return {open: false, sessions: ''};
		}
	}

	const compareTime = (period) => {

		const start = period.startTime.split(':'); // ["8", "00"]
		const end = period.endTime.split(':'); // ["9", "15"]

		const startTime = new Date().setHours(start[0], start[1]);
		const endTime = new Date().setHours(end[0], end[1]);


		const diff1 = startTime - new Date().setHours(8, 5);	
		const diff2 = endTime - new Date().setHours(8, 5);
	
		if(diff1 < 0 && diff2 > 0 ) 
		{
		    return true;
		} else {

			return false;
		}

	};

	return { getPollingPeriods };

});
