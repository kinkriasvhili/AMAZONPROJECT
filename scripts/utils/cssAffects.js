export function addToCartAffect(productId, addedMessageTimeouts) {
  const addedToCartElement = document.querySelector(
    `.js-added-cart-${productId}`
  );
  addedToCartElement.classList.add("showAddedToCartElement");

  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }
  const timeoutId = setTimeout(() => {
    addedToCartElement.classList.remove("showAddedToCartElement");
  }, 2000);
  addedMessageTimeouts[productId] = timeoutId;
}
let addedMessageTimeoutsLoad = {};
export function addToCartAgainAffect(productId) {
  document.querySelector(
    `.js-again-${productId}`
  ).innerHTML = `<i class="fa-solid fa-check"></i> Added`;
  const previousTimeoutId = addedMessageTimeoutsLoad[productId];

  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  const timeoutId = setTimeout(() => {
    document.querySelector(`.js-again-${productId}`).innerHTML = `
    <img class="buy-again-icon" src="images/icons/buy-again.png" />
    <span class="buy-again-message">
      Buy it again
    </span>`;
  }, 2000);
  addedMessageTimeoutsLoad[productId] = timeoutId;
}
