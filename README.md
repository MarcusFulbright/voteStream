voteStream
====

A voting system initially built at HackNashville 4 to collect audience input by which the winner of the hackathon was chosen. This build is more geared towards the needs of [BarCamp Nashville](http://www.barcampnashville.org/) 2013. BarCamp '13 was held November 2, 2013. BarCamp '14 is set for October 18, 2014.

##Uploading Sessions 
###To upload new sessions from a csv file, go to [CSV to JSON](http://www.convertcsv.com/csv-to-json.htm)  
 * Copy/pase csv data into text area 
 * Select "First row is column names" in "Step 2: Choose Input Options" section 
 * In "Step 5: Generate output" click CSV to JSON
 * Click "Download Result" 
 * Upload JSON file to Firebase in "sessions" section

##Model - [Firebase](https://nashvillebarcamp.firebaseio.com/)
###Sessions
A collection of sessions. Individual objects the details on a Speaker's presentation as well as their availability and vote tabulation.
 * Availability (Morning || Afternoon || Both)
 * Body - Description of the session
 * E-mail - email address of the speaker
 * First Name
 * Last Name
 * Room - The room assignment (unused at BCN '13)
 * Session Category - An array of size 2 categories
 * Signup Counts - Favorites from BarCamp website
 * Time - The time assignment (unused at BCN '13)
 * Title - Title of the session
 * Twitter Hashtag - session hashtag
 * Username - BarCamp website username
 * id - Firebase id
 * total_votes - Number of votes tabulated for the session

###Categories: 0, 1, or 2 for each session; 15 total
 * all
 * code
 * content
 * creative enterprise
 * design
 * gear
 * infrastructure
 * life hacks
 * marketing
 * mobile
 * social
 * social enterprise
 * start up
 * ux/ia
 * other

##Users
A user is represented in firebase as a unique code to enter for voting purposes, an array of their votes, and the validity of the account. Currently there is no way within the app to disable a user or identify them by name. That association does not exist in the model or in the unique code assignment process.

##Views
###Login
The first view a user is greeted with. It contains logos for BarCamp and Firebase (in return we received free tier 1 service for BarCamp '13). The user is prompted to enter their unique voting code.

###Voting
The default view upon successful authentication (valid user code). Here a user has the ability to view a listing of the sessions. They can vote on and revoke their votes for sessions. They also have the ability to filter by category.

###Results
This view reveals a table listing of sessions in a realtime link to Firebase. The columns are sortable and should probably default to show the highest scoring sessions by vote count in descending order. It also contains the toggle to enable/disable voting which *must* be put behind something more secure. Seriously, this isn't secure or even obfuscated well.

###Schedule
The plan currently is to include the schedule as updated on the [BarCamp website](http://www.barcampnashville.org/bcn14/sessions) in the application via an iframe. This page is updated manually once votes are tallied and is set up to reveal the time slots and room assignments. It also has the ability to show the user a list of their custom sessions composed of favorites they've marked ahead of time.

## Run the Voting App
Install with:

`npm install`

`grunt`

Run with:
`node web.js`

## Original HackNashville Group
Peter Hiemmelreich, Chuck Bryant, Bart Renner, Thomas Vaughn, Ben Stucki, Hakan Tunc, Erin Page, Beat Zenerino, Calvin Froedge, Paul Sunderhaus, Blake McCool
