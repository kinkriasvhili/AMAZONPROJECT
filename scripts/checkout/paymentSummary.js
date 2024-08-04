// import { cart, cartQuantityCalculation } from "../../data/cartUseClass.js";
//without classes
import { cart, cartQuantityCalculation } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";
import { renderOrderSummary } from "./orderSummary.js";

export function renderPaymentSummary() {
  let product;
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  cart.forEach((cartItem) => {
    product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = shippingPriceCents + productPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentHTML = `
    <div class="payment-summary-title">Order Summary</div>
      <div class="payment-summary-row">
        <div>Items (${cartQuantityCalculation(cart)}):</div>
        <div class="payment-summary-money">
          $${formatCurrency(productPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$4.99</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">
          $${formatCurrency(totalBeforeTaxCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">
          $${formatCurrency(taxCents)}
        </div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">
          $${formatCurrency(totalCents)}
        </div>
      </div>
      <div class="paypal-toggle">
        Use PayPal
        <input type="checkbox" class="js-paypal-toggle" false />
      </div>
      <div class="payment-buttons">
        <div id="paypal-button-container"></div>
        <button id="secondary-button" class="place-order-button button-primary 
          js-place-order">
          Place your order
        </button>
      </div>
      
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentHTML;

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async (event) => {
      try {
        if (cart.length != 0) {
          const response = await fetch(
            "https://supersimplebackend.dev/orders",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cart: cart,
              }),
            }
          );

          let orderData = await response.json();

          cart.forEach((cartItem, index) => {
            orderData.products[index].color = cartItem.color;
            orderData.products[index].size = cartItem.size;
            orderData.products[index].image = cartItem.image;
          });
          addOrder(orderData);
        } else {
          document
            .querySelector(".js-cart-summary")
            .classList.add("cart-summary");
        }
      } catch (error) {
        console.log("Unexpected error. Try again Later " + error);
      }
      if (cart != 0) {
        window.location.href = "orders.html";
        localStorage.removeItem("cart");
        cart.length = 0;
        renderPaymentSummary();
        renderOrderSummary();
      } else {
        event.target.classList.add("button-disable");
      }
    });
}
function showPaypalButtons() {
  const paypalContainer = document.getElementById("paypal-button-container");
  paypalContainer.style.display = "none";

  document
    .querySelector(".js-paypal-toggle")
    .addEventListener("change", function (event) {
      const isChecked = event.target.checked;
      const paypalContainer = document.getElementById(
        "paypal-button-container"
      );
      const secondaryButton = document.getElementById("secondary-button");

      if (isChecked) {
        paypalContainer.style.display = "block";
        secondaryButton.style.display = "none";
      } else {
        paypalContainer.style.display = "none";
        secondaryButton.style.display = "block";
      }
    });
}
document.addEventListener("DOMContentLoaded", () => {
  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            // Corrected to purchase_units
            {
              amount: {
                value: "299.99",
              },
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        // Added onApprove function
        return actions.order.capture().then(function (details) {
          alert("Transaction completed by " + details.payer.name.given_name);
        });
      },
    })
    .render("#paypal-button-container");
  showPaypalButtons();
});
