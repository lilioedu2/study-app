const { sequelize } = require("../../connection");
const { UserModel } = require("../../model/user.model");
const UserService = require("../../service/user.service");

//si se va a usar await la funcion debe ser async
const listar = async function (req, res) {
  console.log("listar usuarios controller");
  try {
    //el or es para que si retorna undefined me traiga vacio
    const users = await UserService.listar(req.query.filtro || "");

    if (users) {
      //en users[0] se encuentra el listado de lo que se recupera desde el sql
      res.json({
        success: true,
        usuarios: users,
      });
    } else {
      res.json({
        sucess: true,
        usuarios: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      sucess: false,
      error: error.message,
    });
  }
  //res.json(users);
};

const consultarPorCodigo = async function (req, res) {
  console.log("consultar 1 usuario por codigo");
  try {
    //Buscar en la base de datos por codigo
    const userModelResult = await UserModel.findByPk(req.params.id);

    if (userModelResult) {
      res.json({
        sucess: true,
        usuario: userModelResult,
      });
    } else {
      res.json({
        sucess: true,
        usuario: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      sucess: false,
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
      sucess: true,
      user: userReturn,
    });
  } catch (error) {
    console.log(error);
    res.json({
      sucess: false,
      error: error.message,
    });
  }
};

const eliminar = async function (req, res) {
  console.log("eliminar usuarios");
  //res.send("eliminar de usuarios");

  //Borrado fisico
  //UserModel.destroy(req.params.id);
  try {
    await sequelize.query(
      "UPDATE users SET deleted=true WHERE id= " + req.params.id
    );
    res.json({
      sucess: true,
    });
  } catch (error) {
    res.json({
      sucess: false,
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
};
