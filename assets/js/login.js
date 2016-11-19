$(document).ready(function() {
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
});

var user = firebase.auth().currentUser;
var name, email, photoUrl, uid;

if (user != null) {
  name = user.displayName;
  email = user.email;
  photoUrl = user.photoURL;
  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
 console.log("user is logged in: " + email);    
}


var user = firebase.auth().currentUser;

if (user != null) {
  user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: "+profile.providerId);
    console.log("  Provider-specific UID: "+profile.uid);
    console.log("  Name: "+profile.displayName);
    console.log("  Email: "+profile.email);
    console.log("  Photo URL: "+profile.photoURL);
  });
}


    $("#signin").on("click", function() {
      var email = $("#email").val().trim();
      var password = $("#password").val().trim();
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } 
        });
      // const token = firebase.auth().createCustomToken(options.userId, {
      //     app: appRootName,
      //     debug: !!options.debug
      // });
      // console.log(token);
      console.log(firebase.auth().currentUser.ld);
        window.location.href=("yelp_google.html");
    });
});