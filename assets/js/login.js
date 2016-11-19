$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyC1_tDsGAAxrdVQdt4JqsUg8znxe_bPC_k",
        authDomain: "bootcampbuddies-userform.firebaseapp.com",
        databaseURL: "https://bootcampbuddies-userform.firebaseio.com",
        storageBucket: "bootcampbuddies-userform.appspot.com",
        messagingSenderId: "1072508458086"
    };
    firebase.initializeApp(config);

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
        window.location.href="C:/Users/IBM%20Laptop/Desktop/myBranch/Bootcamp-Buddies/loggedin.html";
    });
});
