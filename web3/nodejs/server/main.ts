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

