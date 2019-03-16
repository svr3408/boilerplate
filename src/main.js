import User from "./scripts/module.js";

document.addEventListener("DOMContentLoaded", () => {
  let user = new User("Вася");
  user.sayHi(); // Вася
});
