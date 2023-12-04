const userController = require("../../controller/users/users.controller");
const authMiddleware = require("../../middleware/auth.controller");
//require es como un import para referenciar archivos

module.exports = function (app) {
  app.get(
    "/users/list",
    //authMiddleware.auth,
    userController.listar
  );
  app.get(
    "/users/buscarPorCodigo/:filtro",
    // authMiddleware.auth,
    userController.busquedaPorCodigo
  );
  app.post(
    "/users/update",
    authMiddleware.auth,
    userController.actualizar
  );
  app.delete(
    "/users/delete/:filtro",
    authMiddleware.auth,
    userController.eliminar
  );
  app.post(
    "/user/login",
    userController.login
  );
  app.post("/user/logout", authMiddleware.auth, userController.logout);

  app.get(
    "/users/new-password/:id",
    userController.newPassword
  );

};
