var mobileServicesClient = null;
var locLat = 37;
var locLon = -40;
var googleMap = null;
var clusterer = null;
var markers = [];
var soloMarkers = [];

var mobileServicesUrl = "";
var mobileServicesKey = "";
var baseImagePath = "";
var baseShareUrl = "";
var baseUrl = "";

function getMobileServicesClient() {
   if ( mobileServicesClient == null ) {
      mobileServicesClient = new WindowsAzure.MobileServiceClient(
          mobileServicesUrl,
          mobileServicesKey
      );
   }

   return mobileServicesClient;
}

function signIn() {
   //$( ".signin-popup" ).show();
   $( ".signin-popup" ).omniWindow() // create modal
    .trigger( 'show' ); // and show it
}

function login( provider ) {
   var client = getMobileServicesClient();

   client.login( provider ).done( function ( results ) {
      isLoggedIn = true;
      loginProvider = provider;
      userId = results.userId;
      amsAccessToken = results.mobileServiceAuthenticationToken;

      var remember = $( "#rememberMeCheck" ).is( ':checked' );
      if ( remember ) {
         rememberMe = true;
         SaveSettings();
      }

      setLoginUI( true );
   }, function ( err ) {
      alert( "Error: " + err );
   } );
}

function setLoginUI( animate ) {
   var $modal = $( '.signin-popup' ).omniWindow();
   $modal.trigger( 'hide' );

   $( "#signedInName" ).text( userId );

   if ( animate ) {
      $( "#notSignedIn" ).hide( "1000" );
   } else {
      $( "#notSignedIn" ).hide();
   }

   $( "#signedIn" ).show();
}

function setNotLoggedUI( animate ) {
   $( "#signedIn" ).hide();

   if ( animate ) {
      $( "#notSignedIn" ).show( "1000" );
   } else {
      $( "#notSignedIn" ).show();
   }
}

function logout() {
   isLoggedIn = false;
   loginProvider = null;
   userId = null;
   amsAccessToken = null;
   rememberMe = false;
   SaveSettings();

   setNotLoggedUI( true );
}

function setUser( userName, token ) {
   var client = getMobileServicesClient();
   client.currentUser = {
      userId: userName,
      mobileServiceAuthenticationToken: token
   };

   setLoginUI( false );
}

function getLocation() {
   if ( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition( storePosition );
   }
}

function storePosition( position ) {
   locLat = position.coords.latitude;
   locLon = position.coords.longitude;

   var position = new google.maps.LatLng( locLat, locLon );

   googleMap.setCenter( position );
   googleMap.setZoom( 15 );

   var myLoc = new google.maps.Marker( {
      position: position,
      clickable: false,
      icon: new google.maps.MarkerImage( '//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                      new google.maps.Size( 22, 22 ),
                                                      new google.maps.Point( 0, 18 ),
                                                      new google.maps.Point( 11, 11 ) ),
      shadow: null,
      zIndex: 999,
      map: googleMap
   } );

   var circle = new google.maps.Marker( {
      position: position,
      clickable: false,
      icon: {
         path: google.maps.SymbolPath.CIRCLE,
         strokeColor: '1bb6ff',
         strokeOpacity: .4,
         fillColor: '61a0bf',
         fillOpacity: .4,
         strokeWeight: 1,
         zIndex: 1,
         scale: 30 //pixels
      },
      map: googleMap
   } );

   //var circleOpts = {
   //    clickable: false,
   //    radius: 200,
   //    strokeColor: '1bb6ff',
   //    strokeOpacity: .4,
   //    fillColor: '61a0bf',
   //    fillOpacity: .4,
   //    strokeWeight: 1,
   //    zIndex: 1,
   //    map: googleMap,
   //    center: position
   //};
   //var circle = new google.maps.Circle(circleOpts);
   //circle.bindTo('map', myLoc);
}

function canPlaceMarker() {
   return isLoggedIn;
}

function showCreateByldTagDialog( addTagDialog, location ) {
   if ( isLoggedIn ) {
      addTagDialog.data( "location", location ).dialog( "open" );
   }
}

function showEditByldTagDialog( updateTagDialog, location, titleText, descriptionText, tagId ) {
   if ( isLoggedIn ) {
      updateTagDialog.data( "location", location ).
         data( "title", titleText ).
         data( "description", descriptionText ).
         data( "tagId", tagId ).
         dialog( "open" );
   } else {
      alert( "You need to be logged in." );
   }
}

function createByldTag( location, title, description ) {
   if ( isLoggedIn ) {
      var client = getMobileServicesClient();

      var tag = { latitude: location.lat().toString(), longitude: location.lng().toString(), title: title, description: description };
      client.invokeApi( "byldtag/", { body: tag, method: "post" } )
         .done( function ( response ) {
            placeMarker( location, response.result.tagId, title, description, userId );
         }, function ( error ) {
            alert( "error posting tag: " + error );
         } );
   }
}

function updateByldTag( location, title, description, tagId ) {
   if ( isLoggedIn ) {
      var client = getMobileServicesClient();

      var tag = { latitude: location.lat().toString(), longitude: location.lng().toString(), title: title, description: description };
      client.invokeApi( "byldtag/" + tagId, { body: tag, method: "put" } )
         .done( function ( response ) {
            updateMarker( location, tagId, title, description, userId );
         }, function ( error ) {
            alert( "error updating tag: " + error );
         } );
   }
}

function placeMarker( location, insertedTagId, title, description, submitterName ) {
   var marker = new google.maps.Marker( {
      clickable: true,
      position: location,
      zIndex: 999,
      icon: baseImagePath + "byldtag_pin.png",
      tagId: insertedTagId,
      title: title,
      description: description,
      submitterName: submitterName,
      starCount: 0,
      starredByUser: false
   } );

   addMarker( marker, false );
   //googleMap.setCenter(location);
}

function updateMarker( location, tagId, title, description, submitterName ) {
   var marker = getMarker( tagId );
   marker.position = location;
   marker.tagId = tagId;
   marker.title = title;
   marker.description = description;
   marker.submitterName = submitterName;

   closeByldTag();
   openTag( tagId, false );
   //googleMap.setCenter(location);
}

function showTag( tagId ) {
   var client = getMobileServicesClient();

   client.invokeApi( "byldtag/" + tagId, { method: "get" } )
       .done( function ( response ) {
          var result = response.result;
          var location = new google.maps.LatLng( result.Latitude, result.Longitude );
          loadPins( result.id );

          if ( !tagExists( result.id ) ) {
             placeMarker( location, result.id, result.Title, result.Description, result.UserId );
          }

          openTag( result.id, true );
       }, function ( error ) {
          alert( "error getting tag: " + error );
       } );
}

function openTag( tagId, zoomIn ) {
   var marker = getMarker( tagId );
   if ( marker ) {
      if ( zoomIn ) {
         googleMap.setZoom( 20 );
      }

      showTagInfo( marker );
   }
}

function loadPins( unclusteredId ) {
   var client = getMobileServicesClient();

   var currentCenter = googleMap.getCenter();
   var currentZoom = googleMap.getZoom();
   var params = { latitude: currentCenter.lat().toString(), longitude: currentCenter.lng().toString(), viewableMeters: getViewableMeters().toString() };
   client.invokeApi( "byldtag/", { parameters: params, method: "get" } )
       .done( function ( results ) {
          var response = JSON.parse( results.response );
          if ( response.length > 0 ) {
             for ( var i in response ) {
                var pin = response[i];

                if ( ( !unclusteredId || unclusteredId != pin.id ) && !tagExists( pin.id ) ) {
                   var marker = new google.maps.Marker( {
                      clickable: true,
                      position: new google.maps.LatLng( pin.Latitude, pin.Longitude ),
                      zIndex: 999,
                      icon: baseImagePath + "byldtag_pin.png",
                      tagId: pin.id,
                      title: pin.Title,
                      submitterName: pin.UserId,
                      description: pin.Description
                   } );

                   addMarker( marker, true, false );
                }
             }
          }
       }, function ( error ) {
          alert( "error getting tags: " + error );
       } );
}

function getMarker( tagId ) {
   for ( var i = 0; i < soloMarkers.length; i++ ) {
      if ( soloMarkers[i].tagId == tagId ) {
         return soloMarkers[i];
      }
   }

   for ( var i = 0; i < markers.length; i++ ) {
      if ( markers[i].tagId == tagId ) {
         return markers[i];
      }
   }

   return null;
}

function tagExists( tagId ) {
   if ( getMarker( tagId ) ) {
      return true;
   } else {
      return false;
   }
}

function getViewableMeters() {
   var bounds = googleMap.getBounds();
   var sw = bounds.getSouthWest();
   var ne = bounds.getNorthEast();
   var se = new google.maps.LatLng( sw.lat(), ne.lng() );
   var nw = new google.maps.LatLng( ne.lat(), sw.lng() );

   var proximityMeters = 0;
   var proximitymeterswne = google.maps.geometry.spherical.computeDistanceBetween( sw, ne );
   var proximitymetersenw = google.maps.geometry.spherical.computeDistanceBetween( se, nw );

   if ( proximitymeterswne > proximitymetersenw ) {
      proximityMeters = proximitymeterswne;
   } else if ( proximitymetersenw > proximitymeterswne ) {
      proximityMeters = proximitymetersenw;
   } else {
      proximityMeters = proximitymeterswne;
   }

   return proximityMeters;
}

function addMarker( marker, shouldCluster, openTag ) {
   if ( shouldCluster ) {
      markers[markers.length] = marker;
      clusterer.addMarker( marker );
   } else {
      soloMarkers[soloMarkers.length] = marker;
      marker.setMap( googleMap );
   }

   google.maps.event.addListener( marker, 'click', function () {
      //if (!infoBubble.isOpen()) {
      showTagInfo( marker );

      //google.maps.event.addListener(infoBubble, 'domready', function () {
      //});
      // }
   } );
}

function clearMarkers() {
   clusterer.clearMarkers();

   for ( var i = 0; i < soloMarkers.length; i++ ) {
      soloMarkers[i].setMap( null );
   }

   markers = new Array();
   soloMarkers = new Array();
}

function clusterAll() {
   for ( var i = 0; i < soloMarkers.length; i++ ) {
      marker = soloMarkers[i];
      marker.setMap( null );
      markers[markers.length] = marker;
      clusterer.addMarker( marker );
   }

   soloMarkers = new Array();
}

function removeGoogleStyles() {
   $( '.gm-style' ).removeClass( 'gm-style' );
}