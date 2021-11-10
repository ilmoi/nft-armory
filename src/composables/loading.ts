import { computed, readonly, ref, watch } from 'vue';
import { useInterval, watchAtMost } from '@vueuse/core';

export enum LoadStatus {
  Idle,
  Loading,
  Error,
  Success,
}

export interface UpdateLoadingParams {
  newStatus?: LoadStatus;
  newProgress?: number;
  maxProgress?: number;
  newText?: string;
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

  const startTicking = (max: number) => {
    // console.log('triggered with max of', max);

    // todo is this the best solution? Feels hacky...
    const counter = useInterval(200);
    watchAtMost(
      counter,
      (newVal) => {
        // if for some reason progress bar jumps above, we don't want to keep incrementing
        if (progress.value > max) {
          return;
        }
        // console.log(newVal);
        progress.value += 1;
      },
      // this ensures we stop after required number of times
      { count: Math.max(max - progress.value, 0) }
    );
  };

  const updateLoading = (
    { newStatus, newProgress, maxProgress, newText } = {} as UpdateLoadingParams
  ) => {
    if (newStatus) status.value = newStatus;
    if (newProgress) progress.value = newProgress;
    if (newText) text.value = newText;
    if (maxProgress) startTicking(maxProgress);
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
  };
}

function pause(ms: number) {
  setTimeout(() => {
    console.log(`pausing for ${ms / 1000}s`);
  }, ms);
}
