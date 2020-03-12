import numeral from "numeral";

const dollarFilter = function(value) {
  if (!value) {
    return "$ 0";
  }
  return numeral(value).format("($ 0.00 a)");
};

const percentageFilter = function(value) {
  if (!value) {
    return "0.00 %";
  }
  let percentaje = parseFloat(value).toFixed(2)+" %"
  return percentaje
};
export { dollarFilter, percentageFilter };
