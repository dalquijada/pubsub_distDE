const express = require("express");
const router = express();
const productsController = require("../controllers/product-controller");

router.get("/", productsController.products);
router.post("/create", productsController.createProducts);

module.exports = router;
