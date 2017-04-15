$(function() {
	console.log("push");

	var notifRef = firebase.database().ref().child("notifications");
	var baseRef = firebase.database().ref().child("to-fix");

	$('#questions').click(function() {
		console.log("clicked2");
		$('#playlist').empty();
		$('#playlist').removeClass();
		$('#playlist').addClass('col s8 push-s4 question-list');
		baseRef.on('child_added', function(snapshot) {
			console.log(snapshot.val());
			if(snapshot.val().type === 'question') {
				console.log(snapshot.key);
				$('.question-list').append('<div class="interior" id='+snapshot.key+'><span class="title">Question ' + snapshot.val().message + '</span><input type="text" id="answer" name="frame" placeholder="Type Here"> <button class='+snapshot.key+'_submit>ANSWER</button><p><b>Date:</b>'+snapshot.val().timestamp+'<br><b>Timestamp:</b></p></div><div class="divider"></div>');
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
	});

	baseRef.on('child_added',  function(snapshot) {
		console.log(snapshot.val());
		if(snapshot.val().type === 'question') {
			console.log(snapshot.key);
			$('.question-list').append('<div class="interior" id='+snapshot.key+'><span class="title">Question ' + snapshot.val().message + '</span><input type="text" id="answer" name="frame" placeholder="Type Here"> <button class='+snapshot.key+'_submit>ANSWER</button><p><b>Date:</b>'+snapshot.val().timestamp+'<br><b>Timestamp:</b></p></div>');
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
    $('#' + snapshot.key).remove();
  });


});
