const paris = { lat: 48.856614, lng: 2.3522219 };

let jsonMarkers = [];
let googleMarkers = [];
let clickMarkers = [];
let moyenneArrondi;
let moyenneEntiereRestaurant;
let mapDiv;
let myMap;
let service;


//icon par defaut (clickMarkers et jsonMarkers)
const defaultIcon = "http://maps.google.com/mapfiles/kml/shapes/dining.png";
//Score par défaut (clickMarkers)
const defaultStars = 1;

let mySelectors = document.getElementsByName("scoreValues");

//Sources

//https://www.weboblog.fr/recuperer-les-limites-de-la-carte-getbounds-v3
//https://stackoverflow.com/questions/40880117/what-is-the-purpose-of-latlngbounds-in-geodataapi-getautocompletepredictions
//https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds
// nearBy request w/ json https://developers.google.com/maps/documentation/places/web-service/search-nearby

function initMap() {
  //afficher la carte
  mapDiv = document.getElementById("map");
  myMap = new google.maps.Map(mapDiv, {
    zoom: 12,
    center: paris,
  });

  //afficher dès l'ouverture et chaque recharcgemt de la carte des markers restaurant sur une zone limitée
  google.maps.event.addListener(myMap, "tilesloaded", function () {
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
    // demander un retour de service nearBy API à partir de la requête
    service = new google.maps.places.PlacesService(myMap);
    service.nearbySearch(request, callback);
  });

  //appeler la geolocalisation
  geolocalisation();

  //Creer un marker pour chaque resto depuis la liste fournie
  for (
    let indexRestaurant = 0;
    indexRestaurant < restaurants.length;
    indexRestaurant++
  ) {
    //Calcul  de la moyenne des notes de chaque restaurants
    let ratings = restaurants[indexRestaurant].ratings;
    let sommeNotesResto = 0;
    let nbRatings = ratings.length;

    for (let indexRating in ratings) {
      sommeNotesResto += ratings[indexRating].stars;
    }

    let moyenneNoteRestaurant = sommeNotesResto / nbRatings;
    let moyenneEntiereRestaurant = Math.floor(moyenneNoteRestaurant);
    let moyenneArrondi = Math.floor(moyenneNoteRestaurant * 100) / 100;

    //2nde étape : distribuer pour chaque restaurant un marqueur en fonction de ses coordonnnées
    const latLng = new google.maps.LatLng(
      restaurants[indexRestaurant].lat,
      restaurants[indexRestaurant].long
    );
    const marker = new google.maps.Marker({
      position: latLng,
      map: myMap,
      icon: `${defaultIcon}`,
      moyenneEntiere: moyenneEntiereRestaurant,
    });
    marker.setVisible(true);
    jsonMarkers.push(marker);

    google.maps.event.addListener(marker, "click", () => {
      //création de InfoWindow pour un marker
      const myInfoWindow = new google.maps.InfoWindow();
      const content = `
      <div class="text-success container">
        <div class="row">
          <div class="col-8">
            <h3 class="h4">${restaurants[indexRestaurant].restaurantName}</h3>
          </div>
          <div class="col-4">
            <img src ="${UrlApi}" class="img-fluid w-50 img-thumbnail">
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="font-weight-bold">${restaurants[indexRestaurant].address}</p></div>
          <div class="col-12">
            <p>Note moyenne : <span class="badge badge-pill badge-success my-auto ml-2">${moyenneArrondi}</span></p>
            </div>
            <div class="col-12">
            <p>Dernier commentaire : <span class="font-italic text-dark">${
              ratings[nbRatings - 1].comment
            }</span></p>
            </div>
        </div>
    </div>
      `;
      myInfoWindow.setContent(content);
      myInfoWindow.open(map, marker);
    });

   //Afficher jsonMarkers séléctionnés
    for (
      mySelectorsIndex = 0;
      mySelectorsIndex < mySelectors.length;
      mySelectorsIndex++
    ) {
      mySelectors[mySelectorsIndex].addEventListener("click", function (e) {
        let selectedValue = e.target.value;
        for (let i = 0; i < jsonMarkers.length; i++) {
          //console.log(jsonMarkers[i].moyenneEntiere);
          if (selectedValue == "All") {
            marker.setMap(myMap);

          } else if (selectedValue == marker.moyenneEntiere) {
            marker.setMap(myMap);

          } else {
            marker.setMap(null);

          }
        }
      });
    }
  }
  //Creer un marker pour chaque resto depuis la liste fournie
  for (let markerIndex = 0; markerIndex < jsonMarkers.length; markerIndex++) {
    addMarker(jsonMarkers[markerIndex]);
  }

  // ajouter un nouveau marker au click sur la carte
  myMap.addListener("click", (event) => {
    let newMarker = {};
    //définition visuelle d'un nouveau marker
    newMarker.moyenneEntiere = `${defaultStars}`;
    newMarker.coords = event.latLng;
    newMarker.iconImage = `${defaultIcon}`;
    newMarker.content = "testDefault";
    newMarker.ratings = [
      {
        comment: "mouif",
        stars: `${defaultStars}`,
      },
    ];
    addMarker({
      coords: event.latLng,
      content:
        "<h3>Votre nouveau marker</h3>" +
        //JSON.stringify(event.latLng.toJSON(), null, 2) +
        `<p>Note par défaut : <span class="badge badge-pill badge-success my-auto ml-2"> ${newMarker.moyenneEntiere}</span></p>`,
      iconImage: `${defaultIcon}`,
      ratings: [
        {
          comment: "moui3",
          //ce qui est envoyé comme moyenne default
          stars: `${defaultStars}`,
        },
      ],
    });
    clickMarkers.push(newMarker);
    //ici totalité des markers ajoutés au click
  });

}

/* Fin initMap */

//GOOGLE MARKERS
//Afficher les marker en fonction du service
const callback = (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
    for (let i = 0; i < results.length; i++) {
      //console.log(results[i], 'results[i]');
      createGoogleMarker(results[i]);
    }
  }
};
// ajouter un marker sur la carte en fonction de la requête de lieu
function createGoogleMarker(place) {
  const photos = place.photos;
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map: myMap,
    position: place.geometry.location,
    moyenneEntiere: Math.floor(place.rating * 1).toString(),
  });

  googleMarkers.push(marker);

  google.maps.event.addListener(marker, "click", () => {
    //création de InfoWindow pour un marker
    const myInfoWindow = new google.maps.InfoWindow();
    const content = `
    <div>
      <h3 class="h4">${place.name}</h3>
      <p class="h5">${place.vicinity}</p>
      <p>Note moyenne : <span class="badge badge-pill badge-success my-auto ml-2">${
        place.rating
      }</span></p>
      <img src="${photos[0].getUrl({ maxWidth: 75, maxHeight: 75 })}">
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
}

//CLICK MARKERS
// ajouter marker sur la carte
function addMarker(props) {
  const marker = new google.maps.Marker({
    position: props.coords,
    map: myMap,
    ratings: props.ratings,
    //content: props.ratings[0].stars,
    iconImage: props.iconImage,
    moyenneEntiere: props.moyenneEntiere,
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

  //show clickMarkers on selected input
  for (
    mySelectorsIndex = 0;
    mySelectorsIndex < mySelectors.length;
    mySelectorsIndex++
  ) {
    mySelectors[mySelectorsIndex].addEventListener("click", function (e) {
      let selectedValue = e.target.value;
      for (let i = 0; i < clickMarkers.length; i++) {
        if (selectedValue == "All") {
          marker.setMap(myMap);
        } else if (selectedValue == clickMarkers[i].moyenneEntiere) {
          marker.setMap(myMap);
        } else {
          marker.setMap(null);
        }
      }
    });
  }
}



//déclarer geolocalisation()
function geolocalisation() {
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
          locationInfoWindow.setContent("Voici votre position");
          locationInfoWindow.open(myMap);
          myMap.setCenter(pos);
        },
        () => {
          handleLocationError(true, locationInfoWindow, myMap.getCenter());

  //afficher dès l'ouverture et chaque rechargement de la carte des markers restaurant sur une zone limitée
  google.maps.event.addListener(myMap, "tilesloaded", function () {
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
    // demander un retour de service nearBy API à partir de la requête
    service = new google.maps.places.PlacesService(myMap);
    service.nearbySearch(request, callback);
  });
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
