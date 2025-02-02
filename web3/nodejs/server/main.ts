//기초부터 블록체인 실습까지
//단숨에 배우는 타입스크립트
//p.219

interface Block{
    index: number;
    timestamp : number;
    data: string;
    nonce: number;
    hash: string;
    previousBlockHash : string;
}