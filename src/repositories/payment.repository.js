import { run } from "../config/database.js";
export async function findPaymentByOrder(orderId) {
  return (
    (await run("SELECT * FROM payments WHERE order_id=$1", [orderId]))
      .rows[0] || null
  );
}
