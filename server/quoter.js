let quotes = require('./quotes.json');

exports.getRandomOne = function() {
  let totalAmount = quotes.length;
  let rand = Math.floor(Math.random() * totalAmount);
  return quotes[rand];
}
