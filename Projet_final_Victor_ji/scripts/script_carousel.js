//Script pour le carousel

let slideIndex = 0;
showSlides(slideIndex);

function showSlides(index) {
    const slides = document.querySelectorAll('.carousel-item');
    slideIndex = (index + slides.length) % slides.length;
    const offset = -slideIndex * 100;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlides(slideIndex + 1);
}

function prevSlide() {
    showSlides(slideIndex - 1);
}

document.querySelectorAll('.carousel-item img').forEach(img => {
    img.onclick = function() {
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");
        modal.style.display = "block";
        modalImg.src = this.src;
    };
});

document.querySelector('.close').onclick = function() {
    document.getElementById("myModal").style.display = "none";
};
