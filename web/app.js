$(function() {
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

  var $val = "";
	var ref = firebase.database().ref().child("incoming");

	ref.on('child_added', function(snapshot) {
  	$val = snapshot.val().message;
  	$('.incoming-list').append('<p class=' + snapshot.key + ' id='+ snapshot.val().type + '>' + snapshot.val().message + '<button class=button_' + snapshot.key + ' id="accept">Accept</button></p>');
  	console.log(snapshot.toJSON());
	$('.button_' + snapshot.key).click(function() {
	  	var pushRef = firebase.database().ref().child("to-fix");
	  	console.log(snapshot.toJSON());
	    pushRef.push(snapshot.toJSON(), function(err) {
        ref.child(snapshot.key).remove();
	    	console.log(err);
	    });
	});
  });

  ref.on('child_removed', function(snapshot) {
    $('.' + snapshot.key).remove();
  });

});
