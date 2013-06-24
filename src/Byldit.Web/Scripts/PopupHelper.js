var showChar = 100;
var ellipsestext = "...";
var moretext = ">> more";
var lesstext = "<< less";

var currentPopup = null;
var marker = null;
var moreShown = false;
var descriptionText = "";

function showTagInfo(mark, descText) {
    descriptionText = descText;
    marker = mark;

    if (currentPopup != null) {
        currentPopup.close();
    }

    var contentString = getContentStr();

    currentPopup = new InfoBubble({
        map: googleMap,
        maxWidth: 450,
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
        disableAnimation: false,
        arrowPosition: 50,
        backgroundClassName: 'infoBubbleBackground',
        arrowStyle: 0
    });

    currentPopup.open(googleMap, marker);
}

function moreToggle(obj) {
    if (currentPopup != null) {
        moreShown = !moreShown;

        currentPopup.close();

        var contentString = getContentStr();

        currentPopup = new InfoBubble({
            map: googleMap,
            maxWidth: 450,
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
            disableAnimation: true,
            arrowPosition: 50,
            backgroundClassName: 'infoBubbleBackground',
            arrowStyle: 0
        });

        currentPopup.open(googleMap, marker);

        //currentPopup.setContent(getDescText());
        //currentPopup.updateContent_();
        //currentPopup.redraw_();
    }
}

function getContentStr() {
    var descHtml = getDescText();

    var contentString =
        '<div class="infoBubbleContainer">' +
            '<div class="infoBubbleHeader">Cold Stone Creamery</div>' +
            '<div class="hashTagContainer">' +
                '<a class="hashTag" href="tag/coldstone">#coldstone</a> ' +
                '<a class="hashTag" href="tag/icecream">#icecream</a> ' +
                '<a class="hashTag" href="tag/food">#food</a> ' +
            '</div>' +
            '<div class="infoBubbleContentContainer more">' +

            descHtml +

            '</div>' +

            getMoreLessLink() +

        '</div>' +
        '<div class="adContainer">' +
            '<a href="http://www.coldstonecreamery.com/"><img class="adImage" src="..//Content//Images//coldstone.png" /></a>' +
        '</div>';

    return contentString;
}

function getDescText() {
    var consolidatedDesc = "";

    if (descriptionText.length > showChar) {
        if (moreShown) {
            consolidatedDesc = descriptionText;
        } else {
            var c = descriptionText.substr(0, showChar);
            //var h = descriptionText.substr(showChar - 1, descriptionText.length - showChar);
            consolidatedDesc = c + '<span class="moreellipses">' + ellipsestext + '</span>';
        }
    }

    return consolidatedDesc;
}

function getMoreLessLink() {
    if (descriptionText.length > showChar) {
        if (moreShown) {
            return '<div class="more_link_container"><a href="#" class="morelink" onclick="moreToggle(this)">' + lesstext + '</a></div>';
        } else {
            return '<div class="more_link_container"><a href="#" class="morelink" onclick="moreToggle(this)">' + moretext + '</a></div>';
        }
    }
}