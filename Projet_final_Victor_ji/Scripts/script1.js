// Yeux qui bougent
const pupil = document.querySelector('.iris');
const eyeBall = document.querySelector('.eyeBall');

// Définir la taille de l'iris et de la pupille
const irisDiameter = 70; // Diamètre de l'iris
const pupilDiameter = 40; // Diamètre de la pupille
const pupilRadius = pupilDiameter / 2; // Rayon de la pupille
const irisRadius = irisDiameter / 2; // Rayon de l'iris

window.addEventListener('mousemove', (event) => {
    const eyeRect = eyeBall.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
    const deltaX = event.pageX - eyeCenterX;
    const deltaY = event.pageY - eyeCenterY;
    // Calculer l'angle et la distance pour permettre un mouvement complet dans l'iris
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), irisRadius - pupilRadius); // Limiter la distance à l'intérieur de l'iris
    const pupilX = distance * Math.cos(angle);
    const pupilY = distance * Math.sin(angle);
    pupil.style.transform = `translate(${pupilX - 10}px, ${pupilY - 10}px)`;
});

// Écouteur d'événement pour remettre la pupille au centre lorsque le curseur quitte la fenêtre
window.addEventListener('mouseleave', () => {
    pupil.style.transform = `translate(0, 0)`; // Remettre la pupille au centre
});

// Tableau contenant les différentes images de fond
const backgrounds = [
    'Images/fond_jour.jpg',
    'Images/fond_nuit.jpg' // Ajoute d'autres chemins d'images ici
];
const couleur_police = ['Black', 'White'];
let currentBackground = 0; // Indice de l'image de fond actuelle
let currentcolor_police = 0;

// Fonction pour appliquer les paramètres de mode nuit
function applyNightModeSettings() {
    document.body.style.backgroundImage = `url('${backgrounds[currentBackground]}')`; // Change le fond
    const newColor = couleur_police[currentcolor_police];

    // Changer la couleur de la pupille et de la bordure de l'iris
    pupil.style.backgroundColor = newColor; // Change la couleur de la pupille
    eyeBall.style.borderColor = newColor;   // Change la couleur de la bordure de l'iris

    // Changer la couleur de tous les liens du menu
    let menuItems = document.querySelectorAll('#menu a');
    menuItems.forEach(function(item) {
        item.style.color = newColor;
    });

    // Changer la couleur de tous les titres et paragraphes
    let textElements = document.querySelectorAll('h1, h2, p');
    textElements.forEach(function(item) {
        item.style.color = newColor;
    });

    let textForm = document.querySelectorAll('#nom1, #prenom1, #email1, #message1, #file1,h4,li,h5');
    textForm.forEach(function(item) {
        item.style.color = newColor;
    });

    // Ajouter la règle CSS pour le hover à nouveau pour chaque lien du menu
    menuItems.forEach(function(item) {
        item.addEventListener('mouseover', function() {
            item.style.color = 'gray';
        });
        item.addEventListener('mouseout', function() {
            item.style.color = newColor;
        });
    });
}

// Fonction pour changer le fond
function changeBackground() {
    currentBackground = (currentBackground + 1) % backgrounds.length; // Passe à l'image suivante
    currentcolor_police = (currentcolor_police + 1) % couleur_police.length; // Passe à la couleur suivante
    
    // Sauvegarder les paramètres du mode nuit
    localStorage.setItem('currentBackground', currentBackground);
    localStorage.setItem('currentcolor_police', currentcolor_police);

    applyNightModeSettings();
}

// Appliquer les paramètres du mode nuit si déjà définis
if (localStorage.getItem('currentBackground')) {
    currentBackground = parseInt(localStorage.getItem('currentBackground'));
    currentcolor_police = parseInt(localStorage.getItem('currentcolor_police'));
    applyNightModeSettings();
}

// Ajoute un événement de clic à l'œil
document.getElementById('night_mode').addEventListener('click', changeBackground);


//Carousel d'images


let slideIndex = 0;
showSlides(slideIndex);

function showSlides(index) {
    const slides = document.querySelectorAll('.carousel-item');
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    } else {
        slideIndex = index;
    }
    const offset = -slideIndex * 100;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlides(slideIndex + 1);
}

function prevSlide() {
    showSlides(slideIndex - 1);
}


var modal = document.getElementById("myModal");
var modalImg = document.getElementById("img01");
var images = document.querySelectorAll(".carousel-item img");

images.forEach(img => {
    img.onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
    }
});

var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}


function validateForm(event) {
    event.preventDefault();
    var nom = document.getElementById('nom').value;
    var prenom = document.getElementById('prenom').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    if (!nom || !prenom || !email || !message) {
        alert('Veuillez remplir tous les champs.');
        return false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Veuillez entrer une adresse e-mail valide.');
        return false;
    }

    alert('Formulaire envoyé avec succès!');
    event.target.submit();
}



// Sélection des éléments
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

// Ajout d'un événement au clic sur le hamburger
hamburger.addEventListener('click', () => {
    menu.classList.toggle('active'); // Affiche ou masque le menu
    offScreenMenu.classList.toggle("active");
});
