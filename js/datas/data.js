//Calcul  de la moyenne des notes de chaque restaurants
//array to store all markers
let jsonMarkers = [];
let moyenneArrondi;
let moyenneEntiereRestaurant;

//set default star content for iconImage
const defaultIcon = "http://maps.google.com/mapfiles/kml/shapes/dining.png";

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

  console.log(`moyenneNoteRestaurant`, moyenneNoteRestaurant)
    moyenneEntiereRestaurant = Math.floor(moyenneNoteRestaurant);
    moyenneArrondi = Math.floor(moyenneNoteRestaurant * 100) / 100;


  //intégration des valeurs des restaurants dans un objet newMarker
  let newMarker = {
    coords: {
      lat: parseFloat(`${restaurants[3].lat}`),
      lng: parseFloat(`${restaurants[0].long}`),
    },
    iconImage: defaultIcon,
    content: restaurants[3].restaurantName,
    ratings: [
      {
        comment: restaurants[0].ratings[0].comment,
        stars: restaurants[0].ratings[0].stars,
      },
    ],
    moyenneEntiere: moyenneEntiereRestaurant,
  };
  newMarker.coords.lat = parseFloat(`${restaurants[indexRestaurant].lat}`);
  newMarker.coords.lng = parseFloat(`${restaurants[indexRestaurant].long}`);
  newMarker.content = `
  <div class="container">
    <div class="row">
      <div class="col-12"> 
        <h4 class="font-weight-bold">${restaurants[indexRestaurant].restaurantName}</h4>
      </div>
      <div class="col-6">
        <p>${restaurants[indexRestaurant].address}</p>
      </div>  
      <div class="col-6 m-auto">
        <p><span class="badge badge-pill badge-success my-auto p-2">${moyenneArrondi}</span></p>
      </div>
    </div>  
  </div> 
      `;
  newMarker.ratings[0].comment =
    restaurants[indexRestaurant].ratings[0].comment;
  
  jsonMarkers.push(newMarker);
}
