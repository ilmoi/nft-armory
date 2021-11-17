/* eslint-disable no-use-before-define */

import { PublicKey } from '@solana/web3.js';
import fs from 'fs';
import BN from 'bn.js';

export function getEnumKeyByEnumValue(myEnum: any, enumValue: any) {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}

// NOTE: the first array *must* be the longer of the two
export function joinArraysOnKey(arr1: any[], arr2: any[], key: string) {
  const merged = [];
  for (let i = 0; i < arr1.length; i++) {
    merged.push({
      ...arr1[i],
      ...arr2.find((itmInner) => itmInner[key] === arr1[i][key]),
    });
  }
  return merged;
}

export async function okToFailAsync(callback: any, args: any[], wantObject = false) {
  try {
    // mandatory await here, can't just pass down (coz we need to catch error in this scope)
    return await callback(...args);
  } catch (e) {
    console.log(`Oh no! ${callback.name} called with ${args} blew up!`);
    console.log('Full error:', e);
    return wantObject ? {} : undefined;
  }
}

export function okToFailSync(callback: any, args: any[], wantObject = false) {
  try {
    return callback(...args);
  } catch (e) {
    console.log(`Oh no! ${callback.name} called with ${args} blew up!`);
    console.log('Full error:', e);
    return wantObject ? {} : undefined;
  }
}

export function stringifyPubkeysAndBNsInObject(o: any): any {
  const newO = { ...o };
  for (const [k, v] of Object.entries(newO)) {
    if (v instanceof PublicKey) {
      newO[k] = v.toBase58();
    } else if (v instanceof BN) {
      newO[k] = v.toString();
    } else if (parseType(v) === 'array') {
      newO[k] = stringifyPubkeysAndBNInArray(v as any);
    } else if (parseType(v) === 'dict') {
      newO[k] = stringifyPubkeysAndBNsInObject(v);
    } else {
      newO[k] = v;
    }
  }
  return newO;
}

export function stringifyPubkeysAndBNInArray(a: any[]): any[] {
  const newA = [];
  for (const i of a) {
    if (i instanceof PublicKey) {
      newA.push(i.toBase58());
    } else if (i instanceof BN) {
      newA.push(i.toString());
    } else if (parseType(i) === 'array') {
      newA.push(stringifyPubkeysAndBNInArray(i));
    } else if (parseType(i) === 'dict') {
      newA.push(stringifyPubkeysAndBNsInObject(i));
    } else {
      newA.push(i);
    }
  }
  return newA;
}

export function parseType<T>(v: T): string {
  if (v === null || v === undefined) {
    return 'null';
  }
  if (typeof v === 'object') {
    if (v instanceof Array) {
      return 'array';
    }
    if (v instanceof Date) {
      return 'date';
    }
    return 'dict';
  }
  return typeof v;
}

export async function writeToDisk(dir: string, arr: any[]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  arr.forEach((i) => {
    const data = JSON.stringify(i, (k, v) => (v instanceof PublicKey ? v.toBase58() : v), 2);
    fs.writeFile(`output/nft-${i.mint.toBase58()}.json`, data, (err) => {
      if (err) {
        console.log('Write error:', err);
      }
    });
  });
  console.log('Done writing!');
}

export async function pause(ms: number) {
  // weird semantics - but needed to work inside jest
  // taken from https://stackoverflow.com/questions/46077176/jest-settimeout-not-pausing-test
  await new Promise((response) =>
    setTimeout(() => {
      console.log(`pausing for ${ms / 1000}s`);
      response(0);
    }, ms)
  );
}

export function objectOneInsideObjectTwo(o1: any, o2: any): boolean {
  const jsonObj1 = { ...o1 };
  const jsonObj2 = { ...o2 };
  return Object.keys(jsonObj1).every((k1) => {
    if (parseType(jsonObj1[k1]) === 'boolean') {
      jsonObj1[k1] = +jsonObj1[k1];
    }
    if (parseType(jsonObj1[k1]) === 'dict') {
      return objectOneInsideObjectTwo(jsonObj1[k1], jsonObj2[k1]);
    }
    if (parseType(jsonObj1[k1]) === 'array') {
      const results: boolean[] = [];
      jsonObj1[k1].forEach((o: any, i: number) => {
        if (parseType(o) === 'boolean') {
          o = +o;
        }
        if (parseType(o) === 'dict') {
          results.push(objectOneInsideObjectTwo(o, jsonObj2[k1][i]));
        } else {
          results.push(o === jsonObj2[k1][i]);
        }
      });
      return results.every((r) => r);
    }
    return Object.keys(jsonObj2).some((k2) => {
      if (parseType(jsonObj2[k2]) === 'boolean') {
        jsonObj2[k2] = +jsonObj2[k2];
      }
      return jsonObj1[k1] === jsonObj2[k2];
    });
  });
}

export function isIterable(value: any): boolean {
  return Symbol.iterator in Object(value);
}
