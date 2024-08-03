import { orders } from "../data/orders.js";
import { loadProductsFetch, products, getProduct } from "../data/products.js";
import { formatCurrency } from "../scripts/utils/money.js";
import { cart, cartQuantityCalculation, addToCart } from "../data/cart.js";
import { addToCartAgainAffect } from "../scripts/utils/cssAffects.js";
export let trackingItem = {};
loadProductsFetch(loadOrderHtml);
function loadOrderHtml() {
  // console.log(orders);
  let ordersHTML = ``;
  orders.forEach((value) => {
    let price = formatCurrency(value.totalCostCents);
    const date = new Date(value.orderTime);
    const options = { month: "long", day: "numeric" };
    const orderDate = date.toLocaleDateString("en-US", options);
    let productHTML = ``;
    value.products.forEach((productDetails) => {
      //console.log(productDetails.productId);
      //console.log(value.id);
      let matchingProduct = getProduct(productDetails.productId);
      let date = new Date(productDetails.estimatedDeliveryTime);
      let options = { month: "long", day: "numeric" };
      const deliveryDate = date.toLocaleDateString("en-US", options);
      let describtionFirst = matchingProduct.describtions[0];
      let describtionSecond = matchingProduct.describtions[1];
      productHTML += `
        <div class="product-image-container">
          <img src="${productDetails.image}" />
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
          <div class="describtion">

              <div class="size-container">
                ${productDetails.size ? `${describtionSecond}: ` : ""}
                <span class="quantity-label size-label-${matchingProduct.id}">
                  ${productDetails.size ? productDetails.size : ""}
                </span>  
              </div>
              <div class="color-container">
                ${productDetails.color ? `${describtionFirst}: ` : ""}
                <span class="quantity-label quantity-label-${
                  matchingProduct.id
                }">
                  ${productDetails.color ? productDetails.color : ""}
                </span> 
              </div>           

          </div>
          <div class="product-quantity">Quantity: ${
            productDetails.quantity
          }</div>
          <button class="buy-again-button button-primary js-buy-again-btn js-again-${
            productDetails.productId
          }" data-buy-again-id="${productDetails.productId}">
            <img class="buy-again-icon" src="images/icons/buy-again.png" />
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=123&productId=456">
            <button 
              class="track-package-button 
                    button-secondary 
                    js-track-package"
              data-track-package-id="${productDetails.productId}" 
              data-order-id="${value.id}"
              data-product-image="${productDetails.image}"
              data-product-color="${productDetails.color}"
              data-product-size="${productDetails.size}"
            >
              Track package
            </button>
          </a>
        </div>`;
    });
    ordersHTML += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${price}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${value.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${productHTML}
      </div>
    </div>`;
  });
  if (document.querySelector(".js-order-load")) {
    document.querySelector(".js-order-load").innerHTML = ordersHTML;
  }
  if (document.querySelector(".js-cart-quantity")) {
    document.querySelector(".js-cart-quantity").innerHTML =
      cartQuantityCalculation(cart);
  }

  document.querySelectorAll(".js-track-package").forEach((button) => {
    button.addEventListener("click", (event) => {
      let productId = button.dataset.trackPackageId;
      let { orderId } = button.dataset;
      trackingItem.productId = productId;
      trackingItem.orderId = orderId;
      let clickedButton = event.target;
      const productColor = clickedButton.getAttribute("data-product-color");
      const productSize = clickedButton.getAttribute("data-product-size");
      const productImage = clickedButton.getAttribute("data-product-image");
      trackingItem.productImage = productImage;
      trackingItem.productSize = productSize;
      trackingItem.productColor = productColor;

      localStorage.setItem("trackingItem", JSON.stringify(trackingItem));
      console.log(trackingItem);
    });
  });

  document.querySelectorAll(".js-buy-again-btn").forEach((button) => {
    button.addEventListener("click", () => {
      let productId = button.dataset.buyAgainId;
      addToCart(productId);
      loadOrderHtml();
      addToCartAgainAffect(productId);
    });
  });
}
//
