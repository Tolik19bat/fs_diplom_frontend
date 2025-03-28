import Hall from "./Hall.js";
import Loader from "./Loader.js";

Loader.init();
const hall = new Hall();
if (!hall) {
  console.log("Класс Hall не загружен");
}
