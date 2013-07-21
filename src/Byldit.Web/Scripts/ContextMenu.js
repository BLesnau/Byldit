var currentContextMenu = null;

function ShowContextMenu( mapElement, location ) {
   currentContextMenu = new ContextMenu( mapElement );
   currentContextMenu.show( location );
}

function CloseContextMenu() {
   currentContextMenu.close();
   currentContextMenu = null;
}

function ContextMenu( mapElement ) {
   var module = {};

   var currentLocation = null;

   var menu = new Gmap3Menu( mapElement );
   menu.add( "Add ByldTag", "addTag",
      function () {
         menu.close();
         placeMarker( currentLocation.latLng );
      }
   );

   module.show = function ( location ) {
      menu.open( location );
      currentLocation = location;
   };

   module.close = function () {
      menu.close();
      currentLocation = null;
   };

   return module;
}

var menu = new Gmap3Menu( $( "#test" ) );