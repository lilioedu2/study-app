const { sequelize } = require("../connection");
const { UserModel } = require("../model/user.model");

const listar = async function (textoBuscar) {
  console.log("listar usuarios");
  try {
    const users = await sequelize.query(`SELECT * 
      FROM users 
      WHERE 1=1
        AND UPPER(name) LIKE UPPER('%${textoBuscar}%')
        AND deleted IS false
      ORDER BY id`);

    if (users && users[0]) {
      return users[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 usuario por codigo");
  try {
    const userModelResult = await UserModel.findByPk(codigo);
    if (userModelResult) {
      return userModelResult;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const actualizar = async function (
  id,
  name,
  last_name,
  avatar,
  email,
  password,
  deleted
) {
  console.log("actualizar usuarios");
  //Variables
  let userReturn = null; //guarda el user que se va a incluir o editar
  //const data = req.body; //se obtiene los datos e la peticion
  //const id = req.body.id;
  const data = { id, name, last_name, avatar, email, password, deleted };

  console.log("kajhn", data);
  try {
    let userExist = null;
    if (id) {
      userExist = await UserModel.findByPk(id);
    }
    if (userExist) {
      userReturn = await UserModel.update(data, { where: { id: id } });
      userReturn = data;
    } else {
      data.deleted = 0;
      userReturn = await UserModel.create(data);
    }
    return userReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminar = async function (codigo) {
  console.log("eliminar usuarios");
  try {
    await sequelize.query("UPDATE users SET deleted=true WHERE id= " + codigo);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const newPassword = async function (userId) {
  try {
    // Generar una contraseña aleatoria de 6 dígitos
    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();

    // Iniciar una transacción
    const transaction = await sequelize.transaction();

    try {
      // Actualizar la contraseña en la base de datos
      await sequelize.query(`UPDATE users SET password = '${randomPassword}' WHERE id = ${userId}`, { transaction });

      // Obtener el nombre y apellido del usuario
      const [users] = await sequelize.query(`SELECT name, last_name FROM users WHERE id = ${userId}`, { transaction });
      
      // Confirmar la transacción
      await transaction.commit();

      // Si el usuario no existe, retornar null o manejar como prefieras
      if (users.length === 0) {
        return null;
      }

      // Retornar la nueva contraseña junto con el nombre y apellido
      return {
        newPassword: randomPassword,
        name: users[0].name,
        lastName: users[0].last_name
      };
    } catch (error) {
      // Si algo sale mal, hacer rollback de la transacción
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};





//lo que esta entre la llave es json
module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  newPassword,
};
