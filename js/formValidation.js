window.addEventListener("load", main, { once: true });

const validationData = [
  {
    formId: "reservations",
    formConfig: [
      {
        id: "names",
        validations: [
          {
            type: "required",
            message: "Имената са задължителни",
          },
          {
            type: "maxlength",
            value: 30,
            message: "Имената трябва да са най-много 30 символа",
          },
        ],
      },
      {
        id: "telNumber",
        validations: [
          {
            type: "required",
            message: "Мобилният номер е задължителен",
          },
          {
            type: "pattern",
            regexp: /^(\+359|0)\d{9}$/,
            message: "Мобилният номер трябва да валиден и да е от България",
          },
        ],
      },
      {
        id: "email",
        validations: [
          {
            type: "required",
            message: "Имейлът е задължителен",
          },
          {
            type: "email",
            message: "Имейлът е невалиден",
          },
        ],
      },
    ],
  },
];

const validationMap = {
  required: (inputValue) => {
    return !!inputValue;
  },
  maxlength: (inputValue, { value }) => {
    return inputValue.length <= value;
  },
  pattern: (inputValue, { regexp }) => {
    return regexp.test(inputValue);
  },
  email: (inputValue) => {
    return inputValue.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  },
  custom: (inputValue, { validate }) => {
    return validate(inputValue);
  },
  integer: (inputValue) => {
    return Number.isInteger(Number(inputValue));
  },
  minvalue: (inputValue, { value }) => {
    return Number(inputValue) >= value;
  },
  maxvalue: (inputValue, { value }) => {
    return Number(inputValue) <= value;
  },
};

function main() {
  validationData.forEach(({ formId, formConfig }) => {
    const form = document.getElementById(formId);
    const submitBtn = form.querySelector('[type="submit"]');

    for (const inputConfig of formConfig) {
      inputConfig.input = document.getElementById(inputConfig.id);
      inputConfig.validationMessage = form.querySelector(
        `[data-validation-for="${inputConfig.id}"]`
      );
    }

    for (const { input, validationMessage, validations } of formConfig) {
      input.addEventListener("input", () => {
        for (const validation of validations) {
          if (
            typeof validationMap[validation.type] === "function" &&
            !validationMap[validation.type](input.value, validation)
          ) {
            input.setCustomValidity(validation.message);
            validationMessage.textContent = validation.message;
            submitBtn.disabled = true;
            return;
          }
        }

        input.setCustomValidity("");
        validationMessage.textContent = "";
        submitBtn.disabled = false;
      });
    }

    form.addEventListener("submit", (e) => {
      for (const { input, validationMessage, validations } of formConfig) {
        for (const validation of validations) {
          if (
            typeof validationMap[validation.type] === "function" &&
            !validationMap[validation.type](input.value, validation)
          ) {
            input.setCustomValidity(validation.message);
            validationMessage.textContent = validation.message;
            submitBtn.disabled = true;
            e.preventDefault();
            break;
          }

          input.setCustomValidity("");
          validationMessage.textContent = "";
        }
      }
    });
  });
}
