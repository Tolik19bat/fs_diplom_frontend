export default function accordeon() {
  const headers = Array.from(document.querySelectorAll(".conf-step__header"));
  headers.forEach((header) =>
    header.addEventListener("click", () => {
      header.classList.toggle("conf-step__header_closed");
      header.classList.toggle("conf-step__header_opened");
    })
  );

  //   const headers = Array.from(
  //       document.querySelectorAll('.conf-step__header'));

  //   // Убедитесь, что все заголовки закрыты при инициализации
  //   headers.forEach((header) => {
  //       header.classList.add("conf-step__header_closed");
  //       header.classList.remove("conf-step__header_opened");
  //   });

  //   headers.forEach((header) => {
  //       header.addEventListener("click", () => {
  //           // Закрыть все остальные заголовки
  //           headers.forEach((otherHeader) => {
  //               if (otherHeader !== header) {
  //                   otherHeader.classList.add("conf-step__header_closed");
  //                   otherHeader.classList.remove("conf-step__header_opened");
  //               }
  //           });

  //           // Переключить текущий заголовок
  //           header.classList.toggle("conf-step__header_closed");
  //           header.classList.toggle("conf-step__header_opened");
  //       });
  //   });
}
