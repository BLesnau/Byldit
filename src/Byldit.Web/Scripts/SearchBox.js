function SearchBox(controlDiv) {

    var box = document.createElement("input");
    box.type = "text";
    box.className = "searchBox";
    box.id = "searchBox";
    //showTagsImage.style.cursor = 'pointer';
    //showTagsImage.style.marginRight = "10px";

    controlDiv.appendChild(box);
    controlDiv.index = -1;

    return box;
}