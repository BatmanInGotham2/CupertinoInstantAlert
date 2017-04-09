$(function() {

  var ref = firebase.database().ref().child("to-fix");

	$('#action_item').click(function() {
		console.log("clicked");
		$('#playlist').empty();
		$('#playlist').removeClass();
		$('#playlist').addClass('col s6 push-s5 to-fix-list');
		ref.on('child_added', function(snapshot) {
			if(snapshot.val().type === "message") {
	  	$('.to-fix-list').append('<div class=interior id='+snapshot.key+'> <span class="title">Message </span>'+snapshot.val().message+'<p><b>Date:'+snapshot.val().timestamp+'</b><br><b>Timestamp:</b></p><button class=button-' + snapshot.key + '>YES</button></div>');
	  	console.log(snapshot.key);
	    $('.button-' + snapshot.key).click(function() {
	      ref.child(snapshot.key).remove();
	    });
		}
		});
	});

  ref.on('child_added', function(snapshot) {
  	$('.to-fix-list').append('<div class=interior id='+snapshot.key+'> <span class="title">Message </span>'+snapshot.val().message+'<p><b>Date:'+snapshot.val().timestamp+'</b><br><b>Timestamp:</b></p><button class=button-' + snapshot.key + '>YES</button></div>');
  	console.log(snapshot.key);
    $('.button-' + snapshot.key).click(function() {
      ref.child(snapshot.key).remove();
    });
	});

  ref.on('child_removed', function(snapshot) {
    console.log(snapshot.key);
    $(' #' + snapshot.key).remove();
  });

});
