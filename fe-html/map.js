var map,
    myCenter = new google.maps.LatLng(59, 10),
    gridstyle = { strokeColor: 'yellow', strokeWeight: 1 }
grid = [],
    markers = [],
    rectangles = []

function initialize() {
    var mapProp = {
        center: myCenter,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        scaleControl: true
    }


    const infowindow = new google.maps.InfoWindow({
        content: 'Empty',
        ariaLabel: "Uluru",
    });

    map = new google.maps.Map(document.getElementById('map'), mapProp)

    google.maps.event.addListener(map, 'bounds_changed', function (callback) {
        var gridsize = 0.0002 //Grid size in degrees
        var gridlat,
            n = map.getBounds().getNorthEast().lat(),
            s = map.getBounds().getSouthWest().lat(),
            e = map.getBounds().getNorthEast().lng(),
            w = map.getBounds().getSouthWest().lng()

        // If a previous grid and markers are set, we remove them.
        if(grid.length > 0) {
            for (var i = 0; i < grid.length; i++) {
                grid[i].setMap(null)
            }
        }

        if(markers.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null)
            }
        }

        let needsZooming = false
        let distanceSN = Math.abs(s - n)
        let distanceEW = Math.abs(e - w)
        let distance
        if(distanceSN > distanceEW) distance = distanceSN
        else distance = distanceEW

        let gridCount = distance / gridsize

        while (gridCount > 10) {
            needsZooming = true
            gridsize *= 2
            gridCount = distance / gridsize
        }

        var sgrid = Math.round(s / gridsize) * gridsize
        var wgrid = Math.round(w / gridsize) * gridsize
        // Here we create the grid.
        for (gridlat = sgrid; gridlat < n; gridlat = gridlat + gridsize) {
            var gridline = new google.maps.Polyline({
                path: [{ lat: gridlat, lng: e }, { lat: gridlat, lng: w }],
                map: map
            })
            gridline.setOptions(gridstyle)
            grid.push(gridline)
        }

        for (gridlng = wgrid; gridlng < e; gridlng = gridlng + gridsize) {
            var gridline = new google.maps.Polyline({
                path: [{ lat: n, lng: gridlng }, { lat: s, lng: gridlng }],
                map: map
            })
            gridline.setOptions(gridstyle)
            grid.push(gridline)
        }


        for (let startPosLat = sgrid; startPosLat < n; startPosLat = startPosLat + gridsize) {
            for (let startPostLng = wgrid; startPostLng < e; startPostLng = startPostLng + gridsize) {


                let markerposition = { lat: startPosLat + (gridsize / 2), lng: startPostLng + (gridsize / 2) }
                if(needsZooming) {
                    const bounds = {
                        north: startPosLat + gridsize,
                        south: startPosLat,
                        east: startPostLng + gridsize,
                        west: startPostLng,
                    }
                    const rectangle = new google.maps.Rectangle({
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "rgba(255,0,0,0)",
                        fillOpacity: 0.0,
                        map,
                        bounds
                    });

                    rectangle.addListener("click", () => {
                        map.fitBounds(bounds, -50)
                        console.log(map.getZoom())
                        map.setZoom(map.getZoom() + 1)
                    })
                    rectangles.push(rectangle)
                } else {
                    let marker = new google.maps.Marker({
                        position: markerposition,
                        map: map
                    })
                    marker.addListener("click", function () {

                        infowindow.setContent("Lat: " + markerposition.lat + " Lng: " + markerposition.lng + " <br>  X: " + Math.round(markerposition.lat / gridsize) + " Y: " + Math.round(markerposition.lng / gridsize))
                        infowindow.open({ map, anchor:marker })
                    })
                    markers.push(marker)
                }

            }
        }

    })
}

document.addEventListener("DOMContentLoaded", function (event) {
    // Your code to run since DOM is loaded and ready
    initialize()
})