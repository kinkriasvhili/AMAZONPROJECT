import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id == deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(addedDays) {
  const today = dayjs();
  let deliveryDate = today.add(addedDays, "days");
  let weekDay = deliveryDate.format("dddd");
  while (weekDay === "Sunday" || weekDay === "Saturday") {
    addedDays += 1;
    deliveryDate = today.add(addedDays, "days");
    weekDay = deliveryDate.format("dddd");
  }
  let dateString = deliveryDate.format("dddd, MMMM D");
  return dateString;
}
