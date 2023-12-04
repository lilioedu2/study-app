const topicsController = require("../../controller/topics/topics.controller");
const authMiddleware = require("../../middleware/auth.controller");

module.exports = function (app) {
  app.get(
    "/topics/list",
    authMiddleware.auth,
    topicsController.listar
  );
  app.get(
    "/topics/buscarPorCodigo/:filtro",
    authMiddleware.auth,
    topicsController.busquedaPorCodigo
  );
  app.post(
    "/topics/update",
    authMiddleware.auth,
    topicsController.actualizar
  );
  app.delete(
    "/topics/delete/:filtro",
    authMiddleware.auth,
    topicsController.eliminar
  );
  app.get(
    "/topic-details/:topic_id",
    authMiddleware.auth,
    topicsController.listarComentarios
  );
  app.post(
    "/topics-details/comment",
    authMiddleware.auth,
    topicsController.comentarTopicoController
  );
  app.post(
    "/topics-shared",
    authMiddleware.auth,
    topicsController.compartirUsuariosController
  );
  app.get(
    "/topics/shared_me/:id",
    authMiddleware.auth,
    topicsController.listarSharedMeController
  );
  app.post(
    "/topics/updateOrder",
    authMiddleware.auth,
    topicsController.actualizarOrden
  );
  app.post("/topics/update-order",
    authMiddleware.auth,
    topicsController.actualizarOrden
  );
  app.delete(
    "/topics/comenterio-delete/:filtro",
    authMiddleware.auth,
    topicsController.eliminarComentario
  );
  app.delete(
    "/topics/shared-me-delete/:filtro",
    authMiddleware.auth,
    topicsController.eliminarTopicoComparidoConmigo
  );
  app.post(
    "/topics/like",
    authMiddleware.auth,
    topicsController.agregarLike
  );
  app.get(
    "/topics/byLikes",
    authMiddleware.auth,
    topicsController.listarTopicsPorLikes
  );
  app.get(
    "/topics/userHasLiked/:userId/:topicId",
    authMiddleware.auth,
    topicsController.usuarioHaDadoLike
  );
  app.delete(
    "/topics/dislike/:userId/:topicId",
    authMiddleware.auth,
    topicsController.eliminarMegusta
  );

};