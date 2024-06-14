const express = require("express");
const app = express();

const { createClient } = require("redis");
const client = createClient();

const getAllProducts = async () => {
  const time = Math.random() * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Produto 1", "Produto 2"]);
    }, time);
  });
};

app.get("/saved", async (req, res) => {
  await client.del("getAllProducts");
  res.send({ teste: "teste" });
});

app.get("/", async (req, res) => {
  const productsFromCache = await client.get("getAllProducts");
  if (productsFromCache) {
    return res.send(JSON.parse(productsFromCache));
  }
  const products = await getAllProducts();
  await client.set("getAllProducts", JSON.stringify(products), { EX: 5 });
  res.send(products);
});

const start = async () => {
  await client.connect();
  app.listen(3000, () => {
    console.log("server online!");
  });
};

start();
