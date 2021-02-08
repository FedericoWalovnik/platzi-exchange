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

export default {
  getAssets
};
