// Object contructor validator
function Validator(options) {
    // Get .form-group of input
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    // validate function
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Get rules of selector
        var rules = selectorRules[rule.selector];
        // Loop rules - break if has error
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Get element of form need validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Press button submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Loop rules and validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            // Get data if all input ok
            if (isFormValid) {
                // Case submit with javascript api
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Case submit with preventDefault
                else {
                    formElement.submit();
                }
            }
        }

        // Loop every rules and action (event blur, input, ...) - auto validate when input error
        options.rules.forEach(function (rule) {

            // Save all rules for every input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.condition);
            } else {
                selectorRules[rule.selector] = [rule.condition];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
               // blur out input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // User write input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                } 
            });
        });
    }

}

// Declare rules
// 1. Has error => Return error message
// 2. No error => undefined
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        condition: function (value) {
            return value ? undefined :  message || 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        condition: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  message || 'Vui lòng nhập email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        condition: function (value) {
            return value.length >= min ? undefined :  message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}

Validator.isDuplicate = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        condition: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào chưa chính xác';
        }
    }
}

Validator.isIntergerNumber = function(selector, message) {
    return {
        selector: selector,
        condition: function (value) {
            var regex = /^[0-9]*$/;
            return regex.test(value) ? undefined :  message || 'Vui lòng nhập đúng định dạng số';
        }
    };
}
