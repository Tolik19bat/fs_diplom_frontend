import Login from "/admin/src/js/Login.js";
import Loader from "/admin/src/js/Loader.js";

Loader.init();
const login = new Login();
if (!login) {
    console.log("Класс Login не загружен");
}
