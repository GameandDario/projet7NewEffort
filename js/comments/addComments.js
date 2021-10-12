let myComments = [];
let myScores = [];
//console.log("Array resto", restaurants[0].ratings);

/* let CurrentComment = {
  comment: "current comment / actuel",
  score: "current score  / actuel",
}; */
let newArrondi = "";
let newRating = "";
let newComment = "";
let valueSelected = "";
let listScores = "";

//déclaration du container resultBox
const resultBox = document.getElementsByClassName("resultComment-wrapper");
//afficher le container des avis
function showCommentsResult() {
  for (
    let resultBoxIndex = 0;
    resultBoxIndex < resultBox.length;
    resultBoxIndex++
  ) {
    resultBox[resultBoxIndex].classList.add("d-block");
  }
}

for (let restoIndex = 0; restoIndex < restaurants.length; restoIndex++) {
  //console.log(restaurants[restoIndex].ratings)
  //declaration de bouton envoyer commentaire
  let addCommentBtn = document.getElementById("addComment-btn-" + [restoIndex]);
  //declaration zone affichage des commentaires
  let commentsUlEl = document.getElementById("comments_ul-el-" + [restoIndex]);
  //declaration de l'input Scores
  let values = document.getElementsByClassName("addScore-" + [restoIndex]);
  //declaration zone affichage des scores
  let scoresUlEl = document.getElementById("scores_ul-el-" + [restoIndex]);
  //déclaration de l'input Commentaire
  let inputEl = document.getElementById("comment-el-" + [restoIndex]);
  //Declaration du Champ Tous les Commentaires
  let myCommentsBox = document.getElementById("comments-" + [restoIndex] );

  let myArrondi = document.getElementById("moyenneArrondi-" + [restoIndex]);

  function renderScores() {
    let listScores = "";
    for (let oneScore = 0; oneScore < myScores.length; oneScore++) {
      listScores += myScores[oneScore];
      scoresUlEl.innerHTML = listScores;
      listScores = "";
    }
  }
  //sur chaque bouton radio ajout d'une écoute d'évenement click
  for (let indexValue = 0; indexValue < values.length; indexValue++) {
    values[indexValue].addEventListener("click", function () {
      valueSelected = this.value;
      newRating = parseInt(valueSelected);
      myScores.push(newRating);
      valueSelected = "";
      //CurrentComment.score = newRating;
    });
  }

  function renderComments() {
    let listComments = "";
    if (!newRating || !newComment) {
      alert("vous n'avez pas donné de score ou de commentaire");
    } else {
      for (let oneComment = 0; oneComment < myComments.length; oneComment++) {
        listComments += myComments[oneComment];
        commentsUlEl.innerHTML = listComments;
        listComments = "";
      }
    }
  }

  
  function validateContent() {
    console.log(`myArrondi`, myArrondi.textContent)

    myCommentsBox.firstChild.innerHTML += `<li>${newRating} ★ <br/>${newComment}</li>`
    newArrondi = (newRating + parseInt(myArrondi.textContent))/2
    myArrondi.textContent = newArrondi
    console.log(`myArrondi`, myArrondi.textContent)

  }

  //sur bouton Envoi ajout d'une écoute d'évenement click
  addCommentBtn.addEventListener("click", function () {
    //envoi dans l'array des commentaires du resto du nouveau commentaire
    if (newRating) {
      if (inputEl.value) {
        myComments.push(inputEl.value);
        newComment = inputEl.value;
        inputEl.value = "";
        console.log(`newComment`, newComment);
        console.log(`newRating`, newRating);
        renderComments();
        renderScores();
        validateContent();
        showCommentsResult();
        newRating = "";
      } else {
        alert("vous n'avez pas donné de commentaire");
      }
    } else {
      alert("vous n'avez pas donné de score");
    }
  });


}
