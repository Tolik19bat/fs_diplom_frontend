import SignUp from "/admin/src/js/SignUp.js";
import Loader from "/admin/src/js/Loader.js";

Loader.init();
const signUp = new SignUp();
if (!signUp) {
  console.log("Класс SignUp не загружен");
}
