const baseUrl = "https://api.coincap.io/v2";

const getAssets = async () => {
  try {
    const rawData = await fetch(`${baseUrl}/assets?limit=20`);
    const jsonData = await rawData.json();
    return jsonData.data;
  } catch (error) {
    console.error("The api request was not succesful");
  }
};

const getAsset = async (coin) => {
  try {
    const rawData = await fetch(`${baseUrl}/assets/${coin}`);
    const jsonData = await rawData.json();
    return jsonData.data;
  } catch (error) {
    console.error("The api request was not succesful");
  }
};

const getAssetHistory = async (coin) => {
  try {
    const now = new Date();
    const end = now.getTime();
    now.setDate(now.getDate() - 1);
    const start = now.getTime();

    const rawData = await fetch(
      `${baseUrl}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`,
    );
    const jsonData = await rawData.json();
    return jsonData.data;
  } catch (error) {
    console.error("The api request was not succesful");
  }
};

export default {
  getAssets,
  getAsset,
  getAssetHistory,
};
