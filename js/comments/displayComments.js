const toggleComments = function() {
  let myButtons = document.getElementsByClassName("show-comments");
  let myCommentsID;

  /* myButtons est un HTMLCollection -> possibilité de manipuler comme un tableau */
  for (let k =0; k < myButtons.length; k++) {

      myButtons[k].addEventListener("click", function() {
          myCommentsID = document.getElementById("comments-" + k);
          console.log(document.getElementById("comments-" + k))
          
        /* TODO ajouter test sur myMarkersID.classList.contains('hide')*/
          if (myCommentsID.classList.contains('hide')) {
              myCommentsID.classList.remove('hide');
          }
          else {
            myCommentsID.classList.add('hide');
          }
      })
  }
}
toggleComments();
