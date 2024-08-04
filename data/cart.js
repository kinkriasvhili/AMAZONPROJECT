export let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0 && document.querySelector(".js-cart-summary")) {
  document.querySelector(".js-cart-summary").classList.add("cart-summary");
}

export function disableButton(selector, callBack) {
  const intervalId = setInterval(() => {
    const button = document.querySelector(selector);
    if (button) {
      clearInterval(intervalId);
      callBack(button);
    }
  });
}
disableButton(".js-place-order", () => {
  document.querySelector(".js-place-order").classList.add("button-disable");
});

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
export function addToCart(productId, color, size, image, cartId) {
  disableButton(".js-place-order", () => {
    document
      .querySelector(".js-place-order")
      .classList.remove("button-disable");
  });
  let matchingItem;
  let sectionElementValue = 1;
  if (document.querySelector(`.js-quantity-selector-${productId}`)) {
    sectionElementValue = Number(
      document.querySelector(`.js-quantity-selector-${productId}`).value
    );
  }

  cart.forEach((item) => {
    console.log(item);
    if (
      productId === item.productId &&
      color === item.color &&
      size === item.size
    ) {
      matchingItem = item;
      console.log("me");
    }
  });

  if (matchingItem) {
    matchingItem.quantity += sectionElementValue;
  } else {
    cart.push({
      cartId,
      image,
      color,
      size,
      productId,
      quantity: sectionElementValue,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}
export function remoFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId != productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function cartQuantityCalculation(cart) {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  saveToStorage();
  return cartQuantity;
}

export function updateDeliveryOption(cartId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    console.log(cartItem);
    if (cartId === cartItem.cartId) {
      matchingItem = cartItem;
    } else if (cartId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export let products = [];
