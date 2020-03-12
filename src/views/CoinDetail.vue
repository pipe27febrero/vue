<template>
  <div class="flex-col">
    <div class="flex justify-center">
       <bounce-loader :color="'#68d391'" :loading="isLoading" :size="100"></bounce-loader>
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            class="w-20 h-20 mr-5"
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
          />
          <h1 class="text-5xl">
              {{asset.name}}
            <small class="sm:mr-2 text-gray-500">{{asset.symbol}}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank}}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar}}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{asset.changePercent24Hr | percentage}}</span>
            </li>
            
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            @click="toggleConverter"
            
          >
           {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD`}}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full">
              <input
                v-model="convertValue"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl">{{ convertResult }} {{ fromUsd ?  `${asset.symbol}` : `USD`}}</span>
        </div>
      </div>
      <line-chart class="my-10" 
      :colors="['orange']"
      :min="min"
      :max="max"
      :data="history.map(h=>[h.date,parseFloat(h.priceUsd).toFixed(2)])"/>
      <h3 class="text-xl my-10"> Mejores Ofertas de Cambio </h3>
          <table >
        <tr v-for="m in markets" :key="`${m.exchangeId}-${m.priceUsd}`" class="border-b">
          <td class="px-8 py-2">
            <b>{{ m.exchangeId}} </b>
          </td>
          <td>
              {{ m.priceUsd | dollar}}
          </td>
          <td>
             {{ m.baseSymbol }} / {{ m.quoteSymbol }}
          </td>
          <td>
            <px-button 
            :is-loading="m.isLoading || false"
            v-if="!m.url"
            @custom-click="getWebsite(m)">
              <slot>Obtener Link </slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blank" :href="m.url">
              {{ m.url }} </a>
          </td>
        </tr>
      </table>

     
      
     
    </template>
  </div>
</template>

<script>
import api from "@/api";
import PxButton from '@/components/PxButton'
export default {
  name: "CoinDetail",
  components : {PxButton},
  watch : {
    $route() {
      this.getCoin()
    }
  },
  data() {
    return {
      asset: {},
      history : [],
      isLoading : false,
      markets : [],
      fromUsd : true,
      convertValue : null
    };
  },
  computed : {
      convertResult(){
        if(!this.convertValue)
        {
          return 0
        }
        const result = this.fromUsd ? this.convertValue/this.asset.priceUsd : this.convertValue * this.asset.priceUsd        
        return result.toFixed(4)
      },
      min(){
          return Math.min(...this.history.map(h => parseFloat(h.priceUsd).toFixed(2)))
      },
      max(){
          return Math.max(...this.history.map(h => parseFloat(h.priceUsd).toFixed(2)))
      },
      avg(){
          const avgPrice = this.history.map(h => parseFloat(h.priceUsd)).reduce((a,b) => a+b,0)/this.history.length
          return avgPrice.toFixed(2)
      }
  },
  created() {
    this.getCoin()
  },
  methods: {
    toggleConverter(){
      this.fromUsd = !this.fromUsd
    },
    getWebsite(exchange){
      this.$set(exchange,'isLoading',true)
      return api.getExchange(exchange.exchangeId)
            .then(res => {
              this.$set(exchange,'url',res.data.exchangeUrl)
            }).finally(() => {
              this.$set(exchange,'isLoading',false)
            })
    },
    getCoin() {
      const id = this.$route.params.id;
      this.isLoading = true
      Promise.all([
          api.getAsset(id),
          api.getAssetHistory(id),
          api.getMarkets(id)
      ]).then(([asset,assetHistory,markets]) => {
          this.asset = asset.data
          this.history = assetHistory.data
          this.markets = markets.data
      }).finally(() => this.isLoading = false)
    }
    }
}

</script>

<style scoped>
  td {
    padding: 10px;
  }


</style>
