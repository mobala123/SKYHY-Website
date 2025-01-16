document.getElementById('open-modal-btn').addEventListener('click', function() {
    document.getElementById('modal-overlay').classList.add('show'); // Show modal
});

document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('modal-overlay').classList.remove('show'); // Hide modal
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent actual form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Email:', email);
    console.log('Password:', password);

    // Optionally close the modal after form submission
    document.getElementById('modal-overlay').classList.remove('show');
});
cart.js:
javascript
Copy code
// Cart Management Script
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage or initialize empty cart

// Function to add an item to the cart
function addToCart(name, size, price) {
    const item = { name, size, price, quantity: 1 }; // Add quantity to each item
    cart.push(item);
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Function to remove an item from the cart
function removeFromCart(index) {
    index = parseInt(index, 10); // Convert index from string to integer
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay(); // Update the cart display after removal
        saveCartToLocalStorage(); // Save the updated cart to localStorage
    }
}

// Function to update the cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');

    // Clear the cart display
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = 'Total: $0.00';
        return;
    }

    let total = 0;

    // Loop through the cart and generate the cart display
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name} - ${item.size} - $${parseFloat(item.price).toFixed(2)} x ${item.quantity}</span>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
        total += parseFloat(item.price) * item.quantity; // Multiply by quantity
    });

    // Update the total cost
    cartTotal.textContent = `Total: $${total.toFixed(2).toLocaleString()}`;

    // Re-bind event listener for "Remove" buttons after cart display is updated
    bindRemoveButtons();
}

// Function to bind event listener for remove buttons
function bindRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index); // Pass the index to the remove function
        });
    });
}

// Save the cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load the cart from localStorage when the page is loaded
window.addEventListener('load', function() {
    updateCartDisplay();
});

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const sizeSelect = e.target.closest('.menu-item').querySelector('.size-select');
        const size = sizeSelect ? sizeSelect.value : 'N/A'; // Ensure size is available or set to 'N/A'
        const price = sizeSelect ? sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-price') : e.target.getAttribute('data-price');

        // Ensure we have a price and name before adding to cart
        if (!name || !price) {
            alert('Error: Missing item information!');
            return;
        }

        addToCart(name, size, price);
    });
});

// Event listener for filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        filterMenu(category);
    });
});

// Function to filter menu items
function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-category');

    menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block'; // Show item
        } else {
            item.style.display = 'none'; // Hide item
        }
    });
}

// Open the cart modal when the "View Cart" button is clicked
document.querySelector('.cart-btn').addEventListener('click', function() {
    document.querySelector('.cart-modal').style.display = 'flex'; // Show the cart modal
});

// Close the cart modal when the "Close Cart" button is clicked
document.querySelector('.close-cart-btn').addEventListener('click', function() {
    document.querySelector('.cart-modal').style.display = 'none'; // Hide the cart modal
});