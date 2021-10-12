//A chaque clic : cacher ou montrer le formulaire d'ajout de commentaire
const toggleFormComment = function () {
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
  };
  toggleFormComment();