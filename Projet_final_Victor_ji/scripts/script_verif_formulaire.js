//Script pour la validation du formulaire

function validateForm(event) {
    event.preventDefault();
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Veuillez entrer une adresse e-mail valide.');
        return false;
    }

    alert(`Formulaire envoyé avec succès !\n\nInformations saisies :\nNom : ${nom}\nPrénom : ${prenom}\nEmail : ${email}\nMessage : ${message}`);

    event.target.submit();
}

document.getElementById('formulaire').addEventListener('submit', validateForm);
