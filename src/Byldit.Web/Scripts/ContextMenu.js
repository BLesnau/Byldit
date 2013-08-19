var currentContextMenu = null;

function showContextMenu( mapElement, addTagDialog, location ) {
   currentContextMenu = new ContextMenu( mapElement, addTagDialog );
   currentContextMenu.show( location );
}

function closeContextMenu() {
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