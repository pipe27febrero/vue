import axios from "axios";

const url = "https://api.coincap.io/v2";

function getAssets() {
  return axios.get(url + "/assets?limit=20").then(res => res.data);
}

function getAsset(coin) {
  return axios.get(url + "/assets/" + coin).then(res => res.data);
}

function getAssetHistory(coin)
{
  const now = new Date()
  const end = now.getTime()
  now.setDate(now.getDate()-1)
  const start = now.getTime()
  return axios.get(`${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`).then(res => res.data)
}

function getMarkets(coin)
{
  return axios.get(`${url}/assets/${coin}/markets?limit=5`).then(res => res.data)
}

function getExchange(id)
{
  return axios.get(`${url}/exchanges/${id}`).then(res => res.data)
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange
};
