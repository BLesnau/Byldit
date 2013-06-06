// A TextualZoomControl is a GControl that displays textual "Zoom In"
// and "Zoom Out" buttons (as opposed to the iconic buttons used in
// Google Maps).

// We define the function first
//function ShowTagsButton() {
//};

//// To "subclass" the GControl, we set the prototype object to
//// an instance of the GControl object
//ShowTagsButton.prototype = new GControl();

//// By default, the control will appear in the top left corner of the
//// map with 7 pixels of padding.
//ShowTagsButton.prototype.getDefaultPosition = function () {
//    return new GControlPosition(G_ANCHOR_BOTTOM_RIGHT, new GSize(25, 25));
//};

function ShowTagsButton(controlDiv, map, clickHandler) {

    var showTagsImage = document.createElement("img");
    showTagsImage.src = "Content/Images/show-byldtags-text.png";
    showTagsImage.style.cursor = 'pointer';
    showTagsImage.style.marginRight = "10px";
    
    controlDiv.appendChild(showTagsImage);
    controlDiv.index = -1;

    google.maps.event.addDomListener(controlDiv, 'click', clickHandler);
}