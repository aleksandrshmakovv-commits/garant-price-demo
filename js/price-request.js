/* Test assignment: validate locally, without requests or storing contact data. */
(function () {
    'use strict';
    var dialog = document.getElementById('gic-price-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    var form = dialog.querySelector('.gic-price-form');
    var formView = dialog.querySelector('.gic-price-form-view');
    var success = dialog.querySelector('.gic-price-success');
    var title = document.getElementById('gic-price-dialog-title');
    var name = document.getElementById('gic-price-name');
    var phone = document.getElementById('gic-price-phone');
    var submit = dialog.querySelector('.gic-price-submit');
    var opener = null;
    var backdropPointerDown = false;

    function validate() {
        name.setCustomValidity(name.value.trim() ? '' : 'Укажите, как к вам обращаться');
        var digits = phone.value.replace(/\D/g, '');
        var validPhone = /^[+\d\s().-]+$/.test(phone.value) && digits.length >= 10 && digits.length <= 15;
        phone.setCustomValidity(validPhone ? '' : 'Укажите телефон: от 10 до 15 цифр с кодом страны');
    }

    document.querySelectorAll('[data-gic-price-open]').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            opener = button;
            form.reset();
            name.setCustomValidity('');
            phone.setCustomValidity('');
            formView.hidden = false;
            success.hidden = true;
            title.textContent = button.getAttribute('data-gic-price-open');
            submit.textContent = title.textContent;
            document.documentElement.classList.add('gic-price-modal-open');
            dialog.showModal();
            name.focus();
        });
    });

    dialog.querySelector('.gic-price-close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.gic-price-done').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('pointerdown', function (event) {
        var bounds = dialog.getBoundingClientRect();
        backdropPointerDown = event.target === dialog &&
            (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    });
    dialog.addEventListener('click', function (event) {
        var bounds = dialog.getBoundingClientRect();
        if (backdropPointerDown && event.target === dialog &&
            (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
        backdropPointerDown = false;
    });
    dialog.addEventListener('close', function () {
        document.documentElement.classList.remove('gic-price-modal-open');
        form.reset();
        name.setCustomValidity('');
        phone.setCustomValidity('');
        if (opener) opener.focus();
    });
    form.addEventListener('input', validate);
    submit.addEventListener('click', validate);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validate();
        if (!form.reportValidity()) return;
        form.reset();
        formView.hidden = true;
        success.hidden = false;
        success.focus();
    });
    submit.disabled = false;
}());
