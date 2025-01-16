// Load cart from localStorage or initialize empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add an item to the cart
function addToCart(name, size, price) {
    const existingItemIndex = cart.findIndex(item => item.name === name && item.size === size);

    if (existingItemIndex >= 0) {
        // If item already exists in cart, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Otherwise, add a new item
        const item = { name, size, price: parseFloat(price), quantity: 1 };  // Ensure price is a float
        cart.push(item);
    }
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Function to remove an item from the cart
function removeFromCart(index) {
    index = parseInt(index, 10);
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

// Function to update the cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartModal = document.querySelector('.cart-modal');  // Get the modal

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = 'Total: $0.00';
        cartModal.style.display = 'none';  // Close modal if empty
        return;
    }

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

    bindRemoveButtons();
}

// Function to bind event listener for remove buttons
function bindRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
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
        const size = sizeSelect ? sizeSelect.value : 'N/A';
        const price = sizeSelect ? parseFloat(sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-price')) : parseFloat(e.target.getAttribute('data-price'));

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
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Open the cart modal when the "Cart" button is clicked
document.querySelector('.cart-btn').addEventListener('click', function() {
    document.querySelector('.cart-modal').style.display = 'flex';
});

// Close the cart modal when the "Close" button is clicked
document.querySelector('.close-cart-btn').addEventListener('click', function() {
    document.querySelector('.cart-modal').style.display = 'none';
});

// Checkout functionality
document.querySelector('.checkout-btn').addEventListener('click', function() {
    const checkoutForm = document.createElement('form');
    checkoutForm.innerHTML = `
        <h3 class="checkout-title">Checkout</h3>
        <label for="name" class="checkout-label">Full Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="address" class="checkout-label">Shipping Address:</label>
        <input type="text" id="address" name="address" required>
        <label for="payment" class="checkout-label">Payment Method:</label>
        <select id="payment" name="payment">
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
        </select>
        <button type="submit">Place Order</button>
        <div class="checkout-cancel">
            <button type="button" class="exit-btn">Exit Checkout</button>
        </div>
    `;

    const cartModal = document.querySelector('.cart-content');
    cartModal.innerHTML = '';
    cartModal.appendChild(checkoutForm);

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('#name').value;
        const address = document.querySelector('#address').value;

        if (!name || !address) {
            alert('Please fill in all required fields.');
            return;
        }

        const formData = new FormData(checkoutForm);
        console.log('Checkout Info:', Object.fromEntries(formData.entries()));

        // Clear the cart and save it
        cart = [];
        saveCartToLocalStorage();
        updateCartDisplay();

        alert('Thank you for your order!');
        document.querySelector('.cart-modal').style.display = 'none';
    });

    document.querySelector('.exit-btn').addEventListener('click', function() {
        document.querySelector('.cart-modal').style.display = 'none';
        updateCartDisplay();
    });
});