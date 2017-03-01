// Dependencies

require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
var _ = require("lodash");
var getJSON = require('get-json');
var $ = require("jquery");

// Initialize / Routing

app.get("/", function(req, res) {
  res.render("index.ejs")
  console.log('Listening at http://localhost:7000/')
})

app.get("/landingpage", function(req, res) {
  res.render("landingpage.ejs")
})

app.get("/results", function(req, res) {
  res.render("results.ejs")
})

// Listening

app.listen(process.env.PORT || 7000);


// API ////////////////////////////////////////////////////////////////////

app.get('/api/users', (req, res) => {
  db.collection('users')
    .find()
    .toArray((err, result) => {
      if (err) { return console.log(err); }
      res.send(result);
    });
});

app.get('/api/user/:user_id', (req, res) => {
  db.collection('users')
    .find({ user_id: req.params.user_id })
    .toArray((err, result) => {
      if (err) { return console.log(err); }
      res.send(result);
    });
});

app.get('/api/issues', (req, res) => {
  db.collection('issues')
    .find()
    .toArray((err, result) => {
      if (err) { return console.log(err); }
      res.send(result);
    });
});

app.get('/api/officials/:zip', (req, res) => {
  var request = require('request');
  request("https://www.googleapis.com/civicinfo/v2/representatives?key=" + process.env.GOOGLE_API_KEY + "&address=" + req.params.zip, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // body returns a string so make it onto a JSON object
    var dataObj = JSON.parse(body);
    // making new object that makes sense
    var offices = dataObj['offices'];
    var officials = dataObj['officials'];
    var mergedArray = {officials : []};
    offices.forEach(function(obj, index) {
        var indices = obj['officialIndices'];
        indices.forEach(function(indice, ind) {
            var newObj = {};
            newObj['office'] = obj['name'];
            // translate names
            if (newObj.office == "United States Senate") {
              newObj.office = "Senator";
            }
            if (newObj.office.includes("United States House")) {
              newObj.office = "Representative";
            }
            if (newObj.office.includes("Vice-President of the United States")) {
              newObj.office = "Vice President";
            }
            if (newObj.office.includes("President of the United States")) {
              newObj.office = "President";
            }
            // handling missing roles for Mayor, Council Members
            if (obj['roles']) {
              newObj['roles'] = obj['roles']
            } else {
              if (newObj.office == "Mayor" || newObj.office.includes("Council")) {
                newObj['roles'] = "headOfGovernmentCity";
              } else {
                newObj['roles'] = "";
              }
            };
            newObj['name'] = officials[indice]['name'];
            newObj['address'] = officials[indice]['address'];
            newObj['party'] = officials[indice]['party'];
            // ensures party is always provided, even 'unaffiliated'
            if (!newObj.party || newObj.party == "Unknown") {
              newObj.party = "Unaffiliated";
            };
            // value is often 'Democratic' which reads strangly next to 'Republican'
            if (newObj.party == "Democratic") {
              newObj.party = "Democrat";
            };
            newObj['phones'] = officials[indice]['phones'];
            newObj['emails'] = officials[indice]['emails'];
            newObj['urls'] = officials[indice]['urls'];
            newObj['channels'] = officials[indice]['channels'];
            newObj['photos'] = officials[indice]['photoUrl'];
            mergedArray['officials'].push(newObj);
        })
    })
    if (req.query.name) {
      console.log("theres a query");
      mergedArray = _.find(mergedArray.officials, { 'name': req.query.name });
    }
    res.send(mergedArray);
    }
  })
});

// 404

app.use(function (req, res) {
    res.render('404.ejs');
});
