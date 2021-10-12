const section = document.querySelector("section");
let commentsHtml;
function showRestaurants() {
  /* Afficher les restaurants en fonction d'une liste JSON */

  // 1/ Construire la structure html
  result.innerHTML = "";

  // 2/ récupérer les données des restos dans le json restaurants
  for (let indexRestaurant in restaurants) {
    let UrlApi =
      "https://maps.googleapis.com/maps/api/streetview?size=200x200&location=" +
      restaurants[indexRestaurant].lat +
      "," +
      restaurants[indexRestaurant].long +
      "&fov=80&heading=70&pitch=0&key=AIzaSyDMAm0Z6pnqlSPV8LcE1JfPZpAy9hOlBic";

    let result = document.querySelector("#result");
    let ratings = restaurants[indexRestaurant].ratings;

    /* 3/ integrer aux éléments HTML les scores et commentaires de chaque restaurant */
    //3.1 déclarations
    commentsHtml = `<ul>`;
    let sommeNotesResto = 0;
    let nbRatings = ratings.length;
    let moyenneNoteRestaurant;

    for (let indexRating in ratings) {
      /* equivalent sans template string : commentsHtml += "<li>" + ratings[indexRating].stars + "étoiles <br/>" +  ratings[indexRating].comment + "</li>"*/
      commentsHtml += `<li>${ratings[indexRating].stars} ★ <br/> ${ratings[indexRating].comment}</li>`;
      sommeNotesResto += ratings[indexRating].stars;
    }
    // 3.2 calculer la note moyenne de chaque restaurant
    moyenneNoteRestaurant = sommeNotesResto / nbRatings;
    let moyenneEntiereRestaurant = Math.floor(moyenneNoteRestaurant);
    let moyenneArrondi = Math.floor(moyenneNoteRestaurant * 100) / 100;

    //3.3 fermeture HTML
    commentsHtml += `</ul>`;

    /* 4 / intégrer pour chaque restaurant un formulaire pour ajouter nouveau commentaire et nouveau score */
    let newCommentHTML = `
    <div class="form-comment my-2">
      <label for="name">Donnez votre score : </label>
      <div id="inputsAddScore">
        <div class="form-check form-check-inline">
          <input class="form-check-input addScore-${indexRestaurant}" type="radio" name="add_scoreValues" id="add_score1" value="1">
            <label class="form-check-label" for="score1">1</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input addScore-${indexRestaurant}" type="radio" name="add_scoreValues" id="add_score2" value="2">
          <label class="form-check-label" for="score2">2</label>
        </div>
        <div class="form-check form-check-inline">            
          <input class="form-check-input addScore-${indexRestaurant}" type="radio" name="add_scoreValues" id="add_score3" value="3">
          <label class="form-check-label" for="score3">3</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input addScore-${indexRestaurant}" type="radio" name="add_scoreValues" id="add_score4" value="4">
          <label class="form-check-label" for="score4">4</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input addScore-${indexRestaurant}" type="radio" name="add_scoreValues" id="add_score5" value="5">
          <label class="form-check-label" for="score5">5</label>
        </div>
      </div>
        
    <div class="form-comment my-2">
        <p class="mb-0">Votre commentaire : </p>
        <input id="comment-el-${indexRestaurant}" type="text" name="comment" placeholder="Ecrivez...">
    </div>
    <div class="form-comment">
      <button class="btn btn-info submitOpinion" id="addComment-btn-${indexRestaurant}" type="submit">Envoyez vos
      appréciations
      </button>
    </div>
  </div>
    `;

  let newCommentResultHTML = `
  <div class="container">
  <div class="row">
      <div class="col-6 p-2">
          <h4 class="h5 text-center">Commentaires</h4>
          <ul id="comments_ul-el-${indexRestaurant}" class="rounded p-4 text-center border border-dark"></ul>
      </div>
      <div class="col-6 p-2">
          <h4 class="h5 text-center">Scores</h4>
          <ul id="scores_ul-el-${indexRestaurant}" class="rounded p-4 text-center border border-dark"></ul>
      </div>
  </div>
</div>
  `;

    /* 5/ structure globale HTML */
    let restoHtml = `
    <div class="restaurant-wrapper restaurant-${moyenneEntiereRestaurant}">
  <!-- Afficher Nom resto et Bouton Avis -->
        <button class="label btn show-comments">
          ${restaurants[indexRestaurant].restaurantName}
          <a class="ml-3" href="#">Afficher les avis</a>
        </button>

<!-- Afficher Img et Adresse Resto  -->
        <div class="m-2 container">
          <div class="row">
            <div class="col-7">
              <img src ="${UrlApi}" class="img-fluid img-thumbnail">
              <span class="address">${restaurants[indexRestaurant].address}</span>
            </div>
            <!--Ajout de commentsHtml dans un div comments-wrapper ???-->
            <div class="comments hide col-5 text-center" id="comments-${indexRestaurant}">${commentsHtml}
            </div>
          </div>      
        </div>
        <!-- Afficher Note Moyenne Resto  -->
        <div class="comments-wrapper container">
          <div class="moyenne d-flex m-2"> Note moyenne : <span class="badge badge-pill badge-success my-auto ml-2" id="moyenneArrondi-${indexRestaurant}"> ${moyenneArrondi}</span></div>

          <!--Ajout de commentsHtml dans un div comments-wrapper-->
          <div class="comments hide" id="comments-${indexRestaurant}">${commentsHtml}</div>

        </div>
        <!-- Bouton Ajout Nouveau Avis  -->
        <div class="container text-center">
          <button class="btn add-comment border text-white">Donnnez votre avis !</button>
        </div>
        
        <div class="container hide add-comment-wrapper my-3 rounded" id="add_comment-${indexRestaurant}">
          <div class="row">
            <div class="col-12">
              <!-- Insertion du Formulaire Ajout d'avis -->
                ${newCommentHTML}  
            </div>
            <!-- Affichage des commentaires après submit  -->
            <div class="col-12 bg-success rounded-bottom resultComment-wrapper d-none">
              ${newCommentResultHTML}
            </div> 

          </div>
        </div>
    </div>
    `;
    /* 6 afficher le contenu HTML dans l'élément result */
    result.innerHTML += restoHtml;

    ratingValues = document.getElementsByName("addScore_Values");
    //console.log(`ratingvalue`, ratingValues);
  }
}

/* Récuperer les valeurs des inputs dans la sélection de score */
function selectScores() {
  let formInputs = document.getElementsByName("scoreValues");

  for (let k = 0; k < formInputs.length; k++) {
    formInputs[k].addEventListener("click", function (e) {
      //recupération des valeurs à chaque input
      let valueSelected = this.value;
      let target = e.target;
      let restos = document.getElementsByClassName("restaurant-wrapper");

      handleRestoValue(restos, valueSelected);

      let comments = document.getElementsByClassName("comments");
      // Cacher les commentaires à chaque click d'input
      for (
        let indexComment = 0;
        indexComment < comments.length;
        indexComment++
      ) {
        comments[indexComment].classList.add("hide");
      }
    });
  }

  // chargement de la page
  for (let k = 0; k < formInputs.length; k++) {
    if (formInputs[k].checked) {
      let valueSelected = formInputs[k].value;
      let restos = document.getElementsByClassName("restaurant-wrapper");

      handleRestoValue(restos, valueSelected);
    }
  }
}

function handleRestoValue(restos, valueSelected) {
  // on affiche les restos en fonction de la valeur selected avec ajout / suppression de la classe hide
  console.log(valueSelected);
  if (valueSelected == "All") {
    for (let indexResto = 0; indexResto < restos.length; indexResto++) {
      if (restos[indexResto].classList.contains("hide")) {
        restos[indexResto].classList.remove("hide");
      }
    }
  } else {
    for (let indexResto = 0; indexResto < restos.length; indexResto++) {
      if (
        restos[indexResto].classList.contains("restaurant-" + valueSelected)
      ) {
        restos[indexResto].classList.remove("hide");
      } else {
        restos[indexResto].classList.add("hide");
      }
    }
  }
}

showRestaurants();
selectScores();
