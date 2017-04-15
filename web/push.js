$(function() {
	console.log("push");

  var ref = firebase.database().ref().child("notifications");

/*  function submitfrm() {
    //geocoder = new google.maps.Geocoder;
    console.log("locating");
    //if(geocoder) {
      //console.log("geocoding");
       /*geocoder.geocode( { 'address': $('#autocomplete').val()}, function(results, status)
          {
            if(status !== 'OK') {
              alert('Geocoder failed:' + status);
            }*/
        /*    var location = $('#autocomplete').val();
      var msg = $('#msg').val();
      var tag = $('#tag').val();
            var notification = {
        'location' : location,
        'latitude': 37.3230,
        'longitude' : -122.0322,
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
    //}
    //var location = $('#location').val();

  }*/

  $('#notifications').click(function() {
		console.log("clicked");
		$('#playlist').empty();
		$('#playlist').removeClass();
		$('#playlist').addClass('col s8 push-s4 notification-list');
    $('.notification-list').append('<div class="notification_entry"><span class="title">Push Notification </span><input onFocus="geolocate" id="autocomplete" type="text" placeholder="Location"><input type="text" placeholder="Message" id="msg"><input type="text" id="tag" placeholder="Tag"><button type="button" id="bullshit" value="Notify Citizens">Send Notification</button></div>');
		ref.on('child_added', function(snapshot) {
    	$('.notification_entry').append('<div class=interior id='+snapshot.key+'><span class="title">Message </span>'+snapshot.val().message+'<p><b>Date:'+snapshot.val().timestamp+'</b><br><b>Timestamp:</b></p><button class=button-' + snapshot.key + '>YES</button></div>');
    	console.log(snapshot.key);
      $('.button-' + snapshot.key).click(function() {
        ref.child(snapshot.key).remove();
      });
	});
 var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {types:['geocode']});
});

$(document).on('click','#bullshit',function(){
  geocoder = new google.maps.Geocoder;
  console.log("locating");
  if(geocoder) {
    console.log("geocoding");
    geocoder.geocode( { 'address': $('#autocomplete').val()}, function(results, status)
        {
          if(status !== 'OK') {
            alert('Geocoder failed:' + status);
          }
          var location = $('#autocomplete').val();
    var msg = $('#msg').val();
    var tag = $('#tag').val();
          var notification = {
      'location' : location,
      'latitude': results[0].geometry.location.lat(),
      'longitude': results[0].geometry.location.lng(),
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
});


	ref.on('child_added', function(snapshot) {
  	$('.notification-list').append('<div class=interior id='+snapshot.key+'> <span class="title">Message </span>'+snapshot.val().message+'<p><b>Date:'+snapshot.val().timestamp+'</b><br><b>Timestamp:</b></p><button class=button-' + snapshot.key + '>YES</button></div><div class="divider"></div>');
  	console.log(snapshot.key);
    $('.button-' + snapshot.key).click(function() {
      ref.child(snapshot.key).remove();
    });
	});

	ref.on('child_removed', function(snapshot) {
		console.log("removing");
		$('#' + snapshot.key).remove();
	})

});
