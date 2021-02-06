const { PubSub, v1 } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const pubSubClient2 = new v1.PublisherClient();
const topicName = "orders_topic";

const pubsubRepository = require("../repositories/pub-sub-repo");

const { publishMessage } = pubsubRepository;

module.exports = {
    orders: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Orders route confirmed :)",
        });
    },
    //Añadir la función para quitar inventario del objeto en la BD
    createOrders: async (req, res) => {
        var ordersObj = req.body;
        var products = ordersObj.productos;
        var notif = "Nueva orden añadida por el cliente " + ordersObj.cliente;
        console.log(products);

        req.getConnection(function (error, conn) {
            for (var i = 0; i < products.length; i++) {
                conn.query(
                    "UPDATE `productos` SET cantidad = ? WHERE idproductos = " +
                        products[i].id,
                    products[i].cantidad,
                    function (err, rows, fields) {
                        if (err) {
                            req.flash("error", err);
                        } else {
                            console.log("Funciona añadir Orden");
                        }
                    }
                );
            }
        });
        //Envio mensaje de orden creada mediante pubsub
        var messageId = await publishMessage(pubSubClient, topicName, notif);

        console.log(notif);
        return res.status(200).json({
            success: true,
            message: `Message ${messageId} published :)`,
        });
    },
};
