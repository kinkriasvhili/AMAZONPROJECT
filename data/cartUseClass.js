class Cart {
  cartItems;
  constructor() {
    this.cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  }
  //deliveryOptionId
  saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }
  addToCart(productId) {
    let matchingItem;
    let sectionElementValue = Number(
      document.querySelector(`.js-quantity-selector-${productId}`).value
    );
    this.cartItems.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += sectionElementValue;
    } else {
      this.cartItems.push({
        productId,
        quantity: sectionElementValue,
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }
  remoFromCart(productId) {
    const newCart = [];
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId != productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;
    this.saveToStorage();
    return this.cartItems;
  }

  cartQuantityCalculation(cart) {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    this.saveToStorage();
    return cartQuantity;
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}

const items = new Cart();
export let cart = items.cartItems;
export const cartQuantityCalculation = (cart) => {
  return items.cartQuantityCalculation(cart);
};
export const saveToStorage = () => {
  items.saveToStorage();
};
export const updateDeliveryOption = (productId, deliveryOptionId) => {
  items.updateDeliveryOption(productId, deliveryOptionId);
};
export const remoFromCart = (productId) => {
  const updatedCartItems = items.remoFromCart(productId);
  cart.length = 0; // Clear the current cart
  updatedCartItems.forEach((item) => cart.push(item)); // Update the cart with the new items
  return updatedCartItems;
};
export const addToCart = (productId) => {
  items.addToCart(productId);
};
