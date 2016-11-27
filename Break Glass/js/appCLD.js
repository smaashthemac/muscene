// YO 

// ***********PLEASE DO NOT EDIT THIS CODE DIRECTLY******
// ****PLEASE SAVE A SEPARATE APP FILE WITH YOUR INTIALS IN IT****
// *** PLEASE DO SO WITH THE INDEX FILE TOO ****
// *** WE ARE DOING THIS TO AVOID WORKING OVER EACH OTHER***********
// *** WE WILL MERGE EVERYTHING SUNDAY *******

$(document).ready(function() {

    // hides the rest of the divs until they are populated
    $("#our-team").hide();
    $("#parallax").hide();

    var js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCK0yMImFRuMfNUN3W2k6MglVnP_bTQFII&callback=initMap';
    document.getElementsByTagName('head')[0].appendChild(js_file);

    var player;
    var hold = [];
    var holdShortenedName = [];
    var similarArtistArray = [];
    var bioArray = [];

    var userLocation = $("#zipcode").val().trim(); // Variable for the searched location 
    var userArtist = $("#artist").val().trim();

    // var config = {
    //     apiKey: "AIzaSyAfp1Bs3v2vGmBFzFurtDXduezcb8_ifWs",
    //     authDomain: "music-app-14ddc.firebaseapp.com",
    //     databaseURL: "https://music-app-14ddc.firebaseio.com",
    //     storageBucket: "music-app-14ddc.appspot.com",
    //     messagingSenderId: "95008115181"
    // };
    // firebase.initializeApp(config); // intializing firebase for our user data 
    // var database = firebase.database(); // database variable 

    // // At the initial load of the site firebase will load the last searched artist into the search tabs as an idea prompt
    // database.ref().on("value", function(snapshot) {
    //     if (snapshot.child("savedArtist").exists() && snapshot.child("savedLocation").exists()) {
    //         $("#artist").empty();
    //         $("#zipcode").empty();
    //         $("#artist").append(savedArtist);
    //         $("#zipcode").append(savedLocation);
    //     }
    // });

    var similarArtistName;
    var similarArtistNameShortened;
    var similarArtistImg;

    $("#searchButton").on('click', function() {
        $("#our-team").removeClass("hidden");
        $("#our-team").show("slow");

        $(".related-artist").empty();
        $(".players").empty();

        var userLocation = $("#zipcode").val().trim(); // Variable for the searched location 
        var userArtist = $("#artist").val().trim(); // Variable for the searchedArtist
    
        //Last FM query URL for getting searched artist info
        var infoQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + userArtist + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json";
        //Last FM query URL for getting similar artists 
        var similarQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + userArtist + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json&limit=4";
        //Spotify query URL for getting artist IDs
        var spotifyQueryURL = "https://api.spotify.com/v1/search?q=" + userArtist + "&type=artist";

        // console.log(userLocation);
        // console.log(userArtist);

        // database.ref().set({
        //     savedArtist: userArtist, 
        //     savedLocation: userLocation
        // });

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
            newDiv.append("<p> LIKE THEM? SELECT TO FIND THEIR EVENTS! " + "<input class = 'artist-event' type='checkbox' value='" + artistNameShortened + "' </input>")
            $("#searched-artist").html(newDiv);
            // newDiv.attr("id", artistNameShortened);
            // $("#title").append("<h2>" + artistName + "<br><br>");
            // $("#image").append("<img src='" + response.artist.image[3]["#text"] + "' alt='slider 01' class='img-circle'>");
            // $("#bio").append("<br><br><p>" + response.artist.bio.summary + "</p>");
            // $("#mapThem").append("<p> LIKE THEM? SELECT TO FIND THEIR EVENTS! " + "<input class = 'artist-event' type='checkbox' value='" + artistNameShortened + "' </input>");//.attr("id", artistNameShortened);
            //$("#searched-artist").append(newDiv);
            // $(".testimonial_thumbnails_ind_carousel_caption a").html("<a target='_blank' href='" + artistURL + "'>" + artistName +"'s LastFM Page</a>" + "</p>");
            $.get(spotifyQueryURL, function(spotifyResponse){
                // Prints the Artist ID from the Spotify Object to console.
                var artistID = spotifyResponse.artists.items[0].id;
                // Then we build a SECOND URL to query another Spotify endpoint (this one for the tracks)
                var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID +"/top-tracks?country=US";
                // We then run a second AJAX call to get the tracks associated with that Spotify ID
                $.get(queryURLTracks, function(trackResponse){
                    // Builds a Spotify player playing the top song associated with the artist. (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
                    player = '<iframe src="https://embed.spotify.com/?uri=spotify:track:'+trackResponse.tracks[0].id+'" frameborder="0" allowtransparency="true"></iframe>';
                    $("#searched-player").append(player);
                });
            });
        });

        //Similar Artist Query
        $.get(similarQueryURL, function(response){
            for (var i=0; i<4; i++){
                
                similarArtistName = response.similarartists.artist[i].name
                similarArtistNameShortened = similarArtistName.replace(/\s/g, '').toLowerCase();
                similarArtistImg = response.similarartists.artist[i].image[3]["#text"];

                // get bio info for similar artists
                // var infoQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + similarArtistName + "&api_key=1472636e9d44c81a12cdfb216ce752ac&format=json";
                // $.get(infoQueryURL, function(response){
                //     console.log(response);
                //     console.log(response.artist.bio.summary);
                //     bioArray.push(response.artist.bio.summary);  
                // }).then(response => {
                //     console.log(bioArray);
                //     newDiv.html(bioArray[i]);   
                // })

                holdShortenedName.push(similarArtistNameShortened);
                similarArtistArray.push(similarArtistName);

                var newDiv = $("<div>");
                newDiv.attr("id", similarArtistNameShortened);
                newDiv.append("<h2>" + similarArtistName + "</h2>");
                newDiv.append("<img class= 'img-circle' src='" + similarArtistImg + "'><br><br>");
                //newDiv.append("<br><br><p>" + response[i].artist.bio.summary + "</p>");
                // newDiv.append("<input class='artist-event' type='checkbox' value='" + similarArtistNameShortened + "'</input>");
                // newDiv.append("<h3> <a href='" + response.similarartists.artist[i].url+ "' target='_'> LEARN MORE ABOUT THEM HERE </a></h3>");
                $("#related-artist" + i).append(newDiv);
                //Generating Spotify Player for first track of the similar artist


                // $.get(spotifyQueryURL, function(response){
                //     // Prints the Artist ID from the Spotify Object to console.
                //     var artistID = response.artists.items[0].id;
                //     // Then we build a SECOND URL to query another Spotify endpoint (this one for the tracks)
                //     var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID +"/top-tracks?country=US";
                //     $.get(queryURLTracks, function(trackResponse){
                //         // Builds a Spotify player playing the top song associated with the artist. (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
                //         player = '<iframe src="https://embed.spotify.com/?uri=spotify:track:'+ trackResponse.tracks[0].id +'" frameborder="0" allowtransparency="true"></iframe>';
                //         // Appends the new player into the HTML
                //         newDiv.append(player);
                //     }); // End second Spotify AJAX call to get tracks
                // }); //End first Spotify AJAX call


            }; //End for loop
        })


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
                console.log(bios);
                const artistBio = bios.map(x => {
                    return x.artist.bio.summary;
                })
                const simArtistNameShortened = bios.map(y => {
                    return y.artist.name.replace(/\s/g, '').toLowerCase();
                })
                const simArtistName = bios.map(z => {
                    return z.artist.name;
                })
                for (var i = 0; i<2; i++){
                    $("#related-artist" + i).append("<p>" + artistBio[i] + "</p>");
                    $("#related-artist" + i).append("<p> LIKE THEM? SELECT TO FIND THEIR EVENTS! " + "<input class = 'artist-event' type='checkbox' value='" + simArtistNameShortened[i] + "' </input>")
                }
                const getSimArtistID = simArtistName.map(name => fetch("https://api.spotify.com/v1/search?q=" + name + "&type=artist"));
                return Promise.all(getSimArtistID);
            }).then(responses => {
                return Promise.all(responses.map(response => response.json()));
            }).then(artistID => {
                console.log(artistID);
                const id = artistID.map(thing => {
                    return thing.artists.items[0].id;
                })
                console.log(id);
                const getPlayer = id.map(spotifyID => fetch("https://api.spotify.com/v1/artists/" + spotifyID +"/top-tracks?country=US"));
                return Promise.all(getPlayer);
            }).then(responses => {
                return Promise.all(responses.map(response => response.json()));
            }).then(topTracks => {
                const topTrackID = topTracks.map(drill => {
                    return drill.tracks[0].id;
                })
                console.log(topTrackID);
                for(var j = 0; j<2; j++){
                    $("#related-player" + j).append('<iframe src="https://embed.spotify.com/?uri=spotify:track:'+topTrackID[j]+'" frameborder="0" allowtransparency="true"></iframe>')
                }
            })
            
        return false;
    });//end of #find-artistevents click handler

$(document.body).on("click", ".staff-mem", function(){
    var spotifyQueryURL = "https://api.spotify.com/v1/search?q=" + $("this").attr("id") + "&type=artist";
   console.log(spotifyQueryURL)
   $.get(spotifyQueryURL, function(response){
        // Prints the Artist ID from the Spotify Object to console.
        var artistID = response.artists.items[0].id;
        // Then we build a SECOND URL to query another Spotify endpoint (this one for the tracks)
        var queryURLTracks = "https://api.spotify.com/v1/artists/" + artistID +"/top-tracks?country=US";
        $.get(queryURLTracks, function(trackResponse){
            // Builds a Spotify player playing the top song associated with the artist. (NOTE YOU NEED TO BE LOGGED INTO SPOTIFY)
            player = '<iframe src="https://embed.spotify.com/?uri=spotify:track:'+ trackResponse.tracks[0].id +'" frameborder="0" allowtransparency="true"></iframe>';
            // Appends the new player into the HTML
            newDiv.append(player);
        }); // End second Spotify AJAX call to get tracks
    }); //End first Spotify AJAX call
   return false;
});

var eventLocationPair; 
var selectedArtists = ['run the jewels', 'tycho', 'grouplove'];
var eventLocations = [];

var usableLongitude; //Variables for the Google geocoding search
var usableLatitude;

//Searching for events based on the selected artists

$("#eventsButton").on("click", function() {
    $("#parallax").show("slow");

    $("#map-section").show();
    var findArtists = $(".artist-event input:checkbox:checked").map(function(){
      return $(this).val();
        }).get();
        console.log(findArtists);

    for (var i=0; i < findArtists.length; i++) {
        var eventURL = "https://api.bandsintown.com/artists/" + findArtists[i] + "/events/search.json?api_version=2.0&app_id=MUSCENE&location=" + userLocation +"&radius=150";

        $.ajax({url: eventURL, method: "GET"}).done(function(response) {
            console.log(response);
            for (var i=0; i<response.length; i++) {
            eventLocationPair = {
                longitude: (response[i].venue.longitude), 
                latitude: (response[i].venue.latitude)
            }; // End of the object 

            eventLocations.push(eventLocationPair);
            console.log(eventLocations);
            
            $("#events").append("<h1>"+ (i+1) + ". " + response[i].artists[0].name);
            $("#events").append("<h2>" + response[i].formatted_datetime);
            $("#events").append("<h3>" + response[i].formatted_location);
            $("#events").append(response[i].venue.name + "<br>"); 
 
            if (response[i].ticket_status=== "available") {
                $("#events").append("<a target='_blank' href='" + response[i].ticket_url + "'>Buy tickets</a>");
            } else {
                $("#events").append("Tickets are not available :(");
            }
        } // response length for loop
    }) // AJAX Call

    initMap(); // This is here to potentially add the map immediately upon searching for the events
} // selectedArtists for loop

}); // End of find event click handler

// --------NOT USING THIS FOLLOWING CODE BUT IT IS USEFUL TO HAVE IN CASE WE NEED TO CHANGE THE JAVASCRIPT CODE -----//
//  var mapURL = "https://maps.googleapis.com/maps/api/staticmap?size=400x500"; //staticmap?size=400x500

//  for (var i=0; i < eventLocations.length; i++) {

//  console.log(eventLocations[i].latitude);

//  var mapMarkerLabel = "&markers=color:blue%7Clabel:"+(i+1)+"%7C"+ eventLocations[i].latitude+","+eventLocations[i].longitude;
//      mapURL =  mapURL + mapMarkerLabel + "&key=AIzaSyCkG9aMY1Obxvnk_QD1ce7CT_5rEwGj-Us";
//  }// End of for loop

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

//  for (var i = 0; i < eventLocations.length; i++) {
//      var event = eventLocations[i];

//      console.log(event.latitude);
//      console.log(event.longitude);
//          var marker = new google.maps.Marker({
//              position: {lat: event.latitude, lng: event.longitude},
//              map: map
//      });
//  }
// };

// ----- END OF CODE -------------- // 


// FRAMEWORK SITE FUNCTIONALITY

    (function ($) {

    /*-----------------------------------------------------------------*/
    /* ANIMATE SLIDER CAPTION
    /* Demo Scripts for Bootstrap Carousel and Animate.css article on SitePoint by Maria Antonietta Perna
    /*-----------------------------------------------------------------*/
    "use strict";
    function doAnimations(elems) {
        //Cache the animationend event in a variable
        var animEndEv = 'webkitAnimationEnd animationend';
        elems.each(function () {
            var $this = $(this),
                $animationType = $this.data('animation');
            $this.addClass($animationType).one(animEndEv, function () {
                $this.removeClass($animationType);
            });
        });
    }
    //Variables on page load
    var $immortalCarousel = $('.animate_text'),
        $firstAnimatingElems = $immortalCarousel.find('.item:first').find("[data-animation ^= 'animated']");
    //Initialize carousel
    $immortalCarousel.carousel();
    //Animate captions in first slide on page load
    doAnimations($firstAnimatingElems);
    //Other slides to be animated on carousel slide event
    $immortalCarousel.on('slide.bs.carousel', function (e) {
        var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
        doAnimations($animatingElems);
    });

    /*-----------------------------------------------------------------*/
    /* TOOL TIP
    /*-----------------------------------------------------------------*/
    $('[data-toggle="tooltip"]').tooltip();

    /*-----------------------------------------------------------------*/
    /* MOBILE SWIPE
    /*-----------------------------------------------------------------*/
    //Enable swiping...
    $(".carousel-inner").swipe({
    //Generic swipe handler for all directions
        swipeLeft: function (event, direction, distance, duration, fingerCount) {
            $(this).parent().carousel('next');
        },
        swipeRight: function () {
            $(this).parent().carousel('prev');
        },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold: 0
    });

    
    /*-----------------------------------------------------------------*/
    /* THREE SHOWS ONE MOVE
    /*-----------------------------------------------------------------*/
    $('.three_shows_one_move .item').each(function(){
        var itemToClone = $(this);
        for (var i=1;i<3;i++) {
            itemToClone = itemToClone.next();
            // wrap around if at end of item collection
            if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
            }
            // grab item, clone, add marker class, add to collection
            itemToClone.children(':first-child').clone()
            .addClass("cloneditem-"+(i))
            .appendTo($(this));
        }
    });

    /*-----------------------------------------------------------------*/
    /* TWO SHOWS ONE MOVE
    /*-----------------------------------------------------------------*/
    $('.two_shows_one_move .item').each(function(){
        var itemToClone = $(this);
        for (var i=1;i<2;i++) {
            itemToClone = itemToClone.next();
            // wrap around if at end of item collection
            if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
            }
            // grab item, clone, add marker class, add to collection
            itemToClone.children(':first-child').clone()
            .addClass("cloneditem-"+(i))
            .appendTo($(this));
        }
    });

})(jQuery);  


/* Nav Bar */
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $('#nav').addClass('affix');
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $('#nav').removeClass('affix');
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }   
});

}); // End of document ready

