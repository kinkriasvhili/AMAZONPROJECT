import { addToCart, cart } from "../../data/cart.js";

describe("test sute: addToCart", () => {
  it("adds an existing product to the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]);
    });
    addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d");
    expect(cart.length).toEqual(1);
  });
});
