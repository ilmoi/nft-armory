import { isIterable } from '@/common/helpers/util';

function isPresent(dictKey: any, dict: any): boolean {
  return dictKey in dict;
}

// may or may not resemble epicness levels in WoW:)
export enum RarityCategory {
  Legendary = 'legendary',
  Epic = 'epic',
  Rare = 'rare',
  Uncommon = 'uncommon',
  Common = 'common',
}

function assignRarityCategory(itemRank: number, totalItems: number) {
  const percentile = (itemRank / totalItems) * 100;
  if (percentile <= 1) {
    return RarityCategory.Legendary;
  }
  if (percentile <= 5) {
    return RarityCategory.Epic;
  }
  if (percentile <= 20) {
    return RarityCategory.Rare;
  }
  if (percentile <= 40) {
    return RarityCategory.Uncommon;
  }
  return RarityCategory.Common;
}

function countAttributes(files: any[]) {
  const counterDicts: any = {};
  for (const f of files) {
    const { attributes } = f.metadataExternal;
    if (!isIterable(attributes)) {
      continue;
    }

    for (const attribute of attributes) {
      const dictName = attribute.trait_type;
      const dictEntry = attribute.value;

      if (isPresent(dictName, counterDicts)) {
        if (isPresent(dictEntry, counterDicts[dictName])) {
          counterDicts[dictName][dictEntry] += 1;
        } else {
          counterDicts[dictName][dictEntry] = 1;
        }
      } else {
        counterDicts[dictName] = {};
        counterDicts[dictName][dictEntry] = 1;
      }
    }
  }
  // console.log(counterDicts)
  return counterDicts;
}

function calcRarityScores(counterDicts: any, fileCount: number) {
  console.log('length is', fileCount);
  const rarityScoreDicts: any = {};
  for (const [attrName, attrDict] of Object.entries(counterDicts)) {
    rarityScoreDicts[attrName] = {};
    for (const [attrEntry, attrCount] of Object.entries(attrDict as any)) {
      rarityScoreDicts[attrName][attrEntry] = 1 / ((attrCount as any) / fileCount);
    }
  }
  // console.log(rarityScoreDicts)
  return rarityScoreDicts;
}

function rankFilesByRarity(files: any[], rarityDicts: any) {
  const scoredFiles = [...files];
  for (const f of scoredFiles) {
    f.rarityScore = 0;
    const { attributes } = f.metadataExternal;
    if (!isIterable(attributes)) {
      continue;
    }

    for (const attribute of attributes) {
      f.rarityScore += rarityDicts[attribute.trait_type][attribute.value];
    }
  }
  const sortedScoredFiles = scoredFiles.sort(
    (first, second) => second.rarityScore - first.rarityScore
  );
  for (const [i, el] of sortedScoredFiles.entries()) {
    el.rarityRank = i;
    el.rarityCategory = assignRarityCategory(i, files.length);
  }
  // console.log(sortedScoredFiles.splice(0, 10))
  return sortedScoredFiles;
}

// todo yes this is naive but for collections with 10k files this calc is good enough
export function processRarity(files: any[]) {
  const t1 = performance.now();

  const attrs = countAttributes(files);
  const t2 = performance.now();

  const rarityDicts = calcRarityScores(attrs, files.length);
  const t3 = performance.now();

  const rankedFiles = rankFilesByRarity(files, rarityDicts);
  const t4 = performance.now();

  console.log('time to count attrs', (t2 - t1) / 1000);
  console.log('time to count rarity scores', (t3 - t2) / 1000);
  console.log('time to rank files', (t4 - t3) / 1000);
  console.log('tital time', (t4 - t1) / 1000);

  return rankedFiles;
}
