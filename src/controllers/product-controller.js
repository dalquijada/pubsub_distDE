const { PubSub, v1 } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const pubSubClient2 = new v1.PublisherClient();
const topicName = "orders_topic";

const pubsubRepository = require("../repositories/pub-sub-repo");

const { publishMessage } = pubsubRepository;

module.exports = {
    //cambiar para obtener lista de productos en la BD
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
    //Añadir la función para producto el objeto a la BD
    createProducts: async (req, res) => {
        let productsObj = req.body;
        let messageId = await publishMessage(
            pubSubClient,
            topicName,
            productsObj
        );
        console.log(productsObj);
        return res.status(200).json({
            success: true,
            message: `Message ${messageId} published :)`,
        });
    },
};
