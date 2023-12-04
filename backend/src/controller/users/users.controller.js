const { sequelize } = require("../../connection");
const { UserModel } = require("../../model/user.model");
const UserService = require("../../service/user.service");
const jwt = require("jsonwebtoken");

// Generar un token
/*const payload = { user: "exampleUser" };
const secretKey = "mySecretKey";
const token = jwt.sign(payload, secretKey);

console.log("Token generado: ", token);

// Verificar y decodificar un token
const decoded = jwt.verify(token, secretKey);
console.log("Token decodificado", decoded);*/

//si se va a usar await la funcion debe ser async
//con f2 cambiar el listar a listarController, corregir en route tb
const listar = async function (req, res) {
  console.log("listar usuarios controller");
  try {
    //el or es para que si retorna undefined me traiga vacio
    const users = await UserService.listar(req.query.filtro || "");
    if (users) {
      res.json({
        success: true,
        usuarios: users,
      });
    } else {
      res.json({
        success: true,
        usuarios: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const consultarPorCodigo = async function (req, res) {
  console.log("consultar 1 usuario por codigo controller");
  try {
    const userModelResult = await UserService.busquedaPorCodigo(
      req.params.filtro || ""
    );
    if (userModelResult) {
      res.json({
        success: true,
        usuario: userModelResult,
      });
    } else {
      res.json({
        success: true,
        usuario: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const actualizar = async function (req, res) {
  console.log("actualizar usuarios controller");
  let userReturn = null; //guarda el user que se va a incluir o editar
  try {
    userReturn = await UserService.actualizar(
      req.body.id,
      req.body.name,
      req.body.last_name,
      req.body.avatar,
      req.body.email,
      req.body.password,
      req.body.deleted
    );
    res.json({
      success: true,
      user: userReturn,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const eliminar = async function (req, res) {
  console.log("eliminar usuarios controller");
  //res.send("eliminar de usuarios");
  //Borrado fisico
  //UserModel.destroy(req.params.id);
  try {
    await UserService.eliminar(req.params.filtro || "");
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const login = async function (req, res) {
  console.log("login usuarios");
  try {
    // Buscar en la DB el usuario con correo y contraseña proporcionados
    const userDB = await sequelize.query(
      "SELECT * FROM users WHERE email ='" +
      req.body.email +
      "' AND password =  '" +
      req.body.password +
      "'"
    );
    console.log("users", userDB);
    let user = null;
    // Verificar si se encontraron resultados en la consulta y asignar el primer resultado a la variable user
    if (userDB.length > 0 && userDB[0].length > 0) {
      user = userDB[0][0]; // Agregar el primer registro encontrado a la variable user
      if (user.token) {
        // Si el usuario ya está autenticado, devolver la respuesta con error
        res.json({
          success: false,
          error: "Usuario ya está autenticado",
        });
        return;
      }
      const user_id = userDB[0][0].id
      // Generar un token de autenticación
      let token = jwt.sign(
        {
          codigo: user.codigo,
          name: user.name,
          last_name: user.last_name,
          avatar: user.avatar,
          email: user.email,
        },
        "passwd"
      ); // Actualizar el registro del usuario en la DB con el token generado
      const usersDBUpdate = await sequelize.query(
        "UPDATE users SET token = '" + token + "' WHERE id= " + user.id
      );
      // Devolver la respuesta con success y el token generado
      res.json({
        success: true,
        token,
        user_id
      });
    } else {
      // Si no se encuentra el usuario en la DB, devolver la respuesta con el mensaje de error
      res.json({
        success: false,
        error: "Usuario no encontrado",
      });
    }
  } catch (error) {
    // Si ocurre un error, devolver la respuesta con el mensaje de error
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const logout = async function (req, res) {
  try {
    // Actualizar el registro del usuario en la DB para eliminar el token de autenticacion
    const usersDB = await sequelize.query(
      "UPDATE users SET token = null WHERE id = " + res.locals.userId + ""
    );
    // Devolver la respuesta con success
    res.json({
      success: true,
    });
  } catch (error) {
    // Si ocurre un error, deolver la respuesta con el mensaje de error
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const newPassword = async function (req, res) {
  try {
    const userId = req.params.id;
    const newPassword = await UserService.newPassword(userId);

    if (newPassword) {
      res.json({
        success: true,
        newPassword: newPassword,
      });
    } else {
      res.json({
        success: true,
        newPassword: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

//lo que esta entre la llave es json
module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  login,
  logout,
  newPassword,
};
