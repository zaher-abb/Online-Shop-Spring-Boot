// URL of the Lambda endpoint
const api_shop_url = "https://70a1dz3t08.execute-api.us-east-1.amazonaws.com/prod/products";

// Function to fetch and list all products
async function loadProducts() {
    try {
        const response = await fetch(api_shop_url); // Fetch all products
        const products = await response.json();

        if (Array.isArray(products) && products.length > 0) {
            const productContainer = document.getElementById("product-list");
            let markup = "";
            products.forEach((product) => {
                const imgUrl = Array.isArray(product.image_url)
                    ? product.image_url[0].replace("s3://", "https://")
                    : product.image_url;
                markup += `
                <div class="product-card">
                    <a href="product.html?id=${product.PK}">
                        <img src="${imgUrl}" alt="${product.product_name}">
                    </a>
                    <h3>${product.product_name}</h3>
                    <a href="product.html?id=${product.PK}" class="btn btn-primary">View Product</a>
                </div>`;
            });
            productContainer.innerHTML = markup;
            setupProductObserver();
        } else {
            console.error("No products found.");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", loadProducts);

function setupProductObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
}


// Language data
const translations = {
    en: {
        "slider-title-1": "Welcome To Our Gift Shop",
        "slider-subtitle-1": "With love || Homemade || from Berlin.",
        "slider-title-2": "Welcome To Our <br> Gift Shop",
        "slider-subtitle-2": "With love || Homemade || from Berlin.",
        "slider-title-3": "Welcome To Our <br> Gift Shop",
        "slider-subtitle-3": "With love || Homemade || from Berlin.",
        "category-link-1": "button",
        "category-link-2": "opening",
        "category-link-3": "hanger",
        "our-products": "Our Products",
        "best-savings": "Best Savings on <br> new arrivals",
        "why-shop-with-us": "Why Shop With Us",
        "fast-delivery": "Fast Delivery",
        "fast-delivery-desc": "Fast Delivery to you home or office.",
        "free-shiping": "Free Shiping",
        "free-shiping-desc": "Free Shiping in Berlin",
        "best-quality": "Best Quality",
        "best-quality-desc": "We offer you a prime quality product.",
        "gifts-for-loved-ones": "Gifts for your <br> loved ones",
        "buy-now": "Buy Now",
        "contact-us": "Contact Us",
        "name-placeholder": "Name",
        "email-placeholder": "Email",
        "phone-placeholder": "Phone",
        "message-placeholder": "Message",
        "testimonial": "Testimonial",
        "about-us-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,",
        "need-help-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,",
    },
    de: {
        "slider-title-1": "Willkommen in unserem Geschenkeladen",
        "slider-subtitle-1": "Mit Liebe || Hausgemacht || aus Berlin.",
        "slider-title-2": "Willkommen in unserem <br> Geschenkeladen",
        "slider-subtitle-2": "Mit Liebe || Hausgemacht || aus Berlin.",
        "slider-title-3": "Willkommen in unserem <br> Geschenkeladen",
        "slider-subtitle-3": "Mit Liebe || Hausgemacht || aus Berlin.",
        "category-link-1": "knopf",
        "category-link-2": "fta7a",
        "category-link-3": "3la2a",
        "our-products": "Unsere Produkte",
        "best-savings": "Beste Ersparnisse auf <br> Neuankömmlinge",
        "why-shop-with-us": "Warum bei uns einkaufen",
        "fast-delivery": "Schnelle Lieferung",
        "fast-delivery-desc": "Schnelle Lieferung zu Ihnen nach Hause oder ins Büro.",
        "free-shiping": "Kostenloser Versand",
        "free-shiping-desc": "Kostenloser Versand in Berlin",
        "best-quality": "Beste Qualität",
        "best-quality-desc": "Wir bieten Ihnen ein Produkt von höchster Qualität.",
        "gifts-for-loved-ones": "Geschenke für Ihre <br> Lieben",
        "buy-now": "Jetzt kaufen",
        "contact-us": "Kontaktieren Sie uns",
        "name-placeholder": "Name",
        "email-placeholder": "E-Mail",
        "phone-placeholder": "Telefon",
        "message-placeholder": "Nachricht",
        "testimonial": "Zeugnis",
        "about-us-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,",
        "need-help-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,",
    },
    ar: {
        "slider-title-1": "مرحباً بكم في متجر الهدايا الخاص بنا",
        "slider-subtitle-1": "بكل حب || من صنع يدوي || من برلين",
        "slider-title-2": "مرحباً بكم في <br> متجر الهدايا الخاص بنا",
        "slider-subtitle-2": "بكل حب || من صنع يدوي || من برلين",
        "slider-title-3": "مرحباً بكم في <br> متجر الهدايا الخاص بنا",
        "slider-subtitle-3": "بكل حب || من صنع يدوي || من برلين",
        "category-link-1": "زر",
        "category-link-2": "افتتاح",
        "category-link-3": "علاقة",
        "our-products": "منتجاتنا",
        "best-savings": "أفضل المدخرات على <br> الوافدين الجدد",
        "why-shop-with-us": "لماذا تتسوق معنا",
        "fast-delivery": "توصيل سريع",
        "fast-delivery-desc": "توصيل سريع لمنزلك أو مكتبك",
        "free-shiping": "شحن مجاني",
        "free-shiping-desc": "شحن مجاني في برلين",
        "best-quality": "أفضل جودة",
        "best-quality-desc": "نقدم لكم منتجًا بجودة ممتازة",
        "gifts-for-loved-ones": "هدايا لأحبائك",
        "buy-now": "اشتري الآن",
        "contact-us": "اتصل بنا",
        "name-placeholder": "الاسم",
        "email-placeholder": "البريد الإلكتروني",
        "phone-placeholder": "الهاتف",
        "message-placeholder": "الرسالة",
        "testimonial": "شهادة",
        "about-us-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,",
        "need-help-text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet, consectetur adipiscing elit, sed doLorem ipsum dolor sit amet,",
    },
};

// Function to translate the page
function translatePage(lang) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((element) => {
        const key = element.dataset.translate;
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
}

// Function to handle language selection
function handleLanguageSelection() {
    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const lang = button.dataset.lang;
            // Remove active class from all buttons
            langButtons.forEach((btn) => {
                btn.classList.remove("active");
            });
            // Add active class to the clicked button
            button.classList.add("active");
            // Translate the page
            translatePage(lang);
        });
    });
}

// Initialize
handleLanguageSelection();
// Translate to english as default
translatePage("en");
////////// Cart ///////


// PayPal Button Render
paypal.Buttons({
    createOrder: function (data, actions) {
        const totalText = document.getElementById('order-total').innerText.replace(/[^\d.]/g, '');
        const totalAmount = parseFloat(totalText).toFixed(2);

        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalAmount
                }
            }]
        });
    },
    onApprove: function (data, actions) {

        return actions.order.capture().then(function (details) {
            submitOrder(cartItems, totalAmount);
            alert('Transaction completed by ' + details.payer.name.given_name + '!');
            // TODO: trigger order creation backend call here if needed
        });
    },
    onError: function (err) {
        console.error('PayPal Checkout Error:', err);
        alert('Something went wrong during checkout.');
    }
}).render('#paypal-button-container');

function updateTotalPrice() {
    const qty = parseInt(document.getElementById('quantity').value);
    const priceText = document.getElementById('product-price').innerText;
    const price = parseFloat(priceText.replace(/[€$€]/, '')) || 0;
    const total = (price * qty).toFixed(2);
    document.getElementById('product-total').innerText = `€${total}`;
}

function updateQuantity(change) {
    const qtyInput = document.getElementById('quantity');
    let qty = parseInt(qtyInput.value);
    qty += change;
    if (qty < 1) qty = 1;
    qtyInput.value = qty;
    updateTotalPrice();
}

//// iamge in index

document.addEventListener("DOMContentLoaded", () => {
    // Animate photos on scroll
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {threshold: 0.2});

    document.querySelectorAll(".photo-box").forEach(box => {
        observer.observe(box);
    });

    // Lightbox modal
    const modal = document.createElement("div");
    modal.id = "imageModal";
    modal.style.cssText = `
    display: none; position: fixed; z-index: 999;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.85); justify-content: center;
    align-items: center; flex-direction: column;
  `;
    modal.style.display = "none";

    const modalImg = document.createElement("img");
    modalImg.style.cssText = `
    max-width: 90%; max-height: 90%; box-shadow: 0 0 40px rgba(255,255,255,0.3);
  `;
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    document.querySelectorAll(".photo-box img").forEach(img => {
        img.addEventListener("click", () => {
            modalImg.src = img.src;
            modal.style.display = "flex";
        });
    });

    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });

});


////// Load single product 


///cart

document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.querySelector('table tbody');
    let total = 0;

    tbody.innerHTML = '';

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        const row = `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" width="50"> ${item.name}</td>
        <td>${item.quantity}</td>
        <td>€${item.price.toFixed(2)}</td>
        <td>€${subtotal.toFixed(2)}</td>
      </tr>
    `;
        tbody.innerHTML += row;
    });

    document.querySelector('.text-right h4').innerText = `Total: €${total.toFixed(2)}`;
});

async function updateCartCount() {
    try {

        const response = await fetch(`https://70a1dz3t08.execute-api.us-east-1.amazonaws.com/prod/cart?userId=${userId}`);

        const cartItems = await response.json();

        document.getElementById('cart-count').textContent = cartItems.length;
        return cartItems.length;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
    });
