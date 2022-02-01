<template>
  <div class="gmnh-center flex justify-center content-center max-w-xl">
    <!--<div class="nes-select is-dark flex-1">
      <select required id="cluster" v-model="chosenCluster">
        <option :value="Cluster.Mainnet">Mainnet</option>
        <option :value="Cluster.Devnet">Devnet</option>
        <option :value="Cluster.Testnet">Testnet</option>
        <option :value="Cluster.Localnet">Localnet</option>
      </select>
    </div>-->
    <select class="form-select bg-black text-primary" required id="wallet" v-model="chosenWallet">
      <option :value="null">Connect wallet..</option>
      <option :value="WalletName.Phantom">Phantom</option>
      <option :value="WalletName.Sollet">Sollet</option>
      <option :value="WalletName.SolletExtension">Sollet Extension</option>
      <option :value="WalletName.Solflare">Solflare</option>
      <option :value="WalletName.SolflareWeb">Solflare Web</option>
    </select>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { WalletName } from '@solana/wallet-adapter-wallets';
import useCluster, { Cluster } from '@/composables/cluster';
import useWallet from '@/composables/wallet';

export default defineComponent({
  setup() {
    // cluster
    const { cluster, setCluster, getClusterURL } = useCluster();
    //setCluster(Cluster.Devnet); //todo: maybe remove functionality to set cluster
    // wallet
    const { getWalletName, setWallet } = useWallet();
    const chosenWallet = computed({
      get() {
        return getWalletName();
      },
      set(newVal: WalletName | null) {
        setWallet(newVal, getClusterURL());
      },
    });

    return {
      Cluster,
      WalletName,
      chosenWallet,
    };
  },
});
</script>

<style scoped>
.gmnh-center {
  margin: 0 auto;
}
</style>
