const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser());

app.use(
  cors({
    origin: "*"
  })
);

const userRoute = require("./src/route/users/users.route");
const themesRoute = require("./src/route/themes/themes.route");
const topicsRoute = require("./src/route/topics/topics.route");
const themes_propertiesRoute = require("./src/route/themes_properties/themes_properties.route");

// Ruta raiz
app.get("/", function (req, res) {
  //Logica
  res.send("Hello World oiko");
});
//app.post, app.put por ejemplo (el app se declara arriba, es del express)
app.get("/pagina2", function (req, res) {
  //Logica de negocios, aqui se encuentra el controller
  res.json({ application: "Study App", version: "1.0.0" });
});

//Llamadas a los routes de los casos de uso
userRoute(app);
themesRoute(app);
topicsRoute(app);
themes_propertiesRoute(app);

app.listen(3000);
