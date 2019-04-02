function Toast(msg, time = 2000) {
  const div = document.createElement("div");
  const btn = document.createElement("button");
  btn.innerHTML = "CLOSE";

  const id = `toastAt_${new Date().getTime()}`;

  div.innerHTML = msg;
  div.appendChild(btn);
  div.classList.add("toast");
  div.setAttribute("id", id);
  document.body.appendChild(div);

  setTimeout(() => {
    div.classList.add("active");
  }, 0);

  const rm = () => {
    div.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(
        document.querySelector(`div#${id}`)
      );
    }, 600);  
  }

  const time_out = setTimeout(rm, time);

  btn.addEventListener("click", () => {
    clearTimeout(time_out);
    rm();
  });
}