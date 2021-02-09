<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <moon-loader
        :loading="isLoading"
        :color="'#68d391'"
        :size="100"
      ></moon-loader>
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span> #{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Current Price</b>
              <span> {{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Lowest Price</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Highest Price</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Average Price</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">24hs Variation</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl"></span>
        </div>
      </div>
      <line-chart
        class="my-50"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />

      <h3 class="text-xl my-10">Best change offers</h3>
      <table>
        <tr
          v-for="market in markets"
          :key="`${market.exchangeId}-${market.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ market.exchangeId }}</b>
          </td>
          <td>{{ market.priceUsd | dollar }}</td>
          <td>{{ market.baseSymbol }} / {{ market.quoteSymbol }}</td>
          <td>
            <px-button
              :isLoading="market.isLoading || false"
              v-if="!market.url"
              @onClickButton="getWebsite(market)"
            >
              <slot>Get Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck" :href="market.url">
              {{ market.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/api";
import PxButton from "@/components/PxButton";

export default {
  name: "CoinDetail",
  components: {
    PxButton
  },
  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: []
    };
  },
  computed: {
    min() {
      return Math.min(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    max() {
      return Math.max(
        ...this.history.map(h => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      );
    }
  },

  async created() {
    await this.getCoin();
  },
  methods: {
    async getWebsite(exchange) {
      this.$set(exchange, "isLoading", true);

      const newUrl = await api.getExchange(exchange.exchangeId);
      this.$set(exchange, "url", newUrl.exchangeUrl);

      this.$set(exchange, "isLoading", false);

    },

    async getCoin() {
      const id = this.$route.params.id;
      this.isLoading = true;
      this.asset = await api.getAsset(id);
      this.history = await api.getAssetHistory(id);
      this.markets = await api.getMarkets(id);
      this.isLoading = false;
    }
  }
};
</script>
