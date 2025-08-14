import {cart, removeFromCart} from '../data/cart.js';

import { bodyParts } from '../data/bodyparts.js';
import { brakeParts } from '../data/brakeparts.js';
import { engineParts } from '../data/engineparts.js';
import { suspensionParts } from '../data/suspensionparts.js';
import { gearParts } from '../data/gearparts.js';
import { serviceParts } from '../data/serviceparts.js';
import { lubricants } from '../data/lubricants.js';
import { formatCurrency } from './utils/money.js';

const products = [
  ...bodyParts,
  ...brakeParts,
  ...engineParts,
  ...gearParts,
  ...suspensionParts,
  ...serviceParts,
  ...lubricants
];

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  // Skip if product not found
  if (!matchingProduct) {
    console.warn(`Product with ID ${productId} not found`);
    return;
  }

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        For Delivery details please Contact The number provided
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            Ksh${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
});

// Update the DOM
const orderSummaryElement = document.querySelector('.js-order-summary');
if (orderSummaryElement) {
  orderSummaryElement.innerHTML = cartSummaryHTML;
} else {
  console.error('Order summary element not found');
}
let totalPriceCents = 0;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  if (matchingProduct) {
    totalPriceCents += matchingProduct.priceCents * cartItem.quantity;
    // ...existing code for cartSummaryHTML...
  }
});
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML +
  `<div class="cart-total">
     <strong>Total: ${formatCurrency(totalPriceCents)}</strong>
   </div>`;
// Better event delegation approach
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('js-delete-link')) {
    const productId = event.target.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    if (container) {
      container.remove();
      renderPaymentSummary();
    }
  }
});