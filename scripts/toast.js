function Toast(msg, time = 2000) {
  const div = document.createElement("div");
  const btn = document.createElement("button");
  btn.innerHTML = "x";
  const id = `toastAt_${new Date().getTime()}`;

  div.innerHTML = msg;
  div.appendChild(btn);
  div.classList.add("toast");
  div.setAttribute("id", id);
  document.body.appendChild(div);

  setTimeout(() => {
    div.classList.add("active");
  }, 0);

  setTimeout(() => {
    div.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(
        document.querySelector(`div#${id}`)
      );
    }, 600);
    
  }, time);
}