class Car {
  #brand;
  #model;
  isTrukOpen;
  speed = 0;

  constructor(details) {
    this.#brand = details.brand;
    this.#model = details.model;
  }

  displayInfo() {
    let trunkStatus = this.isTrukOpen ? "open" : "close";
    console.log(`
      ${this.#brand} ${this.#model} ${this.speed}km/h, Trunk: ${trunkStatus}`);
  }

  go() {
    if (this.speed <= 195 && !this.isTrukOpen) {
      this.speed += 5;
    }
  }

  break() {
    if (this.speed >= 5) {
      this.speed -= 5;
    }
  }

  openTruck() {
    if (this.speed === 0) {
      this.isTrukOpen = true;
    }
    return this.isTrukOpen;
  }

  closeTruck() {
    this.isTrukOpen = false;
    return this.isTrukOpen;
  }
}

const car1 = new Car({
  brand: "Toyota",
  model: "Corolla",
});
const car2 = new Car({
  brand: "Tesla",
  model: "Model 3",
});

// car2.go();
// car1.openTruck();
// car1.closeTruck();
// car1.displayInfo();
// car2.displayInfo();

class RaceCar extends Car {
  acceleration;
  constructor(details) {
    super(details);
    this.acceleration = details.acceleration;
  }

  go() {
    if (!this.isTrukOpen && this.speed <= 300) {
      this.speed += this.acceleration;
    }
  }
}
const car3 = new RaceCar({
  brand: "McLaren",
  model: "F1",
  acceleration: 20,
});
car3.go();
car3.displayInfo();
