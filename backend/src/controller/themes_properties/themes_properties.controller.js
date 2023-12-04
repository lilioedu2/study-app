const { sequelize } = require("../../connection");
const {
  ThemesPropertiesModel,
} = require("../../model/themes_properties.model");
const themesPropertiesService = require("../../service/themes_properties.service");

const listar = async function (req, res) {
  console.log("listar propiedades de temas controller");
  try {
    const themes_properties = await themesPropertiesService.listar(
      req.query.filtro || ""
    );
    if (themes_properties) {
      res.json({
        success: true,
        themes_properties: themes_properties,
      });
    } else {
      res.json({
        success: true,
        themes_properties: [],
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
  console.log("consultar 1 propiedad de tema por codigo controller");
  try {
    const themesPropertiesModelResult =
      await themesPropertiesService.busquedaPorCodigo(req.params.filtro || "");
    if (themesPropertiesModelResult) {
      res.json({
        success: true,
        themes_properties: themesPropertiesModelResult,
      });
    } else {
      res.json({
        success: true,
        themes_properties: [],
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

const consultarPorCodigoTheme = async function (req, res) {
  console.log("consultar 1 propiedad de tema por codigo del tema controller");
  try {
    const themesPropertiesModelResult =
      await themesPropertiesService.consultarPorCodigoTheme(req.params.filtro || ""); //aqui se captura el id de la ruta y se llama al service
    if (themesPropertiesModelResult) {
      res.json({
        success: true,
        themes_properties: themesPropertiesModelResult,
      });
    } else {
      res.json({
        success: true,
        themes_properties: [],
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
  console.log("actualizar propiedad de tema controller");
  let themesPropertiesReturn = null;
  try {
    themesPropertiesReturn = await themesPropertiesService.actualizar(
      req.body.id,
      req.body.theme_id,
      req.body.property_name,
      req.body.property_value
    );
    res.json({
      success: true,
      themes_properties: themesPropertiesReturn,
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
  console.log("eliminar propiedad de tema controller");
  try {
    await themesPropertiesService.eliminar(req.params.filtro || "");
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

const agregar = async function (req, res) {
  console.log("actualizar propiedad de tema controller");
  let themesPropertiesReturn = null;
  try {
    const themeData = req.body;
    themesPropertiesReturn = await themesPropertiesService.agregarService(themeData);
    res.json({
      success: true,
      themes_properties: themesPropertiesReturn,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const enviarEmail = async function (req, res) {
  try {
    const dataSend = req.body;
    console.log(dataSend);
    await themesPropertiesService.sendEmail(dataSend.destinoEmail, dataSend.subject, dataSend.html);

    res.json({
      success: true,
      message: "Correo enviado exitosamente"
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};




module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  consultarPorCodigoTheme,
  agregar,
  enviarEmail,
};
