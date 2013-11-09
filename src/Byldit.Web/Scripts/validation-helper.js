function validateTagTitle( title ) {
   if( title.length < 1 || title.length > 25 ) {
      alert( "The title must be between 1 and 25 characters long." );
      return false;
   }

   return true;
}

function validateTagDescription( desc ) {
   if ( desc.length < 1 ) {
      alert( "The description must be at least one character long." );
      return false;
   }

   return true;
}

function validateTagKeywords( keywords ) {
   var splitKeys = keywords.split( /(?:,| )+/ );
   if( splitKeys.length > 3 ) {
      alert( "A maximum of three keywords are allowed." );
      return false;
   }

   return true;
}

function getValidKeywordString( keywords ) {
   return keywords.split( /(?:,| )+/ ).join();
}