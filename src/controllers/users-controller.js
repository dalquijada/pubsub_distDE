module.exports = {
    //Registro/Crear Usuario
    registerUsers: (req, res) => {
        var newUser = req.body;
        console.log(newUser);
        req.getConnection(function (error, conn) {
            conn.query(
                "INSERT INTO `usuarios` SET ? ",
                newUser,
                function (err, rows, fields) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        console.log("Funciona añadir usuario");
                        return res.json(
                            "Usuario " + newUser.correo + " añadido"
                        );
                    }
                }
            );
        });
    },
    //Login de usuarios
    loginUsers: async (req, res) => {
        var user = req.body;
        console.log(user);
        req.getConnection(function (error, conn) {
            conn.query(
                "SELECT * FROM `usuarios` WHERE correo = ? AND contraseña = ? ",
                [user.correo, user.contraseña],
                function (err, rows, fields) {
                    if (err) {
                        req.flash("error", err);
                    } else {
                        console.log("Funciona logear usuario");
                        return res.send(rows);
                    }
                }
            );
        });
    },
};
