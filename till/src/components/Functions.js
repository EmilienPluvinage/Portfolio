export function displayPrice(n) {
  // displays the price with a comma and two decimals, unless it's 0, in which case we return 0.

  var i = Math.round(n * 100).toString().length - 2;
  return n === 0
    ? 0
    : (i > 0 ? (n * 100).toString().slice(0, i) : "0") +
        "," +
        (n * 100).toString().slice(i, i + 2);
}
