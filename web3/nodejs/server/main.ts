
interface Block{
    index: number;              // ������ ��� ��ȣ
    timestamp : number;         // �� ����� ���ü�ο� �߰��� ��¥�� �ð�
    data: string;               // �� �� �̻��� �ŷ��� ���� ������
    nonce: number;              // ä���ڵ��� �˾Ƴ��� �� ����
    hash: string;               // �� ����� �ؽ�
    previousBlockHash : string; // ���� ����� �ؽð�
}


import * as crypto from 'crypto';
import * as Logger from './logger';

/*
    function hashSample(password: number) : number
    {
        const hash = 10 + (password % 2);
        console.log(`Original password : ${password}, hashed value: ${hash}`);
        return hash;
    }
*/


let nonce = 0;
async function generateHash(input : string) : Promise<string>{
    const msgBuffer = new TextEncoder().encode(input); // UTF-8 ���� ��ȯ�մϴ�.
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map( b => ('00'+b.toString(16)).slice(-2)).join("");

    return hashHex;
}

async function calculateHashWithNonce(nonce: number): Promise<string>{
    const data = 'Hello World' + nonce;
    return generateHash(data);
}

async function mine(): Promise<void>{
    let hash:string;
    do{
        hash = await calculateHashWithNonce(++nonce);
    }while(hash.startsWith('0000') === false );
    console.log(`Hash:${hash}, nonce:${nonce}`);
}
