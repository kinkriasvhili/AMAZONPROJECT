import {
  cart,
  remoFromCart,
  cartQuantityCalculation,
  updateDeliveryOption,
  disableButton,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = ``;

  cart.forEach((cartItem) => {
    disableButton(".js-place-order", () => {
      document
        .querySelector(".js-place-order")
        .classList.remove("button-disable");
    });
    const { productId } = cartItem;
    const matchingProduct = getProduct(productId);

    const { deliveryOptionId } = cartItem;
    let deliveryOption = getDeliveryOption(deliveryOptionId);

    let addedDays = deliveryOption.deliveryDays;
    const dateString = calculateDeliveryDate(addedDays);
    console.log();
    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">${dateString}</div>

      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity">
            <div class="describtion">
              <span class="size"> 
                <div class="color-container">
                  ${matchingProduct.size ? "Size: " : ""}
                  <span class="quantity-label size-label-${productId}">
                    ${matchingProduct.size ? matchingProduct.size : ""}
                  </span>  
                </div>
                <div class="size-container">
                  ${matchingProduct.color ? "Color: " : ""}
                  <span class="quantity-label quantity-label-${productId}">
                    ${matchingProduct.color ? matchingProduct.color : ""}
                  </span> 
                </div>           
              </span>
            </div>
            <span>
            Quantity:
            <span class="quantity-label quantity-label-${productId}">
              ${cartItem.quantity}
            </span> 
            <input type="number" type="text" class="update-input js-update-input-${productId}">
            </span>
            <span class="save-link js-save-link-${productId}" data-product-id=${productId}> Save </span>
            <span class="update-quantity-link link-primary" data-product-id=${productId}>
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id=${productId}>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          
          ${deliveryOptionsHTML(productId, cartItem)}
          
          
        </div>
      </div>
    </div>
  `;

    document.querySelector(".js-cart-summary").classList.remove("cart-summary");
  });
  //generate deliveroption
  function deliveryOptionsHTML(productId, cartItem) {
    let html = ``;
    deliveryOptions.forEach((deliveryOption) => {
      let addedDays = deliveryOption.deliveryDays;
      const dateString = calculateDeliveryDate(addedDays);

      const priceString =
        deliveryOption.priceCents == 0
          ? "Free"
          : `${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-dekuvery-option"
              data-product-id="${productId}"
              data-delivery-option-id="${deliveryOption.id}">
          <input
            ${isChecked ? "checked" : ""}
            type="radio"
            class="delivery-option-input"
            name="${productId}"
          />
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">${priceString} - Shipping</div>
          </div>
        </div>
        `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  function checkoutItem() {
    document.querySelector(
      ".js-item-quantity"
    ).innerHTML = `${cartQuantityCalculation(cart)} items`;
  }
  checkoutItem();
  // delete
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      let { productId } = link.dataset;
      remoFromCart(productId);
      renderOrderSummary();
      checkoutItem();
      renderPaymentSummary();
      if (cart.length == 0) {
        disableButton(".js-place-order", () => {
          document
            .querySelector(".js-place-order")
            .classList.add("button-disable");
        });
        document
          .querySelector(".js-cart-summary")
          .classList.add("cart-summary");
      }
    });
  });

  // update button
  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      let { productId } = link.dataset;
      let matchingItem;
      products.forEach((product) => {
        if (product.id === productId) {
          matchingItem = event.target;
        }
      });

      let cartQuantityElement = document.querySelector(
        `.quantity-label-${productId}`
      );
      cartQuantityElement.classList.add("quantity-label-off");

      let inputElement = document.querySelector(
        `.js-update-input-${productId}`
      );
      inputElement.classList.add("update-input-on");

      let saveSpanElement = document.querySelector(
        `.js-save-link-${productId}`
      );
      saveSpanElement.classList.add("save-links-on");
      matchingItem.classList.add("update-link-clicked");
      saveSpanElement.addEventListener("click", () => {
        saveSpanElement.classList.remove("save-links-on");
        matchingItem.classList.remove("update-link-clicked");
        inputElement.classList.remove("update-input-on");
        cartQuantityElement.classList.remove("quantity-label-off");
        if (inputElement.value == "") {
          return;
        } else if (inputElement.value > 0) {
          cart.forEach((cartItem) => {
            if (cartItem.productId == productId) {
              cartItem.quantity = Number(inputElement.value);
              renderOrderSummary();
              renderPaymentSummary();
            }
          });
          cartQuantityElement.innerHTML = inputElement.value;
        } else if (inputElement.value < 0) {
          alert("Not a valid quantity");
        }
      });
    });
  });
  // options
  document.querySelectorAll(".js-dekuvery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
