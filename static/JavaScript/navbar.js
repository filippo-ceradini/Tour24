// Get the current page's URL
let currentUrl = window.location.pathname;

// Get the navbar links
let navLinks = document.querySelectorAll('.navbar-nav .nav-link');

// Loop through the navbar links
navLinks.forEach(link => {
    // If the current page's URL matches the navbar link's URL, add the active class to the link
    if (currentUrl === link.getAttribute('href')) {
        link.classList.add('active');
    }
});