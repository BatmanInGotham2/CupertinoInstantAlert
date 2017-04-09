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

  var ref = firebase.database().ref().child("to-fix");
  ref.on('child_added', function(snapshot) {
  	$('body').append('<p class=' + snapshot.key + ' id="message">' + snapshot.val().message + ' <button class=' + snapshot.key + ' id="delete">Delete</button> </p>');
  	console.log(snapshot.key);
    $('p .' + snapshot.key).click(function() {
      var key = $(this).attr('class');
      ref.child(key).remove();
    });
  });

  ref.on('child_removed', function(snapshot) {
    console.log(snapshot.key);
    $('.' + snapshot.key).remove();
  });

});