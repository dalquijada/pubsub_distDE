const { PubSub } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const subscriptionName = "admins_push";
const subscriptionName1 = "clients_push";
const messages = [];
const timeout = 10;

const pubsubRepository = require("../repositories/pub-sub-repo");
const {
    listenForPullMessages,
    listenForPushMessages,
    listenForPullMessagesA,
} = pubsubRepository;

module.exports = {
    notificationsHome: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Notifications route confirmed :)",
        });
    },

    pullNotification: (req, res) => {
        console.log("hellou");

        try {
            listenForPullMessages(
                pubSubClient,
                subscriptionName1,
                timeout,
                req
            );

            //Función para añadir tantas instancias como usuarios clientes se tengan en la tabla notificaciones
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't receive orders object :(",
                data: error,
            });
        }
        console.log(messageNotif);
    },

    pullNotificationA: (req, res) => {
        console.log("PullA");
        req.getConnection(function (error, conn) {
            try {
                listenForPullMessagesA(
                    pubSubClient,
                    subscriptionName,
                    timeout,
                    messages,
                    conn
                );
                //ENVIAR NOTIF AL ADMIN EN CUESTION

                //Función para añadir tantas instancias como usuarios admins se tengan en la tabla notificaciones
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Couldn't receive orders object :(",
                    data: error,
                });
            }
        });
        // console.log(messageNotif);
    },
    //Enviar notificaciones de compras realizadas a administradores
    SendNotificationA: (req, res) => {
        console.log("SendA");
        req.getConnection(function (error, conn) {
            conn.query(
                "SELECT mensaje FROM `notificaciones` WHERE id_usuario = ?",
                req.params.id_usuario,
                function (err, rows, fields) {
                    if (err) {
                        console.log("chimbo");
                    } else {
                        console.log("Funciona enviar notifs admin");
                        res.json(rows);
                        conn.query(
                            "DELETE FROM `notificaciones` WHERE id_usuario = ?",
                            req.params.id_usuario,
                            function (err, results, fields) {
                                if (err) {
                                    console.log("chimbo");
                                } else {
                                    console.log(
                                        "Funciona borrar notifs admin post entrega"
                                    );
                                    console.log(
                                        "Deleted Row(s):",
                                        results.affectedRows
                                    );
                                }
                            }
                        );
                    }
                }
            );
        });
        // console.log(messageNotif);
    },

    pushNotification: async (req, res) => {
        try {
            let messageResponse = await listenForPushMessages(
                req.body.message.data
            );
            //si tiene que recibirlo un cliente
            if (messageResponse.nombre) {
                return res.send(
                    "Se ha añadido un nuevo producto a la tienda de nombre" +
                        messageResponse.nombre
                );
            }
            return res.status(200).json({
                success: true,
                message: "Message received successfully :)",
                data: messageResponse,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't receive orders object :(",
                data: error,
            });
        }
    },
};
