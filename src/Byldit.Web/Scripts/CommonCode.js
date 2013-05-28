var mobileServicesClient = null;
var isLoggedIn = false;
var authProviderUsed = "";
var userId = "";
var amsAuthToken = "";
var locLat = 37;
var locLon = -40;
var googleMap = null;
var markers = [];

function getMobileServicesClient() {
    if (mobileServicesClient == null) {
        mobileServicesClient = new WindowsAzure.MobileServiceClient(
            "https://byldit.azure-mobile.net/",
            "bduEIkOePLucjzWXwVUBmevdjzTReh22"
        );
    }

    return mobileServicesClient;
}

function login(provider) {
    var client = getMobileServicesClient();

    client.login(provider).done(function (results) {
        isLoggedIn = true;
        authProviderUsed = provider;
        userId = results.userId;
        amsAuthToken = results.mobileServiceAuthenticationToken;
        $('div.userName').text(userId);
    }, function (err) {
        alert("Error: " + err);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(storePosition);
    }
}

function storePosition(position) {
    locLat = position.coords.latitude;
    locLon = position.coords.longitude;

    var position = new google.maps.LatLng(locLat, locLon);

    googleMap.setCenter(position);
    googleMap.setZoom(14);

    var myLoc = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                        new google.maps.Size(22, 22),
                                                        new google.maps.Point(0, 18),
                                                        new google.maps.Point(11, 11)),
        shadow: null,
        zIndex: 999,
        map: googleMap
    });
    myLoc.setPosition(position);
}

function placeMarker(location) {
    if (isLoggedIn) {
        var marker = new google.maps.Marker({
            position: location,
            map: googleMap
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
                        map: googleMap
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
    //alert(sw);
    //alert(ne);
    //alert(se);
    //alert(nw);

    var proximityMeters = 0;
    var proximitymeterswne = google.maps.geometry.spherical.computeDistanceBetween(sw, ne);
    var proximitymetersenw = google.maps.geometry.spherical.computeDistanceBetween(se, nw);
    //alert(proximitymeterswne);
    //alert(proximitymetersenw);

    if (proximitymeterswne > proximitymetersenw) {
        proximityMeters = proximitymeterswne;
    } else if (proximitymetersenw > proximitymeterswne) {
        proximityMeters = proximitymetersenw;
    } else {
        proximityMeters = proximitymeterswne;
    }

    //alert(proximityMeters);
    return proximityMeters;
}

function addMarker(marker) {
    markers[markers.length] = marker;
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = new Array();
}