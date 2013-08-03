var showChar = 250;
var ellipsestext = "...";
var moretext = ">> more";
var lesstext = "<< less";
var yellowStarImage = "..//Content//Images//yellow-star.png";
var grayStarImage = "..//Content//Images//gray-star.png";

var currentPopup = null;
var marker = null;
var tagId = null;
var moreShown = false;
var descriptionText = "";
var titleText = "";
var starred = false;
var starCount = null;

function showTagInfo( mark ) {
   marker = mark;
   tagId = marker.tagId;
   descriptionText = mark.description;
   titleText = marker.title;
   starCount = null;
   starred = false;
   setStarInfo();

   if ( currentPopup != null ) {
      currentPopup.close();
   }

   var contentString = getAllContentString();

   currentPopup = new InfoBubble( {
      map: googleMap,
      maxWidth: 450,
      content: contentString,
      shadowStyle: 0,
      padding: 0,
      backgroundColor: 'transparent',
      borderRadius: 4,
      arrowSize: 10,
      borderWidth: 1,
      borderColor: '#2c2c2c',
      disableAutoPan: false,
      hideCloseButton: true,
      disableAnimation: false,
      arrowPosition: 50,
      backgroundClassName: 'infoBubbleBackground',
      arrowStyle: 0
   } );

   currentPopup.open( googleMap, marker );
}

function moreToggle( obj ) {
   if ( currentPopup != null ) {
      moreShown = !moreShown;

      var descTextBox = $( ".infoBubbleContentContainer" );
      var initialContentHeight = descTextBox.height();

      var contentWithoutAd = $( obj ).parent().parent();
      contentWithoutAd.replaceWith( getContentString() );

      descTextBox = $( ".infoBubbleContentContainer" );
      var endContentHeight = descTextBox.height();
      var heightChange = endContentHeight - initialContentHeight;

      var entireBubble = $( ".infoBubbleBackground" ).parent();
      var arrow = $( ".infoBubbleBackground" ).parent().next();
      var underEntireBubble = $( ".infoBubbleBackground" );

      entireBubble.css( 'overflow-x', 'hidden' );

      entireBubble.height( entireBubble.height() + heightChange );

      var entireBubblePos = entireBubble.offset();
      entireBubble.offset( { top: entireBubblePos.top - heightChange, left: entireBubblePos.left } );

      var arrowPos = arrow.offset();
      arrow.offset( { top: arrowPos.top - heightChange, left: arrowPos.left } );
   }
}

function getAllContentString() {
   var contentString = getContentString() + getControlBarString() + getAdContentString();
   return contentString;
}

function getContentString() {
   var descHtml = getDescTextHtml();

   var contentString =
      '<div class="infoBubbleContainer">' +
         '<div class="infoBubbleHeader">' + titleText + '</div>' +
         '<div class="hashTagContainer">' +
         '<a class="hashTag" href="tag/coldstone">#coldstone</a> ' +
         '<a class="hashTag" href="tag/icecream">#icecream</a> ' +
         '<a class="hashTag" href="tag/food">#food</a> ' +
         '</div>' +
         '<div class="infoBubbleContentContainer more">' +
         descHtml +
         '</div>' +
         getMoreLessLink() +
         '</div>';

   return contentString;
}

function getControlBarString() {
   var starText;
   if ( starCount == null ) {
      starText = '<span class="like-text"></span>';
   } else {
      starText = '<span class="like-text">' + starCount + ' Stars' + '</span>';
   }

   var barString =
      '<div class="control-bar">' +
            getStarImageString() +
            starText +

            '<div class="small-social-container float-right">' +
               '<a class="small-social-button" href="javascript:alert(&quot;You posted to Facebook dawg!&quot;)">' +
               '<img src="..//Content//Images//small-facebook-widget.jpg" /></a>' +
               '<a class="small-social-button" href="javascript:alert(&quot;You posted to Twitter dawg!&quot;)">' +
               '<img src="..//Content//Images//small-twitter-widget.jpg" /></a>' +
               '<a class="small-social-button" href="javascript:alert(&quot;You posted to Google dawg!&quot;)">' +
               '<img src="..//Content//Images//small-google-widget.jpg" /></a>' +
            '</div>' +
      '</div>';

   return barString;
}

function getStarImageString() {
   if ( starred ) {
      return '<a href="javascript:;"><img id="yellow-star" class="like-star" src="' + yellowStarImage + '" onClick="starClicked()">' +
             '<img id="gray-star" class="like-star" style="display:none" src="' + grayStarImage + '" onClick="starClicked()"></a>';
   } else {
      return '<a href="javascript:;"><img id="yellow-star" class="like-star" style="display:none" src="' + yellowStarImage + '" onClick="starClicked()">' +
             '<img id="gray-star" class="like-star" src="' + grayStarImage + '" onClick="starClicked()"></a>';
   }
}

function getAdContentString() {
   var contentString =
      '<div class="adContainer">' +
           '<a href="http://www.coldstonecreamery.com/"><img class="adImage" src="..//Content//Images//coldstone.png" /></a>' +
       '</div>';

   return contentString;
}

function getDescTextHtml() {
   var consolidatedDesc = getDescText();

   if ( descriptionText.length > showChar ) {
      if ( moreShown ) {
      } else {
         consolidatedDesc = consolidatedDesc + '<span class="moreellipses">' + ellipsestext + '</span>';
      }
   }
   return consolidatedDesc;
}

function getDescText() {

   var consolidatedDesc = "";
   if ( ( descriptionText.length > showChar ) && !moreShown ) {
      consolidatedDesc = descriptionText.substr( 0, showChar );
   } else {
      var consolidatedDesc = descriptionText;
   }

   return consolidatedDesc;
}

function getMoreLessLink() {
   if ( descriptionText.length > showChar ) {
      if ( moreShown ) {
         return '<div class="more_link_container"><a href="#" class="morelink" onclick="moreToggle(this)">' + lesstext + '</a></div>';
      } else {
         return '<div class="more_link_container"><a href="#" class="morelink" onclick="moreToggle(this)">' + moretext + '</a></div>';
      }
   }
}

function setStarInfo() {
   var client = getMobileServicesClient();
   client.invokeApi( "byldtag/" + tagId + "/star", { method: "get" } )
       .done( function ( response ) {
          starCount = response.result.starCount;
          starred = response.result.starredByUser;
          updateStar();
       }, function ( error ) {
          alert( "error getting star info: " + error );
       } );
}

function starClicked() {
   var client = getMobileServicesClient();
   var method;
   if( starred ) {
      method = "delete";
   } else {
      method = "post";
   }
   
   client.invokeApi( "byldtag/" + tagId + "/star", { method: method } )
       .done( function () {
          starred = !starred;

          if ( starred ) {
             starCount++;

             $( "#gray-star" ).hide();
             $( "#yellow-star" ).show();

          } else {
             starCount--;

             $( "#yellow-star" ).hide();
             $( "#gray-star" ).show();
          }

          $( ".like-text" ).text( starCount + " Stars" );
       }, function ( error ) {
          alert( "error getting star info: " + error );
       } );
}

function updateStar() {
   if ( starred ) {

      $( "#gray-star" ).hide();
      $( "#yellow-star" ).show();

   } else {

      $( "#yellow-star" ).hide();
      $( "#gray-star" ).show();
   }

   $( ".like-text" ).text( starCount + " Stars" );
}

//function fromLatLngToPoint( latLng, opt_point ) {
//   var me = this;
//   var point = opt_point || new google.maps.Point( 0, 0 );
//   var origin = me.pixelOrigin_;

//   point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

//   // Truncating to 0.9999 effectively limits latitude to 89.189. This is
//   // about a third of a tile past the edge of the world tile.
//   var siny = bound( Math.sin( degreesToRadians( latLng.lat() ) ), -0.9999,
//       0.9999 );
//   point.y = origin.y + 0.5 * Math.log(( 1 + siny ) / ( 1 - siny ) ) *
//       -me.pixelsPerLonRadian_;
//   return point;
//};

function fromPointToLatLng( point ) {
   var TILE_SIZE = 256;
   var pixelsPerLonDegree_ = TILE_SIZE / 360;
   var pixelsPerLonRadian_ = TILE_SIZE / ( 2 * Math.PI );

   var origin = new google.maps.Point( TILE_SIZE / 2, TILE_SIZE / 2 );
   var lng = ( point.x - origin.x ) / pixelsPerLonDegree_;
   var latRadians = ( point.y - origin.y ) / -pixelsPerLonRadian_;
   var lat = radiansToDegrees( 2 * Math.atan( Math.exp( latRadians ) ) -
       Math.PI / 2 );
   return new google.maps.LatLng( lat, lng );
};

function degreesToRadians( deg ) {
   return deg * ( Math.PI / 180 );
}

function radiansToDegrees( rad ) {
   return rad / ( Math.PI / 180 );
}