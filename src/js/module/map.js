elife.service('mapService', function () {
    // 复杂的自定义覆盖物
    function ComplexCustomOverlay(point, title, address) {
        this._point = point;
        this._title = title;
        this._address = address;
    }

    try {
        ComplexCustomOverlay.prototype = new BMap.Overlay();
    } catch (e) {
    }
    ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.style.backgroundColor = "rgba(0, 0, 0, .6)";
        div.style.color = "white";
        div.style.width = "220px";
        div.style.padding = "4px 6px";
        div.style.borderRadius = "4px";
        div.style.lineHeight = "22px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "12px";
        var title = document.createElement("div");
        var address = document.createElement("div");
        title.style.fontSize = "14px";
        title.style.fontWeight = 600;
        address.style.overflow = "hidden";
        address.style.textOverflow = "ellipsis";
        div.appendChild(title);
        div.appendChild(address);
        title.appendChild(document.createTextNode(this._title));
        address.appendChild(document.createTextNode(this._address));
        map.getPanes().labelPane.appendChild(div);
        return div;
    };
    ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - 12 + "px";
        this._div.style.top = pixel.y - 88 + "px";
    };
    return {
        overlay: ComplexCustomOverlay
    };
});