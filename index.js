require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.send("afreeca invest api");
});

app.get("/pageb", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.get("/api/last_quote/stocks/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const url = "https://data.alpaca.markets/v1/last_quote/stocks/";
  const headers = {
    "APCA-API-KEY-ID": process.env.alpaca_key_id,
    "APCA-API-SECRET-KEY": process.env.alpaca_secret_key,
  };
  try {
    response = await axios({
      method: "get",
      url: `${url}/${symbol}`,
      headers,
    });
    return res.status(200).json({
      success: "true",
      data: response.data,
    });
  } catch (error) {
    if (error.response.status === 404) {
      return res.status(404).json({
        success: "false",
        data: {
          error: error.response.message,
        },
      });
    }
    return res.status(500).json({
      success: "false",
      data: {
        error: error.response.message,
      },
    });
  }
});

app.get("/api/marketCap/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const url = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=";
  try {
    response = await axios({
      method: "get",
      url: `${url}${symbol}&f=j1`,
    });
    return res.status(200).json({
      success: "true",
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: "false",
      data: {
        error: error.response.message,
      },
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
