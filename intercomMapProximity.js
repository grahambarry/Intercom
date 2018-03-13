

    function run(click){
        initialize();
    }

/*-- Google Maps Stuff - One Call to getCustomers.setMapMarkersAndDetails();
        This setMapMarkersAndDetails(); function RETURNS a map markers array and a marker info array --*/
jQuery(function($) {
    // Asynchronously Load the map API 
    var scriptIntercom = document.createElement('script');
    scriptIntercom.src = "./dist/getCustomersWithinRadius_Bundled.js";
    document.body.appendChild(scriptIntercom);
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCi1PKeTpPXcya8V03GwtbGnrJzXI0pxNM&callback=initialize";
    document.body.appendChild(script);
});

//--Initializer -- Runs at start and Re-Runs with each User Input
async function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
           
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

    
    // Returns an Array of two arrays "Markers and MarkerInfo" From the function setMapMarkersAndDetails();
    let markersAndInfoReturnedArray = await setMapMarkersAndDetails();

    // Multiple Markers
    let markers = markersAndInfoReturnedArray[0];
                        
    // Info Window Content
    let infoWindowContent = markersAndInfoReturnedArray[1];
   
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);

            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen

        await map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    if (markers.length < 2){
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(10);
                google.maps.event.removeListener(boundsListener);
        });
    };
}