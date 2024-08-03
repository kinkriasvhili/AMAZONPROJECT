import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart.js";
// import "../data/cart-oop.js";
// import "../data/cart-class.js";
// import "../data/backend-practice.js";

async function loadPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log("Unexpected error. Please try it again");
  }
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
