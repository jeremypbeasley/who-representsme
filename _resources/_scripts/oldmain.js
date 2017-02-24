var googleApiKey = "AIzaSyDWvCRpzgZakIAVB0046tW86OrL1wCclZI";

function getOfficials(zip, roles) {
  for (i = 0; i < roles.length; i++) {
    if ( roles[i] == "legislatorUpperBody") {
      $.get("https://www.googleapis.com/civicinfo/v2/representatives?key=" + googleApiKey + "&address=" + zip + "&roles=" + roles[i] , function(result) {
        printPerson(result.officials, "U.S. Senate");
      });
    }
    if ( roles[i] == "legislatorLowerBody") {
      $.get("https://www.googleapis.com/civicinfo/v2/representatives?key=" + googleApiKey + "&address=" + zip + "&roles=" + roles[i] , function(result) {
        printPerson(result.officials, "U.S. House of Representatives");
      });
    }
    if ( roles[i] == "headOfGovernment") {
      $.get("https://www.googleapis.com/civicinfo/v2/representatives?key=" + googleApiKey + "&address=" + zip + "&roles=" + roles[i] , function(result) {
        // excludes U.S. President from result
        var governor = [ result.officials[1] ];
        printPerson(governor, "Governor");
      });
    }
  }
};

function printPerson(officials, officialsOffice) {
  $(".officialList").append("<div class='officialTile'><h2 class='Display3'>" + officialsOffice + "</h2></div>");
  for (i = 0; i < officials.length; i++) {
    official = printPersonTemplate(officials[i]);
    $(".officialList").append(official);
  }
};

function printPersonTemplate(official) {
  // photo
  if (official.photoUrl) {
    officialPhoto = official.photoUrl;
  } else {
    officialPhoto = ""
  }
  // party affiliation
  officialPartyInitial = official.party.charAt(0);
  // twitter username
  officialTwitter = "";
  console.log(official.name);
  if (official.channels) {
    console.log("theres a channels");
    for (i = 0; i < official.channels.length; i++) {
      if (official.channels[i].type == "Twitter") {
        officialTwitter = '<p><a href="http://twitter.com/' + official.channels[i].id + '" target="_blank">@' + official.channels[i].id + '</a></p>';
        console.log("theres a twitter");
      }
      console.log(official.channels[i].type)
    }
  }
  return [
    '<div class="officialTile">',
      // '<a href="https://www.google.com/search?q=' + official.name + " " + official.party + '" target="_blank">',
        '<div class="officialPhoto Small" style="background-image: url(' + officialPhoto + ')"></div>',
        '<div class="officialName">',
        '<p>' + official.name + ' (' + officialPartyInitial + ')</p>',
        officialTwitter,
        '</div>',
      // '</a>',
    '</div>',
  ].join('\n');
};

getOfficials(
  98144,
  [
    // "deputyHeadOfGovernment",
    // "executiveCouncil",
    // "governmentOfficer",
    "headOfGovernment",
    // "headOfState",
    // "highestCourtJudge",
    // "judge",
    "legislatorLowerBody",
    "legislatorUpperBody",
    // "schoolBoard",
    // "specialPurposeOfficer"
  ]
);

$(document).on("click",".SubmitButton",function(e){
  $(".officialList").html("");
  var zip = $("input").val();
  getOfficials(
    98144,
    [
      // "deputyHeadOfGovernment",
      // "executiveCouncil",
      // "governmentOfficer",
      "headOfGovernment",
      // "headOfState",
      // "highestCourtJudge",
      // "judge",
      "legislatorLowerBody",
      "legislatorUpperBody",
      // "schoolBoard",
      // "specialPurposeOfficer"
    ]
  );
});

// NOTES

// US Senators, legislatorUpperBody
// US House Representatives, legislatorLowerBody
// Governor, headsOfGovernment
// Lt. Governor, headsOfGovernment
// Mayor, headsOfGovernment
// City Council, ?

// https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDWvCRpzgZakIAVB0046tW86OrL1wCclZI&address=98144
