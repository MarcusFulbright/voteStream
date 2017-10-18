'use strict';

const { writeFile } = require('fs');
const badges = require('./badges.json');
const completeBadges = {};

// Check to see if badges.json is exporting a JSON array
if (!Array.isArray(badges)) {
    throw new Error('badges.json must export an array. Incorrect JSON.')
}

for (let i = 0; i < badges.length; i++) {
    // Firebase needs at least a single key value to insert into a collection
    completeBadges[badges[i]] = {
        sessions: 0
    };
};

// Write the complete badges object to a JSON file
writeFile('./finalBadges.json', JSON.stringify(completeBadges, null, 4), (err) => {
    if (err) throw err;

    console.log('The badges have been created. You can now upload voteStream/finalBadges.json to Firebase.');
});
