var mobileServicesClient = null;
var isLoggedIn = false;
var authProviderUsed = "";
var userId = "";
var amsAuthToken = "";
var locLat = 37;
var locLon = -40;
var googleMap = null;

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

        //googleMap.setCenter(location);

        var client = getMobileServicesClient();

        var pin = { latitude: location.lat().toString(), longitude: location.lng().toString() };
        client.getTable("Pin").insert(pin);
    }
}