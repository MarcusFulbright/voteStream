// test user with admin privledges: 03sbtn

var TOKEN = process.env.FIREBASE_TOKEN,
	Firebase = require('firebase'),
	Root = new Firebase('https://nashvillebarcamp.firebaseio.com/'),
	Users = Root.child('Users'),
	Sessions = Root.child('Sessions'),
	FirebaseTokenGenerator = require("firebase-token-generator"),
	tokenGenerator = new FirebaseTokenGenerator(TOKEN),
	express = require("express"),
	request = require("request"),
	app = express(),
	port = process.env.PORT || 8083;
	var server = new Firebase('https://nashvillebarcamp.firebaseio.com/Users');
	server.auth(TOKEN);

app.use(express.bodyParser());

app.post('/login', function(req, res) {
	var id = req.body.id;
	if (!id) {
		return res.send(401, { error: 'Invalid User ID' });
	}

	server.child(id).on('value', function(snapshot) {

		var userData = snapshot.val();
		console.log(userData);

		if (!userData) {
			return res.send(401, { error: 'Invalid User ID' });
		}
		userData.id = id;

		var token = tokenGenerator.createToken({
			uid: id.toString(),
			user_id : id.toString(),
			admin: (userData.admin === true)
		});

		res.send(200, {token: token, user: userData});
	});

});

app.get('/logout/:id', function (req, res, next) {
	Users.child(req.params.id).unauth();

	if ((/(?:text|application)\/x?html(?:\+xml)/i).test(req.headers.accept)) {
		res.redirect('/');
	} else {
		res.send(204);
	}

});

app.get('/favorites/:token/:bcnusername', function(req, res, next) {
  var bcnusername = req.params.bcnusername;

  // TODO: Make this more generic. We shouldn't be looking at bcn14 statically.
  request({
    url: "http://www.barcampnashville.org/bcn16/users/" + bcnusername + "/attending",
    method: 'GET',
    timeout: 20000, // 20 second timeout
		headers: {
			'Accept' : 'application/json'
		}
  }, function(error, response, body) {
    if (error) {
      console.log(error);
      res.status(500).send();
    } else {
			try {
	      var data = JSON.parse(body)['favorited sessions'].map(function(session) {
	        return session.session
	      });
			} catch(err) {
				console.log("Error parsing Favorites data! Invalid Username: " + bcnusername);
				res.status(400).send({
					username: bcnusername
				});
				return false;
			}
      var userRef = Users.child(req.params.token.toUpperCase());
      var favoriteNids = data.map(function(fav) {
        return +fav.Nid;
      });

      userRef.update({
        favoriteIds: favoriteNids
      });
      res.status(200).send({
        favoriteIds: favoriteNids
      });
    }
  });
});

// This serves up all the HTML pages on the site
// The port designation allows us to develop on 8083 but serve from heroku on standard ports
if (app.get('env') === 'development') {
	app.use("/", express.static(__dirname + "/app")).listen(port);
} else {
	app.use("/", express.static(__dirname + "/release")).listen(port);
}

console.log("APP Server started successfully on port " + port);
