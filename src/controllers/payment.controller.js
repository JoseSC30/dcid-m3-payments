import { simulatePayment } from "../models/payment.model.js";
import { run, db } from "../config/database.js";
import { auth, internal } from "../middleware/auth.middleware.js";
import { call } from "../services/http.service.js";
import { log } from "../utils/logger.js";
export function registerPaymentRoutes(router) {
  router.post("/payments", internal, async (req, res, next) => {
    try {
      const {
        order_id,
        amount,
        currency = "BOB",
        payment_method = "CARD",
        card_last4 = "",
      } = req.body;
      if (
        !order_id ||
        !(Number(amount) > 0) ||
        currency !== "BOB" ||
        !["CARD", "QR", "BANK_TRANSFER", "WALLET"].includes(payment_method)
      )
        return res.status(400).json({ error: "Pago inválido" });
      const old = await run("SELECT * FROM payments WHERE order_id=$1", [
        order_id,
      ]);
      if (old.rowCount) {
        const p = old.rows[0];
        if (
          Number(p.amount) !== Number(amount) ||
          p.currency !== currency ||
          p.payment_method !== payment_method
        )
          return res.status(409).json({ error: "DUPLICATE_ORDER_CONFLICT" });
        return res.json({ transaction: p, replayed: true });
      }
      const rejected =
        simulatePayment(payment_method, card_last4) === "rejected";
      const x = await run(
        "INSERT INTO payments(order_id,amount,currency,payment_method,status) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [
          order_id,
          amount,
          currency,
          payment_method,
          rejected ? "rejected" : "approved",
        ],
      );
      res
        .status(rejected ? 200 : 201)
        .json({ transaction: x.rows[0], replayed: false });
    } catch (e) {
      if (e.code === "23505")
        return res.status(409).json({ error: "Pago ya procesado" });
      next(e);
    }
  });
  router.get("/payments/order/:id", internal, async (req, res, next) => {
    try {
      const x = await run("SELECT * FROM payments WHERE order_id=$1", [
        req.params.id,
      ]);
      if (!x.rowCount)
        return res.status(404).json({ error: "Pago no encontrado" });
      res.json(x.rows[0]);
    } catch (e) {
      next(e);
    }
  });
}
