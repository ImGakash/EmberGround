const axios = require("axios");

require("dotenv").config();

const BREETH_BASE_URL = "https://api.thebreeth.com";

const searchBreeth = async () => {
  try {
    console.log("Searching Nagrik memory in Breeth...");

    const response = await axios.post(
      `${BREETH_BASE_URL}/v1/search`,
      {
        query:
          "What do you know about Nagrik application BSP-2026-10482?",
        limit: 5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BREETH_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("\nBreeth Search Result:\n");

    console.log(
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.error("\nBreeth search failed ❌");

    console.error(
      error.response?.data || error.message
    );
  }
};

searchBreeth();