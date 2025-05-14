//https://docs.google.com/presentation/d/1aUvS2ABdVVb38LquViBKbJnqtZi82QSZn7DGzkuH9M8/edit#slide=id.g2dd6cbe4cc1_0_0
// 56 ~ 57 �� �����̵�

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
  let max = Math.max((a.toString().split(".")[1] || "").length, (b.toString().split(".")[1] || "").length); // �Ǽ����� ����
  let chk = ("0.".concat(parseFloat(a.toString().split(".")[1])) > "0.".concat(parseFloat(b.toString().split(".")[1]))) ? true : false; // a�� �Ǽ��ΰ� b�� �Ǽ��κ��� ū��
  let isNegative = (a + b) < 0; // ���� ��������

  // ������ ����� ��ȯ
  a = setNegative(a);
  b = setNegative(b);

  // 2������ ��ȯ
  a = a.toString(2).split(".");
  b = b.toString(2).split(".");

  // �Ҽ��ΰ� ������ �� ���ڿ��� �ʱ�ȭ
  a[1] = a[1] || "";
  b[1] = b[1] || "";

  // ������, �Ҽ����� ���̸� ���߱� ���� 0�� �߰�
  a[0].length < b[0].length ? a[0] = addZeros(a[0], b[0].length - a[0].length, false) : b[0] = addZeros(b[0], a[0].length - b[0].length, false);
  a[1].length < b[1].length ? a[1] = addZeros(a[1], b[1].length - a[1].length, true) : b[1] = addZeros(b[1], a[1].length - b[1].length, true);

  // ������ 2�� ������ ��ȯ
  if ((!isANegative && isBNegative) || (isANegative && !isBNegative)) {
    if (isANegative) a = negateAndAddBinary(a);
    if (isBNegative) b = negateAndAddBinary(b);
  }

  // �Ҽ���, �������� ���� ���
  decimal = calBinary(a[1], b[1]);
  integer = calBinary(a[0], b[0]);

  // ������ 2�� ���� ���� ����
  if((!isANegative && isBNegative) || (isANegative && !isBNegative)) {    
    if(isNegative) {
      [integer, decimal] = [integer.split("").map((x) => x === "0" ? "1" : "0").join(""), decimal.split("").map((x) => x === "0" ? "1" : "0").join("")];
    }

    // A�� ������ ��, a�� �Ǽ��ΰ� b�� �Ǽ��κ��� ũ�� �ʴٸ� 1�� ������
    if (!chk && isANegative) {
      integer = (parseInt(integer, 2) + 1).toString(2);
    }
  }

  console.log((isNegative ? -1 : 1) * (parseInt(integer, 2) + binaryToFloat(decimal, max)));
}


