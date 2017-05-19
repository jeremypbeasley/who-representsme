// UI fade in

$('.HeadingLarge').delay(200).fadeTo( 500 , 1);
$('.EnterZip').delay(500).fadeTo( 500 , 1);
$('.SiteCredit, .TinyLogo').delay(800).fadeTo( 500 , 1);

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
    e.preventDefault();
    // validate the field has 5 characters AND those are all digits
    // if ( $(".InputZip").val().length !== 5 ) {
    //   displaySnackbar("Sorry, we need a 5 digit zip code.", "error");
    // }
    // otherwise, go get officials
    getOfficials(
      $(".InputZip").val(),
      [
        "legislatorUpperBody", // Senate
        "legislatorLowerBody" // House
        //"headOfGovernment", // Governor
        //"headOfGovernmentCity" // Mayor
      ]
    );
});

// OFFICIALS, all

function getOfficials(zip, roles) {
  if (zip.length <= 5 || zip.match(/^[0-9]+$/) != null) {
    // zip validation against API response
    $.get("/api/officials/" + zip, function(result) {
      // zip validation, no US zips are over 5 digits
        if (zip !== result.address.zip) {
          displaySnackbar("Please enter a valid US zip code.", "notif");
        } else {
          openOverlay();
          var officialsSorted = {officials : []};
          _.forEach(roles, function(value, key) {
            var role = value;
            _.forEach(result.officials, function(value, key) {
              if (value.roles == role) {
                officialsSorted['officials'].push(value);
              }
            });
          });
          $('#OverlayCityName').html(result.address.city);
          // adds in the div we load content into after closeOverlay cleared it
          $(".OverlayContent").html("<div class='OfficialRoster'></div>");
          $('.OverlayCity').delay(200).fadeTo(500, 1);
          $('.OfficialRoster').delay(500).fadeTo(500, 1);
          $('.ShareContainer').delay(750).fadeTo(500, 1);
          $('.OverlaySiteCredit').delay(1000).fadeTo(500, 1);
          loadOfficialPhotos(officialsSorted.officials);
          for (i = 0; i < officialsSorted.officials.length; i++) {
            console.log("getting an official");
            printOfficial(officialsSorted.officials[i]);
          }
          var w = $(".officialSingle").outerWidth(true);
          $("#officialList").css("width", (officialsSorted.officials.length * w) + "px");
        }
    }).fail(function() {
      // if API response fails
      displaySnackbar("Sorry! We're having some issues. Try again?", "notif");
    })
  } else {
    // if zip entered is longer than 5
    displaySnackbar("Please enter a valid 5 digit US zip code.", "notif");
  }
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
        officialTwitter = '<p class=""><a href="http://twitter.com/' + official.channels[x].id + '" target="_blank">@' + official.channels[x].id + '</a></p>';
      }
    }
  }
  //email
  if (!official.emails) {
    var officialEmail = '<p class>None available</p>';
  } else {
    var officialEmail = '<p><a href="mailto:' + official.emails[0] + '">' + official.emails[0] + '</a></p>';
  }
  // party
  if (official.party == "Republican" || official.party == "Democrat" || official.party == "Green" || official.party == "Independent") {
    var party = " (" + official.party.charAt(0) + ")";
  } else {
    var party = "";
  }
  // site
  if (official.party == "Republican" || official.party == "Democrat" || official.party == "Green" || official.party == "Independent") {
    var party = " (" + official.party.charAt(0) + ")";
  } else {
    var party = "";
  }
  person = [
    '<div class="OfficialSingle">',
      '<div class="OfficialPhoto">',
        '<div class="Image" style="background-image: url(' + official.photos + ')"></div>',
        '<div class="Backdrop"></div>',
      '</div>',
      '<div class="OfficialInfo">',
        '<p class="op50 OfficialOffice">' + official.office + party + '</p>',
        '<h3 class="OfficialName d-mt2 mb3">' + official.name + '</h3>',
        '<p><a href="tel:',
         official.phones[0].replace(/[^A-Z0-9]/ig, "") + '">' + official.phones,
         '</a></p>',
         officialTwitter,
        '<p class="OfficialSite"><a href="',
          official.urls[0],
        '" target="_blank">More info ›</a></p>',
      '</div>',
    '</div>',
    // '<div class="OfficialDivider class="pt4 pb4></div>',
  ].join('\n');
  $(".OfficialRoster").append(person);
};

function loadOfficialPhotos(officials) {
  // loops through photourls, making actual images to preload actual bg images
  for (i = 0; i < officials.length; i++) {
    let n = new Image();
    n.setAttribute("src", officials[i].photos);
    console.log("appending");
    document.getElementById("ImgLoader").appendChild(n);
  }
  var nImages = officials.length;
  var loadCounter = 0;
  //binds onload event listner to images
  $("#ImgLoader img").on("load", function() {
    loadCounter++;
    if(nImages == loadCounter) {
      $('.OfficialPhoto .Image').fadeIn(500);
      $('.OfficialPhoto .Backdrop').delay(200).fadeTo(.1);
      //$("#loadingDiv").hide();
    }
  }).each(function() {
    // attempt to defeat cases where load event does not fire on cached images
    if(this.complete) $(this).trigger("load");
  });
}

// copy share url

var clipboard = new Clipboard('.BtnShare');

clipboard.on('success', function(e) {
  displaySnackbar("Copied to your clipboard!", "notif");
});
clipboard.on('error', function(e) {
   displaySnackbar("We weren't able to copy this :(", "error");
});
