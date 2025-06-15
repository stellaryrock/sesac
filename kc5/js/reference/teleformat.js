import assert from 'assert';

const telfmt = str => {
  const len = str.length;
  if (len < 7) return str;
  if (len <= 8) return str.replace(/(\d{3,4})(\d{4})$/g, '$1-$2');

  // const g3 = 4;
  const g1 = str.startsWith('02') ? 2 : len === 12 ? 4 : 3;
  const g2 = len - g1 - 4;
  // console.log(str, '->', g1, g2, g3);

  const regexp = new RegExp(`(\\d{${g1}})(\\d{${g2}})(\\d{4})$`, 'g');
  return str.replace(regexp, '$1-$2-$3');
};




assert.deepStrictEqual(telfmt('0101234567'), '010-123-4567');
assert.deepStrictEqual(telfmt('01012345678'), '010-1234-5678');
assert.deepStrictEqual(telfmt('0212345678'), '02-1234-5678');
assert.deepStrictEqual(telfmt('021234567'), '02-123-4567');
assert.deepStrictEqual(telfmt('0331234567'), '033-123-4567');
assert.deepStrictEqual(telfmt('15771577'), '1577-1577');
assert.deepStrictEqual(telfmt('07012341234'), '070-1234-1234');
assert.deepStrictEqual(telfmt('050712345678'), '0507-1234-5678');

