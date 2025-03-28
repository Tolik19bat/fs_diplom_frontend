import Ticket from "/client/src/js/Ticket.js";
import Loader from "./Loader.js";

Loader.init();
const ticket = new Ticket();
if (!ticket) {
  console.log("Класс Ticket не загружен");
}
