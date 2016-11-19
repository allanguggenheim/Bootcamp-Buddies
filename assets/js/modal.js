

$(document).ready(function(){

var placecategory;
var placezipcode;

function something() {

}

// Check if any button is clicked forever
$('button').on("click", function() {


//CHARACTER BUTTON SCOPE
    // Now that a button has been clicked, let's check if it's a character
    if ($(this).hasClass("yelpgoogle")){
        // placecategory = $('#placecategory').val().trim();
        placezipcode = $('#placezipcode').val().trim();
        window.location.href = "yelp_google.html?placecategory=cafes&placezipcode=" + placezipcode;
    }
   	
    if ($(this).hasClass("adminbutton")){
        // placecategory = $('#placecategory').val().trim();
        window.location.href = "admin/index.html";
    }

})

})