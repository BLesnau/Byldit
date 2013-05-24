function login(provider) {
    var client = new WindowsAzure.MobileServiceClient(
        "https://byldit.azure-mobile.net/",
        "bduEIkOePLucjzWXwVUBmevdjzTReh22"
    );

    client.login(provider).done(function (results) {
        //alert("You are now logged in as: " + results.userId);
        $('div.userName').text(results.userId);
    }, function (err) {
        alert("Error: " + err);
    });
}

function loginToFacebook() {
    login("facebook");
}

function loginToTwitter() {
    login("twitter");
}

function loginToGoogle() {
    login("google");
}

function loginToMicrosoft() {
    login("microsoftaccount");
}