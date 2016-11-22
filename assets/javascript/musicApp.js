$(document).ready(function {

var userLocation = $("#location-input").val().trim()  // Variable for the searched location 
var userArtist = $("#artist-input").val().trim(); // Variable for the searchedArtist

var usableLongitude; // For geocoding API
var usableLatitude; // For geocoding API

var eventLocationPair; 
var selectedArtists = ['run the jewels', 'tycho', 'grouplove'];
var eventLocations = [];


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
} // selectedArtists for loop

}); // Find event click handler


//----- NOT USING THIS FOLLOWING CODE BUT IT IS USEFUL TO HAVE IN CASE THE JAVASCRIPT MAP BREAKS, IN SHALLAH NO -------//

// 	var mapURL = "https://maps.googleapis.com/maps/api/staticmap?size=400x500"; //staticmap?size=400x500

// 	for (var i=0; i < eventLocations.length; i++) {

// 	console.log(eventLocations[i].latitude);

// 	var mapMarkerLabel = "&markers=color:blue%7Clabel:"+(i+1)+"%7C"+ eventLocations[i].latitude+","+eventLocations[i].longitude;
// 		mapURL =  mapURL + mapMarkerLabel + "&key=AIzaSyCkG9aMY1Obxvnk_QD1ce7CT_5rEwGj-Us";
// 	}// End of for loop

// $("#map").append("<img src='" + mapURL +  "' alt='google map'>");

// ---- END OF NOT USED CODE ------------------------------// 

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

//----------- POTENTIALLY DO NOT NEED TO USE (TBD) ----------- // 

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

// ------------END OF USELESS CODE ---------------------// 

$("#map-it").on("click", function() {

initMap();

}); // end of map click handler


}); // end of document ready