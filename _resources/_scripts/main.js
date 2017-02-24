// GLOBAL VARS

var userPostalCode;

$('#zipForm').submit(function(e) {
    e.preventDefault();
    // validate the field has 5 characters AND those are all digits
    if ( $("input:first").val().length !== 5 ) {
      displaySnackbar("Sorry, we need a 5 digit zip code.", "error");
    } else {
      var zip =
      getOfficials(
        $("input:first").val(),
        [
          "legislatorUpperBody",
          "legislatorLowerBody",
          "headOfGovernment",
          "headOfGovernmentCity"
        ]
      );
    }
});

// OFFICIALS, all

function getOfficials(zip, roles) {
  // $("#officialList").css("width", "10000px");
  $.get("/api/officials/" + zip, function(result) {
    console.log(result);
    var officialsSorted = {officials : []};
    _.forEach(roles, function(value, key) {
      var role = value;
      _.forEach(result.officials, function(value, key) {
        if (value.roles == role) {
          officialsSorted['officials'].push(value)
        }
      });
    });
    for (i = 0; i < officialsSorted.officials.length; i++) {
      printOfficial(officialsSorted.officials[i]);
    }
    var w = $(".officialSingle").outerWidth(true);
    $("#officialList").css("width", (officialsSorted.officials.length * w) + "px");
  });
};

function printOfficial(official) {
  if (official.party) {
    if (official.party == "Republican" || official.party == "Democrat") {
      var party = " (" + official.party.charAt(0) + ")";
    } else {
      var party = ""
    }
  } else {
    var party = "";
  }
  person = [
    '<div class="officialSingle" data-name="' + official.name + '">',
      '<div class="officialPhoto Small" style="background-image: url(' + official.photos + ')"></div>',
      '<div class="officialName">',
      '<p><span class="op50">' + official.office.substring(0,20) + '</span><br>',
      official.name + party + '</p>',
      '</div>',
    '</div>',
  ].join('\n');
  $("#officialList").append(person);
};

// OFFICIALS, overlay

function officialDetailTemplate(official) {
  console.log(official);
  // twitter logic
  if (official.channels) {
    for (i = 0; i < official.channels.length; i++) {
      officialTwitter = '';
      if (official.channels[i].type == "Twitter") {
        console.log("has twitter")
        officialTwitter = '<p class="mt1"><a href="http://twitter.com/' + official.channels[i].id + '" target="_blank">@' + official.channels[i].id + '</a></p>';
        i = 1000;
      }
    }
  }
  // email logic
  if (!official.emails) {
    var officialEmail = '<p>None available</p>'
  } else {
    var officialEmail = '<p class=""><a href="mailto:' + official.emails[0] + '">' + official.emails[0] + '</a></p>'
  }
  // party logic
  if (official.party == "Republican" || official.party == "Democrat" || official.party == "Green" || official.party == "Independent") {
    var party = " (" + official.party.charAt(0) + ")";
  } else {
    var party = "";
  }
  return [
    '<div class="row alignCenter">',
      '<div class="officialPhoto Large" style="background-image: url(' + official.photos + ')"></div>',
      '<div class="officialTitleCard">',
        '<p class="op50">' + official.office + party + '</p>',
        '<h2 class="Display1">' + official.name + '</h2>',
        '<p class="mt2"><button class="followButton">Follow</button></p>',
      '</div>',
    '</div>',
    '<div class="officialTile">',
      '<p class="op50 Caption mb3">Online</p>',
      officialTwitter,
    '</div>',
    '<div class="officialTile">',
      '<p class="op50 Caption mb3">Call</p>',
      '<p class=""><a href="tel:',
       official.phones[0].replace(/[^A-Z0-9]/ig, "") + '">' + official.phones,
       '</a></p>',
    '</div>',
    '<div class="officialTile">',
      '<p class="op50 Caption mb3">Email</p>',
      officialEmail,
    '</div>',
    '<div class="officialTile">',
      '<p class="op50 Caption mb3">Mail</p>',
      '<p class="">',
        official.address[0].line1 + '<Br>',
        official.address[0].city + ', ' + official.address[0].state +'<Br>',
        official.address[0].zip + '<Br>',
      '</p>',
    '</div>',
  ].join('\n');
};

$(document).on("click",".officialSingle",function(e){
  var name = $(this).data('name');
  $.get('/api/officials/' + userPostalCode + '/?name=' + name, function (result) {
    var OverlayContent = officialDetailTemplate(result);
    openOverlay(OverlayContent);
  })
  .fail(function (error) {
    console.log("error");
  });
});

// ISSUES, list

function getIssues() {
  $.get("/api/issues", function(result) {
    printIssues(result);
  });
};

function printIssues(issues) {
  for (i = 0; i < issues.length; i++) {
    issue = printIssuesTemplate(issues[i]);
    $("#issuesList").append(issue);
  }
};

function printIssuesTemplate(issues) {
  return [
    '<div class="officialTile">',
      '<p class="Caption op50 mt1">' + issues.locale_name + '</p>',
      '<h2 class="Display2 mb2">' + issues.title + '</h2>',
      '<p class="op50">Join Jeremy and ' + issues.actions.total_acted.toLocaleString() + ' others.</p>',
    '</div>',
  ].join('\n');
};

function displayZip(userPostalCode, userCity, userState) {
  $("#displayZip").html(userCity + ', ' + userState + ' - ' + userPostalCode);
}

function getUserProfile(user_id) {
  $("#userFirstName").html("");
  $.get("/api/user/" + user_id, function (result) {
    firstName = result[0].firstName;
    $("#userFirstName").html( firstName );
    $("#headerName").html( firstName.toLowerCase() + "." );
    // getIssues();
    userPostalCode = result[0].address.postalcode;
    userCity = result[0].address.city;
    userState = result[0].address.state;
    displayZip(userPostalCode, userCity, userState);
    getOfficials(
      userPostalCode,
      [
        "legislatorUpperBody",
        "legislatorLowerBody",
        "headOfGovernment",
        "headOfGovernmentCity"
      ]
    );
  })
}
// getUserProfile(user_id);
