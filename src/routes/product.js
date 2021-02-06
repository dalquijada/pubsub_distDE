const express = require("express");
const router = express();
const productsController = require("../controllers/product-controller");

router.get("/", productsController.products);
router.get("/(:id_producto)", productsController.productDetail);
router.post("/(:id_producto)", productsController.updateProduct);
router.post("/create", productsController.createProducts);

module.exports = router;
