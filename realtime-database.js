
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


// TESTS 

// $("#incrementTest").on("click", () => {
//     alert("ok")
//     db.collection("Classes").doc("dev").set({
//         Students: +1
//     })
// })



// Initialisation des gestionnaires d'événement

//Back-end
$("#addClassBtn").on("click", () => $("#inputAddClass").css("display","block"))
$("#delClassBtn").on("click", delClass)
$("#confirmAddClass").on("click", confirmAddClass)
$('#checkMail').on("submit",checkMail);
$('#addUserForm').on('submit', onAddUser);
$('#notSignedUp').on('submit', newAccount);
$('#signedUp').on('submit', signIn);
$("#signOutBtn").click(disconnect);
$(".displayAddCourse").on("submit",addCourse)
//Front-end
$("#selectClasses").change(displayUsers)
$("#addCourseBtn").on("click", () => $(".displayAddCourse").css("display","flex"))
$("#displayClasses").on("click", () => $("html, body").animate({scrollTop: $("#newTable").offset().top -100}, 600))
$("#EDT").on("click", () => $("html, body").animate({scrollTop: $(".right").offset().top}, 600))
$("#etudes").change( () => {if( $("#etudes").val() == "élève"){$("#displayIf").css("display","block")} else { $("#displayIf").css("display","none")}})
$(".cancel").click( () => window.location.href = "index3.html" )
$("#addUser").click( () => window.location.href = "index.html" )
$('.cells').on("click", cellClick)
$(".close").click(closeBtn)



// Gérer le click des cellules de l'emploi du temps
function cellClick(){
    $(this).css("background-color","red")
}

// Gérer le click du bouton close
function closeBtn(){
    $(this).parent().css("display","none")
}

// Affichage champs de saisi d'ajout de cours

function courseDisplay(){
    $(".displayAddCourse").css("display","flex")
}

// Ajout classe database

function confirmAddClass(){

    const newClass = $("#addInput").val()

    db.collection("Classes").doc(newClass).get().then(function(doc){
        if(doc.exists){
            alert("Cette classe existe déjà")
        } else {
            if( newClass.length >= 3 ){
                db.collection("Classes").doc(newClass).set({
                    Students: 0
                }).then(function(){
                    $("#inputAddClass").css("display","none")
                    alert("Classe créée")
                })
            }
        }
    })
}

// Suppr class database

function delClass(){
    
    const selectClass = $("#selectClasses").val()
    
    if( selectClass.length > 2 ){
        db.collection("Classes").doc(selectClass).delete().then(function(){
            alert("Classe supprimée")
        }).catch(function(error){
            alert("Check la console")
            console.log("Error removing document: ", error);
        })
    }
}

// Affichage des classes créés dans le select

db.collection("Classes").onSnapshot(function(querySnapshot){
    $(".studentClass").remove()
    querySnapshot.forEach(function(doc) {
        $("#selectClasses").append(`
            <option class="studentClass" value="${doc.id}">${doc.id}</option>
        `)
    });
});



// Ajouter utilisateurs à la database

function onAddUser (event) {
    event.preventDefault();

    const nom = $('#nom').val();
    const prénom = $('#prénom').val();
    const grade = $('#etudes').val();
    const email = $('#email').val();
    const classe = $('#classe').val();

        
    if( nom.length >= 2 && prénom.length >= 2){
        db.collection(grade).doc(email).get().then(function(doc){
            if(doc.exists){
                $('#email').css("border","2px red solid")
                alert("Ce mail a déjà été enregistré, l'utilisateur a dû recevoir un mail l'invitant à s'inscrire.") // Coder possibilité de renvoyer un mail ici
            } else {
                if( classe.length >= 3){
                    db.collection(grade).doc(email).set({
                        Nom: nom,
                        Prénom: prénom,
                        Rôle: grade,
                        Mail: email,
                        Classe: classe
                    })
                    .then(function () {
                        console.log("Document successfully written!");
                        alert("L'utilisateur a été enregistré, un mail lui a été envoyé, il se peut qu'il soit dans sa boîte Spam.")
    
                        Email.send({
                            Host: "smtp.gmail.com",
                            Username : "nolanseb08@gmail.com",
                            Password : "MkeKyou08",
                            To : email,
                            From : "nolanseb08@gmail.com",
                            Subject : "Enregistrement sur le registre de Sèb & Nolan",
                            Body : "Bonjour, un administrateur vous a enregistré sur le registre de Sèb et Nolan ! Rendez-vous à l'adresse suivante: '...'. Bienvenue !"
                        }).then(function(){
                            window.location.href = "index3.html" // Coder possibilité d'ajouter d'autre utilisateurs directement
                        }).catch(function(error){
                            console.log(error)
                            alert("Une erreur s'est produite lors de l'envoi du mail, ouvrir la console.")
                        });
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                        alert("Il y a eu une erreur à l'enregistrement de l'utilisateur, ouvrir console")
                    });
                } else {
                    db.collection(grade).doc(email).set({
                        Nom: nom,
                        Prénom: prénom,
                        Rôle: grade,
                        Mail: email
                    })
                    .then(function () {
                        console.log("Document successfully written!");
                        alert("L'utilisateur a été enregistré, un mail lui a été envoyé, il se peut qu'il soit dans sa boîte Spam.")
    
                        Email.send({
                            Host: "smtp.gmail.com",
                            Username : "nolanseb08@gmail.com",
                            Password : "MkeKyou08",
                            To : email,
                            From : "nolanseb08@gmail.com",
                            Subject : "Enregistrement sur le registre de Sèb & Nolan",
                            Body : "Bonjour, un administrateur vous a enregistré sur le registre de Sèb et Nolan ! Rendez-vous à l'adresse suivante: '...'. Bienvenue !"
                        }).then(function(){
                            window.location.href = "index3.html" // Coder possibilité d'ajouter d'autre utilisateurs directement
                        }).catch(function(error){
                            console.log(error)
                            alert("Une erreur s'est produite lors de l'envoi du mail, ouvrir la console.")
                        });
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                        alert("Il y a eu une erreur à l'enregistrement de l'utilisateur, ouvrir console")
                    });
                }
            }
        });
    } else {
        $("#nom").css("border","2px red solid")
        $("#prénom").css("border","2px red solid")
        alert("Le nom ou le prénom  est / sont  trop courts")
    }
}



// Check si l'utilisateur est déjà inscrit à la connexion

function checkMail(event){
    event.preventDefault();

    const mail = $("#Cemail").val()

    const docEleve = db.collection("élève").doc(mail)
    const docProf = db.collection("professeur").doc(mail)
    const docAdmin = db.collection("administration").doc(mail)

    docEleve.get().then(function(doc){
        if(doc.exists){
            if(doc.data().firstCo == undefined){
                $("#Cemail").attr("readonly", true)
                $("#checkMailBtn").css("display","none")
                $("#notSignedUp").css("display","flex")
            } else {
                $("#Cemail").attr("readonly", true)
                $("#checkMailBtn").css("display","none")
                $("#signedUp").css("display","flex")
            }
        } else {
            docProf.get().then(function(doc){
                if(doc.exists){
                    if(doc.data().firstCo == undefined){
                        $("#Cemail").attr("readonly", true)
                        $("#checkMailBtn").css("display","none")
                        $("#notSignedUp").css("display","flex")
                    } else {
                        $("#Cemail").attr("readonly", true)
                        $("#checkMailBtn").css("display","none")
                        $("#signedUp").css("display","flex")
                    }
                } else {
                    docAdmin.get().then(function(doc){
                        if(doc.exists){
                            $("#Cemail").attr("readonly", true)
                            $("#checkMailBtn").css("display","none")
                            $("#signedUp").css("display","flex")
                        } else {
                            alert("Utilisateur non enregistré, demander la permission d'un administrateur.")
                        }
                    })
                }
            }).catch(function(error){
                console.log(error)
            })
        }
    }).catch(function(error){
        console.log(error)
    })
}



// Fonction de création de compte

function newAccount(event){
    event.preventDefault()

    if( $('#notSignedUpPass').val().length && $('#notSignedUpPass2').val().length >= 6){

        if( $('#notSignedUpPass').val() === $('#notSignedUpPass2').val() ){

            const mail = $('#Cemail').val();
            const password = $('#notSignedUpPass').val();
        
            firebase.auth().createUserWithEmailAndPassword(mail, password)
            .then(function(){
                db.collection("élève").doc(mail).get().then(function(doc){
                    if(doc.exists){
                        db.collection("élève").doc(mail).set({
                            firstCo: true
                        }, { merge: true }).then(function(){ window.location.href = "index3.html", alert("Merci d'avoir créé votre compte, bienvenue !") })
                    } else {
                        db.collection("professeur").doc(mail).set({
                            firstCo: true
                        }, { merge: true }).then(function(){ window.location.href = "index3.html", alert("Merci d'avoir créé votre compte, bienvenue !") })
                    }
                })
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
                if(errorMessage == "The email address is already in use by another account."){
                    alert("Utilisateur déjà inscrit.")
                }
            });

        } else {
            $('#notSignedUpPass').css("border","2px red solid")
            $('#notSignedUpPass2').css("border","2px red solid")
            alert("Les mots de passes ne correspondent pas")
        }

    } else {
        $('#notSignedUpPass').css("border","2px red solid")
        $('#notSignedUpPass2').css("border","2px red solid")
        alert("Le mot de passe doit faire plus de 6 caractères")
    }
}



// Fonction de connexion

function signIn(event){
    event.preventDefault()

    const email = $('#Cemail').val();
    const password = $('#signedUpPass').val();
    

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log("signed in "+email)
        location.assign("index3.html")
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorMessage == "There is no user record corresponding to this identifier. The user may have been deleted."){
            alert("Email incorrect ou utilisateur non enregistré.")
        }
        if(errorMessage == "Too many unsuccessful login attempts. Please try again later."){
            alert("Trop de tentatives ratées, réessayer dans quelques minutes")
        }
        if(errorMessage == "The password is invalid or the user does not have a password."){
            alert("Mot de passe incorrect")
        }
        console.log(errorMessage)
    });
}



// Fonction de déconnexion

function disconnect(event){
    event.preventDefault();

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Disconnected")
        window.location.href = "index2.html"
    }).catch(function(error) {
        // An error happened.
    });
}



// addCourse

function addCourse(event){
    event.preventDefault()

    console.log("ok")

    const matière = $("#subject").val()
    const prof = $("#teacher").val()
    const jour = $("#day").val()
    const début = $("#startTime").val()
    const fin = $("#endTime").val()
    const classe = $("#classe").val()

    db.collection("Cours").doc(matière).set({
        Matière: matière,
        Formateur: prof,
        Date: jour,
        Début: début,
        Fin: fin,
        Classe: classe
    })
}



// display courses test ( à changer pour afficher dans EDT )
db.collection("Cours").onSnapshot(function(querySnapshot){
    $(".courses").remove()
    querySnapshot.forEach(function(doc) {
        $("#displayTest").append(`
            <div class="courses">
                <ul>
                    <li>${doc.data().Matière}</li>
                    <li>${doc.data().Formateur}</li>
                    <li>${doc.data().Date}</li>
                    <li>${doc.data().Début}</li>
                    <li>${doc.data().Fin}</li>
                    <li>${doc.data().Classe}</li>
                </ul>
            </div>
            <hr>
        `)
    });
});



// Afficher élèves dans tableau

function displayUsers(){

    const selectClass = $("#selectClasses").val().toLowerCase()

    db.collection("élève").onSnapshot(function(querySnapshot){
        $(".studentsRaw").remove()
        let nbrStud = 0
        querySnapshot.forEach(function(doc) {
            if(doc.data().Classe == selectClass){
                $("#Students").append(`
                <tr class="studentsRaw">
                    <td>${doc.data().Nom}</td>
                    <td>${doc.data().Prénom}</td>
                </tr>
                `)
                nbrStud++
                $("#nbrStud").empty()
                $("#nbrStud").append(`${nbrStud} étudiants`)
                
            }
        })
    })
    
}



// Affichage de l'adresse de l'utilisateur connecté

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#tagMail ").append(`
            ${user.email}
        `)
        console.log(user)
        db.collection("administration").doc(user.email).get().then(function(doc){
            if(doc.exists){
                $(".adminDisplay").css("display","block")
            } else {
                $(".adminDisplay").css("display","none")
            }
        })
    } else {
      // No user is signed in.
      console.log("Aucun utilisateur connecté")
    }
});


