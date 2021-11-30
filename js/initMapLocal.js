const paris = { lat: 48.856614, lng: 2.3522219 };
let pos;
const defaultLat = "44";
const defaultLng = "2.44";

let googleMarkers = [];

//icon par defaut (clickMarkers et jsonMarkers)
const defaultIcon = "http://maps.google.com/mapfiles/kml/shapes/dining.png";
//Score par défaut (clickMarkers)
const defaultStars = 1;

let mySelectors = document.getElementsByName("scoreValues");

//Déclarer geolocalisation(), appelé depuis script HTML
function startGeoloc() {
  locationInfoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          adress: "",
        };
        //Appeler la création  de la carte
        initLocalMap();

        const marker = new google.maps.Marker({
          map: myMap,
          position: pos,
        });

        const content = `<div class="infoWindowGoogle">
                            <h3 class="h5">Votre position</h3>
                            <p class="h5">Latitude :  ${pos.lat} / Longitude : ${pos.lat}</p>
                        </div>`;
        google.maps.event.addListener(marker, "click", () => {
          locationInfoWindow.setContent(content);
          locationInfoWindow.open(map, marker);
        });
        locationInfoWindow.setPosition(pos);
        locationInfoWindow.setContent(content);
        locationInfoWindow.open(myMap, marker);
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
}
//Fin startGeoloc()

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function initLocalMap() {
  //Afficher la carte
  mapDiv = document.getElementById("map");
  myMap = new google.maps.Map(mapDiv, {
    zoom: 14,
    center: pos,
  });

  //Préparer un requête pour enrgistrer les données de restaurants autour de la zone indiquée
  const request = {
    location: pos,
    radius: 500,
    type: ["restaurant"],
  };
  // Demander un retour de service nearBy API à partir de la requête
  service = new google.maps.places.PlacesService(myMap);
  service.nearbySearch(request, callback);

  //Appeler de Nouveaux Markers si la carte est déplacée
  reLoadMarkers();
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createGoogleMarker(results[i]);
    }
  }
}

// Ajouter un marker sur la carte en fonction de la requête de lieu
function createGoogleMarker(place) {
  const photos = place.photos;

  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: myMap,
    id: place.place_id,
    position: place.geometry.location,
    lat: parseFloat(defaultLat),
    lng: parseFloat(defaultLng),
    icon: `${defaultIcon}`,

    coords: {
      lat: parseFloat(defaultLat),
      lng: parseFloat(defaultLng),
    },
    ratings: [
      {
        comment: "Pas de commentaire à jour",
        stars: Math.floor(place.rating * 1).toString(),
      },
    ],
    moyenneEntiere: Math.floor(place.rating * 1).toString(),
    restaurantName: place.name,
    adress: place.vicinity,
  });
  googleMarkers.push(marker);

  //création de InfoWindow pour un googlemarker
  google.maps.event.addListener(marker, "click", () => {
    const myInfoWindow = new google.maps.InfoWindow();
    
    let content = `
      <div class="infoWindowGoogle">
        <h3 id = "googleRestoName-${marker.id}"" class="h4">${place.name}</h3>
        <p class="h5">${place.vicinity}</p>
        <!--<p class="h5">${marker.position}</p>-->
        
        <p>Note moyenne :
            <span id = googleScore" class="badge badge-pill badge-success my-auto ml-2">${marker.ratings[0].stars}</span>
        </p>
        <p>Dernier commentaire :`; 
        if(!place.comment == 'undefined') {
            console.log ('tr');
            content += `<span id = googleComment">${place.comment}</span>`;
        } else {console.log ('undefined'); 
            content += ` <span id = googleComment"> ${marker.ratings[0].comment}</span>`;}
        content +=  `</p>
       
        <img class="rounded" src="${photos[0].getUrl({
          maxWidth: 75,
          maxHeight: 75,
        })}">
      </div>
      `;
    myInfoWindow.setContent(content);
    myInfoWindow.open(map, marker);
  });

  //Afficher google Markers séléctionnés
  for (
    mySelectorsIndex = 0;
    mySelectorsIndex < mySelectors.length;
    mySelectorsIndex++
  ) {
    mySelectors[mySelectorsIndex].addEventListener("click", function (e) {
      let selectedValue = e.target.value;
      for (let i = 0; i < googleMarkers.length; i++) {
        if (selectedValue == "All") {
          marker.setMap(myMap);
        } else if (selectedValue == marker.moyenneEntiere) {
          //console.log("markercontentGoogle", marker);
          marker.setMap(myMap);
        } else {
          //console.log("falseGoogle", googleMarkers[i].moyenneEntiere);
          marker.setMap(null);
        }
      }
    });
  }

  //Ajouter les données GoogleMarkers dans le tableau restaurants
  myMarkerDatas = {
    id:marker,
    position: marker.position,
    restaurantName: marker.restaurantName,
    lat: marker.position.toJSON().lat,
    long: marker.position.toJSON().lng,
    address: marker.adress,
    ratings: marker.ratings,
    //moyenneEntiere:marker.moyenneEntiere,
  };
  restaurants.push(myMarkerDatas);

  showRestaurants();
  toggleComments();
  toggleFormComment();
  addComments();
}

//Déclarer le rechargement des markers sur une zone limitée, en fonction d'un déplacement de la carte
function reLoadMarkers() {
  google.maps.event.addListener(myMap, "dragend", function () {
    // Effacer les anciens markers
    googleMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    //Réinitialiser les tableaux de stockage
    googleMarkers = [];
    restaurants = [];
    jsonMarkers = [];

    const myBounds = myMap.getBounds();
    const South_Lat = myBounds.getSouthWest().lat();
    const South_Lng = myBounds.getSouthWest().lng();
    const North_Lat = myBounds.getNorthEast().lat();
    const North_Lng = myBounds.getNorthEast().lng();

    const request = {
      bounds: myBounds,
      //bounds: which must be a google.maps.LatLngBounds
      type: ["restaurant"],
    };
    // Demander un retour de service nearBy API à partir de la requête
    service = new google.maps.places.PlacesService(myMap);
    service.nearbySearch(request, callback);
  });
}
