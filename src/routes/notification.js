const express = require("express");
const router = express();
const notificationsController = require("../controllers/notification-controller");

router.get("/", notificationsController.notificationsHome);
router.get("/pull", notificationsController.pullNotification);
router.get("/pullA", notificationsController.pullNotificationA);
router.get("/sendA/(:id_usuario)", notificationsController.SendNotificationA);
router.post("/push", notificationsController.pushNotification);

module.exports = router;
