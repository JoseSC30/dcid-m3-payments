export const PAYMENT_STATES = Object.freeze(["approved", "rejected"]);
export const PAYMENT_METHODS = Object.freeze([
  "CARD",
  "QR",
  "BANK_TRANSFER",
  "WALLET",
]);
export function validatePayment({
  order_id,
  amount,
  currency = "BOB",
  payment_method = "CARD",
} = {}) {
  if (
    !order_id ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0 ||
    currency !== "BOB" ||
    !PAYMENT_METHODS.includes(payment_method)
  )
    throw new Error("Pago inválido");
  return true;
}
export function simulatePayment(method, last4) {
  return method === "CARD" && String(last4) === "0000"
    ? "rejected"
    : "approved";
}
