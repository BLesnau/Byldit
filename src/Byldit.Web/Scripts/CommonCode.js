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