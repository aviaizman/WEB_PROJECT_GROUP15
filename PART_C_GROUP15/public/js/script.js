// Some starter routes to show on the home page
const sampleRoutes = [
    {
        name: "Banias Waterfall Trail",
        region: "north",
        difficulty: "easy",
        duration: "short",
        hours: 1.5,
        description: "A green walk beside flowing water, shade, and a beautiful waterfall."
    },
    {
        name: "Mount Carmel Ridge",
        region: "north",
        difficulty: "medium",
        duration: "half-day",
        hours: 4,
        description: "Forest views, sea air, and a steady climb through classic Carmel scenery."
    },
    {
        name: "Yarkon Park Urban Nature",
        region: "center",
        difficulty: "easy",
        duration: "short",
        hours: 2,
        description: "A relaxed city nature route with river paths and many picnic stops."
    },
    {
        name: "Jerusalem Hills Loop",
        region: "jerusalem",
        difficulty: "medium",
        duration: "half-day",
        hours: 3.5,
        description: "Rolling hills, pine trees, and wide viewpoints close to Jerusalem."
    },
    {
        name: "Ein Gedi Desert Springs",
        region: "south",
        difficulty: "medium",
        duration: "half-day",
        hours: 4,
        description: "A desert route with cliffs, water pools, and a dramatic Dead Sea view."
    },
    {
        name: "Ramon Crater Challenge",
        region: "south",
        difficulty: "hard",
        duration: "full-day",
        hours: 7,
        description: "A demanding desert hike across colorful geology and open crater views."
    }
];

// Nice labels for filters and route cards
const labels = {
    north: "North",
    center: "Center",
    south: "South",
    jerusalem: "Jerusalem",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    short: "Up to 2 hours",
    "half-day": "2-5 hours",
    "full-day": "Full day",
    circular: "Circular route",
    dogs: "Suitable for dogs",
    baby: "Suitable for babies",
    romantic: "Romantic",
    water: "Possibility for entering water"
};

document.addEventListener("DOMContentLoaded", initApp);

// Start the page and connect the forms to JavaScript
function initApp() {
    updateNavbarLoginLink();
    updateGreeting();
    protectUploadPage();

    const loginForm = document.getElementById("loginForm");
    const searchForm = document.getElementById("searchForm");
    const uploadForm = document.getElementById("uploadForm");
    const routeImage = document.getElementById("routeImage");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (searchForm) {
        searchForm.addEventListener("submit", handleSearch);
        loadHomeRoutes();
    }

    if (uploadForm) {
        uploadForm.addEventListener("submit", handleUploadForm);
    }

    if (routeImage) {
        routeImage.addEventListener("change", updateSelectedFileName);
    }

    initMovingTrailIcon();
    initHomeHeroSlideshow();
}

// Rotate the home hero background after the first entrance animation finishes
function initHomeHeroSlideshow() {
    if (document.body.dataset.page !== "home") {
        return;
    }

    const hero = document.getElementById("homeHero");
    const currentLayer = document.querySelector(".hero-bg-current");
    const nextLayer = document.querySelector(".hero-bg-next");

    if (!hero || !currentLayer || !nextLayer) {
        return;
    }

    const heroImages = [
        "images/hero-north.jpg",
        "images/hero-desert.jpg",
        "images/hero-coast.jpg",
        "images/hero-hills.jpg"
    ];
    let currentIndex = 0;

    currentLayer.style.backgroundImage = `url("${heroImages[currentIndex]}")`;
    nextLayer.style.backgroundImage = `url("${heroImages[currentIndex]}")`;

    const showNextImage = () => {
        const nextIndex = (currentIndex + 1) % heroImages.length;

        nextLayer.style.backgroundImage = `url("${heroImages[nextIndex]}")`;
        nextLayer.classList.add("is-visible");

        window.setTimeout(() => {
            currentLayer.style.backgroundImage = `url("${heroImages[nextIndex]}")`;
            nextLayer.classList.remove("is-visible");
            currentIndex = nextIndex;
        }, 900);
    };

    const startSlideshow = () => {
        window.setInterval(showNextImage, 4000);
    };

    hero.addEventListener("animationend", startSlideshow, { once: true });
}

// Move the small upload-page icon along a short section of the right trail
function initMovingTrailIcon() {
    if (document.body.dataset.page !== "upload") {
        return;
    }

    const trailPath = document.getElementById("rightTrailPath");
    const movingIcon = document.getElementById("movingTrailIcon");

    if (!trailPath || !movingIcon || typeof trailPath.getTotalLength !== "function") {
        return;
    }

    const pathLength = trailPath.getTotalLength();
    const startLength = pathLength * 0.02;
    const travelLength = pathLength * 0.92;
    let ticking = false;

    const updateIconPosition = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        const point = trailPath.getPointAtLength(startLength + travelLength * progress);

        movingIcon.setAttribute("transform", `translate(${point.x} ${point.y})`);
        ticking = false;
    };

    const requestUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateIconPosition);
            ticking = true;
        }
    };

    updateIconPosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
}

// Show the correct greeting in the header
function updateGreeting() {
    const userArea = document.getElementById("userArea");

    if (!userArea) {
        return;
    }

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");

    userArea.innerHTML = "";

    const greeting = document.createElement("span");
    greeting.className = "greeting";

    if (loggedIn && username) {
        greeting.textContent = `Hello ${username}`;

        const logoutButton = document.createElement("button");
        logoutButton.className = "btn logout-btn";
        logoutButton.type = "button";
        logoutButton.textContent = "Logout";
        logoutButton.addEventListener("click", handleLogout);

        userArea.append(greeting, logoutButton);
    } else {
        greeting.textContent = "Hello guest";

        const loginLink = document.createElement("a");
        loginLink.className = "btn secondary-btn";
        loginLink.href = "/login";
        loginLink.textContent = "Log in to continue";

        userArea.append(greeting, loginLink);
    }
}

// Handle login form submit
async function handleLogin(event) {
    event.preventDefault();
    clearErrors(["username", "email", "password"]);

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const successMessage = document.getElementById("loginSuccess");

    if (successMessage) {
        successMessage.textContent = "";
    }

    let isValid = true;

    if (username.length < 2) {
        showError("username", "Username must be at least 2 characters.");
        isValid = false;
    }

    if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }

    if (!/^[A-Za-z0-9]{8,}$/.test(password)) {
        showError("password", "Password must be at least 8 characters and contain only letters and numbers.");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    try {
        const response = await fetch("/LoginUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            localStorage.removeItem("username");
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            alert("One or more login details are incorrect");
            return;
        }

        localStorage.setItem("username", data.user.username);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        successMessage.textContent = data.message || "Login successful";
        updateNavbarLoginLink();
        updateGreeting();

        setTimeout(() => {
            window.location.href = "/";
        }, 900);
    } catch (error) {
        localStorage.removeItem("username");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        alert("One or more login details are incorrect");
    }
}

// Log the user out and update the page
function handleLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("isLoggedIn");
    updateNavbarLoginLink();
    updateGreeting();

    if (document.body.dataset.page === "upload") {
        protectUploadPage();
    }
}

// Update the profile nav behavior based on login state
function updateNavbarLoginLink() {
    const profileLink = document.querySelector(".main-nav .profile-link");

    if (!profileLink) {
        return;
    }

    const loggedIn = localStorage.getItem("loggedIn") === "true";
    profileLink.textContent = "My Profile";
    profileLink.href = loggedIn ? "#" : "/login";
    profileLink.onclick = loggedIn
        ? (event) => event.preventDefault()
        : null;
}

// Check if user is logged in before showing the upload form
function protectUploadPage() {
    if (document.body.dataset.page !== "upload") {
        return;
    }

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const formWrapper = document.getElementById("uploadFormWrapper");
    const accessMessage = document.getElementById("uploadAccessMessage");

    if (!formWrapper || !accessMessage) {
        return;
    }

    formWrapper.classList.toggle("hidden", !isLoggedIn);
    accessMessage.classList.toggle("hidden", isLoggedIn);
}

// Load route cards for the home page
async function loadHomeRoutes() {
    const searchError = document.getElementById("searchError");

    if (searchError) {
        searchError.textContent = "";
    }

    try {
        const response = await fetch("/GetHomeRoutes");
        const result = await response.json();

        if (!response.ok || !result.success) {
            if (searchError) {
                searchError.textContent = result.message || "Could not load routes.";
            }
            renderRoutes([]);
            return;
        }

        renderRoutes(result.routes);
    } catch (error) {
        if (searchError) {
            searchError.textContent = "Could not load routes.";
        }
        renderRoutes([]);
    }
}

// Show matching routes from the search form
async function handleSearch(event) {
    event.preventDefault();

    const region = document.getElementById("searchRegion").value;
    const difficulty = document.getElementById("searchDifficulty").value;
    const duration = document.getElementById("searchDuration").value;
    const searchError = document.getElementById("searchError");

    searchError.textContent = "";

    if (!region && !difficulty && !duration) {
        searchError.textContent = "Please choose at least one search field.";
        return;
    }

    const params = new URLSearchParams({
        region,
        difficulty,
        duration: duration === "half-day" ? "medium" : duration === "full-day" ? "long" : duration
    });

    try {
        const response = await fetch(`/SearchRoutes?${params.toString()}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            searchError.textContent = result.message || "Could not search routes.";
            renderRoutes([]);
            return;
        }

        renderRoutes(result.routes);
    } catch (error) {
        searchError.textContent = "Could not search routes.";
        renderRoutes([]);
    }
}

// Validate upload form and save the new route
async function handleUploadForm(event) {
    event.preventDefault();
    clearErrors(["routeName", "routeRegion", "routeDifficulty", "routeDuration", "routeDescription", "routeFeatures"]);

    const routeName = document.getElementById("routeName").value.trim();
    const routeRegion = document.getElementById("routeRegion").value;
    const routeDifficulty = document.getElementById("routeDifficulty").value;
    const routeDuration = Number(document.getElementById("routeDuration").value);
    const routeDescription = document.getElementById("routeDescription").value.trim();
    const routeFeatures = Array.from(document.querySelectorAll('input[name="routeFeatures"]:checked'))
        .map((checkbox) => checkbox.value);
    let isValid = true;

    if (!/^[A-Za-z0-9 ]{3,}$/.test(routeName)) {
        showError("routeName", "Route name must be at least 3 characters and use only letters and numbers.");
        isValid = false;
    }

    if (!routeRegion) {
        showError("routeRegion", "Region is required.");
        isValid = false;
    }

    if (!routeDifficulty) {
        showError("routeDifficulty", "Difficulty is required.");
        isValid = false;
    }

    if (!routeDuration || routeDuration <= 0) {
        showError("routeDuration", "Duration must be a positive number.");
        isValid = false;
    }

    if (routeDescription.length < 15) {
        showError("routeDescription", "Description must be at least 15 characters.");
        isValid = false;
    }



    if (!isValid) {
        return;
    }

    try {
        const response = await fetch("/CreateNewRoute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                routeName,
                routeRegion,
                routeDifficulty,
                routeDuration,
                routeDescription,
                routeFeatures
            })
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            alert(result.message || "Could not upload the route.");
            return;
        }

        alert(result.message);
        event.target.reset();
        updateSelectedFileName({ target: document.getElementById("routeImage") });
    } catch (error) {
        alert("Could not upload the route.");
    }
}

// Show the chosen image file name
function updateSelectedFileName(event) {
    const fileName = document.getElementById("routeImageName");

    if (!fileName) {
        return;
    }

    fileName.textContent = event.target.files.length > 0
        ? event.target.files[0].name
        : "No file selected";
}

// Build the route cards on the page
function renderRoutes(routes) {
    const resultsArea = document.getElementById("resultsArea");

    if (!resultsArea) {
        return;
    }

    resultsArea.innerHTML = "";

    if (routes.length === 0) {
        resultsArea.innerHTML = '<p class="empty-state">No routes found for your search.</p>';
        return;
    }

    routes.forEach((route) => {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const meta = document.createElement("p");
        const features = document.createElement("p");
        const description = document.createElement("p");
        card.className = "route-card";
        meta.className = "route-meta";
        features.className = "route-features";

        title.textContent = route.route_name;
        meta.textContent = `${labels[route.region] || route.region} | ${labels[route.difficulty] || route.difficulty} | ${route.duration_hours} hours`;
        const selectedFeatures = [
            route.is_circular ? "Circular route" : "",
            route.suitable_dogs ? "Suitable for dogs" : "",
            route.suitable_babies ? "Suitable for babies" : "",
            route.romantic ? "Romantic" : "",
            route.water_entry ? "Entering water" : ""
        ].filter(Boolean);
        features.textContent = selectedFeatures.length > 0
            ? `Features: ${selectedFeatures.join(", ")}`
            : "";
        description.textContent = route.description;

        card.append(title, meta);

        if (features.textContent) {
            card.appendChild(features);
        }

        card.appendChild(description);
        resultsArea.appendChild(card);
    });
}

// Mix sample routes with routes uploaded by the user
function getAllRoutes() {
    return [...sampleRoutes, ...getUploadedRoutes()];
}

// Get uploaded routes from localStorage
function getUploadedRoutes() {
    const storedRoutes = localStorage.getItem("uploadedRoutes");

    if (!storedRoutes) {
        return [];
    }

    try {
        return JSON.parse(storedRoutes);
    } catch (error) {
        return [];
    }
}

// Turn hours into the duration groups used by the filters
function getDurationGroup(hours) {
    if (hours <= 2) {
        return "short";
    }

    if (hours <= 5) {
        return "half-day";
    }

    return "full-day";
}

// Clear old validation messages
function clearErrors(fieldIds) {
    fieldIds.forEach((fieldId) => {
        showError(fieldId, "");
    });
}

// Put an error message under a field
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);

    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Simple email check for the login form
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
