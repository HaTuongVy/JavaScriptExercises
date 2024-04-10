// Hàm validator
function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};
  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    // Lấy được value qua inputElement.value
    // Lấy được hàm kiểm tra test function qua rule.test
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);
    var errorMessage;

    // Lấy ra các rule của selector
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule và kiểm tra
    // Nếu có lỗi thì dừng việc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "checkbox":
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }

  // Lấy Element của form cần validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    // Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      options.rules.forEach(function (rule) {
        // Thực hiện lặp qua từng rules và validate
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);

        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Trường hợp submit với JS
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled]"
          );
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }

                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);

                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          },
          {});

          options.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    // Xử lý lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,...)
    options.rules.forEach(function (rule) {
      // Lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        // Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // Xử lý trường hợp mỗi khi người dùng nhập vào sẽ không bị lỗi nữa
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    });
  }
}

// Định nghĩa các rule
// Nguyên tắc của các rule:
// 1. Khi có lỗi thì trả ra message lỗi
// 2. Khi hợp lệ thì không trả ra gì cả (undefined)
Validator.isRequired = function (selector, messgae) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : messgae || "Vui lòng nhập trường này!";
    },
  };
};

Validator.isEmail = function (selector, messgae) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : messgae || "Trường này phải là email";
    },
  };
};

Validator.minLength = function (selector, min, messgae) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : messgae || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConformValue, messgae) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConformValue()
        ? undefined
        : messgae || "Giá trị nhập vào không chính xác";
    },
  };
};
