function showMoreLess() {
    alert(this);
    var showChar = 100;
    var ellipsestext = "...";
    var moretext = "more";
    var lesstext = "less";
    $('.more').each(function () {
        alert("sdgsdg");
        var content = $(this).html();

        if (content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar - 1, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

            $(this).html(html);
        }

    });

    $(".morelink").click(function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
}

var moreShown = false;

function moreClicked(obj) {
    var moretext = "more";
    var lesstext = "less";
    var jObj = $(obj);

    if (jObj.hasClass("less")) {
        jObj.removeClass("less");
        jObj.html(moretext);
    } else {
        jObj.addClass("less");
        jObj.html(lesstext);
    }
    //jObj.parent().prev().toggle();
    jObj.prev().toggle();

    google.maps.event.addListener(currentPopup, 'domready', function () {
        $(".infoBubbleBackground").height($(".infoBubbleBackground").height() + 500);
        $(".infoBubbleBackground").parent().height($(".infoBubbleBackground").parent().height() + 500);
    });
    
    currentPopup.updateContent_();
    //currentPopup.redraw_();
    //currentPopup.draw();

    return false;
}