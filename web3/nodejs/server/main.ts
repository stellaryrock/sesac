//���ʺ��� ���ü�� �ǽ�����
//�ܼ��� ���� Ÿ�Խ�ũ��Ʈ
//p.219

interface Block{
    index: number;              // ������ ��� ��ȣ
    timestamp : number;         // �� ����� ���ü�ο� �߰��� ��¥�� �ð�
    data: string;               // �� �� �̻��� �ŷ��� ���� ������
    nonce: number;              // ä���ڵ��� �˾Ƴ��� �� ����
    hash: string;               // �� ����� �ؽ�
    previousBlockHash : string; // ���� ����� �ؽð�
}


//import * as crypto from 'crypto';

let nonce = 0;
async function generateHash(input : string) : Promise<string>{
    const msgBuffer = new TextEncoder().encode(input); // UTF-8 ���� ��ȯ�մϴ�.
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map( b => ('00'+b.toString(16)).slice(-2)).join("");

    return hashHex;
}

