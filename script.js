const apiURL =
  "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

let cartData = [];

async function fetchCartData() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    cartData = data.items;
    populateCart(cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

function populateCart(items) {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let subtotal = 0;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartRow = document.createElement("tr");
    cartRow.innerHTML = `
      <td><img src="${item.image}" alt="${
      item.title
    }" class="cart-item-image" width="60px" height="60px"></td>
      <td style="color: #9F9F9F;">${item.title}</td>
      <td style="color: #9F9F9F;">₹${(item.price / 100).toFixed(2)}</td>
      <td><input type="number" value="${
        item.quantity
      }" min="1" class="quantity-input" data-id="${item.id}"></td>
      <td>₹${(itemTotal / 100).toFixed(2)}</td>
      <td><button class="remove-btn" data-id="${
        item.id
      }"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.625 7H20.125V4.8125C20.125 3.84727 19.3402 3.0625 18.375 3.0625H9.625C8.65977 3.0625 7.875 3.84727 7.875 4.8125V7H4.375C3.89102 7 3.5 7.39102 3.5 7.875V8.75C3.5 8.87031 3.59844 8.96875 3.71875 8.96875H5.37031L6.0457 23.2695C6.08945 24.202 6.86055 24.9375 7.79297 24.9375H20.207C21.1422 24.9375 21.9105 24.2047 21.9543 23.2695L22.6297 8.96875H24.2812C24.4016 8.96875 24.5 8.87031 24.5 8.75V7.875C24.5 7.39102 24.109 7 23.625 7ZM18.1562 7H9.84375V5.03125H18.1562V7Z" fill="#B88E2F"/>
            </svg></button></td>
    `;

    cartItems.appendChild(cartRow);
  });

  updateCartTotals(subtotal);
  addEventListeners();
}

function updateCartTotals(subtotal) {
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  subtotalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
  totalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
}

function addEventListeners() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", handleQuantityChange);
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", handleItemRemove);
  });
}

function handleQuantityChange(event) {
  const input = event.target;
  const newQuantity = parseInt(input.value);
  const itemId = input.dataset.id;

  if (newQuantity > 0) {
    updateItemQuantity(itemId, newQuantity);
  } else {
    input.value = 1;
    updateItemQuantity(itemId, 1);
  }
}

function handleItemRemove(event) {
  const button = event.currentTarget;
  const itemId = button.dataset.id;
  removeItemFromCart(itemId);
}

function updateItemQuantity(itemId, newQuantity) {
  const item = cartData.find((item) => item.id == itemId);
  if (item) {
    item.quantity = newQuantity;

    populateCart(cartData);
  }
}

function removeItemFromCart(itemId) {
  cartData = cartData.filter((item) => item.id != itemId);
  populateCart(cartData);
}

fetchCartData();
