import express from "express";
import { data } from "./const.js";

const app = express();
const PORT = 3130;

const balanceData = data
  .filter((user) => user.isActive === true)
  .reduce((acum, user) => acum + user.balance, 0);

app.use(express.json());

const collectUser = (req, res) => {
  const { param } = req.params;

  if (!param) {
    return res.send({
      cantidad: data.length,
      Cuentas: data,
    });
  }

  const user = data.find((e) => e._id === param);

  if (!user) {
    return res.status(404).send({
      status: false,
      message: `Usuario con _id ${param} no encontrado`,
    });
  }

  res.send({
    status: true,
    _id: param,
    user,
  });
};

const queryUser = (req, res) => {
  const query = req.query;

  if (!query || Object.keys(query).length === 0) {
    return res.status(400).send({
      status: false,
      message: "Debes enviar al menos un query param para filtrar",
    });
  }

  let resultados = data.filter((item) =>
    Object.entries(query).every(
      ([key, value]) => String(item[key]) === String(value)
    )
  );

  if (resultados.length === 0) {
    return res.status(404).send({
      status: false,
      message: "No se encontró ninguna cuenta con los filtros enviados",
    });
  }

  res.send({ finded: true, cantidad: resultados.length, Cuentas: resultados });
};

const balance = (req, res) => {
  res.send({ balance: balanceData });
};

app.get("/cuentas/query", queryUser);
app.get("/cuentas/:param", collectUser);
app.get("/cuentas", collectUser);
app.get("/cuentasbalance", balance);

app.listen(PORT, () => {
  console.log(`Estamos al aire en http://localhost:${PORT}`);

  app.router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log("ruta registrada:", r.route.path);
    }
  });
});
