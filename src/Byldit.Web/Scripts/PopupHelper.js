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
var submitterName = "";
var keywords = "";
var starred = false;
var starCount = null;

function showTagInfo( mark ) {
   var client = getMobileServicesClient();
   client.invokeApi( "user/" + mark.submitterName, { method: "get" } )
       .done( function ( response ) {
          marker = mark;
          tagId = marker.tagId;
          descriptionText = mark.description;
          titleText = marker.title;
          submitterName = response.result.AccountName;
          keywords = marker.keywords;
          starCount = null;
          starred = false;

          var contentString = getAllContentString();

          if ( currentPopup != null ) {
             currentPopup.close();
          } else {
             currentPopup = new InfoBubble( {
                map: googleMap,
                maxWidth: 485,
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
          }

          currentPopup.setContent( contentString );
          currentPopup.open( googleMap, marker );
          setStarInfo();

          removeGoogleStyles();

       }, function ( error ) {
          marker = mark;
          tagId = marker.tagId;
          descriptionText = mark.description;
          titleText = marker.title;
          submitterName = marker.submitterName;
          keywords = marker.keywords;
          starCount = null;
          starred = false;

          var contentString = getAllContentString();

          if ( currentPopup != null ) {
             currentPopup.close();
          } else {
             currentPopup = new InfoBubble( {
                map: googleMap,
                maxWidth: 485,
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
          }

          currentPopup.setContent( contentString );
          currentPopup.open( googleMap, marker );
          setStarInfo();

          removeGoogleStyles();
       } ); 
}

function closeByldTag() {
   if ( currentPopup != null ) {
      currentPopup.close();
   }
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
   var nameNoColon = submitterName.replace( ':', '' );

   var contentString =
      '<div class="infoBubbleContainer">' +
         '<div class="submitter-container">' +
            getHeaderString() +
            '<div class="submitter-text">Submitted by: <a href="javascript:comingSoon();" class="submitter-link">' + nameNoColon + '</a></div>' +
            //'<div class="submitter-text">Submitted by: <a href="user/' + nameNoColon + '" class="submitter-link">' + nameNoColon + '</a></div>' +
         '</div>' +
         getHashTagString() +
         '<div class="infoBubbleContentContainer more">' +
            descHtml +
         '</div>' +
         getMoreLessLink() +
      '</div>';

   return contentString;
}

function getHashTagString() {
   var str = '<div class="hashTagContainer">';

   if ( keywords ) {
      var keyArray = keywords.split( /(?:,| )+/ );
      for ( var i = 0; i < keyArray.length; i++ ) {
         if( keyArray[i].length > 0 ) {
            str += '<a class="hashTag" href="javascript:comingSoon();">#' + keyArray[i] + '</a> ';
         }
      }
   }

   str += '</div>';

   return str;
}

function getHeaderString() {
   var headerText = '<div class="infoBubbleHeader">' + titleText;

   if ( isLoggedIn && submitterName == userId ) {
      headerText += '<a class="edit-pic" href="javascript:editTag()">' +
         '<img src="' + baseImagePath + 'edit-logo.png" /></a>';
   }

   headerText += '</div>';

   return headerText;
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
               '<a class="small-social-button" href="javascript:shareToFacebook(' + tagId + ')">' +
               '<img src="..//Content//Images//small-facebook-widget.jpg" /></a>' +
               '<a class="small-social-button" href="javascript:shareToTwitter(' + tagId + ')">' +
               '<img src="..//Content//Images//small-twitter-widget.jpg" /></a>' +
               '<a class="small-social-button" href="javascript:shareToGoogle(' + tagId + ')">' +
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
   var ad = getAd();
   var contentString =
      '<div class="adContainer">' +
           '<a href="' + ad.link + '"><img class="adImage" src="' + baseImagePath + ad.path + '" /></a>' +
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

   return '';
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
   if ( starred ) {
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

function editTag() {
   showEditByldTagDialog( $( "#update-tag-dialog" ), marker.position, titleText, descriptionText, tagId );
}

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