const x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}


function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }

  function showPosition(position) {
    let latlon = position.coords.latitude + "," + position.coords.longitude;
  
    let img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=APIKEY";
  
    let myMap = document.getElementById("mapholder");
    myMap.innerHTML = "<img src='"+img_url+"'>";
    const marker = new googleMarkers.maps.Marker({
        position:latlon,
        map: myMap,
        title: "Vous êtes ici"
    });
  }