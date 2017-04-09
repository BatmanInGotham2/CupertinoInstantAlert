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

	var notifRef = firebase.database().ref().child("notifications");
	var baseRef = firebase.database().ref().child("to-fix");

	baseRef.on('child_added', function(snapshot) {
		console.log(snapshot.val());
		if(snapshot.val().type === 'question') {
			console.log(snapshot.key);
			$('body').append('<p class=' + snapshot.key + ' id="message">' + snapshot.val().message + '<br><input id="answer" type="text" placeholder="answer"></input><button class=' + snapshot.key + '_submit' + ' id="submit">submit</button></p>');
			$(' .' + snapshot.key+'_submit').click(function() {
			   var key = snapshot.key;
				var msg = $('#answer').val();
				console.log();

				var notification = {
					'answer' : msg,
					'question' : snapshot.val().message,
					'timestamp' : new Date().toString(),
					'type' : 'question'
				}
				
				console.log(notification);

				notifRef.push(notification, function(err) {
					console.log(err);
					baseRef.child(key).remove();
				});
   		 });
		} 
	});

	baseRef.on('child_removed', function(snapshot) {
    $('.' + snapshot.key).remove();
  });


});