<template>
  <div>
    <moon-loader
      :loading="isLoading"
      :color="'#68d391'"
      :size="100"
    ></moon-loader>
    <px-assets-table v-if="!isLoading" :assets="assets" />
  </div>
</template>

<script>
import api from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable";

export default {
  name: "Home",
  components: { PxAssetsTable },
  data() {
    return {
      isLoading: false,
      assets: []
    };
  },
  async created() {
    this.isLoading = true;
    const assetsData = await api.getAssets();
    this.assets = assetsData;
    this.isLoading = false;
  }
};
</script>

<style></style>
