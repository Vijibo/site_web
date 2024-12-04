// Yeux qui bougent
const pupil = document.querySelector('.iris');
const eyeBall = document.querySelector('.eyeBall');

const irisDiameter = 70;
const pupilDiameter = 40;
const pupilRadius = pupilDiameter / 2;
const irisRadius = irisDiameter / 2;

window.addEventListener('mousemove', (event) => {
    const eyeRect = eyeBall.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
    const deltaX = event.pageX - eyeCenterX;
    const deltaY = event.pageY - eyeCenterY;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), irisRadius - pupilRadius);
    const pupilX = distance * Math.cos(angle);
    const pupilY = distance * Math.sin(angle);
    pupil.style.transform = `translate(${pupilX - 10}px, ${pupilY - 10}px)`;
});



// Mode Nuit
const backgrounds = ['images/fond_jour.jpg', 'images/fond_nuit.jpg'];
const couleur_police = ['Black', 'White'];
let currentBackground = 0;
let currentcolor_police = 0;

function applyNightModeSettings() {
    document.body.style.backgroundImage = `url('${backgrounds[currentBackground]}')`;
    const newColor = couleur_police[currentcolor_police];

    pupil.style.backgroundColor = newColor;
    eyeBall.style.borderColor = newColor; 
    document.querySelectorAll('#menu a, h1, h2, p, h4, li, h5, #nom1, #prenom1, #email1, #message1, #file1,summary').forEach(el => {
        el.style.color = newColor;
    });


}

function changeBackground() {
    currentBackground = (currentBackground + 1) % 2;
    currentcolor_police = (currentcolor_police + 1) % 2;
    localStorage.setItem('currentBackground', currentBackground);
    localStorage.setItem('currentcolor_police', currentcolor_police);
    applyNightModeSettings();
}
 
if (localStorage.getItem('currentBackground')) {
    currentBackground = parseInt(localStorage.getItem('currentBackground'));
    currentcolor_police = parseInt(localStorage.getItem('currentcolor_police'));
    applyNightModeSettings();
}

document.getElementById('night_mode').addEventListener('click', changeBackground);

//Menu hamburger
const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
});
