const themesController = require("../../controller/themes/themes.controller");
const authMiddleware = require("../../middleware/auth.controller");
//require es como un import para referenciar archivos

module.exports = function (app) {
  app.get("/themes/list", authMiddleware.auth, themesController.listar);
  app.get(
    "/themes/buscarPorCodigo/:filtro",
    authMiddleware.auth,
    themesController.busquedaPorCodigo
  );
  app.post("/themes/update", authMiddleware.auth, themesController.actualizar);
  app.delete(
    "/themes/delete/:filtro",
    authMiddleware.auth,
    themesController.eliminar
  );
  app.post("/themes/update-order",
    authMiddleware.auth,
    themesController.actualizarOrden
  );

};
