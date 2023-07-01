const currentDateTime = require("./date");
const date = currentDateTime();

console.log(`Today is ${date.date}, the current time is ${date.time}.`);
