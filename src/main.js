import User from './scripts/module.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = new User('Вася');
  user.sayHi(); // Вася
});
