const themesPropertiesController = require('../../controller/themes_properties/themes_properties.controller')
const authMiddleware = require("../../middleware/auth.controller");

module.exports = function (app) {
    app.get("/themes_properties/list", themesPropertiesController.listar);
    app.get("/themes_properties/buscarPorCodigo/:filtro", themesPropertiesController.busquedaPorCodigo);
    app.get("/themes_properties/buscarPorTema/:filtro", authMiddleware.auth, themesPropertiesController.consultarPorCodigoTheme);
    app.post("/themes_properties/update", authMiddleware.auth, themesPropertiesController.actualizar);
    app.delete("/themes_properties/delete/:filtro", authMiddleware.auth, themesPropertiesController.eliminar);

    app.post("/themes_properties/add", authMiddleware.auth, themesPropertiesController.agregar);
    app.post("/themes_properties/enviaremail",
        themesPropertiesController.enviarEmail
    );

}