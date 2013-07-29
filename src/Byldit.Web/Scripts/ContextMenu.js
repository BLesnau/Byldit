var currentContextMenu = null;

function ShowContextMenu( mapElement, addTagDialog, location ) {
   currentContextMenu = new ContextMenu( mapElement, addTagDialog );
   currentContextMenu.show( location );
}

function CloseContextMenu() {
   if( currentContextMenu ) {
      currentContextMenu.close();
      currentContextMenu = null;
   }
}

function ContextMenu( mapElement, addTagDialog ) {
   var module = {};

   var currentLocation = null;

   var menu = new Gmap3Menu( mapElement );
   menu.add( "Add ByldTag", "addTag",
      function () {
         menu.close();
         showCreateByldTagDialog( addTagDialog, currentLocation.latLng );
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