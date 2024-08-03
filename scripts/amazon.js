import { cart, addToCart, cartQuantityCalculation } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "../scripts/utils/money.js";
import { addToCartAffect } from "../scripts/utils/cssAffects.js";

loadProductsFetch(renderProductsGrid);

function renderProductsGrid() {
  let productsHTML = ``;
  updateCartQuantity();
  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");
  let filteredProducts = products;
  if (search) {
    filteredProducts = products.filter((product) => {
      let filteredName = product.name.toUpperCase().replace(/[-:]/g, "");
      let filteredSearch = search.toUpperCase().replace(/[-:]/g, "");
      return filteredName.includes(filteredSearch);
    });
  }
  if (filteredProducts.length === 0) {
    productsHTML = "<p class='no-product'>No products matched your search.</p>";
  }
  // console.log(filteredProducts);
  filteredProducts.forEach((product) => {
    // console.log(filteredProducts);
    productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img
          
          class="product-image
                 product-image-${product.id}"
          src="${product.image}"
        />
      </div>

      <div class="product-name limit-text-to-2-lines">
       ${product.name}
      </div>

      <div class="product-rating-container">
        <img
          class="product-rating-stars"
          src="${product.getStarsUrl()}"
        />
        <div class="product-rating-count link-primary">${
          product.rating.count
        }</div>
      </div>

      <div class="product-price">${product.getPrice()}</div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHtml()}

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-cart-${product.id}">
        <img src="images/icons/checkmark.png" />
        Added
      </div>

      <button 
      class="
        add-to-cart-button 
        button-primary 
        js-add-to-cart" 
      data-product-id="${product.id}">
        Add to Cart</button>
    </div>`;
  });
  document.querySelector(".search-button-js").addEventListener("click", () => {
    let searchValue = document.querySelector(".search-input-js").value;
    window.location.href = `amazon.html?search=${searchValue}`;
  });
  document
    .querySelector(".search-input-js")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        let searchValue = document.querySelector(".search-input-js").value;
        window.location.href = `amazon.html?search=${searchValue}`;
      }
    });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  function updateCartQuantity() {
    document.querySelector(".js-cart-quantity").innerHTML =
      cartQuantityCalculation(cart);
  }

  let addedMessageTimeouts = {};
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      addToCart(productId);

      updateCartQuantity();
      addToCartAffect(productId, addedMessageTimeouts);
    });
  });
}
