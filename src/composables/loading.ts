import { computed, readonly, ref, watch } from 'vue';
import { useInterval, watchAtMost } from '@vueuse/core';

export enum LoadStatus {
  Idle,
  Loading,
  Error,
  Success,
}

export interface IUpdateLoadingParams {
  newStatus: LoadStatus;
  newProgress: number;
  maxProgress: number;
  newText: string;
}

export default function useLoading() {
  const status = ref<LoadStatus>(LoadStatus.Idle);
  const progress = ref<number>(0);
  const text = ref<string>('Loading...');

  const isIdle = computed(() => status.value === LoadStatus.Idle);
  const isLoading = computed(() => status.value === LoadStatus.Loading);
  const isError = computed(() => status.value === LoadStatus.Error);
  const isSuccess = computed(() => status.value === LoadStatus.Success);
  const isOk = computed(
    () => status.value === LoadStatus.Idle || status.value === LoadStatus.Success
  );

  // todo is this the best solution? Feels hacky...
  let currentVersion = 0;
  const startTicking = (max: number, passedVersion: number) => {
    const counter = useInterval(1000);
    watchAtMost(
      counter,
      () => {
        // if for some reason progress bar jumps above, we don't want to keep incrementing
        // also use versioning to stop old counters
        if (progress.value > max || passedVersion !== currentVersion) {
          return;
        }
        progress.value += 2;
      },
      // this ensures we stop after required number of times
      { count: Math.max(max - progress.value, 0) }
    );
  };

  const updateLoading = (
    { newStatus, newProgress, maxProgress, newText } = {} as IUpdateLoadingParams
  ) => {
    status.value = newStatus;
    progress.value = newProgress;
    text.value = newText;
    currentVersion += 1;
    startTicking(maxProgress, currentVersion);
  };

  const updateLoadingStdErr = (e: Error) => {
    updateLoading({
      newStatus: LoadStatus.Error,
      newProgress: 0,
      maxProgress: 0,
      newText: `Uh oh something went wrong - ${e}`,
    });
  };

  const updateLoadingStdWin = () => {
    updateLoading({
      newStatus: LoadStatus.Success,
      newProgress: 0,
      maxProgress: 0,
      newText: 'Successfully loaded!',
    });
  };

  return {
    status: readonly(status),
    progress: readonly(progress),
    text: readonly(text),
    isIdle,
    isLoading,
    isError,
    isSuccess,
    isOk,
    updateLoading,
    updateLoadingStdErr,
    updateLoadingStdWin,
  };
}

export function estimateNFTLoadTime(count: number) {
  // first 100 NFTs = <1min, then 1min extra for each 2500 extra 1min
  return 1 + Math.floor(count / 2000);
}
