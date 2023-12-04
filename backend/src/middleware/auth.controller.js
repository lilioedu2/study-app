const { sequelize } = require("../connection"); // importar la conexion a la DB
const jwt = require("jsonwebtoken");

const auth = async function (req, res, next) {
  if (!req.headers.authorization) {
    // Verificar si se proporciona el encabezado de autorizacion
    res.json({
      success: false,
      error: "No authorization header",
    });
    return;
  } else {
    let token = req.headers.authorization;
    // Consultar la DB para verificar el token
    const userDB = await sequelize.query(
      "SELECT * FROM users WHERE token = '" + token + "'"
    );
    let user = null;

    if (userDB.length > 0 && userDB[0].length > 0) {
      // Si se encuentra un usuario con el token propocionado
      user = userDB[0][0];

      console.log("Token del usuario: ", user);

      res.locals.userId = user.id; // Almacenar ID del usuario en res.locals p/ acceder en otras partes de la app

      next(); // Pasar al siguiente middleware o controlador de ruta
    } else {
      // Si el token es inválido o no se encuentra un usuario
      res.json({
        success: false,
        error: "Token inválido",
      });
    }
  }
};

module.exports = {
  auth,
};
