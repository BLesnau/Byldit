var mobileServicesClient = null;
var locLat = 37;
var locLon = -40;
var googleMap = null;
var markers = [];
var mobileServicesUrl = "";
var mobileServicesKey = "";

var baseImagePath = "";

function getMobileServicesClient() {
    if (mobileServicesClient == null) {
        mobileServicesClient = new WindowsAzure.MobileServiceClient(
            mobileServicesUrl,
            mobileServicesKey
        );
    }

    return mobileServicesClient;
}

function login(provider) {
    var client = getMobileServicesClient();

    client.login(provider).done(function (results) {
        isLoggedIn = true;
        loginProvider = provider;
        userId = results.userId;
        amsAccessToken = results.mobileServiceAuthenticationToken;

        var remember = $("#rememberMeCheck").is(':checked');
        if (remember) {
            rememberMe = true;
            SaveSettings();
        }

        setLoginUI(true);
    }, function (err) {
        alert("Error: " + err);
    });
}

function setLoginUI(animate) {
    if (animate) {
        $("#notSignedIn").hide("1000");
    } else {
        $("#notSignedIn").hide();
    }

    $("#signedIn").show();
    if (loginProvider == "facebook") {
        $("#fbLogo").show();
    }
    else {
        $("#fbLogo").hide();
    }

    if (loginProvider == "twitter") {
        $("#twitterLogo").show();
    } else {
        $("#twitterLogo").hide();
    }

    if (loginProvider == "google") {
        $("#googleLogo").show();
    } else {
        $("#googleLogo").hide();
    }
}

function setNotLoggedUI(animate) {
    $("#signedIn").hide();

    if (animate) {
        $("#notSignedIn").show("1000");
    } else {
        $("#notSignedIn").show();
    }
}

function logout() {
    isLoggedIn = false;
    loginProvider = null;
    userId = null;
    amsAccessToken = null;
    rememberMe = false;
    SaveSettings();

    setNotLoggedUI(true);
}

function setUser(userName, token) {
    var client = getMobileServicesClient();
    client.currentUser = {
        userId: userName,
        mobileServiceAuthenticationToken: token
    };

    setLoginUI(false);
}

//function getLocation() {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(storePosition);
//    }
//}

//function storePosition(position) {
//    locLat = position.coords.latitude;
//    locLon = position.coords.longitude;

//    var position = new google.maps.LatLng(locLat, locLon);

//    googleMap.setCenter(position);
//    googleMap.setZoom(15);

//    var myLoc = new google.maps.Marker({
//        clickable: false,
//        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
//                                                        new google.maps.Size(22, 22),
//                                                        new google.maps.Point(0, 18),
//                                                        new google.maps.Point(11, 11)),
//        shadow: null,
//        zIndex: 999,
//        map: googleMap
//    });
//    myLoc.setPosition(position);
//}

function placeMarker(location) {
    if (isLoggedIn) {
        var marker = new google.maps.Marker({
            position: location,
            map: googleMap,
            icon: baseImagePath + "byldtag_pin.png"
        });

        addMarker(marker);
        //googleMap.setCenter(location);

        var client = getMobileServicesClient();

        var pin = { latitude: location.lat().toString(), longitude: location.lng().toString() };
        client.getTable("Pin").insert(pin);
    }
}

function loadPins() {
    var client = getMobileServicesClient();

    var currentCenter = googleMap.getCenter();
    var currentZoom = googleMap.getZoom();
    var filter = currentCenter.lat().toString() + ", " + currentCenter.lng().toString() + ", " + getViewableMeters().toString();
    //alert(filter);
    client.getTable("Pin").where({ Filter: filter })
        .read()
        .done(function (results) {
            if (results.length > 0) {
                clearMarkers();
                for (var i in results) {
                    var pin = results[i];

                    var marker = new google.maps.Marker({
                        clickable: true,
                        position: new google.maps.LatLng(pin.Latitude, pin.Longitude),
                        zIndex: 999,
                        map: googleMap,
                        icon: baseImagePath + "byldtag_pin.png"
                    });

                    addMarker(marker);
                }
            }
        });
}

function getViewableMeters() {
    var bounds = googleMap.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var se = new google.maps.LatLng(sw.lat(), ne.lng());
    var nw = new google.maps.LatLng(ne.lat(), sw.lng());

    var proximityMeters = 0;
    var proximitymeterswne = google.maps.geometry.spherical.computeDistanceBetween(sw, ne);
    var proximitymetersenw = google.maps.geometry.spherical.computeDistanceBetween(se, nw);

    if (proximitymeterswne > proximitymetersenw) {
        proximityMeters = proximitymeterswne;
    } else if (proximitymetersenw > proximitymeterswne) {
        proximityMeters = proximitymetersenw;
    } else {
        proximityMeters = proximitymeterswne;
    }

    return proximityMeters;
}

function addMarker(marker) {
    markers[markers.length] = marker;

    google.maps.event.addListener(marker, 'click', function () {
        //if (!infoBubble.isOpen()) {

        var contentString =
            '<div class="infoBubbleContainer">' +
                '<div class="infoBubbleHeader">Cold Stone Creamery</div>' +
                    //'<div class="indentedTagInfo">' +
                '<div class="hashTagContainer">' +
                    '<a class="hashTag" href="tag/coldstone">#coldstone</a> ' +
                    '<a class="hashTag" href="tag/icecream">#icecream</a> ' +
                    '<a class="hashTag" href="tag/food">#food</a> ' +
                '</div>' +
                '<div class="infoBubbleContentContainer">' +
                '<div>This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome. This place is awesome.</div>' +
                '</br>' +
                '<div>Ditto everything from above. Ditto everything from above. Ditto everything from above. Ditto everything from above.</div>' +
                '</div>' +
                    //'</div>' +
            '</div>' +
            '<div class="adContainer">' +
                '<a href="http://www.coldstonecreamery.com/"><img class="adImage" src="..//Content//Images//coldstone.png" /></a>' +
            '</div>';

        var infoBubble = new InfoBubble({
            map: googleMap,
            maxWidth: 400,
            //maxHeight: 500,
            content: contentString,
            position: new google.maps.LatLng(-35, 151),
            shadowStyle: 0,
            padding: 0,
            backgroundColor: 'transparent',
            borderRadius: 4,
            arrowSize: 10,
            borderWidth: 1,
            borderColor: '#2c2c2c',
            disableAutoPan: false,
            hideCloseButton: true,
            arrowPosition: 50,
            backgroundClassName: 'infoBubbleBackground',
            arrowStyle: 0
        });

        infoBubble.open(googleMap, marker);
        // }
    });
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = new Array();
}