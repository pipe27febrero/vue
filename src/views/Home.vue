<template>
  <px-assets-table :assets="assets"> </px-assets-table>
</template>

<script>
import api from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable.vue";

export default {
  name: "Home",
  components: { PxAssetsTable },
  data() {
    return {
      assets: []
    };
  },
  created() {
    api.getAssets().then(assets => (this.assets = assets.data));
  }
};
</script>
