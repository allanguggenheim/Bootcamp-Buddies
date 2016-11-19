 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC1_tDsGAAxrdVQdt4JqsUg8znxe_bPC_k",
    authDomain: "bootcampbuddies-userform.firebaseapp.com",
    databaseURL: "https://bootcampbuddies-userform.firebaseio.com",
    storageBucket: "bootcampbuddies-userform.appspot.com",
    messagingSenderId: "1072508458086"
  };
  firebase.initializeApp(config);

	// Referencing the firebase
	var database= firebase.database();
	var students = database.ref();


function deletestudent(studentKey) {
  console.log(students);
  students.child(studentKey).remove().then(function() {
    // Code after remove
  });
	//Prevents moving to new page
	return false;
};


$(document).ready(function(){ 



	//Initial values
	var student = {
		Name: "",
		Dest: ""
	};
		//Button for adding students
	$("#submitStudent").on("click", function(){
		// alert("yoo");

		//Getting new student input
		student.Name = $('#addName').val().trim();
		student.Dest = $('#addDestination').val().trim();

		//Creating temporary object for holding student new

		var newstudent = {
			name: student.Name,
			destination: student.Dest
		}

		//Uploads student data to the database
		database.ref().push({
			newstudent,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});

		// Clears all of the text-boxes
		$("#addName").val("");
		$("#addDestination").val("");

		//Prevents moving to new page
		return false;

	});

	//Make all of this update every 60 seconds

		database.ref().on("child_removed", function(childSnapshot){
			location.reload();
		});

	//Create Firebase event for adding students to the database and a row in the html with entries
		database.ref().on("child_added", function(childSnapshot){
			//console.log(childSnapshot.val());

		//Add stored students to the schedule
			//assigning stored student names to a variable
			student.Name = childSnapshot.val().newstudent.name;
				$('#name').append('<div class="row" id="nameRow">');
				$('#nameRow').append(student.Name);
				//Add a new line for the next student
				$('#nameRow').append("<br/>");

			//Destination
			student.Dest = childSnapshot.val().newstudent.destination;
				$('#destination').append('<div class="row" id="destRow">');
				$('#destRow').append(student.Dest);
				//Add a new line for the next student
				$('#destRow').append("<br/>");


				$('#delete').append('<div class="row" id="deleteRow">');
				$('#deleteRow').append('<button id=\"deletestudent\" type=\"submit\" class=\"btn btn-primary\" onclick=\"deletestudent(\''+childSnapshot.key+'\');\">Delete</button>');
				// $('#deleteRow').append('<button id=\"deletestudent\" type=\"submit\" class=\"btn btn-primary\" onclick=\"deletestudent(\''+student.Name+'\');\">Delete</button>');
				$('#deleteRow').append("<br/>");
				// If any errors are experienced, log them to console.
			}, function (errorObject) {

			  	console.log("The read failed: " + errorObject.code);
	});



});	