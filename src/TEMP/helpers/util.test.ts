import { PublicKey } from '@solana/web3.js';
import { stringifyPubkeysInObject } from './util';

describe('stringifies pubkeys', () => {
  it('in both objects and arrays', () => {
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

    const actual = stringifyPubkeysInObject(input);

    expect(actual).toEqual(expected);
  });
});
