function TopscrollTo() {
  if (window.scrollY != 0) {
    setTimeout(function () {
      window.scrollTo(0, window.scrollY - 300);
      TopscrollTo();
    }, 20);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const firstBlockHeight = 600;
  const goToUp = document.querySelector(".GoToUp");

  goToUpButton(goToUp, firstBlockHeight);

  window.addEventListener("scroll", function () {
    goToUpButton(goToUp, firstBlockHeight);
  });

  disableSubmitButton();

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("Menu-Link")) {
      e.preventDefault();
      let blockForScroll = document.getElementById(e.target.dataset.toBlockId);
      blockForScroll.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    if (e.target.classList.contains("ModalDocs-Outer")) {
      e.target.classList.remove("ModalDocs-Outer_Show");
    }
    if (e.target.classList.contains("Button_ModalClose")) {
      e.target.parentNode.parentNode.parentNode.classList.remove(
        "ModalDocs-Outer_Show"
      );
    }

    if (e.target.classList.contains("Policy-Link")) {
      e.preventDefault();
      fetch("https://taxirul.ru/confPolicy.php", {
        method: "GET",
        //cors: "no-mode",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          document.querySelector(".ModalDocs-Title").innerHTML = data.title;
          document.querySelector(".ModalDocs-Text").innerHTML = data.text;
          document
            .querySelector(".ModalDocs-Outer")
            .classList.add("ModalDocs-Outer_Show");
        });
    }

    if (e.target.classList.contains("Oferta-Link")) {
      e.preventDefault();
      fetch("https://taxirul.ru/dogOferta.php", {
        method: "GET",
        //cors: "no-mode",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          document.querySelector(".ModalDocs-Title").innerHTML = data.title;
          document.querySelector(".ModalDocs-Text").innerHTML = data.text;
          document
            .querySelector(".ModalDocs-Outer")
            .classList.add("ModalDocs-Outer_Show");
        });
    }
  });

  //Get all input[type="file"] and set event for change label to filename
  changeInputsFileLabel();

  //const urlMail = "http://localhost/taxirul.ru/mailSender.php";
  const urlMail = "https://taxirul.ru/api/mailSender.php";

  toggleSubmitButton();

  // send callback form
  callbackFormHAndler(urlMail);

  //earn now form
  earnNowFormHAndler(urlMail);
});

function toggleSubmitButton() {
  const policyCheckboxes = document.querySelectorAll(".PolicyAccept");
  Array.prototype.forEach.call(policyCheckboxes, function (checkbox) {
    checkbox.addEventListener("change", function (e) {
      if (e.target.checked) {
        checkbox.parentNode.nextElementSibling.disabled = false;
        checkbox.parentNode.nextElementSibling.classList.add("Button_Send");
      } else {
        checkbox.parentNode.nextElementSibling.disabled = true;
        checkbox.parentNode.nextElementSibling.classList.remove("Button_Send");
      }
    });
  });
}

let checkInputs = function (pattern, checkNode, errorText) {
  let error = document.createElement("p");
  error.classList.add("Input-Error");
  if (!pattern.test(checkNode.value)) {
    error.innerHTML = errorText;
    checkNode.parentNode.parentNode.appendChild(error);
    return false;
  } else {
    if (
      checkNode.parentNode.parentNode.getElementsByClassName(
        "Input-Error"
      )[0] !== undefined
    )
      checkNode.parentNode.parentNode.removeChild(
        checkNode.parentNode.parentNode.lastChild
      );
  }
  return true;
};

function goToUpButton(gtu, fbh) {
  if (pageYOffset > fbh) {
    gtu.classList.add("GoToUp_Show");
  } else {
    gtu.classList.remove("GoToUp_Show");
  }
}

function disableSubmitButton() {
  const buttons = document.querySelectorAll(".Button-Submit");
  Array.prototype.forEach.call(buttons, function (button) {
    button.disabled = true;
  });
}

function callbackFormHAndler(url) {
  const callbackForm = document.querySelector(".Callback-Form");
  callbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fd = new FormData();
    fd.append("cbFio", document.getElementById("cbFio").value);
    fd.append("cbPhone", document.getElementById("cbPhone").value);
    fd.append("cbCity", document.getElementById("cbCity").value);

    fd.append("purpose", "callback");

    if (
      !checkInputs(
        /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u,
        document.getElementById("cbFio"),
        "Ошибка ввода имени"
      )
    )
      return false;

    if (
      !checkInputs(
        /^\d+$/,
        document.getElementById("cbPhone"),
        "Ошибка ввода телефона"
      )
    )
      return false;

    if (
      !checkInputs(
        /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u,
        document.getElementById("cbCity"),
        "Ошибка ввода города"
      )
    )
      return false;

    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LepZf0UAAAAAHdDGwsItYSQGQRrZktN0ijHvOq-", {
          action: "homepage",
        })
        .then(function (token) {
          fd.append("g-recaptcha-response", token);

          fetch(url, {
            method: "POST",
            body: fd,
          })
            .then((response) => {
              formResponseHandler(response);
            })
            .catch((err) => console.log("error", err));
        });
    });
    formCleaner(this);
  });
}

function earnNowFormHAndler(url) {
  const earnNowForm = document.querySelector(".EarnNow-Form");
  earnNowForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fd = new FormData(this);
    fd.append("purpose", "earnNow");

    if (
      !checkInputs(
        /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u,
        document.getElementById("enFio"),
        "Ошибка ввода имени"
      )
    )
      return false;

    if (
      !checkInputs(
        /^\d+$/,
        document.getElementById("enPhone"),
        "Ошибка ввода телефона"
      )
    )
      return false;

    if (
      !checkInputs(
        /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u,
        document.getElementById("enCity"),
        "Ошибка ввода города"
      )
    )
      return false;

    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LepZf0UAAAAAHdDGwsItYSQGQRrZktN0ijHvOq-", {
          action: "homepage",
        })
        .then(function (token) {
          fd.append("g-recaptcha-response", token);

          fetch(url, {
            method: "POST",
            body: fd,
          })
            .then((response) => {
              formResponseHandler(response);
            })
            .catch((err) => console.log("error", err));
        });
    });
    formCleaner(this);
  });
}

function formResponseHandler(resp) {
  const modalOuter = document.querySelector(".Modal-Outer");
  const modalMessageNode = document.querySelector(".Modal-Message");
  if (resp.ok) {
    modalMessageNode.innerHTML =
      "Спасибо за обращение! Мы с вами свяжемся в ближайшее время";
  } else {
    modalMessageNode.innerHTML =
      "Что-то пошло не так. Пожалуйста, повторите отправку данных";
  }

  showAndHideModal(modalOuter);
}

function showAndHideModal(modal) {
  modal.classList.add("Modal-Outer_Show");
  modal.addEventListener("click", function (e) {
    if (e.target.classList.contains("Button")) {
      this.classList.remove("Modal-Outer_Show");
    }
  });
  setTimeout(function () {
    modal.classList.remove("Modal-Outer_Show");
  }, 6000);
}

function formCleaner(formHandler) {
  formHandler.reset();
  const inputs = formHandler.querySelectorAll(".InputFile");
  if (inputs.length > 0) {
    Array.prototype.forEach.call(inputs, function (input) {
      let label = input.nextElementSibling;
      label.innerHTML = "Загрузить фото";
    });
  }
}

function changeInputsFileLabel() {
  const inputs = document.querySelectorAll(".InputFile");
  Array.prototype.forEach.call(inputs, function (input) {
    let label = input.nextElementSibling;
    let labelVal = label.innerHTML;
    input.addEventListener("change", function (e) {
      let fileName = "";
      fileName = e.target.value.split("\\").pop();
      if (fileName) label.innerHTML = fileName;
      else label.innerHTML = labelVal;
    });
  });
}
