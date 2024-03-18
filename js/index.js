document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.querySelector('.form__input--select');
    const citySelect = document.querySelector('.city-select');
    const iconArrow = document.querySelector('.icon--arrow');
    const btn = document.querySelector('.form__button-submit')


    function updateCityOptionsVisibility(filterText) {
        const cityOptions = Array.from(citySelect.querySelectorAll('span'));

        cityOptions.forEach(function (option) {
            const cityName = option.textContent.toLowerCase();
            option.style.display = cityName.includes(filterText) ? 'block' : 'none';
        });

        const visibleOptions = cityOptions.filter(option => option.style.display !== 'none');
        // citySelect.style.display = visibleOptions.length ? 'block' : 'none';
    }

    // Відслідковувати клік на елементі .city-select та обрати місто
    citySelect.addEventListener('click', function (event) {
        const targetOption = event.target.closest('span');
        if (targetOption) {
            inputField.value = targetOption.getAttribute('data-value');
            iconArrow.classList.toggle('active')
            toggleSelect(false)
        }
    });

    // Фільтрувати міста в залежності від введеного користувачем тексту
    inputField.addEventListener('input', function () {
        const filterText = inputField.value.toLowerCase();
        if (iconArrow.classList.contains('active')) {
            updateCityOptionsVisibility(filterText);
        }
    });

    // Закрити випадаюче меню, якщо клік відбувається поза ним або на іконці
    document.addEventListener('click', function (e) {
        const isClickedInside = citySelect.contains(e.target);
        const isClickedOnInput = inputField.contains(e.target);

        if (!isClickedInside && !isClickedOnInput) {
            if (iconArrow.classList.contains('active')) {
                iconArrow.classList.toggle('active')
                return toggleSelect(false)
            }
        }

        if (e.target.closest('.icon--arrow')) {
            if (iconArrow.classList.contains('active')) {
                iconArrow.classList.toggle('active')
                return toggleSelect(false)
            }
            iconArrow.classList.toggle('active')
            toggleSelect(true)
        }
    });

    function toggleSelect(boolen) {
        boolen ? citySelect.style.display = 'block' : citySelect.style.display = 'none'
    }



    const show_pw_btn = document.querySelector('.form__pass-icon');
    const show_pw_icon = show_pw_btn.querySelector('img');
    const pw_input = document.querySelector('.form__input--password');

    show_pw_icon.addEventListener('click', (e) => {
        pw_input.type = pw_input.type === 'password' ? 'text' : 'password';

        // Зміна шляху в залежності від типу пароля
        if (pw_input.type === 'text') {
            show_pw_icon.src = './img/icons/passwordOn.svg';
        } else {
            show_pw_icon.src = './img/icons/passwordOff.svg';
        }
    });




    function removeError(input) {
        input.classList.remove('error-input');
        input.type === 'checkbox' 
        ? errorSpan = document.querySelector('.erorr-span')
        : errorSpan = input.closest('.form__input-container').nextElementSibling
        errorSpan.textContent = ''
        const parent = input.parentNode;
        if (parent.classList.contains('error-input')) {
            parent.classList.remove('error-input');
        }
    }

    function createError(input, message) {
        let errorSpan
        input.type === 'checkbox' 
        ? errorSpan = document.querySelector('.erorr-span')
        : errorSpan = input.closest('.form__input-container').nextElementSibling
        errorSpan.classList.add('error-message');
        errorSpan.textContent = message;

        // Додайте клас помилки до інпута для стилізації бордера
        input.parentNode.classList.add('error-input');

    }

    function validation(form) {
        let result = true;
        const allInputs = form.querySelectorAll('input');



        // Clear existing errors
        allInputs.forEach(input => removeError(input));

        allInputs.forEach(input => {
            if (input.value.trim() === '') {
                result = false;
                createError(input, 'This field cannot be empty');
            }

            if (input.classList.contains('form__input--phone') && input.value.length < 19) {
                result = false;
                createError(input, "Phone number is required and must be in the correct format")
            }
            if (input.classList.contains('form__input--email') && !isValidEmail(input.value)) {
                result = false;
                createError(input, "Email is required")
            }

            if (input.classList.contains('form__input--checbox') && !input.checked) {
                result = false;
                createError(input, "Checkbox will be checked")
            }

            function isValidEmail(email) {
                // Simple email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            // Additional validation checks can be added here if needed

            return result;
        });

        return result;
    }

    async function submitFormToEmail(formData) {
        try {
            const response = await fetch('../mail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                btn.classList.remove('active')
                btn.classList.add('finished')
                const data = await response.json();
                const span = document.querySelector('.erorr-span')
                span.textContent = '';
                console.log('Email submission successful:', data);
            } else {
                throw new Error('Failed to submit form');
            }
        } catch (error) {
            btn.classList.remove('active')
            console.error('Error submitting form:', error);
            const span = document.querySelector('.erorr-span')
            span.textContent = 'Something went wrong';
        }
    }

    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        if (validation(this)) {
            const formData = {};
            const allInputs = this.querySelectorAll('input');
            allInputs.forEach(input => {
                formData[input.name] = input.value;
                if (input.type === 'checkbox') {
                    show_pw_icon.src = './img/icons/passwordOff.svg';
                    input.checked = false;
                } else {
                    input.value = ''
                }
                removeError(input)
            });
            btn.classList.add('active')
            submitFormToEmail(formData)
        }
    });


    IMask(
        document.getElementById('tel-mask'),
        {
            mask: '+38 (000) 000-00-00'
        }
    )


});
