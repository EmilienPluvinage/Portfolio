export function displayPrice(priceInCents) {
  // displays the price with a comma and two decimals, unless it's 0, in which case we return 0.
  var i = Math.round(priceInCents).toString().length - 2;
  var result =
    priceInCents === 0
      ? 0
      : (i > 0 ? priceInCents.toString().slice(0, i) : "0") +
        "," +
        (i === -1 ? "0" : "") +
        priceInCents.toString().slice(i, i + 2);
  return result;
}

export function displayPercentage(value) {
  return (value * 100).toString() + "%";
}
