const express = require("express");
const router = express();
const notificationsController = require("../controllers/notification-controller");

router.get("/", notificationsController.notificationsHome);

router.get("/pullC", notificationsController.pullNotificationC);
//router.get("/sendC/(:id_usuario)", notificationsController.SendNotificationC);

router.get("/pullA", notificationsController.pullNotificationA);
router.get("/send/(:id_usuario)", notificationsController.SendNotification);

router.post("/push", notificationsController.pushNotification);

module.exports = router;
