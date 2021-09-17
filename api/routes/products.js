const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        product: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            volume: doc.volume,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error.name);
      res.status(500).json({ error: error });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    volume: req.body.volume,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Handling POST request to  /products",
        createdProduct: {
          name: result.name,
          price: result.price,
          volume: result.volume,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.name,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({ message: "Not a valid number you enter" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product update",
        request: { type: "GET", url: "http://localhost:3000/products/" + id },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.name });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        url: "http://localhost:3000/products",
        data: { name: "String", price: "Number", volume: "Number" },
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
