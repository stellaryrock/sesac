//기초부터 블록체인 실습까지
//단숨에 배우는 타입스크립트
//p.219

interface Block{
    index: number;              // 순차적 블록 번호
    timestamp : number;         // 새 블록이 블록체인에 추가된 날짜와 시간
    data: string;               // 한 번 이상의 거래에 대한 데이터
    nonce: number;              // 채굴자들이 알아내야 할 숫자
    hash: string;               // 이 블록의 해시
    previousBlockHash : string; // 이전 블록의 해시값
}


//import * as crypto from 'crypto';

let nonce = 0;
async function generateHash(input : string) : Promise<string>{
    const msgBuffer = new TextEncoder().encode(input); // UTF-8 으로 변환합니다.
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map( b => ('00'+b.toString(16)).slice(-2)).join("");

    return hashHex;
}

