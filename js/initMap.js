const paris = { lat: 48.856614, lng: 2.3522219 };
let pos; 

const defaultLat = "44";
const defaultLng = "2.44";



///
let jsonMarkers = [];
let googleMarkers = [];
let clickMarkers = [];
let moyenneArrondi;
let moyenneEntiereRestaurant;
let mapDiv;
let myMap;
let service;
let myMarkerDatas;
let myLabel;
let myScore;
let newMarker;



//icon par defaut (clickMarkers et jsonMarkers)
const defaultIcon = "http://maps.google.com/mapfiles/kml/shapes/dining.png";
//Score par défaut (clickMarkers)
const defaultStars = 1;

let mySelectors = document.getElementsByName("scoreValues");

function initMap() {
  //Afficher la carte
  mapDiv = document.getElementById("map");
  myMap = new google.maps.Map(mapDiv, {
    zoom: 12,
    center: paris,
   
  });
 
  //Dès l'ouverture Afficher des restos depuis le service API
  const request = {
    location: paris,
    radius: 500,
    type: ["restaurant"],
  };
  // Demander un retour de service nearBy API à partir de la requête
 /*   service = new google.maps.places.PlacesService(myMap);
  service.nearbySearch(request, callback); */

  //Dès l'ouverture Afficher sur la carte un marker pour chaque resto depuis la liste fournie restaurants /js/datas/listRestaurants.js
  for (
    let indexRestaurant = 0;
    indexRestaurant < restaurants.length;
    indexRestaurant++
  ) {
    //1ère étape : calcul  de la moyenne des notes de chaque restaurants
    let ratings = restaurants[indexRestaurant].ratings;
    let sommeNotesResto = 0;
    let nbRatings = ratings.length;

    let UrlApi =
      "https://maps.googleapis.com/maps/api/streetview?size=200x200&location=" +
      restaurants[indexRestaurant].lat +
      "," +
      restaurants[indexRestaurant].long 
      // + APIKEY ""
      ;

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

    // 6 restos sont affichés

    //création de InfoWindow pour un marker json
    google.maps.event.addListener(marker, "click", () => {
      const myInfoWindow = new google.maps.InfoWindow();
      console.log(`object`, UrlApi);
      const content = `
      <div class="text-success container">
        <div class="row">
          <div class="col-8">
            <h3 class="h4">${restaurants[indexRestaurant].restaurantName}</h3>
          </div>
          <div class="col-4">
          <p></p>
            <img src ="${UrlApi}" class="img-fluid w-50 img-thumbnail">
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="font-weight-bold">${
              restaurants[indexRestaurant].address
            }</p></div>
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

  //Creer un marker pour chaque resto depuis la liste jSon fournie
  /*   for (let markerIndex = 0; markerIndex < jsonMarkers.length; markerIndex++) {
    addMarker(jsonMarkers[markerIndex]);
  } */

  showRestaurants();
  toggleComments();
  toggleFormComment();
  addComments();

  //Afficher à chaque rechargement de la carte des markers sur une zone limitée
  google.maps.event.addListener(myMap, "dragend", function () {
    // Effacer les anciens markers
    googleMarkers.forEach((marker) => {
      marker.setMap(null);
    });

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

  const geocoder = new google.maps.Geocoder();

  // ajouter un nouveau marker au click sur la carte
  myMap.addListener("click", (event) => {
    newMarker = {
    //définition visuelle d'un nouveau marker
    adress: "test",
    moyenneEntiere: `${defaultStars}`,
    coords: event.latLng,
    iconImage: `${defaultIcon}`,
    content:  defaultStars,
    ratings: [
      {
        comment: "mouif",
        stars: `${defaultStars}`,
      },
    ]
  };
    //afficher une adresse depuis des donnees 
    geocoder.geocode({ location: newMarker.coords }).then((response) => {
      if (response.results[0]) {
        newMarker.adress = response.results[0].formatted_address;
      }
      addMarker({
        adress: event.address,
        coords: event.latLng,
        content: `<h3>Votre nouveau marker</h3>
        <p id ="adress-el" class="text-center">${newMarker.adress}</p>
        <div class="m-2">
            <p>
                <span id="defaultLabel-el" class="m-2">Note par défaut : </span>
                <span id="defaultScore-el" class="badge badge-pill badge-success my-auto ml-2"> ${newMarker.moyenneEntiere}</span>
            </p>
        </div>
        <button class="mx-2 btn" onclick="showForm()">Donnez votre avis !</button>
        <div id="newForm"></div>`
        ,
        moyenneEntiere: "par defaut",  
        iconImage: `${defaultIcon}`,
        ratings: [
          {
            comment: "moui3",
            //ce qui est envoyé comme moyenne default
            stars: `${defaultStars}`,
          },
        ],
      });
    });
    clickMarkers.push(newMarker);
    console.log(`clickMarkers`, clickMarkers)
    //ici totalité des markers ajoutés au click
  });
}

/* Fin initMap */

//GOOGLE MARKERS
//Afficher les marker en fonction du service API
const callback = (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
    for (let i = 0; i < results.length; i++) {
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
    lat: parseFloat(defaultLat),
    lng: parseFloat(defaultLng),

    coords: {
      lat: parseFloat(defaultLat),
      lng: parseFloat(defaultLng),
    },
    ratings: [
      {
        comment: "testComment",
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
    const content = `
    <div class="infoWindowGoogle">
      <h3 id = "googleRestoName" class="h4">${place.name}</h3>
      <p class="h5">${place.vicinity}</p>
      <!--<p class="h5">${marker.position}</p>-->
      <p>Note moyenne : <span id = googleScore" class="badge badge-pill badge-success my-auto ml-2">${
        place.rating
      }</span></p>
      <p>Dernier commentaire : <span id = googleComment">${
        place.comment
      }</span></p>
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

//CLICK MARKERS
// ajouter marker sur la carte
function addMarker(props) {
  const marker = new google.maps.Marker({
    adress: props.adress,
    position: props.coords,
    map: myMap,
    ratings: props.ratings,
    //content: props.ratings[0].stars,
    iconImage: props.iconImage,
    moyenneEntiere: props.moyenneEntiere,
  });
  console.log(`marker`, marker);
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
