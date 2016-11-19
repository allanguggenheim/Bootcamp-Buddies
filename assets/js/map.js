
var foundMyself = false;
var foundMatch = false;
var name, email, photoUrl, uid;
var map;
var gmarkers = [];
var myVM;
var myAddress;

// alert();

var placezipcode = location.search.split('placezipcode=')[1];
console.log("This will show you study groups near " + placezipcode);

var yelpAuth = {
                //
                // Update with your auth tokens.
                //
    consumerKey: "CYIw0EYo7t4MxnbzgeXGwA", 
    consumerSecret: "FesnqFQwQ2XldfAoYdCd4KZ0WHw",
    accessToken: "9-HRKj_YfATgLgKR1piSAb7CTfMSH_QH",
    accessTokenSecret: "j0NGfSG6BzIbCme1h3YByKbEPt0"
        };

// function initMap() {
//     var myLatLng = {lat: 37.7423, lng: -122.473823};
//     map = new google.maps.Map(document.getElementById('map'), {
//               zoom: 15,
//               center: myLatLng,
//               mapTypeId: google.maps.MapTypeId.ROADMAP
//             });
//     google.maps.event.addDomListener(window, "resize", function() {
//         var center = map.getCenter();
//         google.maps.event.trigger(map, "resize");
//         map.setCenter(center); 
//     });

//     myVM = new ViewModel();
//     ko.applyBindings(myVM, document.getElementById("locations"));
// };

function rad(x) {return x*Math.PI/180;}

function getMyAddress(callback){
     // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC1_tDsGAAxrdVQdt4JqsUg8znxe_bPC_k",
    authDomain: "bootcampbuddies-userform.firebaseapp.com",
    databaseURL: "https://bootcampbuddies-userform.firebaseio.com",
    storageBucket: "bootcampbuddies-userform.appspot.com",
    messagingSenderId: "1072508458086"
  };
  // firebase.initializeApp(config);

    // Referencing the firebase
    var database= firebase.database();
    var students = database.ref();

    //Initial values
    var student = {
        Name: "",
        Dest: ""
    };
    var studentLat="";
    var studentLong="";

    if(!foundMyself){
// /Create Firebase event for adding students to the database and a row in the html with entries
       database.ref().on("child_added", function(childSnapshot){
           //console.log(childSnapshot.val());

           if (email == childSnapshot.val().newUser.email) {
                var myAddress = childSnapshot.val().newUser.address;
               console.log("my found address inside loop in function: " + myAddress);
               foundMyself = true;

               callback(myAddress);
            
           }
       });
    }

}

function calcDistance(p1, p2) {
  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}

function getLat(zip) {
        console.log("zip provided is:  " + zip);
        var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': zip}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    studentLat = results[0].geometry.location.lat();
                    studentLong = results[0].geometry.location.lng();
                    console.log("student lat is: " + studentLat);
                    // console.log("student long is: " + studentLong);
                    return studentLat;
                }
            });

}

function getLong(zip) {
        var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { 'address': zip}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    studentLat = results[0].geometry.location.lat();
                    studentLong = results[0].geometry.location.lng();
                    // console.log("student lat is: " + studentLat);
                    console.log("student long is: " + studentLong);
                    return studentLong;
                }
            });

}

function geocodeAddress(address, callback) {

    var geocoder = new google.maps.Geocoder();

    var latlng = new Array(2);

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            latlng[0] = results[0].geometry.location.lat();
            latlng[1] = results[0].geometry.location.lng();
            callback(latlng); // call the callback function here
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}

function initMap() {
    findMiddle();
};

var Locations = [
    {
        name: 'Guerra Quality Meats',
        lat:  37.743461,
        lng: -122.471199,
        address: '490 Taraval St, San Francisco',
        index: 0,
        yelpID: 'guerra-quality-meats-san-francisco',
        reviewCount: 0,
        imageUrl: null,
        ratingImageUrl: '',
        snippet: ''

    }
]

var Location = function(map, data){
	var marker;

	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.address = ko.observable(data.address);
	this.yelpID = ko.observable(data.yelpID);
	this.index = ko.observable(data.index);
	this.reviewCount = ko.observable(data.reviewCount);
    this.imageUrl = ko.observable(data.imageUrl);
    this.ratingImageUrl = ko.observable(data.ratingImageUrl);
    this.snippet = ko.observable(data.snippet);

	marker = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat, data.lng),
		animation: google.maps.Animation.DROP,
		icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	});

          
	var infowindow = new google.maps.InfoWindow({
          content: "<strong>" + data.name + "</strong>" + "<br>" + data.address
        });

	google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, this);
        clicked_item = myVM.locationList()[data.index];
        locationClick(marker,clicked_item);
    
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
    	infowindow.open(map, this);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
    	infowindow.close();
    });

	this.isVisible = ko.observable(false);

	this.isVisible.subscribe(function(currentState){
		if (currentState) {
			marker.setMap(map);
		} else {
			marker.setMap(null);
		}
	});

	this.isVisible(true);
	gmarkers.push(marker);
}


var ViewModel = function(){

    var self = this;
    this.markerList = ko.observableArray([]);
    this.query = ko.observable('');
    this.currentLoc = ko.observable('');
    this.errorMsg = ko.observable('');


    this.locationList = ko.observableArray([]);
    Locations.forEach(function(locItem){
    	self.locationList.push(new Location(map, locItem));
    });

    this.selectedItem = ko.observable('');

    // location filter is used for the search field
    self.filteredLocations = ko.computed(function () {
        var filter = self.query().toLowerCase();
        var match;

        if (!filter) {
        	match = self.locationList();
        	match.forEach(function(item){
    			item.isVisible(true);
    		});
            return match
        } else {
            var isSelected;
            return ko.utils.arrayFilter(self.locationList(), function (item) {
                match = item.name().toLowerCase().indexOf(filter) !== -1;
                item.isVisible(match);
                self.selectedItem('');
                self.currentLoc('');
                toggleMarkers(null);
                return match;
            });
        }
    });

    this.hilightItem = function(item){
        self.selectedItem(item.name());
    };

    this.changeCurrentLoc = function(item){
        self.currentLoc(item);
    };

    this.onClick = function(item){
        locationClick(gmarkers[item.index()], item);
    };

}

function toggleMarkers(marker){
    for (i=0; i < gmarkers.length; i++){
            gmarkers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        }
    if (marker){
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    }    
    
    };

function locationClick(marker, clicked_item){
    toggleMarkers(marker);
    myVM.hilightItem(clicked_item);
    getYelpData(clicked_item);
};
    
//Yelp functions bellow

function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    };

function getYelpData(item){
    var yelpID = item.yelpID();

    var yelp_url = 'https://api.yelp.com/v2/business/' + yelpID;

    var parameters = {

            oauth_consumer_key: yelpAuth.consumerKey,
            oauth_token: yelpAuth.accessToken,
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now()/1000),
            oauth_signature_method: 'HMAC-SHA1',
            callback: null       
        };

    var oauth_signature = oauthSignature.generate('GET', yelp_url, parameters, yelpAuth.consumerSecret, yelpAuth.accessTokenSecret);
    parameters.oauth_signature = oauth_signature; 

    $.ajax({
            'url' : yelp_url,
            'data' : parameters,
            'dataType' : 'jsonp',
            'jsonpCallback' : 'myCallback',
            'cache': true
    })
    .done(function(data, textStatus, jqXHR) {
        myVM.errorMsg('');
        
        item.reviewCount(JSON.stringify(data.review_count));
        
        // removing extra quotes from image URL
        var image_url = JSON.stringify(data.image_url);
        image_url = image_url.replace(/["]+/g, '')
        item.imageUrl(image_url);

        // removing extra quotes from image URL
        var rating_url = JSON.stringify(data.rating_img_url);
        rating_url = rating_url.replace(/["]+/g, '')
        item.ratingImageUrl(rating_url);

        item.snippet(JSON.stringify(data.snippet_text));

        myVM.changeCurrentLoc(item);

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
        myVM.errorMsg('Could not load Yelp reviews');
        myVM.changeCurrentLoc('');
    });

};

function findMiddle() {



    var config = {
        apiKey: "AIzaSyC1_tDsGAAxrdVQdt4JqsUg8znxe_bPC_k",
        authDomain: "bootcampbuddies-userform.firebaseapp.com",
        databaseURL: "https://bootcampbuddies-userform.firebaseio.com",
        storageBucket: "bootcampbuddies-userform.appspot.com",
        messagingSenderId: "1072508458086"
    };
    firebase.initializeApp(config);


// import firebase;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // console.log("user is logged in: " + user)

  } else {
    // No user is signed in.
    // console.log("user aint logged in")
  }


var user = firebase.auth().currentUser;


if (user != null) {
  name = user.displayName;
  email = user.email;
  photoUrl = user.photoURL;
  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
 console.log("user is logged in: " + email);    
}

});




    var geocoder = new google.maps.Geocoder();
    var firstAddress = "17059 albers street";
    // var secondAddress = placezipcode;
    var firstLatitude;
    var firstLongitude;
    var secondLatitude;
    var secondLongitude;

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC1_tDsGAAxrdVQdt4JqsUg8znxe_bPC_k",
    authDomain: "bootcampbuddies-userform.firebaseapp.com",
    databaseURL: "https://bootcampbuddies-userform.firebaseio.com",
    storageBucket: "bootcampbuddies-userform.appspot.com",
    messagingSenderId: "1072508458086"
  };
  // firebase.initializeApp(config);

    // Referencing the firebase
    var database= firebase.database();
    var students = database.ref();

    //Initial values
    var student = {
        Name: "",
        Dest: ""
    };
    var studentLat="";
    var studentLong="";


getMyAddress(function(myAddress) {

    var secondAddress = myAddress;
    console.log("my found address is all good: " + secondAddress);

    geocoder.geocode( { 'address': firstAddress}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            firstLatitude = results[0].geometry.location.lat();
            firstLongitude = results[0].geometry.location.lng();
            console.log(firstLatitude);
            console.log(firstLongitude);
        }
    

    geocoder.geocode( { 'address': secondAddress}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            secondLatitude = results[0].geometry.location.lat();
            secondLongitude = results[0].geometry.location.lng();
            console.log(secondLatitude);
            console.log(secondLongitude);
        }


            console.log("can I still:" + firstLatitude);
            console.log("can I still:" + firstLongitude);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: new google.maps.LatLng(firstLatitude, firstLongitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;




        marker = new google.maps.Marker({
            position: new google.maps.LatLng(firstLatitude, firstLongitude),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(firstAddress);
                infowindow.open(map, marker);
            }
        })(marker, i));
    

    var bound = new google.maps.LatLngBounds();

        bound.extend( new google.maps.LatLng(firstLatitude, firstLongitude) );
        bound.extend( new google.maps.LatLng(secondLatitude, secondLongitude) );

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(secondLatitude, secondLongitude),
            map: map
        });

        // OTHER CODE

        // database.ref().on("child_added", function(childSnapshot){






        // });

    //Create Firebase event for adding students to the database and a row in the html with entries
        database.ref().on("child_added", function(childSnapshot){
            //console.log(childSnapshot.val());

        //Add stored students to the schedule
            //assigning stored student names to a variable
            student.Name = childSnapshot.val().newUser.email;

            console.log("found student in db: " + student.Name);

            //address
            student.Dest = childSnapshot.val().newUser.address;


            console.log("found student zip code in db: " + student.Dest)

            // var studentLat = getLat(student.Dest);
            // var studentLong = getLong(student.Dest);

geocodeAddress(student.Dest, function(search_latlng) {
  console.log("the lat long is yo: " + search_latlng);


                    // console.log("student lat is still: " + studentLat);
                    // console.log("student long is still: " + studentLong);

            marker = new google.maps.Marker({
                title: childSnapshot.val().newUser.email,
                position: new google.maps.LatLng(search_latlng[0], search_latlng[1]),
                map: map
            });
            gmarkers.push(marker);
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!IM DEBUGGING: " + gmarkers);

            // var p1 = new google.maps.LatLng(45.463688, 9.18814);
            // var p2 = new google.maps.LatLng(46.0438317, 9.75936230000002);

            // alert(calcDistance(p1, p2));

                // If any errors are experienced, log them to console.

    var lat = secondLatitude;
    var lng = secondLongitude;

console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!IM DEBUGGING: " + gmarkers);

    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    for( i=0;i<gmarkers.length; i++ ) {
        var mlat = gmarkers[i].position.lat();
        var mlng = gmarkers[i].position.lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }

    var myEmail = gmarkers[closest].title;


console.log("The closes marker is: " + gmarkers[closest].title);


    if(!foundMatch){
// /Create Firebase event for adding students to the database and a row in the html with entries
       database.ref().on("child_added", function(childSnapshot){
           //console.log(childSnapshot.val());

           if (myEmail == childSnapshot.val().newUser.email) {
               var myAddress = childSnapshot.val().newUser.address;
               var myExperience = childSnapshot.val().newUser.experience;
               var myInterests = childSnapshot.val().newUser.interests;
               $('#matchedUser').append(
                        "Your Study Match:<br/>Email: " + myEmail + 
                        "<br/>Location: " + myAddress + 
                        "<br/>Level: " + myExperience + 
                        "<br/>Interests: " + myInterests
                    );

               console.log("found address: " + myAddress);
               console.log("found experience: " + myExperience);
               for( i=0;i<myInterests.length; i++ ) {
                    console.log("found an interest: " + myInterests[i]);
               }
            foundMatch = true;
           }
       });
    }


            }, function (errorObject) {

                console.log("The read failed: " + errorObject.code);


            });






});

    // return gmarkers[closest].title;



// var closesMarkerTitle = find_closest_marker(secondLatitude, secondLongitude);




    //  TO GET THE CENTER OF ALL MARKERS
    console.log( "the center lat is: " + bound.getCenter().lat() + " the center long is: " + bound.getCenter().lng() );


        marker = new google.maps.Marker({
            position: new google.maps.LatLng(bound.getCenter().lat(), bound.getCenter().lng()),
            map: map
        });

    // getYelpCafes(bound.getCenter().lat(), bound.getCenter().lng());

    //var yelp_url = 'https://api.yelp.com/v2/search?category_filter=bars&cll=' + centerLat + ',' + centerLon;
    var yelp_url = 'http://api.yelp.com/v2/search';

    var parameters = {

            oauth_consumer_key: yelpAuth.consumerKey,
            oauth_token: yelpAuth.accessToken,
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now()/1000),
            oauth_signature_method: 'HMAC-SHA1',
            // oauth_signature: yelpAuth.accessTokenSecret,
            callback: 'JSON_CALLBACK',
            term: 'cafes',
            //location: '91316'
            ll: bound.getCenter().lat() + "," + bound.getCenter().lng(),
            limit: 10
        };

    var oauth_signature = oauthSignature.generate('GET', yelp_url, parameters, yelpAuth.consumerSecret, yelpAuth.accessTokenSecret);
    parameters.oauth_signature = oauth_signature; 

    $.ajax({
            'url' : yelp_url,
            'data' : parameters,
            'dataType' : 'jsonp',
            'jsonpCallback' : 'myCallback',
            'cache': true
    })
    .done(function(data, textStatus, jqXHR) {
        // myVM.errorMsg('');
        console.log(data.businesses);
        // item.reviewCount(JSON.stringify(data.review_count));
        
        // // removing extra quotes from image URL
        // var image_url = JSON.stringify(data.image_url);
        // image_url = image_url.replace(/["]+/g, '')
        // item.imageUrl(image_url);

        // // removing extra quotes from image URL
        // var rating_url = JSON.stringify(data.rating_img_url);
        // rating_url = rating_url.replace(/["]+/g, '')
        // item.ratingImageUrl(rating_url);

        // item.snippet(JSON.stringify(data.snippet_text));

        // myVM.changeCurrentLoc(item);
            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            for (i=0; i < data.businesses.length; i++){
                console.log(i);
                console.log("position of result is: " + data.businesses[i].location.coordinate.latitude + "," + data.businesses[i].location.coordinate.longitude);
                console.log("title of result is: " + data.businesses[i].name + " , Rating: " + data.businesses[i].rating);
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.businesses[i].location.coordinate.latitude, data.businesses[i].location.coordinate.longitude),
                    title: data.businesses[i].name + " , Rating: " + data.businesses[i].rating,
                    map: map,
                    icon: image
                });
                Locations.push({
                    name: data.businesses[i].name,
                    lat:  data.businesses[i].location.coordinate.latitude,
                    lng: data.businesses[i].location.coordinate.longitude,
                    address: data.businesses[i].location.address[0],
                    index: i,
                    yelpID: data.businesses[i].id,
                    reviewCount: data.businesses[i].review_count,
                    imageUrl: data.businesses[i].image_url,
                    ratingImageUrl: data.businesses[i].rating_img_url,
                    snippet: data.businesses[i].snippet_text
                    });
            } 
            console.log("Locations are: " + Locations) 
                myVM = new ViewModel();
                ko.applyBindings(myVM, document.getElementById("locations"));

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
        myVM.errorMsg('Could not load Yelp reviews');
        myVM.changeCurrentLoc('');
    });


    // marker = new google.maps.Marker({
    //     position: new google.maps.LatLng(bound.getCenter().lat(),bound.getCenter().lng()),
    //     map: map
    // });

    });
    });
    });

};
