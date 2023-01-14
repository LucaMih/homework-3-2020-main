const express = require("express");
const Sequelize = require("sequelize");
var bodyParser = require("body-parser");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "my.db",
});

let FoodItem = sequelize.define(
  "foodItem",
  {
    name: Sequelize.STRING,
    category: {
      type: Sequelize.STRING,
      validate: {
        len: [3, 10],
      },
      allowNull: false,
    },
    calories: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  }
);

const app = express();
// TODO
app.use(bodyParser.json());

app.get("/create", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    for (let i = 0; i < 10; i++) {
      let foodItem = new FoodItem({
        name: "name " + i,
        category: ["MEAT", "DAIRY", "VEGETABLE"][Math.floor(Math.random() * 3)],
        calories: 30 + i,
      });
      await foodItem.save();
    }
    res.status(201).json({ message: "created" });
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/food-items", async (req, res) => {
  try {
    let foodItems = await FoodItem.findAll();
    res.status(200).json(foodItems);
  } catch (err) {
    console.warn(err.stack);
    res.status(500).json({ message: "server error" });
  }
});

app.post("/food-items", async (req, res) => {
  try {
    // TODO
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "body is missing" });
    } else {
      let name = req.body.name;
      let calories = req.body.calories;
      let category = req.body.category;
      if (
        typeof name === "undefined" ||
        typeof category === "undefined" ||
        typeof calories === "undefined"
      ) {
        res.status(400).send({ message: "malformed request" });
      } else if (calories < 0) {
        res
          .status(400)
          .send({ message: "calories should be a positive number" });
      } else if (category.length < 2) {
        res.status(400).send({ message: "not a valid category" });
      } else {
        console.log("!DM 201 created|");
        res.status(201).send({ message: "created" });
      }
    }
  } catch (err) {
    // TODO
    res.status(400).send({ message: "malformed request" });
  }
});

module.exports = app;
