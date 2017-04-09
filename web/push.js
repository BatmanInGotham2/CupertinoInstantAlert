   var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {types:['geocode']});
function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }
$(function() {
	console.log("push");
	// Initialize Firebase
	var config = {
	apiKey: "AIzaSyAHlt4CJODLsL62AOFKxTgQL-eBmEHN898",
	authDomain: "hackcupertino.firebaseapp.com",
	databaseURL: "https://hackcupertino.firebaseio.com",
	projectId: "hackcupertino",
	storageBucket: "hackcupertino.appspot.com",
	messagingSenderId: "157896239962"
	};
	firebase.initializeApp(config);

	var ref = firebase.database().ref().child("notifications");
    var location;

	$('#submit').on('click', function() {
		geocoder = new google.maps.Geocoder; 

		if(geocoder) {
			console.log("geocoding");
			 geocoder.geocode( { 'address': $('#autocomplete').val()}, function(results, status)
          {
          	if(status !== 'OK') {
          		alert('Geocoder failed:' + status);
          	}
          	location = $('#autocomplete').val();
			var msg = $('#message').val();
			var tag = $('#tag').val();
          	var notification = {
				'location' : location,
				'latitude': results[0].geometry.location.lat(),
				'longitude' : results[0].geometry.location.lng(),
				'message' : msg,
				'tag' : tag,
				'timestamp' : new Date().toString(),
				'type': 'message'
			};
			console.log(notification);

			ref.push(notification, function(err) {
				console.log(err);
			});	
          });
		}
		//var location = $('#location').val();
		
	});

	ref.on('child_added', function(snapshot){
		//console.log(snapshot.val());
		  var k = snapshot.key;
		  var msg = snapshot.val().message === null ? snapshot.val().answer : snapshot.val().message;
		$('body').append('<p class=' + snapshot.key + ' id="message">' + msg + ' <button class=' + snapshot.key + ' id="delete">Delete</button> </p>');
		  console.log(snapshot.key);
		$('.' + snapshot.key).click(function() {
	      var key = $(this).attr('class');
	      console.log(k);
	      ref.child(k).remove();
	    });
	});

	ref.on('child_removed', function(snapshot) {
		console.log("removing");
		$('.' + snapshot.key).remove();
	})
	
});