$(document).ready(function(){
	var player;
	var hold = [];
	var holdShortenedName = [];
	var similarArtistArray = [];

	var config = {
		apiKey: "AIzaSyAfp1Bs3v2vGmBFzFurtDXduezcb8_ifWs",
		authDomain: "music-app-14ddc.firebaseapp.com",
		databaseURL: "https://music-app-14ddc.firebaseio.com",
		storageBucket: "music-app-14ddc.appspot.com",
		messagingSenderId: "95008115181"
	};
	firebase.initializeApp(config); // intializing firebase for our user data 

	var database = firebase.database(); // database variable 

	database.ref().set({
		savedArtist: userArtist, 
		savedLocation: userLocation,
	})

	// At the initial load of the site firebase will load the last searched artist into the search tabs as an idea prompt
	database.ref().on("value", function(snapshot) {
		if (snapshot.child("savedArtist").exists() && snapshot.child("savedLocation").exists()) {
			$("#artist").empty();
			$("#zipcode").empty();
			$("#artist").append(savedArtist);
			$("#zipcode").append(savedLocation);
		}

		else {
			database.ref().set({
				savedArtist: userArtist,
				savedLocation: userLocation
			});
		}
	})

	var userLocation = $("#location-input").val().trim(); // Variable for the searched location 
	var userArtist = $("#artist-input").val().trim(); // Variable for the searchedArtist

	$("#find-artistevents").on('click', function() {
		$(".searched-artist").empty();
		$(".similar-artist").empty();
		$("#playerDiv").empty();
	
		//Last FM query URL for getting searched artist info
		var infoQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + userArtist + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json";
		//Last FM query URL for getting similar artists 
		var similarQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + userArtist + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json&limit=3";
		//Spotify query URL for getting artist IDs
		var spotifyQueryURL = "https://api.spotify.com/v1/search?q=" + userArtist + "&type=artist";

		//Searched Artist search
		$.get(infoQueryURL, function(response){
			var artistName = response.artist.name;
			var artistNameShortened = artistName.replace(/\s/g, '').toLowerCase();
			//show in artist div searched for artist info from lastfm
			$(".searched-artist").append("<h1>" + artistName);
			$(".searched-artist").append("<input type='checkbox' data-name='" + artistNameShortened + "' </input>").attr("id", artistNameShortened); //Talk to design team about what needs to happen with "selected" artists
			$(".searched-artist").append("<img src='" + response.artist.image[3]["#text"] + "''>");
			$.get(spotifyQueryURL, function(spotifyResponse){
				// Prints the Artist ID from the Spotify Object to console.
				var artistID = spotifyResponse.artists.items[0].id;
				// Then we build a SECOND URL to query another Spotify endpoint (this one for the tracks)
				var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID +"/top-tracks?country=US";
				// We then run a second AJAX call to get the tracks associated with that Spotify ID
				$.get(queryURLTracks, function(trackResponse){
					// Builds a Spotify player playing the top song associated with the artist. (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
					player = '<iframe src="https://embed.spotify.com/?uri=spotify:track:'+trackResponse.tracks[0].id+'" frameborder="0" allowtransparency="true"></iframe>';
					$("#playerDiv").append(player);
				});
			});
		});

		//Similar Artist Query
		$.get(similarQueryURL, function(response){
			for (var i=0; i<3; i++){
				var newDiv = $("<div>");
				var similarArtistName = response.similarartists.artist[i].name
				var similarArtistNameShortened = similarArtistName.replace(/\s/g, '').toLowerCase();
				var similarArtistImg = response.similarartists.artist[i].image[3]["#text"];
				var spotifyQueryURL = "https://api.spotify.com/v1/search?q=" + similarArtistName + "&type=artist";
				holdShortenedName.push(similarArtistNameShortened);
				similarArtistArray.push(similarArtistName);

				newDiv.append("<input type='checkbox' data-name='" + similarArtistNameShortened + "'</input>").attr("id", similarArtistNameShortened); 
				newDiv.append("<img src=" + similarArtistImg + ">");
				newDiv.append("<h2>" + similarArtistName);
				newDiv.append("<a href='" + response.similarartists.artist[i].url+ "' target='_'>" + similarArtistName + "</a>");
				//Generating Spotify Player for first track of the similar artist
				$.get(spotifyQueryURL, function(response){
					// Prints the Artist ID from the Spotify Object to console.
					var artistID = response.artists.items[0].id;
					// Then we build a SECOND URL to query another Spotify endpoint (this one for the tracks)
					var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID +"/top-tracks?country=US";
					$.get(queryURLTracks, function(trackResponse){
						// Builds a Spotify player playing the top song associated with the artist. (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
						player = '<iframe src="https://embed.spotify.com/?uri=spotify:track:'+ trackResponse.tracks[0].id +'" frameborder="0" allowtransparency="true"></iframe>';
						// Appends the new player into the HTML
						// hold.push(player); //Doesn't work for same reason as appending to newDiv asynchronously - rest of the page renders too quickly.
						newDiv.append(player);
					}); // End second Spotify AJAX call to get tracks
				}); //End first Spotify AJAX call
				$(".similar-artist").append(newDiv);
			}; //End for loop
		}); //End similar artist AJAX call
		return false;
	});//end of #find-artistevents click handler

//-----CODE STILL NEEDED: Push selected artists (checkbox or something) to the selectedArtists array to search for events -------// 

// --- END OF CODE FOR PUSHING TO ARRAY -------// 

var eventLocationPair; 
var selectedArtists = ['run the jewels', 'tycho', 'grouplove'];
var eventLocations = [];

var usableLongitude; //Variables for the Google geocoding search
var usableLatitude;

//Searching for events based on the selected artists

$("#find-events").on("click", function() {
	for (var i=0; i < selectedArtists.length; i++) {
		var eventURL = "https://api.bandsintown.com/artists/" + selectedArtists[i] + "/events/search.json?api_version=2.0&app_id=MUSCENE&location=" + userLocation +"&radius=150";

		$.ajax({url: eventURL, method: "GET"}).done(function(response) {
			console.log(response);
			for (var i=0; i<response.length; i++) {
			eventLocationPair = {
				longitude: (response[i].venue.longitude), 
				latitude: (response[i].venue.latitude)
			}; // End of the object 

			eventLocations.push(eventLocationPair);
			console.log(eventLocations);
			
			$("#eventInfoDiv").append("<h1>"+ (i+1) + ". " + response[i].artists[0].name);
			$("#eventInfoDiv").append("<h2>" + response[i].formatted_datetime);
			$("#eventInfoDiv").append("<h3>" + response[i].formatted_location);
			$("#eventInfoDiv").append(response[i].venue.name + "<br>"); 
 
			if (response[i].ticket_status=== "available") {
				$("#eventInfoDiv").append("<a target='_blank' href='" + response[i].ticket_url + "'>Buy tickets</a>");
			} else {
				$("#eventInfoDiv").append("Tickets are not available :(");
			}
		} // response length for loop
	}) // AJAX Call

	//initMap(); // This is here to potentially add the map immediately upon searching for the events
} // selectedArtists for loop

}); // End of find event click handler

// --------NOT USING THIS FOLLOWING CODE BUT IT IS USEFUL TO HAVE IN CASE WE NEED TO CHANGE THE JAVASCRIPT CODE -----//
// 	var mapURL = "https://maps.googleapis.com/maps/api/staticmap?size=400x500"; //staticmap?size=400x500

// 	for (var i=0; i < eventLocations.length; i++) {

// 	console.log(eventLocations[i].latitude);

// 	var mapMarkerLabel = "&markers=color:blue%7Clabel:"+(i+1)+"%7C"+ eventLocations[i].latitude+","+eventLocations[i].longitude;
// 		mapURL =  mapURL + mapMarkerLabel + "&key=AIzaSyCkG9aMY1Obxvnk_QD1ce7CT_5rEwGj-Us";
// 	}// End of for loop

// $("#map").append("<img src='" + mapURL +  "' alt='google map'>");

//----- END OF CODE ---------------------// 

//Potentially need to refigure now based on separate javascript file -----// 

function initMap() {
	//Geocoding URL for the lat/long for the center of the map
	var geoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userLocation +"&key=AIzaSyDnb-B2_SlUBZ8hZtUuWPNTxyVtQU5CunE";

	$.ajax({url: geoURL, method: "GET"}).done(function(response) {
		console.log(response);
		usableLongitude = response.results[0].geometry.location.lng;
		usableLatitude = response.results[0].geometry.location.lat;
		console.log(usableLongitude);
		console.log(usableLatitude);
	})

  	var map = new google.maps.Map(document.getElementById('map'), {
  	center: {lat: usableLatitude, lng: usableLongitude},
    zoom: 6,
  });

	for (var i = 0; i < eventLocations.length; i++) {
    	var event = eventLocations[i];
   		var marker = new google.maps.Marker({
      		position: {lat: event.latitude, lng: event.longitude},
      		map: map
    	});
	} 
};

//----- POTENTIALLY DO NOT NEED THIS CODE -----// 

// function setMarkers(map) {

// 	for (var i = 0; i < eventLocations.length; i++) {
//     	var event = eventLocations[i];

//     	console.log(event.latitude);
//     	console.log(event.longitude);
//    		var marker = new google.maps.Marker({
//       		position: {lat: event.latitude, lng: event.longitude},
//       		map: map
//     	});
// 	}
// };

// ----- END OF CODE -------------- // 

//Click on the map button, show map

$("#map-it").on("click", function() {

initMap();

}); // end of map click handler

}); //end of document ready