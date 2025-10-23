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

  res.send({
    status: true,
    id: param,
    user,
  });

  if (!user) {
    return res.status(404).send({
      status: false,
      message: `Usuario con id ${param} no encontrado`,
    });
  }
};

const queryUser = (req, res) => {
  const query = req.query;
  let resultados = data;

  for (const key in query) {
    resultados = resultados.filter(
      (item) => String(item[key]) === String(query[key])
    );
  }

    if (!query) {
    return res.status(404).send({
      status: false,
      message: `No se encontro nada con ${query}`,
    });
  }

  res.send({ finded: true, data: resultados });
};

app.get("/cuentas", collectUser);
app.get("/cuentas/:param", collectUser);
app.get("/cuentas/query", queryUser);

app.listen(PORT, () => {
  console.log(`Estamos al aire en http://localhost:${PORT}`);

  app.router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log("ruta registrada:", r.route.path);
    }
  });
});
