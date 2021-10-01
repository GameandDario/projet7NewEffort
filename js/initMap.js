const paris = { lat: 48.856614, lng: 2.3522219 };
let mapDiv;
let myMap;
let service;
let allAddedMarkers =[];
let markers = [];

//set default star content for Rating
const defaultStars = 2;
//set default star content for iconImage
const defaultIcon = "http://maps.google.com/mapfiles/kml/shapes/dining.png";

//Sources

//https://www.weboblog.fr/recuperer-les-limites-de-la-carte-getbounds-v3
//https://stackoverflow.com/questions/40880117/what-is-the-purpose-of-latlngbounds-in-geodataapi-getautocompletepredictions
//https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds
// nearBy request w/ json https://developers.google.com/maps/documentation/places/web-service/search-nearby?hl=en#Bounds
function initMap() {
  //afficher la carte
  mapDiv = document.getElementById("map");
  myMap = new google.maps.Map(mapDiv, {
    zoom: 14,
    center: paris,
  });

  google.maps.event.addListener(myMap, "tilesloaded", function () {
    const myBounds = myMap.getBounds();
    const South_Lat = myBounds.getSouthWest().lat();
    const South_Lng = myBounds.getSouthWest().lng();
    const North_Lat = myBounds.getNorthEast().lat();
    const North_Lng = myBounds.getNorthEast().lng();

    const request = {
      bounds: myBounds,
      //bounds: which must be a google.maps.LatLngBounds
      fields: [
        "name",
        "formatted_address",
        /* "place_id", */
        "geometry",
        "openNow",
        "restaurants",
      ],
    };

    // demander un retour de service nearBy API à partir de la requête
    service = new google.maps.places.PlacesService(myMap);
    service.nearbySearch(request, callback);
  });
    //Ajout localisation
  localisation()

  // This event listener will call addMarker() when the map is clicked.
  myMap.addListener("click", (event) => {
    let newMarker = {};
    addMarker({
      coords: event.latLng,
      content:
        "<h3>Votre nouveau marker</h3>" +
        JSON.stringify(event.latLng.toJSON(), null, 2) +
        `<p>${defaultStars}</p>`,
      iconImage: `${defaultIcon}`,
      ratings: [
        {
          comment: "moui3",
          //ce qui est envoyé comme moyenne default
          stars: `${defaultStars}`,
        },
      ],
    });
    //définition visuelle d'un nouveau marker
    newMarker.coords = event.latLng;
    newMarker.iconImage = `${defaultIcon}`;
    newMarker.content = `${defaultStars}`;
    newMarker.ratings = [
      {
        comment: "mouif",
        stars: `${defaultStars}`,
      },
    ];
    console.log(`newMarkerStars`, newMarker.ratings[0].stars);
    console.log(`newMarkerComment`, newMarker.ratings[0].comment);
    markers.push(newMarker);
    //ici totalité des markers ajoutés au click
    allAddedMarkers = markers;
    console.log(`allmarkers`, allAddedMarkers);

  });
}
/* Fin initMap */



 // ajouter un marker sur la carte en fonction de la requête de lieu
 function createMarker(place) {
  const photos = place.photos;
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: myMap,
    position: place.geometry.location,
    title: place.name,
  });
  google.maps.event.addListener(marker, "click", () => {
    //création de InfoWindow pour un marker
    const myInfoWindow = new google.maps.InfoWindow();

    const content = document.createElement("div");
    
    const nameElement = document.createElement("h2");
    nameElement.textContent = place.name;
    content.appendChild(nameElement);

    const placeIsOpenElement = document.createElement("p");
    placeIsOpenElement.textContent = place.openNow;
    content.appendChild(placeIsOpenElement);
ls
    const placePhotoElement = document.createElement("img");
    placePhotoElement.src = photos[0].getUrl({ maxWidth: 55, maxHeight: 55 });
    content.appendChild(placePhotoElement);

    myInfoWindow.setContent(content);
    myInfoWindow.open(map, marker);
  });
}

//Afficher les marker en fonction du service
const callback = (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
    //myMap.setCenter(results[0].geometry.location);
  }
}

function localisation(){
  locationInfoWindow = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");
  
    locationButton.textContent = "Se déplacer sur votre lieu géolocalisé";
    locationButton.classList.add("custom-map-control-button");
    myMap.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,

            };
            locationInfoWindow.setPosition(pos);
            locationInfoWindow.setContent('Voici votre position');
            locationInfoWindow.open(myMap);
            myMap.setCenter(pos);
          },
          () => {
            handleLocationError(true, locationInfoWindow, myMap.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, locationInfoWindow, myMap.getCenter());
      }
    });
  }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


// create marker on map
function addMarker(props) {
  // The marker, positioned at Paris
  const marker = new google.maps.Marker({
    position: props.coords,
    map: myMap,
    ratings: props.ratings,
    content: props.ratings[0].stars,
    iconImage: props.iconImage,
    //moyenneEntiere: props.moyenneEntiere,
    moyenneEntiere: 3,
  });

  marker.setVisible(true);

  //check for custom icon not undefined
  if (props.iconImage) {
    marker.setIcon(props.iconImage);
  }
  if (props.moyenneEntiere) {
    marker.moyenneEntiere = props.moyenneEntiere;
  }
  //check for infoWindow content not undefined
  if (props.content) {
    //add  infoWindow
    const markerInfoWindow = new google.maps.InfoWindow({
      content: props.content,
    });
    //show infoWindow on click
    marker.addListener("click", () => {
      markerInfoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }

  let markersOnMap = allAddedMarkers;
  markersOnMap.push(marker);
  console.log(`markersOnMapArray`, markersOnMap);
}