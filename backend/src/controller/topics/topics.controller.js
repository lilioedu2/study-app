const { sequelize } = require("../../connection");
const { TopicsModel } = require("../../model/topics.model");
const topicsService = require("../../service/topics.service");

const listar = async function (req, res) {
  console.log("listar topicos controller");
  try {
    const topics = await topicsService.listar(req.query.filtro || "");
    if (topics) {
      res.json({
        success: true,
        topicos: topics,
      });
    } else {
      res.json({
        success: true,
        topicos: [],
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

const consultarPorCodigo = async function (req, res) {
  console.log("consultar 1 topico por codigo controller");
  try {
    const topicsModelResult = await topicsService.busquedaPorCodigo(
      req.params.filtro || ""
    );
    if (topicsModelResult) {
      res.json({
        success: true,
        topic: topicsModelResult,
      });
    } else {
      res.json({
        success: true,
        topic: [],
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
  console.log("actualizar topicos controller");

  let topicsReturn = null;

  try {
    topicsReturn = await topicsService.actualizar(
      req.body.id,
      req.body.create_date,
      req.body.name,
      req.body.topic_id,
      req.body.order,
      req.body.priority,
      req.body.color,
      req.body.link,
      req.body.owner_user_id
    );
    res.json({
      success: true,
      topic: topicsReturn,
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
  console.log("eliminar topicos controller");
  try {
    await topicsService.eliminar(req.params.filtro || "");
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

const listarComentarios = async function (req, res) {
  console.log("listar comentarios topicos controller", req, res);
  try {
    const comments = await topicsService.listarComentarios(
      req.params.topic_id || ""
    );
    if (comments) {
      res.json({
        success: true,
        topicos: comments,
      });
    } else {
      res.json({
        success: true,
        topicos: [],
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

const comentarTopicoController = async function (req, res) {
  try {
    // Recibir los datos del comentario del cuerpo de la solicitud
    const comentarioData = req.body;

    // Llamar al servicio para guardar el comentario
    const topicsReturn = await topicsService.comentarTopicoService(comentarioData);

    res.json({
      success: true,
      topic: topicsReturn,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const compartirUsuariosController = async function (req, res) {
  try {
    const dataSharedTopics = req.body;

    const sharedTopicsReturn = await topicsService.compartirUsuariosService(dataSharedTopics);

    res.json({
      success: true,
      topic: sharedTopicsReturn,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const listarSharedMeController = async function (req, res) {
  console.log("listarSharedMe topicos controller");
  try {
    const topics = await topicsService.listarSharedMeService(req.params.id || "");
    if (topics) {
      res.json({
        success: true,
        topicos: topics,
      });
    } else {
      res.json({
        success: true,
        topicos: [],
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

const actualizarOrden = async function (req, res) {
  try {
    await topicsService.actualizarOrden(req.body);
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

const eliminarComentario = async function (req, res) {
  console.log("eliminar comentario controller");
  try {
    await topicsService.eliminarComentario(req.params.filtro || "");
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

const eliminarTopicoComparidoConmigo = async function (req, res) {
  console.log("p;lkasj", req.params.filtro);
  try {
    await topicsService.eliminarTopicoComparidoConmigo(req.params.filtro || "");
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

const agregarLike = async function (req, res) {
  try {
    const { userId, topicId } = req.body;
    await topicsService.agregarLike(userId, topicId);
    res.json({
      success: true
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};

const listarTopicsPorLikes = async function (req, res) {
  try {
    const topics = await topicsService.listarTopicsPorLikes();
    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};

const usuarioHaDadoLike = async function (req, res) {
  try {
    const userId = req.params.userId;
    const topicId = req.params.topicId;
    const hasLiked = await topicsService.usuarioHaDadoLike(userId, topicId);
    res.json({
      success: true,
      data: hasLiked
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};


const eliminarMegusta = async function (req, res) {
  console.log("eliminar like controller");
  try {
    const userId = req.params.userId;
    const topicId = req.params.topicId;
    await topicsService.eliminarMegusta(userId, topicId);
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
  listarComentarios,
  comentarTopicoController,
  compartirUsuariosController,
  listarSharedMeController,
  actualizarOrden,
  eliminarComentario,
  eliminarTopicoComparidoConmigo,
  agregarLike,
  listarTopicsPorLikes,
  usuarioHaDadoLike,
  eliminarMegusta
};
