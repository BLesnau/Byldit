var currentlyLoading = false;
var waitingToHide = false;
var loadPending = false;
var showTimer = null;
var hideTimer = null;
var pendingTimer = null;

function loadPins( unclusteredId ) {
   if ( currentlyLoading || waitingToHide ) {
      setPendingLoad( false );
      return;
   } else {
      reset();
   }

   //console.log("LOAD START");

   currentlyLoading = true;
   showTimer = setTimeout( function () {
      showLoadTagOverlay();
   }, 2000 );

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

          doneLoading();
       }, function ( error ) {
          alert( "error getting tags: " + error );
          doneLoading();
       } );
}

function setPendingLoad( fromTimer ) {
   if ( fromTimer || !loadPending ) {
      //console.log( "PENDING" );
      loadPending = true;
      pendingTimer = setTimeout( function () {
         if ( currentlyLoading || waitingToHide ) {
            setPendingLoad( true );
         } else {
            loadPending = false;
            loadPins();
         }
      }, 1000 );
   }
}

function showLoadTagOverlay() {
   if ( !currentlyLoading ) {
      return;
   }

   waitingToHide = true;
   hideTimer = setTimeout( function () {
      hideLoadTagOverlay();
   }, 2000 );

   createLoadOverlay().trigger( 'show' ); // and show it
}

function hideLoadTagOverlay() {
   waitingToHide = false;

   if ( currentlyLoading ) {
      return;
   }

   createLoadOverlay().trigger( 'hide' );
   reset();
}

function createLoadOverlay() {
   var overlay = $( "#load-tags-overlay" ).omniWindow( {
      overlay: {
         selector: ''
      },
      modal: {
         animations: {
            hide: function ( subjects, internalCallback ) {
               subjects.modal.fadeOut( 250, function () {
                  internalCallback( subjects );
               } );
            },
            show: function ( subjects, internalCallback ) {
               subjects.modal.fadeIn( 250, function () {
                  internalCallback( subjects );
               } );
            }
         }
      },
      callbacks: {
         positioning: function ( subjects, internalCallback ) {
         }
      }
   } );

   return overlay;
}

function doneLoading() {
   //console.log( "LOAD DONE" );

   currentlyLoading = false;
   clearShowTimer();

   if ( !waitingToHide ) {
      hideLoadTagOverlay();
   }
}

function reset() {
   currentlyLoading = false;
   waitingToHide = false;

   clearShowTimer();
   clearHideTimer();
}

function clearShowTimer( timer ) {
   if ( showTimer != null ) {
      clearInterval( showTimer );
      showTimer = null;
   }
}

function clearHideTimer( timer ) {
   if ( hideTimer != null ) {
      clearInterval( hideTimer );
      hideTimer = null;
   }
}