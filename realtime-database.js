"use strict"

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


// Display les cours dans le calendrier 

function calChange(){
    db.collection("Cours").onSnapshot(function(querySnapshot){
        evenements = []
        querySnapshot.forEach(function(doc) {
            
            const classe = doc.data().Classe
            const matière = doc.data().Matière
            const start = doc.data().Début
            const end = doc.data().Fin

            if( $("#selectClassesCalendar").val() == classe){
            
                let cours = {
                    "title": matière,
                    "start": start,
                    "end": end
                }

                evenements.push(cours)
                rerender()
            }
        });
    });
}


// fonction de rendering du calendrier

function rerender(){
    $("#calendrier").html("")
    calendrier = new FullCalendar.Calendar(elementCalendrier, {
        //appelle les elements
        plugins: ['dayGrid','timeGrid','list'],
        contentHeight: 700,
        defaultView: 'timeGridWeek',
        locale : 'fr' ,//langue
        header: {
            left:'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,list'
        },
        buttonText: {
            today:"Aujourd'hui",
            month:"Mois",
            week:"Semaine",
            list:"liste",
        },
        events: evenements,
        nowIndicator: true,
        eventClick: function(){ alert("yo")}
    })
    calendrier.render()
}


let evenements = []


let elementCalendrier = document.getElementById("calendrier")

//on instancie le calendrier
let calendrier = new FullCalendar.Calendar(elementCalendrier, {
    //appelle les elements
    plugins: ['dayGrid','timeGrid','list'],
    contentHeight: 700,
    defaultView: 'timeGridWeek',
    locale : 'fr' ,//langue
    header: {
        left:'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,list'
    },
    buttonText: {
        today:"Aujourd'hui",
        month:"Mois",
        week:"Semaine",
        list:"liste",
    },
    events: evenements,
    nowIndicator: true
})
calendrier.render()



// Initialisation des gestionnaires d'événement

//Back-end
$("#delClassBtn").on("click", delClass)
$("#confirmAddClass").on("click", confirmAddClass)
$('#addUserForm').on('submit', onAddUser);
$("#signOutBtn").on("click", disconnect);
$("#addCourseForm").on('submit', addCourse)
$("#modifUserForm").on("submit", confirmModif)
function rerunBtns(){
    $(".supprBtn").on("click", supprUser )
    $(".modifBtn").on("click", modifUser ) 
}

//Front-end
$("#addClassBtn").on("click", () => $("#inputAddClass").css("display","block"))
$("#selectClasses").change(displayUsers)
$("#selectClassesCalendar").change(calChange)
$("#addUserBtn").on("click", () => $("html, body").animate({scrollTop: $(".mid").offset().top - 200}))
$("#addCourseBtn").on("click", () => $("html, body").animate({scrollTop: $(".mid").offset().top - 200}))
$("#displayClasses").on("click", () => $("html, body").animate({scrollTop: $("#newTable").offset().top}, 600))
$("#EDT").on("click", () => $("html, body").animate({scrollTop: $(".main").offset().top}, 600))
$("#etudes").change( () => {if( $("#etudes").val() == "élève"){$("#displayIf").css("display","block")} else { $("#displayIf").css("display","none")}})
$("#editUsersBtn").on("click", () => {
    $(".editBtns").css("display","table-cell")
    rerunBtns()
})



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

// Affichage des classes créés dans le select du calendrier 

db.collection("Classes").onSnapshot(function(querySnapshot){
    $(".studentClassCalendar").remove()
    querySnapshot.forEach(function(doc) {
        $("#selectClassesCalendar").append(`
            <option class="studentClassCalendar" value="${doc.id}">${doc.id}</option>
        `)
    });
});


// Affichage des classes créés dans le menu select du tableau ( Tableau de display des élèves / profs )


db.collection("Classes").onSnapshot(function(querySnapshot){
    $(".studentClass").remove()
    querySnapshot.forEach(function(doc) {
        $("#selectClasses").append(`
            <option class="studentClass" value="${doc.id}">${doc.id}</option>
        `)
    });
});


// Supprimer informations de l'utilisateur

function supprUser(){
    const td = $(this).attr("class").split(" ")[0]

    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").doc(td).delete().then(function() {
            console.log("Document successfully deleted!");
            alert("Utilisateur supprimé avec succés")
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    } else {
        db.collection("élève").doc(td).delete().then(function() {
            console.log("Document successfully deleted!");
            alert("Utilisateur supprimé avec succés")
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
}


// Modifier information de l'utilisateur

function modifUser(){
    const td = $(this).attr("class").split(" ")[0]
    $("html, body").animate({scrollTop: $("html").height()})
    
    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").doc(td).get().then(function(doc){
            if(doc.exists){
                $("#Mclasse").prop("required",false)
                $("#displayM").css("display","none")
                $("#Mnom").val(doc.data().Nom)
                $("#Mprénom").val(doc.data().Prénom)
                $("#Memail").val(doc.data().Mail)

            }
        })
    } else {
        db.collection("élève").doc(td).get().then(function(doc){
            if(doc.exists){
                $("#Mclasse").prop("required",true)
                $("#displayM").css("display","block")
                $("#Mnom").val(doc.data().Nom)
                $("#Mprénom").val(doc.data().Prénom)
                $("#Memail").val(doc.data().Mail)
                $("#Mclasse").val(doc.data().Classe)
            }
        })
    }
}

// Confirmation des modifications de l'utilisateur

function confirmModif(event){
    event.preventDefault()

    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").doc(td).get().then(function(doc){
            if(doc.exists){
                $("#Mnom").val(doc.data().Nom)
                $("#Mprénom").val(doc.data().Prénom)
                $("#Memail").val(doc.data().Mail)
            }
        })
    } else {
        db.collection("élève").doc(td).get().then(function(doc){
            if(doc.exists){
                $("#Mnom").val(doc.data().Nom)
                $("#Mprénom").val(doc.data().Prénom)
                $("#Memail").val(doc.data().Mail)
                $("#Mclasse").val(doc.data().Classe)
            }
        })
    }
}

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
                if( $("#displayIf").css("display") == "block" ){
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



// Fonction de déconnexion

function disconnect(event){
    event.preventDefault();

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Disconnected")
        location.replace("connexion.html")
    }).catch(function(error) {
        // An error happened.
    });
}



// Ajouter cours à la database

function addCourse(event){
    event.preventDefault()

    const classe = $("#classCourse").val()
    const matière = $("#matière").val()
    const start = $("#start").val()
    const end = $("#end").val()

    db.collection("Cours").doc().set({
        Classe: classe,
        Matière: matière,
        Début: start,
        Fin: end
    }).then(function(){
        alert("Cours ajouté !")
        $("#classCourse").val("")
        $("#matière").val("")
        $("#start").val("")
        $("#end").val("")
    })
}



// Afficher élèves dans tableau

function displayUsers(){

    const selectClass = $("#selectClasses").val().toLowerCase()

    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").onSnapshot(function(querySnapshot){
            $(".studentsRow").remove()
            querySnapshot.forEach(function(doc) {
                    $("#Students").append(`
                    <tr class="studentsRow">
                        <td>${doc.data().Nom}</td>
                        <td>${doc.data().Prénom}</td>
                        <td class="editBtns"><button class="${doc.data().Mail} neumorph modifBtn" data-toggle="collapse" data-target="#modifUserDiv">Modifier</button><button class="${doc.data().Mail} neumorph supprBtn">Supprimer</button></td>
                    </tr>
                    `)
                    $("#nbrStud").empty()
            })
        })
    } else {
        db.collection("élève").onSnapshot(function(querySnapshot){
            $(".studentsRow").remove()
            let nbrStud = 0
            querySnapshot.forEach(function(doc) {
                if(doc.data().Classe == selectClass){
                    $("#Students").append(`
                    <tr class="studentsRow">
                        <td>${doc.data().Nom}</td>
                        <td>${doc.data().Prénom}</td>
                        <td class="editBtns"><button class="${doc.data().Mail} neumorph modifBtn" data-toggle="collapse" data-target="#modifUserDiv">Modifier</button><button class="${doc.data().Mail} neumorph supprBtn">Supprimer</button></td>
                    </tr>
                    `)
                    nbrStud++
                    $("#nbrStud").empty()
                    $("#nbrStud").append(`${nbrStud} étudiants`)
                }
            })
        })
    }
}



// Affichage de l'adresse mail de l'utilisateur connecté

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


