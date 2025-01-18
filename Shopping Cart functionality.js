// Initialize the cart from localStorage or use an empty array if not found
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart display in the modal
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartModal = document.querySelector('.cart-modal');  // Get the modal

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = 'Total: $0.00';
        cartModal.style.display = 'none';  // Hide modal if empty
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} - ${item.size} - $${item.price.toFixed(2)} x ${item.quantity}</span>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = `Total: $${total.toFixed(2).toLocaleString()}`;
        bindRemoveButtons(); // Bind remove button functionality
    }
}

// Function to add an item to the cart
function addToCart(name, size, price) {
    const existingItemIndex = cart.findIndex(item => item.name === name && item.size === size);

    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1; // If item exists, update quantity
    } else {
        cart.push({ name, size, price: parseFloat(price), quantity: 1 }); // Add new item
    }

    saveCartToLocalStorage();
    updateCartDisplay(); // Update the cart display after adding
}

// Function to remove an item from the cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // Remove item
        saveCartToLocalStorage();
        updateCartDisplay(); // Update the cart display after removing
    }
}

// Function to save the cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to bind event listener for remove buttons
function bindRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index); // Call removeFromCart with the correct index
        });
    });
}

// Show cart modal when the "View Cart" button is clicked
document.querySelector('.cart-btn').addEventListener('click', function() {
    document.querySelector('.cart-modal').style.display = 'flex'; // Show the cart modal
});

// Close cart modal when the "Close" button is clicked
document.querySelector('.close-cart-btn').addEventListener('click', function() {
    document.querySelector('.cart-modal').style.display = 'none'; // Hide the cart modal
});

// Function to initialize the cart on page load
window.addEventListener('load', function() {
    updateCartDisplay(); // Load cart items from localStorage on page load
});

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const sizeSelect = e.target.closest('.menu-item').querySelector('.size-select');
        const size = sizeSelect ? sizeSelect.value : 'N/A';
        const price = sizeSelect ? parseFloat(sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-price')) : parseFloat(e.target.getAttribute('data-price'));

        if (!name || !price) {
            alert('Error: Missing item information!');
            return;
        }

        addToCart(name, size, price); // Add item to cart
    });
});