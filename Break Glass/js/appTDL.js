var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: usableLatitude, lng: usableLongitude},
        zoom: 6,
        });
  
  setMarkers(map);

};

function setMarkers(map) {

    for (var i = 0; i < eventLocations.length; i++) {
        var event = eventLocations[i];
        console.log(event)
        var marker = new google.maps.Marker({
             position: {lat: event.latitude, lng: event.longitude},
             map: map
        });
    }
};

var userLocation;
var userArtist;

var eventLocationPair; 
var eventLocations = [];

var usableLongitude; //Variables for the Google geocoding search
var usableLatitude;


$(document).ready(function() {

    // hides the rest of the divs until they are populated
    $("#our-team").hide();
    $("#parallax").hide();

    var player;
    var hold = [];
    var similarArtistArray = [];
    var bioArray = [];
    var width = $(window).width();

    var similarArtistName;
    var similarArtistNameShortened;
    var similarArtistImg;

    var config = {
        apiKey: "AIzaSyAfp1Bs3v2vGmBFzFurtDXduezcb8_ifWs",
        authDomain: "music-app-14ddc.firebaseapp.com",
        databaseURL: "https://music-app-14ddc.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "95008115181"
    };

    firebase.initializeApp(config); // intializing firebase for our user data 

    var database = firebase.database(); // database variable

    $("#searchButton").on('click', function(event) {
        event.preventDefault();
        $("#our-team").removeClass("hidden");
        $("#our-team").show("slow");
        $("#parallax").hide("slow");
        eventLocations=[];
        hold = [];
        //$(".related-artist").empty();
        $(".players").empty();

        userLocation = $("#location").val().trim(); // Variable for the searched location 
        userArtist = $("#artist").val().trim(); // Variable for the searchedArtist

        console.log(userLocation);
        console.log(userArtist);
        
        database.ref().set({
            savedArtist: userArtist,
            savedLocation: userLocation
        });
    
        //Last FM query URL for getting searched artist info
        var infoQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + userArtist + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json";
        //Last FM query URL for getting similar artists 
        var similarQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + userArtist + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json&limit=4";
        //Spotify query URL for getting artist IDs
        var spotifyQueryURL = "https://api.spotify.com/v1/search?q=" + userArtist + "&type=artist";

        //Searched Artist search
        $.get(infoQueryURL, function(response){
            // console.log(response);
            var artistName = response.artist.name;
            var artistNameShortened = artistName.replace(/\s/g, '').toLowerCase();
            var artistURL = response.artist.url;
            //show in artist div searched for artist info from lastfm
            var newDiv = $("<div>");
            newDiv.append("<h2>" + artistName + "</h2>");
            newDiv.append("<img src='" + response.artist.image[3]["#text"] + "' alt='slider 01' class='img-circle'>");
            newDiv.append("<br><br><p>" + response.artist.bio.summary + "</p>")
            newDiv.append("<p> LIKE THIS ARTIST? SELECT TO FIND THEIR EVENTS!")
            newDiv.attr("value", artistNameShortened);
            newDiv.addClass("artist");
            $("#searched-artist").html(newDiv);
            $.get(spotifyQueryURL, function(spotifyResponse){
                // Prints the Artist ID from the Spotify Object to console.
                var artistID = spotifyResponse.artists.items[0].id;
                // Then we build a SECOND URL to query another Spotify endpoint (this one for the tracks)
                var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID +"/top-tracks?country=US";
                // We then run a second AJAX call to get the tracks associated with that Spotify ID
                $.get(queryURLTracks, function(trackResponse){
                    // Builds a Spotify player playing the top song associated with the artist. (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
                    player = '<iframe src="https://embed.spotify.com/?uri=spotify:track:'+trackResponse.tracks[0].id+'" frameborder="0" allowtransparency="true"></iframe>';
                    $(".player-searched").append(player);
                });
            });
        });

        //Similar Artist Query
        $.get(similarQueryURL, function(response){
            for (var i=0; i<2; i++){
                similarArtistName = response.similarartists.artist[i].name
                similarArtistNameShortened = similarArtistName.replace(/\s/g, '').toLowerCase();
                similarArtistImg = response.similarartists.artist[i].image[3]["#text"];
                var newDiv = $("<div>");
                // newDiv.attr("id", similarArtistNameShortened);
                newDiv.attr("value", similarArtistNameShortened);
                newDiv.addClass("artist");
                newDiv.append("<h2>" + similarArtistName + "</h2>");
                newDiv.append("<img class= 'img-circle' src='" + similarArtistImg + "'><br><br>");
                $("#related-artist" + i).append(newDiv);
            }; //End for loop
        })

        //Similar artist bio and spotify players promise chain
        fetch(similarQueryURL)
            .then(response => response.json())
            .then(data => {
                const names = data.similarartists.artist.map(item => {
                    return item.name;
                }).slice(0, 3);
                const tasks = names.map(name => fetch("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + name + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json"));
                return Promise.all(tasks);
            }).then(responses => {
                return Promise.all(responses.map(response => response.json()));
            }).then(bios => {
                // console.log(bios);
                const artistBio = bios.map(x => {
                    return x.artist.bio.summary;
                })
                const simArtistNameShortened = bios.map(y => {
                    return y.artist.name.replace(/\s/g, '').toLowerCase();
                })
                const simArtistName = bios.map(z => {
                    return z.artist.name;
                })
                for (var i = 0; i<3; i++){
                    $("#related-artist" + i + " div").append("<p>" + artistBio[i] + "</p>");
                    $("#related-artist" + i + " div").append("<p> LIKE THIS ARTIST? SELECT TO FIND THEIR EVENTS!");
                }
                const getSimArtistID = simArtistName.map(name => fetch("https://api.spotify.com/v1/search?q=" + name + "&type=artist"));
                return Promise.all(getSimArtistID);
            }).then(responses => {
                return Promise.all(responses.map(response => response.json()));
            }).then(artistID => {
                // console.log(artistID);
                const id = artistID.map(thing => {
                    return thing.artists.items[0].id;
                })
                // console.log(id);
                const getPlayer = id.map(spotifyID => fetch("https://api.spotify.com/v1/artists/" + spotifyID +"/top-tracks?country=US"));
                return Promise.all(getPlayer);
            }).then(responses => {
                return Promise.all(responses.map(response => response.json()));
            }).then(topTracks => {
                const topTrackID = topTracks.map(drill => {
                    return drill.tracks[0].id;
                })
                // console.log(topTrackID);
                for(var j = 0; j<3; j++){
                    $(".players" + j).append('<iframe src="https://embed.spotify.com/?uri=spotify:track:'+topTrackID[j]+'" frameborder="0" allowtransparency="true"></iframe>')
                }
            })
    });//end of #find-artistevents click handler

    //Click event handler that adds selected artists
    $(document.body).on("click", ".artist", function(){
        var x = $(this).attr("value");
        var found = jQuery.inArray(x, hold);
        if (found >= 0) {
            hold.splice(found, 1);
            $(this).removeClass("selected");
        } else {
            hold.push(x);
            $(this).addClass("selected");
        }
        console.log(hold);
    }); //End click event handler for adding selected artists to array


    // var eventLocationPair; 
    // var selectedArtists = ['run the jewels', 'tycho', 'grouplove'];
    // var eventLocations = [];

    // var usableLongitude; //Variables for the Google geocoding search
    // var usableLatitude;

    //Searching for events based on the selected artists
    // $("#map").append("<img src='" + mapURL +  "' alt='google map'>");
        //Searching for events based on the selected artists
    $("#eventsButton").on("click", function() {
        $("#parallax").show("slow");
        $("#events").empty();

        for (var i=0; i < hold.length; i++) {
            var eventURL = "https://api.bandsintown.com/artists/" + hold[i] + "/events/search.json?api_version=2.0&app_id=MUSCENE&location=" + userLocation +"&radius=150";
            console.log(eventURL);
            $.ajax({url: eventURL, method: "GET"}).done(function(response) {
                console.log(response);
                console.log(response.length);

                if (response.length === 0) {
                       $("#events").append("<h2> Sorry, no events in your area.</h2>");
               } else {

                for (var i=0; i<response.length; i++) {
                    eventLocationPair = {
                        longitude: (response[i].venue.longitude), 
                        latitude: (response[i].venue.latitude)
                    }; // End of eventLocationPair object 
                    console.log(eventLocationPair);
                    eventLocations.push(eventLocationPair);
                    
                    $("#events").append("<h3>" + (i+1) + ". " + response[i].artists[0].name);
                    $("#events").append("<h4>" + response[i].formatted_datetime);
                    $("#events").append("<h4>" + response[i].formatted_location);
                    $("#events").append("<h4>" + response[i].venue.name + "<br>"); 
         
                    if (response[i].ticket_status=== "available") {
                        $("#events").append("<h4><a target='_blank' href='" + response[i].ticket_url + "'>Buy tickets</a></h6>");
                    } else {
                        $("#events").append("Tickets are not available :(");
                    }
                }
                } // response length for loop
            }) // AJAX Call
        } // selectedArtists for loop

        var geoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userLocation +"&key=AIzaSyDnb-B2_SlUBZ8hZtUuWPNTxyVtQU5CunE";
        //AJAX call to Google Maps
        $.ajax({url: geoURL, method: "GET"}).done(function(response) {
            console.log(response);
            usableLongitude = response.results[0].geometry.location.lng;
            usableLatitude = response.results[0].geometry.location.lat;
            console.log(usableLongitude);
            console.log(usableLatitude);
        });//End AJAX call to Google Maps for Geocode

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCK0yMImFRuMfNUN3W2k6MglVnP_bTQFII&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(js_file);

}); // End of find event click handler

    // /* Nav Bar */
    // $(window).scroll(function() {
    //     if ($(".navbar").offset().top > 50) {
    //         $('#nav').addClass('affix');
    //         $(".navbar-fixed-top").addClass("top-nav-collapse");
    //     } else {
    //         $('#nav').removeClass('affix');
    //         $(".navbar-fixed-top").removeClass("top-nav-collapse");
    //     }   
    // });// End function ($)
});
