﻿function shareToFacebook( tagId ) {
   var urlToShare = getUrlToShare( tagId );
   var shareLink = getFacebookShareLink( urlToShare, baseImagePath + "shareLogo.png", "Help us build it!", "Byldit gives communities a voice in what businesses they want." );

   openLink( shareLink );
}

function shareToTwitter( tagId ) {
   var urlToShare = getUrlToShare( tagId );
   var shareLink = getTwitterShareLink( urlToShare, "Help us build it!" );

   openLink( shareLink );
}

function shareToGoogle( tagId ) {
   var urlToShare = getUrlToShare( tagId );
   var shareLink = getGoogleShareLink( urlToShare );

   openLink( shareLink );
}

function getFacebookShareLink( url, thumb, linkTitle, linkSummary ) {
   return "http://www.facebook.com/sharer/sharer.php?s=100" +
      "&p[url]=" + url +
      "&p[images][0]=" + thumb +
      "&p[title]=" + linkTitle +
      "&p[summary]=" + linkSummary;
}

function getTwitterShareLink( url, message ) {
   return "http://twitter.com/home?status=" + message + " " + url;
}

function getGoogleShareLink( url ) {
   return "https://plus.google.com/share?url=" + url;
}

function getUrlToShare( tagId ) {
   return baseUrl + "/byldtag/" + tagId;
}

function openLink( link ) {
   window.open(link);
}