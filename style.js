/* =========================================================
   STARTBUGS CAFÉ
   Main JavaScript
========================================================= */


/* ================= MOBILE NAVIGATION ================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("open");

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});


/* Close mobile menu after clicking link */

document.querySelectorAll(".nav-menu a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= MENU FILTER ================= */

const categoryButtons = document.querySelectorAll(".category-btn");
const menuCards = document.querySelectorAll(".menu-card");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        menuCards.forEach(card => {

            const cardCategory = card.dataset.category;

            if (category === "all" || category === cardCategory) {

                card.style.display = "block";

                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 20);

            } else {

                card.style.opacity = "0";
                card.style.transform = "translateY(15px)";

                setTimeout(() => {
                    card.style.display = "none";
                }, 250);

            }

        });

    });

});


/* ================= SHOPPING CART ================= */

let cart = [];

const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const cartSubtotal = document.getElementById("cartSubtotal");
const cartTax = document.getElementById("cartTax");
const cartTotal = document.getElementById("cartTotal");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* Add product buttons */

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

        }

        updateCart();

        showToast(`${name} added to your order`);

    });

});


/* Update cart */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-mug-hot"></i>
                <h3>Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
            </div>
        `;

    } else {

        cart.forEach((item, index) => {

            const itemElement = document.createElement("div");

            itemElement.className = "cart-item";

            itemElement.innerHTML = `

                <img src="${item.image}" alt="${item.name}">

                <div>

                    <h4>${item.name}</h4>

                    <span class="cart-item-price">
                        ₹${item.price * item.quantity}
                    </span>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(${index}, -1)">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-item"
                    onclick="removeItem(${index})"
                    aria-label="Remove item">

                    <i class="fa-solid fa-trash"></i>

                </button>
            `;

            cartItems.appendChild(itemElement);

        });

    }


    /* Count */

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    /* Price calculations */

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * 0.05);

    const total = subtotal + tax;

    cartSubtotal.textContent = `₹${subtotal}`;
    cartTax.textContent = `₹${tax}`;
    cartTotal.textContent = `₹${total}`;

}


/* Increase/decrease */

function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();

}


/* Remove */

function removeItem(index) {

    const removedName = cart[index].name;

    cart.splice(index, 1);

    updateCart();

    showToast(`${removedName} removed`);

}


/* Open cart */

function showCart() {

    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");

    document.body.classList.add("no-scroll");

}

openCart.addEventListener("click", showCart);


/* Close cart */

function hideCart() {

    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");

    document.body.classList.remove("no-scroll");

}

closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);


/* Place order */

document.getElementById("placeOrder").addEventListener("click", () => {

    if (cart.length === 0) {

        showToast("Please add an item first");

        return;

    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    alert(
        `Thank you for choosing Startbugs Café!\n\n` +
        `Order Total: ₹${total}\n\n` +
        `This is a front-end demo. No real payment has been processed.`
    );

});

/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ================= GALLERY LIGHTBOX ================= */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-item").forEach(item => {

    item.addEventListener("click", () => {

        const image = item.dataset.image;

        lightboxImage.src = image;

        lightbox.classList.add("show");

        document.body.classList.add("no-scroll");

    });

});


function closeLightbox() {

    lightbox.classList.remove("show");

    document.body.classList.remove("no-scroll");

}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeLightbox();
        hideCart();

    }

});


/* ================= TESTIMONIAL SLIDER ================= */

const slides = document.querySelectorAll(".review-slide");
const dots = document.querySelectorAll("#sliderDots button");

let currentSlide = 0;


function showSlide(index) {

    if (index < 0) {
        index = slides.length - 1;
    }

    if (index >= slides.length) {
        index = 0;
    }

    currentSlide = index;

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

}


document.getElementById("nextReview").addEventListener("click", () => {

    showSlide(currentSlide + 1);

});


document.getElementById("previousReview").addEventListener("click", () => {

    showSlide(currentSlide - 1);

});


dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

    });

});


/* Automatic slider */

setInterval(() => {

    showSlide(currentSlide + 1);

}, 5000);


/* ================= CONTACT FORM ================= */

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    let valid = true;


    /* Get fields */

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");


    /* Clear previous errors */

    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll(".form-group input, .form-group textarea")
        .forEach(field => {
            field.classList.remove("invalid");
        });


    /* Name */

    if (name.value.trim().length < 2) {

        document.getElementById("nameError").textContent =
            "Please enter your name.";

        name.classList.add("invalid");

        valid = false;

    }


    /* Email */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {

        document.getElementById("emailError").textContent =
            "Please enter a valid email.";

        email.classList.add("invalid");

        valid = false;

    }


    /* Phone */

    if (
        phone.value.trim() !== "" &&
        !/^[0-9+\-\s]{10,15}$/.test(phone.value.trim())
    ) {

        document.getElementById("phoneError").textContent =
            "Please enter a valid phone number.";

        phone.classList.add("invalid");

        valid = false;

    }


    /* Message */

    if (message.value.trim().length < 10) {

        document.getElementById("messageError").textContent =
            "Message should contain at least 10 characters.";

        message.classList.add("invalid");

        valid = false;

    }


    /* Success */

    if (valid) {

        document.getElementById("formSuccess")
            .classList.add("show");

        contactForm.reset();

        setTimeout(() => {

            document.getElementById("formSuccess")
                .classList.remove("show");

        }, 5000);

    }

});


/* ================= SCROLL ANIMATIONS ================= */

const revealElements =
    document.querySelectorAll(".reveal");


const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    observer.observe(element);

});


/* ================= BACK TO TOP ================= */

const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {

        backTop.classList.add("show");

    } else {

        backTop.classList.remove("show");

    }

});


backTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* ================= GOOGLE MAPS ================= */

function openMap() {

    const address =
        "Startbugs Cafe Main Road India";

    const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    window.open(url, "_blank");

}


/* ================= NEWSLETTER ================= */

const newsletterForm =
    document.querySelector(".newsletter-form");

newsletterForm.addEventListener("submit", event => {

    event.preventDefault();

});


newsletterForm.querySelector("button").addEventListener("click", () => {

    const input =
        newsletterForm.querySelector("input");

    if (!input.value.trim()) {

        showToast("Please enter your email");

        return;

    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {

        showToast("Please enter a valid email");

        return;

    }

    input.value = "";

    showToast("Thanks for subscribing!");

});


/* ================= INITIALIZE ================= */

updateCart();