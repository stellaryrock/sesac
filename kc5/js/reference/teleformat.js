import assert from 'assert';

const _telfmt = str => {
  const len = str.length;
  if (len < 7) return str;
  if (len <= 8) return str.replace(/(\d{3,4})(\d{4})$/g, '$1-$2');
  
  const g1 = str.startsWith('02') ? 2 : len === 12 ? 4 : 3;
  const g2 = len - g1 - 4;

  const regexp = new RegExp(`(\\d{${g1}})(\\d{${g2}})(\\d{4})$`, 'g');
  return str.replace(regexp, '$1-$2-$3');
};

const __telfmt = str => {
  const len = str.length;
  if( len < 7 ) return str;
  if( len <= 8 || len > 12 ) return str.replace(/(\d{3,4})(\d{4})/g, '$1-$2');
    
  const g1 = str.startsWith('02') ? 2 : len >= 12 ? 4 : 3;
  const g2 = len - g1 - 4;

  const regexp = new RegExp();
  str.replace( `/{\\d${g1}\\d{${g2}}\\d{4}}/g`, '$1-$2-$3');
  console.log(`/{\\d${g1}\\d{${g2}}\\d{4}}/g`);

  return str;
}

const telfmt = ( store, str ) => {
  if(str < 7 || str > 12) return str;
  if(str <= 8) return str.replace(/\d{3,4}\d{4}/g,'$1-$2');
  
  
  return str.startsWith();
}

console.log(_telfmt('12341234'));
console.log(_telfmt('0101234567'));
console.log(_telfmt('0212345678'));
console.log(_telfmt('0331234567'));
console.log(_telfmt('07012341234'));
console.log(_telfmt('050712345678'));

// assert.deepStrictEqual(telfmt('0101234567'), '010-123-4567');
// assert.deepStrictEqual(telfmt('01012345678'), '010-1234-5678');
// assert.deepStrictEqual(telfmt('0212345678'), '02-1234-5678');
// assert.deepStrictEqual(telfmt('021234567'), '02-123-4567');
// assert.deepStrictEqual(telfmt('0331234567'), '033-123-4567');
// assert.deepStrictEqual(telfmt('15771577'), '1577-1577');
// assert.deepStrictEqual(telfmt('07012341234'), '070-1234-1234');
// assert.deepStrictEqual(telfmt('050712345678'), '0507-1234-5678');

