var isLoggedIn = false;
var rememberMe = false;
var loginProvider = null;
var userId = null;
var accountName = null;
var amsAccessToken = null;

function LoadSettings() {
    var tmpRememberMe = getCookie("rememberMe");
    if (tmpRememberMe == "true") {
        rememberMe = true;
    } else {
        rememberMe = false;
    }
    //alert("rememberMe = " + rememberMe);

    var tmpProvider = getCookie("loginProvider");
    if (tmpProvider != null) {
        loginProvider = tmpProvider;
    }
    //alert("loginProvider = " + loginProvider);

    var tmpUserId = getCookie("userId");
    if (tmpUserId != null) {
        userId = tmpUserId;
    }
    //alert("userId = " + userId);

    var tmpToken = getCookie("amsAccessToken");
    if (tmpToken != null) {
        amsAccessToken = tmpToken;
    }
    //alert("amsAccessToken = " + amsAccessToken);

    if (rememberMe && loginProvider != null && userId != null && amsAccessToken != null) {
        isLoggedIn = true;
        setUser( userId, amsAccessToken );
    } else {
        setNotLoggedUI(false);
    }
}

function SaveSettings() {
    if (rememberMe == true) {
        setCookie("rememberMe", "true");
    } else {
        setCookie("rememberMe", "false");
    }

    if (loginProvider != null) {
        setCookie("loginProvider", loginProvider);
    }

    if (userId != null) {
        setCookie("userId", userId);
    }

    if (amsAccessToken != null) {
        setCookie("amsAccessToken", amsAccessToken);
    }
}

function setCookie(cookieName, cValue, daysToExpire) {
    //No Expiration For Now
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + daysToExpire);
    daysToExpire = null;

    var cookieValue = escape(cValue) + ((daysToExpire == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = cookieName + "=" + cookieValue;
}

function getCookie(cookieName) {
    var cookieValue = document.cookie;
    var cookieStart = cookieValue.indexOf(" " + cookieName + "=");

    if (cookieStart == -1) {
        cookieStart = cookieValue.indexOf(cookieName + "=");
    }

    if (cookieStart == -1) {
        cookieValue = null;
    } else {
        cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
        var cookieEnd = cookieValue.indexOf(";", cookieStart);
        if (cookieEnd == -1) {
            cookieEnd = cookieValue.length;
        }
        cookieValue = unescape(cookieValue.substring(cookieStart, cookieEnd));
    }

    return cookieValue;
}