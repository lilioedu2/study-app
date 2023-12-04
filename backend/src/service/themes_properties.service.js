const nodemailer = require('nodemailer');
const { sequelize } = require("../connection");
const { ThemesPropertiesModel } = require("../model/themes_properties.model");

const listar = async function (textoBuscar) {
  console.log("listar propiedades de temas");
  try {
    const themes_properties = await sequelize.query(`SELECT * 
      FROM themes_properties
      WHERE 1=1
        AND UPPER(property_name) LIKE UPPER('%${textoBuscar}%')
      ORDER BY id`);
    if (themes_properties && themes_properties[0]) {
      return themes_properties[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 propiedad de tema por codigo");
  try {
    const themesPropertiesModelResult = await ThemesPropertiesModel.findByPk(
      codigo
    );
    if (themesPropertiesModelResult) {
      return themesPropertiesModelResult;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigoTheme = async function (codigo) {
  console.log("Consultar propiedades de tema por código del tema: " + codigo);
  try {
    const result = await sequelize.query(`
      SELECT *
        FROM themes_properties
        WHERE theme_id = ${codigo}
        ORDER BY id`
    );

    // Acceder al resultado de la consulta
    const themes_properties = result[0];

    if (themes_properties.length > 0) {
      return themes_properties;
    } else {
      return [];
    }

  } catch (error) {
    console.log("Error en consultarPorCodigoTheme: ", error);
    // Devolver array vacío en caso de error
    return [];
  }
};



const actualizar = async function (
  id,
  theme_id,
  property_name,
  property_value
) {
  console.log("actualizar propiedad de tema");
  let themesPropertiesReturn = null;
  const data = { id, theme_id, property_name, property_value };
  try {
    let themesPropertiesExist = null;
    if (id) {
      themesPropertiesExist = await ThemesPropertiesModel.findByPk(id);
    }
    if (themesPropertiesExist) {
      themesPropertiesReturn = await ThemesPropertiesModel.update(data, {
        where: { id: id },
      });
      themesPropertiesReturn = data;
    } else {
      themesPropertiesReturn = await ThemesPropertiesModel.create(data);
    }
    return themesPropertiesReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminar = async function (codigo) {
  console.log("eliminar propiedad de tema");
  try {
    ThemesPropertiesModel.destroy(
      { where: { id: codigo } },
      { truncate: false }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const agregarService = async function (data) {
  try {
    const newThemeProperty = await ThemesPropertiesModel.create({
      theme_id: data.theme_id,
      property_name: data.property_name,
      property_value: data.property_value
    });

    return newThemeProperty; // Devuelve la instancia creada
  } catch (error) {
    console.error("Error al insertar en la base de datos:", error);
    throw new Error("Error al insertar en la base de datos");
  }
};


const sendEmail = async (destinoEmail, subject, html) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tu correo',
      pass: 'nfgh jyrf hgfh asxz' //<== ejemplo de pass
    }
  });

  let mailOptions = {
    from: 'w0973898419@gmail.com',
    to: destinoEmail,
    subject: subject,
    html: html  // Cambiado de 'text' a 'html'
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};





module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  consultarPorCodigoTheme,
  agregarService,
  sendEmail
};
