import Payment from "/client/src/js/Payment.js";
import Loader from "./Loader.js";

Loader.init();
const payment = new Payment();
if (!payment) {
  console.log("Класс Payment не загружен");
}
