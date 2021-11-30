const section = document.querySelector("section");
let result = document.querySelector("#result");


let newRating;
//ne récup^ère pas les donn ées pour chaque resto => tableau AllMarkers contenant infos mises à jour si nouveau commmentaire   

class InfoRestos {
  constructor(
    InfoRestosId,
    InfoRestosName,
    InfoRestosAdress,
    InfoRestosLat,
    InfoRestosLng,
    InfoRestosMoyenne,
    InfoRestosUrlApi,
    InfoRestosComments,
    InfoRestosLastComment
  ) {
    this.InfoRestosId = InfoRestosId;
    this.InfoRestosName = InfoRestosName;
    this.InfoRestosAdress = InfoRestosAdress;
    this.InfoRestosLat = InfoRestosLat;
    this.InfoRestosLng = InfoRestosLng;
    this.InfoRestosMoyenne = InfoRestosMoyenne;
    this.InfoRestosUrlApi = InfoRestosUrlApi;
    this.InfoRestosComments = InfoRestosComments;
    this.InfoRestosLastComment = InfoRestosLastComment;
  }

  //methods()
  displayInfos() {
    let classHtml = `
    <div class="text-black-50 bg-light rounded restaurant-wrapper container p-2 m-2 restaurant-${this.InfoRestosMoyenne}">
    <div class="row m-2 justify-content-center align-items-center bg-primary rounded p-1">
        <div class="col-8">
            <button class="btn show-comments shadow">
                <h3 class="h4 h4 m-auto text-white">${this.InfoRestosName}</h3>
            </button>
        </div>
        <div class="col-4 p-1">
            <img src=" ${this.InfoRestosUrlApi}" class="img-fluid rounded border">
        </div>
    </div>
    <div class="row m-2 border rounded">
        <div class="col-12">
            <p class="font-weight-bold">${this.InfoRestosAdress}</p>
        </div>
        <div class="col-12">
            <p>Note moyenne : <span class="badge badge-pill badge-success my-auto ml-2"
                    id="defaultScore-el-${this.InfoRestosId}">${this.InfoRestosMoyenne}</span></p>
        </div>
        <div class="col-12">
            <p>Dernier commentaire : <span class="font-italic font-weight-bold" id="lastComment-${this.InfoRestosId}">${this.InfoRestosLastComment}</span></p>
        </div>
        <!--Ajout de commentsHtml dans un div comments-wrapper ???-->
        <div class="comments hide col-12" id="comments-${this.InfoRestosId}">${this.InfoRestosComments}</div>
        <div class="col-12">

            <!-- Bouton Ajout Nouveau Avis  -->
            <div class="container text-center">
                <button class="btn border add-comment">Donnez votre avis !</button>
            </div>
            <div id="myForm-${this.InfoRestosId}">

            </div>
        </div>
    </div>
    `;
    result.innerHTML += classHtml;
  }

  toggleComments() {
    let myButtons = document.getElementsByClassName("show-comments");
    let myCommentsID;
    /* myButtons est un HTMLCollection -> possibilité de manipuler comme un tableau */
    for (let k = 0; k < myButtons.length; k++) {
      myButtons[k].addEventListener("click", function () {
        myCommentsID = document.getElementById("comments-" + k);
        /* TODO ajouter test sur myMarkersID.classList.contains('hide')*/
        if (myCommentsID.classList.contains("hide")) {
          myCommentsID.classList.remove("hide");
        } else {
          myCommentsID.classList.add("hide");
        }
      });
    }
  }
  addCommentForm() {
    let myFormEl = document.getElementById("myForm-" + this.InfoRestosId);
    myFormEl.innerHTML = `
    <div class="container hide add-comment-wrapper my-3 rounded" id="add_comment-${this.InfoRestosId}">
    <div class="row p-3" id="newForm-${this.InfoRestosId}">
        <div class="form-comment my-2">
            <label for="name">Donnez votre score : </label>
            <div id="inputsAddScore">
                <div class="form-check form-check-inline">
                    <input class="form-check-input addScore" type="radio"
                        name="add_scoreValues" id="add_score1" value="1">
                    <label class="form-check-label" for="score1">1</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input addScore" type="radio"
                        name="add_scoreValues" id="add_score2" value="2">
                    <label class="form-check-label" for="score2">2</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input addScore" type="radio"
                        name="add_scoreValues" id="add_score3" value="3">
                    <label class="form-check-label" for="score3">3</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input addScore" type="radio"
                        name="add_scoreValues" id="add_score4" value="4">
                    <label class="form-check-label" for="score4">4</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input addScore" type="radio"
                        name="add_scoreValues" id="add_score5" value="5">
                    <label class="form-check-label" for="score5">5</label>
                </div>
            </div>

            <div class="form-comment my-2">
                <p class="mb-0">Votre commentaire : </p>
                <input id="comment-el-${this.InfoRestosId}" class="comment-el" type="text" name="comment"
                    placeholder="Ecrivez...">
            </div>
            <div class="form-comment">
                <button class="btn btn-info submitOpinion" id="addComment-btn-${this.InfoRestosId}"
                    type="submit">Envoyez vos
                    appréciations
                </button>
            </div>
        </div>
    </div>
</div>
    `;
  }

  toggleFormComments() {
    let myAddCommentButtons = document.getElementsByClassName("add-comment");
    let myFormCommentID;
    for (let i = 0; i < myAddCommentButtons.length; i++) {
      myAddCommentButtons[i].addEventListener("click", function () {
        myFormCommentID = document.getElementById("add_comment-" + i);
        //test : au clic, si la classe hide est présente, la retirer, sinon l'ajouter sur l'élément
        if (myFormCommentID.classList.contains("hide")) {
          myFormCommentID.classList.remove("hide");
        } else {
          myFormCommentID.classList.add("hide");
        }
      });
    }
  }
  addNewComment() {
    let myScoreInputs = document.getElementsByClassName("addScore");
    let valueSelected;
    let newScore;
    let newComment;
    for (
      let indexScoreInputs = 0;
      indexScoreInputs < myScoreInputs.length;
      indexScoreInputs++
    ) {
      myScoreInputs[indexScoreInputs].addEventListener("click", function () {
        valueSelected = myScoreInputs[indexScoreInputs].value;
        newScore = parseInt(valueSelected);
      });
    }
    let submitBtns = document.getElementsByClassName("submitOpinion");
    for (let index = 0; index < submitBtns.length; index++) {
      submitBtns[index].addEventListener("click", function () {
        let inputComment = document.getElementById("comment-el-" + [index]);
        newComment = inputComment.value;
        let myCommentsBox = document.getElementById("comments-" + [index]);
        let lastComment = document.getElementById("lastComment-" + [index]);
        let moyenneBox = document.getElementById("defaultScore-el-" + [index]);
        //console.log(newRating + newComment)
        newRating = `<li class="p-1">${newScore} ★ <br/>${newComment}</li>`;
        myCommentsBox.lastElementChild.innerHTML += newRating;
        lastComment.innerHTML = newComment;
        let currentMoyenne = parseInt(moyenneBox.innerText);
        moyenneBox.innerHTML = Math.floor((currentMoyenne + newScore)/2);
      });
    }
  }


  createMarker() {
    const latLng = new google.maps.LatLng(
      this.InfoRestosLat,
      this.InfoRestosLng
    );
    const marker = new google.maps.Marker({
      id: this.InfoRestosId,
      position: latLng,
      map: map,
      icon: `${defaultIcon}`,
      moyenneEntiere: this.InfoRestosMoyenne,
    });
    marker.setVisible(true);

    var prev_infoWindow;
    //.close() ne fonctionnne pas sur let et const
    google.maps.event.addListener(marker, "click", () => {
      if (prev_infoWindow) {
        prev_infoWindow.close();
      }
      const myInfoWindow = new google.maps.InfoWindow();
      let content = `
            <div class="text-success container">
              <div class="row">
                <div class="col-8">
                  <h3 class="h4">${this.InfoRestosName}</h3>
                </div>
                <div class="col-4">
                <p></p>
                  <img src ="${this.InfoRestosUrlApi}" class="img-fluid w-50 img-thumbnail">
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <p class="font-weight-bold">${this.InfoRestosAdress}</p></div>
                <div class="col-12">
                
                  <p>Note moyenne : <span id"="marker-moyenne-${this.InfoRestosName}"class="badge badge-pill badge-success my-auto ml-2">${this.InfoRestosMoyenne}</span></p>
                  </div>
                  <div class="col-12">
                  <p>Dernier commentaire :
                    <span id = "newRatingInfoWindow-${this.InfoRestosName}" class="font-italic text-dark">${this.InfoRestosLastComment}</span>
                  </p>
                </div>
              </div> 
          </div>
            `;   
      myInfoWindow.setContent(content);
      myInfoWindow.open(map, marker);
      prev_infoWindow = myInfoWindow;
    });
  }
}
