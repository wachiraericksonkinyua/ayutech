import { bodyParts } from '../data/bodyparts.js';
import { brakeParts } from '../data/brakeparts.js';
import { engineParts } from '../data/engineparts.js';
import { gearParts } from '../data/gearparts.js';
import { serviceParts } from '../data/serviceparts.js';
import { suspensionParts } from '../data/suspensionparts.js';

document.addEventListener('DOMContentLoaded', () => {
  function highlight(text, term) {
    if (!term) return text;
    return text.replace(new RegExp(`(${term})`, 'gi'), '<mark>$1</mark>');
  }

  function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  const allProducts = [
    ...bodyParts,
    ...brakeParts,
    ...engineParts,
    ...gearParts,
    ...serviceParts,
    ...suspensionParts
  ];

  const productsGrid = document.querySelector('.js-products-grid');
  const noProductsMessage = document.querySelector('.no-products-message');
  const searchInput = document.getElementById('find');

  function renderProducts(products, filter = '') {
    if (products.length === 0) {
      noProductsMessage.style.display = 'block';
      productsGrid.innerHTML = '';
      return;
    }
    noProductsMessage.style.display = 'none';
    productsGrid.innerHTML = products.map((product, idx) => `
      <div class="product-card" data-idx="${idx}">
        <button class="remove-product-btn" title="Remove">&times;</button>
        <img src="${product.image}" alt="${product.name}">
        <h3>${highlight(product.name, filter)}</h3>
        <p>${(product.priceCents / 100).toLocaleString()} KES</p>
        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
      </div>
    `).join('');

    document.querySelectorAll('.remove-product-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        card.remove();
      });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const productId = btn.dataset.productId;
        addToCart(productId);
        alert('Added to cart!');
      });
    });
  }

  searchInput.addEventListener('keyup', function() {
    const filter = this.value.toLowerCase();
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(filter) ||
      product.keywords.some(k => k.toLowerCase().includes(filter))
    );
    renderProducts(filtered, filter);
  });

 
});