// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
const paris = { lat: 48.856614, lng: 2.3522219 };

const defaultLat = "44";
const defaultLng = "2.44";
let map;
let googleMarkers = [];
let searchBoxMarkers = [];
let commentsHtml;

const defaultIcon = "http://maps.google.com/mapfiles/kml/shapes/dining.png";


function initAutocomplete() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: paris,
    zoom: 14,
    mapTypeId: "roadmap",
  });

  //Dès l'ouverture, instancier un élément myInfoResto et un Marker pour chaque élément de [restaurants]
  //ici intégrer fonction pour relancer comptage de indexRestaurant
  resetRestaurantsArray()
  function resetRestaurantsArray() {
  for (let indexRestaurant in restaurants) {
    let scores = [];
    let comments = [];
    let nBComments;
    let lastComment;

    let sommeNotesResto = 0;
    commentsHtml = `<ul class="bg-second rounded">`;

    InfoRestosRatings = restaurants[indexRestaurant].ratings;

    for (let indexRating in InfoRestosRatings) {
      scores.push(InfoRestosRatings[indexRating].stars);
      comments.push(InfoRestosRatings[indexRating].comment);
      sommeNotesResto += InfoRestosRatings[indexRating].stars;
      commentsHtml += `<li class= "p-1">${InfoRestosRatings[indexRating].stars} ★ <br/> ${InfoRestosRatings[indexRating].comment}</li>`;
    }
    commentsHtml += `</ul>`;

    restaurants[indexRestaurant]["scores"] = scores;
    //restaurants[indexRestaurant]["comments"] = comments;
    restaurants[indexRestaurant]["comments"] = commentsHtml;
    nBComments = comments.length;
    lastComment = comments[nBComments - 1];
    restaurants[indexRestaurant].lastComment = lastComment;
    restaurants[indexRestaurant]["moyenne"] = Math.floor(
      sommeNotesResto / scores.length
    );
    restaurants[indexRestaurant]["UrlApi"] =
      "https://maps.googleapis.com/maps/api/streetview?size=200x200&location=" +
      restaurants[indexRestaurant].lat +
      "," +
      restaurants[indexRestaurant].long + "&fov=80&heading=70&pitch=0&key=" +
      APIKEY;

    const myInfoResto = new InfoRestos(
      [indexRestaurant],
      restaurants[indexRestaurant].restaurantName,
      restaurants[indexRestaurant].address,
      restaurants[indexRestaurant].lat,
      restaurants[indexRestaurant].long,
      restaurants[indexRestaurant].moyenne,
      restaurants[indexRestaurant].UrlApi,
      restaurants[indexRestaurant]["comments"],
      restaurants[indexRestaurant].lastComment
    );
    myInfoResto.displayInfos();// afficher infos dans colonne droite
    myInfoResto.toggleComments();//montrer / cacher les commentaires pour un resto
    myInfoResto.createMarker();//instancier marker et infoWindow
    myInfoResto.toggleFormComments();//afficher/ cacher le formulaire d'ajout de commetaire
    myInfoResto.addCommentForm();//créer un formulaire
    myInfoResto.addNewComment();//ajouter un commentaire
    
   

    //Afficher à chaque rechargement de la carte des markers sur une zone limitée
    google.maps.event.addListener(map, "dragend", function () {
      // Effacer les anciens markers
      googleMarkers.forEach((marker) => {
        marker.setMap(null);
      });

      googleMarkers = [];
 
      restaurants = [];

      searchBoxMarkers = [];

      const myBounds = map.getBounds();
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
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    });

//GOOGLE MARKERS

//Afficher les marker en fonction du service API
const callback = (results, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);

    }
  }
};

//Creation de markers pour Search Box ,Google Place et Click sur carte
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) {
    console.log("Returned place contains no geometry");
    return;
  }
  const photos = place.photos;
  const icon = {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25),
  };
  const marker = new google.maps.Marker({
    map: map,
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

  var prev_infoWindow;
  //console.log(`prev_infoWindow`, prev_infoWindow)
  google.maps.event.addListener(marker, "click", () => {
    if (prev_infoWindow) {
      prev_infoWindow.close();
    }
    const myInfoWindow = new google.maps.InfoWindow();
    const content = `
    <div class="infoWindowGoogle">
      <h3 id = "googleRestoName" class="h4">${place.name}</h3>
      <p class="h5">${place.vicinity}</p>
      <!--<p class="h5">${marker.position}</p>-->
      <p>Note moyenne : 
        <span id = googleScore" class="badge badge-pill badge-success my-auto ml-2">${place.rating}
        </span>
      </p>
      <p>Dernier commentaire : <span id = googleComment">${place.comment}
        </span>
      </p>
      <img class="rounded" src="${photos[0].getUrl({
        maxWidth: 75,
        maxHeight: 75,
      })}">
    </div>
    `;
    myInfoWindow.setContent(content);
    myInfoWindow.open(map, marker);
    prev_infoWindow = myInfoWindow;
  });
  restaurants.push(marker);

  //instancier infoRestos();
}
  }
}

  /* SEARCHBOX */

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    searchBoxMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    googleMarkers = [];
    restaurants = [];
    searchBoxMarkers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      createMarker(place);
      //ICI tableau searchBoxMarkers intègre les nouveaux markers;
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


function reLoad () {
  console.log(newRating, restaurants);
}

