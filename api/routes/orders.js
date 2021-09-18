const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const order = require("../models/order");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("product  quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + doc._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err.name,
      });
    });
});

// Error occurred

// router.get("/:orderId", (req, res, next) => {
//   Order.findById(req.params.orderId)
//     .exec()
//     .then((order) => {
//     if(!order) {
//       return res.status(404).json({
//         message:"Order not found "
//       })

//     }
//       res.status(200).json({
//         order: order,
//         request: {
//           type: "GET",
//           url: "http://localhost:3000/orders",
//         },
//       })

//     .catch((err) => {
//       res.status(500).json({
//         error: err.name,
//       });
//     });
// });

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhsot:3000/orders",
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.name,
      });
    });
});

module.exports = router;
