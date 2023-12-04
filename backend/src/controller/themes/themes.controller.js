const { sequelize } = require("../../connection");
const { ThemesModel } = require("../../model/themes.model");
const themesService = require("../../service/themes.service");

const listar = async function (req, res) {
  console.log("listar temas controller");
  try {
    const themes = await themesService.listar(req.query.filtro || "");
    if (themes) {
      res.json({
        success: true,
        temas: themes,
      });
    } else {
      res.json({
        success: true,
        temas: [],
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
  console.log("consultar 1 tema por codigo controller");
  try {
    const themesModelResult = await themesService.busquedaPorCodigo(
      req.params.filtro || ""
    );
    if (themesModelResult) {
      res.json({
        success: true,
        theme: themesModelResult,
      });
    } else {
      res.json({
        success: true,
        theme: [],
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
  console.log("actualizar temas controller");
  let themesReturn = null;
  try {
    themesReturn = await themesService.actualizar(
      req.body.id,
      req.body.create_date,
      req.body.name,
      req.body.description,
      req.body.keywords,
      req.body.owner_user_id
    );
    res.json({
      success: true,
      theme: themesReturn,
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
  console.log("eliminar temas controller");
  try {
    await themesService.eliminar(req.params.filtro || "");
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

const actualizarOrden = async function (req, res) {
  try {
    await themesService.actualizarOrden(req.body);
    res.json({
      success: true,
    });
  } catch (error) {
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
  actualizarOrden,
};
