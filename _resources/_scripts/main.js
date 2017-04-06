// Random Zip Code

function getRandomZip() {
  $.get("/zips.json", function(result) {
    if (!result) {
      //err
    } else {
      var zip = result[(Math.random() * (29900 - 1) + 1).toFixed(0)];
      // console.log(zip);
      $('#zipInput').val(zip);
    }
  })
}
getRandomZip();

//  OFFICIALS, Form

$('#zipForm').submit(function(e) {
    openOverlay();
    e.preventDefault();
    // validate the field has 5 characters AND those are all digits
    if ( $("input:first").val().length !== 5 ) {
      displaySnackbar("Sorry, we need a 5 digit zip code.", "error");
    }
    // otherwise, go get officials
    getOfficials(
      $("input:first").val(),
      [
        "legislatorUpperBody", // Senate
        "legislatorLowerBody", // House
        "headOfGovernment", // Governor
        "headOfGovernmentCity" // Mayor
      ]
    );
});

// OFFICIALS, all

function getOfficials(zip, roles) {
  $.get("/api/officials/" + zip, function(result) {
    var officialsSorted = {officials : []};
    _.forEach(roles, function(value, key) {
      var role = value;
      _.forEach(result.officials, function(value, key) {
        if (value.roles == role) {
          officialsSorted['officials'].push(value)
        }
      });
    });
    $("#officialList").html("");
    for (i = 0; i < officialsSorted.officials.length; i++) {
      printOfficial(officialsSorted.officials[i]);
    }
    var w = $(".officialSingle").outerWidth(true);
    $("#officialList").css("width", (officialsSorted.officials.length * w) + "px");
  });
};

function printOfficial(official) {
  // twitter
  if (!official.channels) {
    //err
  } else {
    // console.log(official.channels.length);
    // console.log(official.channels);
    for (x = 0; x < official.channels.length; x++) {
      if (official.channels[x].type == "Twitter") {
        // console.log("has twitter");
        officialTwitter = '<p class="mt1"><a href="http://twitter.com/' + official.channels[x].id + '" target="_blank">@' + official.channels[x].id + '</a></p>';
      }
    }
  }
  //email
  if (!official.emails) {
    var officialEmail = '<p>None available</p>';
  } else {
    var officialEmail = '<p class=""><a href="mailto:' + official.emails[0] + '">' + official.emails[0] + '</a></p>';
  }
  // party
  if (official.party == "Republican" || official.party == "Democrat" || official.party == "Green" || official.party == "Independent") {
    var party = " (" + official.party.charAt(0) + ")";
  } else {
    var party = "";
  }
  person = [
    '<div class="OfficialContainer">',
      '<div class="officialPhoto OfficialPhoto" style="background-image: url(' + official.photos + ')"></div>',
      '<p class="op50">' + official.office + party + '</p>',
      '<p>' + official.name + '</p>',
      officialTwitter,
      '<p class=""><a href="tel:',
       official.phones[0].replace(/[^A-Z0-9]/ig, "") + '">' + official.phones,
       '</a></p>',
      officialEmail,
    '</div>',
  ].join('\n');
  $(".OfficialsContainer").append(person);
};
