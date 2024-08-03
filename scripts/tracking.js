import { getProduct, products, loadProductsFetch } from "../data/products.js";
import { orders } from "../data/orders.js";
import { cart, cartQuantityCalculation } from "../data/cart.js";
loadProductsFetch(loadTackingPage);
function loadTackingPage() {
  const trackingItem = JSON.parse(localStorage.getItem("trackingItem"));

  let trackingProduct = getProduct(trackingItem.productId);
  let describtionFirst = trackingProduct.describtions[0];
  let describtionSecond = trackingProduct.describtions[1];

  let orderTime = "";
  let arriveDate = "";
  let productQuantity = 0;
  orders.forEach((item) => {
    if (item.id == trackingItem.orderId) {
      orderTime = item.orderTime;
      item.products.forEach((product) => {
        if (product.productId == trackingItem.productId) {
          arriveDate = product.estimatedDeliveryTime;
          productQuantity = product.quantity;
        }
      });
    }
  });
  //arive time
  //arriveDate = "2024-07-27T17:47:00.00Z";

  const dateOfArrive = new Date(arriveDate);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  const ConvertedArriveDate = dateOfArrive.toLocaleDateString("en-US", options);
  //2024-08-03T16:38:35.561Z
  //order time
  const dateOfOrder = new Date(orderTime);

  //curent Time
  const currentTime = new Date().toISOString();
  const currentTimeInNum = new Date(currentTime);

  //differences
  const differenceCurrentToOrder = currentTimeInNum - dateOfOrder;
  const differenceOrderToArrive = dateOfArrive - dateOfOrder;

  let percentageOfDelivery =
    (differenceCurrentToOrder / differenceOrderToArrive) * 100;
  let currentPreparing = "";
  let currentDelivered = "";
  let currentShipped = "";
  if (percentageOfDelivery >= 0 && percentageOfDelivery < 49) {
    currentPreparing = "current-status";
  } else if (percentageOfDelivery >= 49 && percentageOfDelivery < 100) {
    currentShipped = "current-status";
  }
  if (percentageOfDelivery >= 100) {
    currentDelivered = "current-status";
  }
  document.querySelector(".js-tracking-page").innerHTML = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">Arriving on ${ConvertedArriveDate}</div>

      <div class="product-info">
        ${trackingProduct.name}
      </div>

      <div class="describtion">
        <div class="color-container">
          ${trackingProduct.size ? `${describtionSecond}: ` : ""}
          <span class="quantity-label size-label-${trackingProduct.id}">
            ${trackingProduct.size ? trackingProduct.size : ""}
          </span>  
        </div>
        <div class="size-container">
          ${trackingProduct.color ? `${describtionFirst}: ` : ""}
          <span class="quantity-label quantity-label-${trackingProduct.id}">
            ${trackingProduct.color ? trackingProduct.color : ""}
          </span> 
        </div>           
      </div>

      <div class="product-info">Quantity: ${productQuantity}</div>

      <img
        class="product-image"
        src="${trackingProduct.image}"
      />

      <div class="progress-labels-container">
        <div class="progress-label ${currentPreparing}">Preparing</div>
        <div class="progress-label ${currentShipped}">Shipped</div>
        <div class="progress-label ${currentDelivered}" >Delivered</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width:${percentageOfDelivery}%"></div>
      </div>
    </div>`;

  if (document.querySelector(".js-cart-quantity")) {
    document.querySelector(".js-cart-quantity").innerHTML =
      cartQuantityCalculation(cart);
  }
}
