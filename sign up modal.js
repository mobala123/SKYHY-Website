// Get elements
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const modal = document.getElementById("modal");

// Open modal when the button is clicked
openModalBtn.addEventListener("click", function() {
  modal.style.display = "flex";
});

// Close modal when the close button is clicked
closeModalBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// Optionally close modal if clicked outside the modal content
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});