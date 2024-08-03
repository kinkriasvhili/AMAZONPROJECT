class Cart {
  cartItems;
  #localStorageKey;

  // constructor run without calling out it;
  // has to be named constructor
  // we can't return in constructor
  // setup code => constructor
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
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

let productId = "83d4ca15-0f35-48f5-b7a3-1ea210004f2e";

//parametries for Cart(p)
const cart = new Cart("cart-oop");
export const businessCart = new Cart("cart-business");

// this mess up code so we have privates add #
// cart.localStorageKey = 'aaa'
//with # -private witthout # public
// also we can use # on methods to make it private

// console.log(cart);
// console.log(businessCart);
// console.log(businessCart instanceof Cart);
