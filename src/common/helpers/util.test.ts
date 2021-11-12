import { PublicKey } from '@solana/web3.js';
import { objectOneInsideObjectTwo, stringifyPubkeysAndBNsInObject } from './util';

describe('stringifyPubkeysAndBNsInObject', () => {
  it('stringifies pubkeys in both objects and arrays', () => {
    const input = {
      a: new PublicKey('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA'),
      b: 'notpubkey',
      c: 123,
      d: {
        e: new PublicKey('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA'),
      },
      f: [
        { g: new PublicKey('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA') },
        { h: new PublicKey('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA') },
        { i: 'notpubkey' },
        { j: 123 },
        {
          k: {
            l: {
              o: new PublicKey('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA'),
            },
          },
        },
      ],
    };

    const expected = {
      a: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
      b: 'notpubkey',
      c: 123,
      d: {
        e: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
      },
      f: [
        { g: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA' },
        { h: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA' },
        { i: 'notpubkey' },
        { j: 123 },
        {
          k: {
            l: {
              o: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
            },
          },
        },
      ],
    };

    const actual = stringifyPubkeysAndBNsInObject(input);

    expect(actual).toEqual(expected);
  });
});

describe('objectOneInsideObjectTwo', () => {
  it('succeeds when o1 inside o2', () => {
    const o1 = {
      name: 'new_name',
      symbol: 'new_symbol',
      uri: 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
      sellerFeeBasisPoints: 10,
      creators: [
        {
          address: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
          verified: false,
          share: 50,
        },
        {
          address: 'AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX',
          verified: false,
          share: 50,
        },
      ],
    };

    const o2 = {
      key: 4,
      name: 'new_name',
      symbol: 'new_symbol',
      uri: 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
      sellerFeeBasisPoints: 10,
      creators: [
        {
          address: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
          verified: false,
          share: 50,
        },
        {
          address: 'AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX',
          verified: false,
          share: 50,
        },
      ],
      primarySaleHappened: 1,
      isMutable: 1,
    };

    const result = objectOneInsideObjectTwo(o1, o2);
    expect(result).toBeTruthy();
  });
  it('fails when o1 not actually inside o2', () => {
    const o1 = {
      name: 'new_name',
      symbol: 'new_symbol',
      uri: 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
      sellerFeeBasisPoints: 10,
      creators: [
        {
          address: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
          verified: false,
          share: 50,
        },
        {
          address: 'AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX',
          verified: false,
          share: 50,
        },
      ],
    };

    const o2 = {
      key: 4,
      name: 'new_name',
      symbol: 'new_symbol',
      uri: 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
      sellerFeeBasisPoints: 10,
      creators: [
        {
          address: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
          verified: false,
          share: 50,
        },
        {
          address: 'AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX',
          verified: false,
          share: 0, // <--- this is diff
        },
      ],
      primarySaleHappened: 1,
      isMutable: 1,
    };

    const result = objectOneInsideObjectTwo(o1, o2);
    expect(result).toBeFalsy();
  });
  it('parses out booleans into numbers', () => {
    const o1 = {
      name: 'new_name',
      symbol: 'new_symbol',
      uri: 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
      sellerFeeBasisPoints: 10,
      creators: [
        {
          address: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
          verified: false,
          share: 50,
        },
        {
          address: 'AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX',
          verified: false,
          share: 50,
        },
      ],
    };

    const o2 = {
      key: 4,
      name: 'new_name',
      symbol: 'new_symbol',
      uri: 'https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
      sellerFeeBasisPoints: 10,
      creators: [
        {
          address: '75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA',
          verified: 0,
          share: 50,
        },
        {
          address: 'AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX',
          verified: 0,
          share: 50, // <--- this is diff
        },
      ],
      primarySaleHappened: 1,
      isMutable: 1,
    };

    const result = objectOneInsideObjectTwo(o1, o2);
    expect(result).toBeTruthy();
  });
});
