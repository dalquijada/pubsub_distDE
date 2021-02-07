const { PubSub, v1 } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const pubSubClient2 = new v1.PublisherClient();
const topicName = "products_topic";

const pubsubRepository = require("../repositories/pub-sub-repo");

const { publishMessage } = pubsubRepository;

module.exports = {
    //Obtener lista de productos disponibles
    products: (req, res, next) => {
        req.getConnection(function (error, conn) {
            conn.query(
                "SELECT * FROM `productos` ORDER BY idproductos ASC",
                function (err, rows, fields) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        return res.json(rows);
                    }
                }
            );
        });
    },

    //Añadir producto ADMIN y publicar mensaje pubsub
    createProducts: async (req, res) => {
        var productsObj = req.body;
        var notif = productsObj.nombre;
        req.getConnection(function (error, conn) {
            conn.query(
                "INSERT INTO `productos` SET ?",
                productsObj,
                function (err, result) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        req.flash("success", "Producto Añadido Exitosamente");
                        console.log("Funciona añadir producto");
                    }
                }
            );
        });

        console.log(productsObj);
        var messageId = await publishMessage(pubSubClient, topicName, notif);
        return res.status(200).json({
            success: true,
            message: `Message ${messageId} published :)`,
        });
    },

    //Obtener detalle de producto
    productDetail: (req, res, next) => {
        req.getConnection(function (error, conn) {
            conn.query(
                "SELECT * FROM `productos` WHERE idproductos = ?",
                req.params.id_producto,
                function (err, rows, fields) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        return res.json(rows);
                    }
                }
            );
        });
    },

    //Actualizar producto ADMIN
    updateProduct: async (req, res) => {
        var productsObj = req.body;
        console.log(productsObj);
        req.getConnection(function (error, conn) {
            conn.query(
                "UPDATE `productos` SET ? WHERE idproductos = " +
                    req.params.id_producto,
                productsObj,
                function (err, result) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        console.log("Funciona Actualizar producto");
                        return res.json(result);
                    }
                }
            );
        });
    },
};
