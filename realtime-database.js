
var firebaseConfig = {
    apiKey: "AIzaSyA-jY35gl77Yli8qqCuFPt57-j5ZAVXnGc",
    authDomain: "registreabsence.firebaseapp.com",
    databaseURL: "https://registreabsence.firebaseio.com",
    projectId: "registreabsence",
    storageBucket: "registreabsence.appspot.com",
    messagingSenderId: "692146756912",
    appId: "1:692146756912:web:8b0c195a882e23440a7cf5"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


// Initialisation des gestionnaires d'événement
$('#addUserForm').on('submit', newAccount);
$('#addLogginForm').on('submit', signIn);
$('.cells').click(cellClick);
$("#signOutBtn").click(disconnect);
$('#addTimeForm').on('submit', onAddTime);


// Gérer le click des cellules de l'emploi du temps

function cellClick(){
    $(this).css("background-color","red")
}


// Récupérer les informations précédemment rentrée dans la base de donnée

db.collection("registreabsence").onSnapshot(function (querySnapshot){
    $(".users").remove()
    querySnapshot.forEach(function (doc) {
        $(".testTable").append(
            `<tr class="users">
                <td>${doc.data().Nom}</td>
                <td>${doc.data().Prénom}</td>
                <td>${doc.data().Rôle}</td>
                <td>${doc.data().Mail}</td>
            </tr>`
        )
    });
});

function onAddUser (event) {
    event.preventDefault();

    const nom = $('#nom').val();
    const prénom = $('#prénom').val();
    const grade = $('#etudes').val();
    const email = $('#email').val();

    // Ajouter les informations dans la database 
    db.collection(grade).doc(email).set({
        Nom: nom,
        Prénom: prénom,
        Rôle: grade,
        Mail: email
    })
    .then(function () {
        console.log("Document successfully written!");
    })
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });
}


// Création compte

function newAccount(event){
    event.preventDefault()

    if( $('#mdp').val().length && $('#mdp2').val().length >= 6){
        if( $('#mdp').val() === $('#mdp2').val()){
            const email = $('#email').val();
            const password = $('#mdp').val();
        
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
                if(errorMessage == "The email address is already in use by another account."){
                    alert("Utilisateur déjà enregistré.")
                }
            });
        } else {
            $('#mdp').css("border","2px red solid")
            $('#mdp2').css("border","2px red solid")
            alert("Les mots de passes ne correspondent pas")
        }
    } else {
        $('#mdp').css("border","2px red solid")
        $('#mdp2').css("border","2px red solid")
        alert("Le mot de passe doit faire plus de 6 caractères")
    }
}

// Connexion

function signIn(event){
    event.preventDefault()

    const email = $('#Cemail').val();
    const password = $('#Cmdp').val();

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log("signed in "+email)
        window.location.href = "index3.html"
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorMessage == "There is no user record corresponding to this identifier. The user may have been deleted."){
            alert("Email et mot de passe incorrects ou utilisateur pas encore enregistré.")
        }
        console.log(errorMessage)
    });
}

// AJOUTER DIV TIME

function onAddTime (event) {
    event.preventDefault();

    const matiere = $('#matiere').val();
    const formateur = $('#formateur').val();
    const duration = $('#duration').val();
    const duration2 = $('#duration2').val();
    const classe = $('#classe').val();



    // Ajouter les information dans la database 
    db.collection('emploi_du_temps/').doc().set({

        matiere,
        formateur,
        duration,
        duration2,
        classe

    });
}
//  récupérèr les information précedement rentrée dans la base de donnée (emploi du temps)

db.collection('emploi_du_temps/').onSnapshot(function (querySnapshot) {

    let content = '';
    querySnapshot.forEach(function(doc) {
        
        content += `<div> <hr>
         <b> ${doc.data().matiere} <br/> 
        ${doc.data().formateur} <br/>
        Du ${doc.data().duration} au ${doc.data().duration2}  <br/> 
        classse : ${ doc.data().classe} </b>  </div>`;
    });
    
    $('#time').html(content);
});


// Afficher utilisateurs connectés

// function authListener(){
//     firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
//             $("#BigTest").append(`
//                 ${user.email}
//             `)
//         } else {
//           // No user is signed in.
//           console.log("Aucun utilisateur connecté")
//         }
//     });
// }

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#tagMail ").append(`
            ${user.email}
        `)
        console.log(user)
    } else {
      // No user is signed in.
      console.log("Aucun utilisateur connecté")
    }
});



function disconnect(event){
    event.preventDefault();

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Disconnected")
        location.assign("index2.html")
    }).catch(function(error) {
        // An error happened.
    });
}


