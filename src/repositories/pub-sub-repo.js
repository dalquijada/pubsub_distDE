module.exports = {
    publishMessage: async (pubSubClient, topicName, payload) => {
        const dataBuffer = Buffer.from(JSON.stringify(payload));

        const messageId = await pubSubClient
            .topic(topicName)
            .publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
        return messageId;
    },
    //CAMBIAR AL IGUAL QUE PULLA PERO PARA PRODUCTOS -> CLIENTES
    listenForPullMessages: (
        pubSubClient,
        subscriptionName,
        timeout,
        messageNotif
    ) => {
        const subscription = pubSubClient.subscription(subscriptionName);

        let messageCount = 0;
        const messageHandler = (message) => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${message.attributes}`);
            messageCount += 1;

            message.ack();
            messageNotif.push(message.data);
        };

        subscription.on("message", messageHandler);

        setTimeout(() => {
            subscription.removeListener("message", messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    },

    listenForPullMessagesA: (
        pubSubClient,
        subscriptionName,
        timeout,
        messages,
        conn
    ) => {
        const subscription = pubSubClient.subscription(subscriptionName);
        let messageCount = 0;
        const messageHandler = (message) => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${message.attributes}`);
            messages.push(`${message.data}`);
            messageCount += 1;
            message.ack();
        };

        subscription.on("message", messageHandler);

        setTimeout(() => {
            subscription.removeListener("message", messageHandler);
            console.log(`${messageCount} message(s) received.`);
            //Añadir mensajes a notificaciones
            conn.query(
                "SELECT * FROM `usuarios` WHERE isAdmin = 1",
                function (err, rows, fields) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        console.log("Funciona Obtener Usuarios");
                        for (var i = 0; i < rows.length; i++) {
                            var notif = {
                                id_usuario: rows[i].idusuarios,
                                mensaje: messages,
                            };
                            console.log(notif);
                            conn.query(
                                "INSERT INTO `notificaciones` SET ?",
                                notif,
                                function (err, result) {
                                    if (err) {
                                        console.log("chimbo");
                                    } else {
                                        console.log(
                                            "Funciona Añadir notifs admin"
                                        );
                                        return;
                                    }
                                }
                            );
                        }
                    }
                }
            );
        }, timeout * 1000);
    },

    listenForPushMessages: (payload) => {
        const message = Buffer.from(payload, "base64").toString("utf-8");
        let parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
        console.log("Push object received");
        return parsedMessage;
    },
};
