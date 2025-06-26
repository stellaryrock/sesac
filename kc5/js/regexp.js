//초성 검색을 하는 search함수를 정규식을 이용하여 작성하시오.
const s = ['강원도 고성군', '고성군 토성면', '토성면 북면', '북면', '김1수'];

'강원도 고성군'.charCodeAt(0);

searchByKoreanInitialSound(s, 'ㄱㅅㄱ');
searchByKoreanInitialSound(s, 'ㅌㅅㅁ');
searchByKoreanInitialSound(s, 'ㅂㅁ'); 
searchByKoreanInitialSound(s, 'ㅍㅁ'); 
searchByKoreanInitialSound(s, 'ㄱ1ㅅ');
