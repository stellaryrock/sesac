//https://docs.google.com/presentation/d/1aUvS2ABdVVb38LquViBKbJnqtZi82QSZn7DGzkuH9M8/edit#slide=id.g2dd6cbe4cc1_0_0
// 56 ~ 57 번 슬라이드

function chkNegative(value) { return value < 0 ? true : false; }
function setNegative(value) { return value < 0 ? -value : value; }
function addZeros(value, length, isBack) { return isBack ? value + "0".repeat(length) : "0".repeat(length) + value; }
function binaryToFloat(value, limit) { return parseFloat(value.split("").reduce((acc, cur, idx) => acc + cur * Math.pow(2, -idx - 1), 0).toFixed(limit)); }
function negateAndAddBinary(value) { return addBinary(negateBinary(value)); }
function negateBinary(value) { return value.map(x => x.split("").map(bit => bit === "0" ? "1" : "0").join("")) }

function addBinary(value) {
  let [integerPart, decimalPart] = value;
  let count = 1;

  let decimal = decimalPart.split("").reverse().map(bit => {
    if (count === 0) return bit;
    if (bit === "0") {
      count = 0;
      return "1";
    }
    return "0";
  }).reverse().join("");

  let integer = integerPart.split("").reverse().map(bit => {
    if (count === 0) return bit;
    if (bit === "0") {
      count = 0;
      return "1";
    }
    return "0";
  }).reverse().join("");

  return [integer, decimal];
}
function addPoints(a, b) {
  function calBinary(value1, value2) {
    return (
      (result) => {
        for (let i = value1.length - 1; i >= 0; i--) {
          let sum = (+value1[i]) + (+value2[i]) + carry;
          carry = sum >> 1;
          result = (sum % 2) + result;
        }
        return result;
      }
    )("");
  }

  const isANegative = chkNegative(a);
  const isBNegative = chkNegative(b);

  let carry = 0;
  let integer = "";
  let decimal = "";
  let max = Math.max((a.toString().split(".")[1] || "").length, (b.toString().split(".")[1] || "").length); // 실수부의 길이
  let chk = ("0.".concat(parseFloat(a.toString().split(".")[1])) > "0.".concat(parseFloat(b.toString().split(".")[1]))) ? true : false; // a의 실수부가 b의 실수부보다 큰지
  let isNegative = (a + b) < 0; // 합이 음수인지

  // 음수면 양수로 변환
  a = setNegative(a);
  b = setNegative(b);

  // 2진수로 변환
  a = a.toString(2).split(".");
  b = b.toString(2).split(".");

  // 소수부가 없으면 빈 문자열로 초기화
  a[1] = a[1] || "";
  b[1] = b[1] || "";

  // 정수부, 소수부의 길이를 맞추기 위해 0을 추가
  a[0].length < b[0].length ? a[0] = addZeros(a[0], b[0].length - a[0].length, false) : b[0] = addZeros(b[0], a[0].length - b[0].length, false);
  a[1].length < b[1].length ? a[1] = addZeros(a[1], b[1].length - a[1].length, true) : b[1] = addZeros(b[1], a[1].length - b[1].length, true);

  // 음수면 2의 보수로 변환
  if ((!isANegative && isBNegative) || (isANegative && !isBNegative)) {
    if (isANegative) a = negateAndAddBinary(a);
    if (isBNegative) b = negateAndAddBinary(b);
  }

  // 소수부, 정수부의 합을 계산
  decimal = calBinary(a[1], b[1]);
  integer = calBinary(a[0], b[0]);

  // 음수면 2의 보수 연산 수행
  if((!isANegative && isBNegative) || (isANegative && !isBNegative)) {    
    if(isNegative) {
      [integer, decimal] = [integer.split("").map((x) => x === "0" ? "1" : "0").join(""), decimal.split("").map((x) => x === "0" ? "1" : "0").join("")];
    }

    // A가 음수일 때, a의 실수부가 b의 실수부보다 크지 않다면 1을 더해줌
    if (!chk && isANegative) {
      integer = (parseInt(integer, 2) + 1).toString(2);
    }
  }

  console.log((isNegative ? -1 : 1) * (parseInt(integer, 2) + binaryToFloat(decimal, max)));
}


