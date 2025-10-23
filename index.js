import express from "express";
import { data } from "./const.js";

const app = express();
const PORT = 3130;

app.use(express.json());

const collectUser = (req, res) => {
  const arrData = data.length;
  const { param } = req.params;

  if (!param) {
    return res.send({
      "cantidad de datos": arrData,
      Cuentas: data,
    });
  }

  const user = data.find((e) => e._id === param);

  if (!user) {
    return res.status(404).send({
      status: false,
      message: `Usuario con id ${param} no encontrado`,
    });
  }

  res.send({
    status: true,
    id: param,
    user,
  });
};

app.get("/cuentas", collectUser);
app.get("/cuentas/:param", collectUser);

app.listen(PORT, () => {
  console.log(`Estamos al aire en http://localhost:${PORT}`);

  app.router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log("ruta registrada:", r.route.path);
    }
  });
});
