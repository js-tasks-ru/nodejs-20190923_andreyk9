function checkNumber(numb) {
  return isNaN(parseFloat(numb));
}

function sum(a, b) {
  if ([a, b].some(checkNumber)) {
    throw new TypeError();
  }

  return a + b;
}

module.exports = sum;
