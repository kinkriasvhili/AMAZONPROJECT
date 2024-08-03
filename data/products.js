import { formatCurrency } from "../scripts/utils/money.js";

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHtml() {
    return ``;
  }
}
class Describtion extends Product {
  colors;
  sizes;
  color;
  size;

  constructor(productDetails) {
    super(productDetails);
    this.size = productDetails.size;
    this.color = productDetails.color;
    this.colors = productDetails.colors;
    this.sizes = productDetails.sizes;
  }
  extraInfoHtml() {
    const colorButton = this.colors
      .map((color, index) => {
        return `<button class="color-button color-${this.id}" data-product-id="${this.id}" data-color-index="${index}" data-color-image="${color.image}">${color.name}</button>`;
      })
      .join("");

    const sizeButton = this.sizes
      .map((size, index) => {
        return `<button class="size-button" data-product-id="${this.id}" data-size-index="${index}">${size.name}</button>`;
      })
      .join("");

    return `
      ${
        colorButton
          ? `

          <div class="button-container">
            ${colorButton}
          </div>`
          : ""
      }
      ${sizeButton ? `<div class="button-container">${sizeButton}</div>` : ""}
    `;
  }
}

export let products = JSON.parse(localStorage.getItem("products")) || [];
function saveProductToStorage() {
  localStorage.setItem("products", JSON.stringify(products));
}

export async function loadProductsFetch(fun) {
  //send request
  try {
    let promise;
    let data;
    if (JSON.parse(localStorage.getItem("products"))) {
      data = JSON.parse(localStorage.getItem("products"));
    } else {
      promise = await fetch("../backend/products.json");
      data = await promise.json();
    }
    products = data.map((productDetails) => {
      if (productDetails.colors) {
        return new Describtion(productDetails);
      } else {
        return new Product(productDetails);
      }
    });
    if (fun && data) {
      await fun();
    }
    return promise;
  } catch (error) {
    console.log("Unexpected error. Please try it again ", error);
  }
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("color-button")) {
    handleColorButtonClickColor(event);
  } else if (event.target.classList.contains("size-button")) {
    handleColorButtonClickSize(event);
  }
});

function handleColorButtonClickColor(event) {
  const clickedButton = event.target;
  const productId = clickedButton.getAttribute("data-product-id");
  const product = getProduct(productId);
  const colorButtons = [
    ...document.querySelectorAll(
      `.color-button[data-product-id="${productId}"]`
    ),
  ];

  colorButtons.forEach((button) => {
    button.classList.remove("active");
  });
  clickedButton.classList.add("active");
  const colorImage = clickedButton.getAttribute("data-color-image");
  console.log(colorImage);

  let imageColor = clickedButton.innerHTML;

  product.image = colorImage;

  document.querySelector(`.product-image-${productId}`).src = product.image;
  product.color = imageColor;
  saveProductToStorage();
}

function handleColorButtonClickSize(event) {
  const clickedButton = event.target;
  const productId = clickedButton.getAttribute("data-product-id");
  const product = getProduct(productId);
  const sizeButtons = [
    ...document.querySelectorAll(
      `.size-button[data-product-id="${productId}"]`
    ),
  ];
  sizeButtons.forEach((button) => {
    button.classList.remove("active");
  });

  clickedButton.classList.add("active");
  const sizeIndex = clickedButton.getAttribute("data-size-index");
  product.size = product.sizes[sizeIndex].name;
  saveProductToStorage();
}

document.addEventListener("DOMContentLoaded", () => {
  function activeBtn() {
    products.forEach((product) => {
      const colorButtons = [
        ...document.querySelectorAll(
          `.color-button[data-product-id="${product.id}"]`
        ),
      ];

      const sizeButtons = [
        ...document.querySelectorAll(
          `.size-button[data-product-id="${product.id}"]`
        ),
      ];

      if (colorButtons) {
        colorButtons.forEach((button) => {
          if (button.innerHTML == product.color) {
            button.classList.add("active");
          }
        });
      }
      if (sizeButtons) {
        sizeButtons.forEach((button) => {
          if (button.innerHTML == product.size) {
            button.classList.add("active");
          }
        });
      }
    });
  }
  loadProductsFetch(activeBtn);
});
