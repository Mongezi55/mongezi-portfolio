// This watches when .hero becomes visible in the viewport
const heroObserver = new IntersectionObserver(startTypingWhenVisible, { threshold: 0.5 });
heroObserver.observe(document.querySelector('.hero'));

// Hamburger Manu Button Logic
const hamburger = document.querySelector('.menu-logo');
const navLinks = document.querySelector('.nav-links');
const menuTitle = document.querySelector('.menu-title');
const overlay = document.querySelector('.overlay');

function toggleMenu() {
    navLinks.classList.toggle("active");
    overlay.classList.toggle("active");
}

navLinks.addEventListener("click", toggleMenu);
hamburger.addEventListener("click", toggleMenu);

// Array containing locations of pictures displayed on home page (laptop-view)
const images = [
    './Assets/Profiles/Profile-1.jpg',
    './Assets/Profiles/Profile-2.jpg',
    './Assets/Profiles/Profile-3.jpg',
    './Assets/Profiles/Profile-4.jpg',
]

const layers = document.querySelectorAll(".profile-picture");

let currentImage = 0;
let activeLayer = 0;

// Load Initial Picture
layers[activeLayer].style.backgroundImage = `url${images[currentImage]}`;

setInterval(() => {

    currentImage = (currentImage + 1) % images.length; // Loop through pictures in array

    const nextLayer = 1 - activeLayer; // switch between layers

    layers[nextLayer].style.backgroundImage =  `url(${images[currentImage]})`;

    layers[nextLayer].classList.add("active");

    layers[activeLayer].classList.remove("active");

    activeLayer = nextLayer;

}, 5000);



// Home page self type box animation
const typingBox = document.querySelector('.scroll-text');   // Mobile Version
const typingBox2 = document.querySelector('.d-scroll');     // Desktop Version

// clearing typing box
typingBox.innerHTML = ''; 
typingBox2.innerHTML = '';
const words = [
    'Full Stack Developer',
    'JavaScript Enthusiast',
    'Backend Developer.'
];


// Self typing Box logic
let wordIndex = 0;
let charIndex = 0;
let isErasing = false;
let started = false;

function typeEffect() {
    const currentWord = words[wordIndex]

    if(!isErasing){ //Typing
        //typingBox.innerHTML += currentWord.charAt(charIndex)
        typingBox.innerHTML = currentWord.substring(0, charIndex + 1);
        typingBox2.innerHTML = currentWord.substring(0, charIndex + 1);
        charIndex++;
        
        if(charIndex === currentWord.length){
            setTimeout(() => {
                isErasing = true;
            }, 1000);   // Pause before deleting
        }
    }else{
        //Erasing
        typingBox.innerHTML = currentWord.substring(0, charIndex - 1);
        typingBox2.innerHTML = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if(charIndex === 0){
            isErasing = false;
            wordIndex = (wordIndex + 1) % words.length; // Loop infinitely
        }
    }

    const speed = isErasing ? 50: 100;  // Delete faster than typing
    setTimeout(typeEffect, speed);
}

function startTypingWhenVisible(entries) {
    entries.forEach( entry => {
        if(entry.isIntersecting && !started){
            started = true;
            typeEffect();
        }
    });
}

// Service card glow animation
const service_card = document.querySelectorAll('.service-card');
service_card.forEach((element, index, array) =>{
    element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        element.style.setProperty("--x", `${x}px`);
        element.style.setProperty("--y", `${y}px`);    
    })
});

// Makes expertise slider infinitely loop

const sliders = document.querySelectorAll('.expertise-slider');

sliders.forEach((element, index, array) => {
    element.innerHTML += element.innerHTML;
})


// Form submition
const toast = document.querySelector('.toast');

function showToast(){
    // show toast
    toast.className =  `toast show`;

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000)
}

// API call for handling client email communication
const form = document.querySelector('.input-section');
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Save client data in local object
    const data = {
        email: this.email.value,
        name: this.name.value,
        message: this.message.value
    }

    await fetch('/api/contact', {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(data)
    });

    setTimeout(() => {
        showToast();
        form.reset();
    }, 1000)    

});

