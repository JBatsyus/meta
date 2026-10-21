const lenis = new Lenis({
    // Длительность анимации прокрутки (в секундах).
    // Чем больше значение — тем медленнее и плавнее скролл.
    duration: 1.2,

    // Коэффициент интерполяции (lerp = linear interpolation).
    // Значение от 0 до 1:
    // - 0.1 = очень плавно, но с "инерцией"
    // - 0.5 = баланс между плавностью и отзывчивостью
    // - 1 = мгновенная прокрутка (без сглаживания)
    lerp: 0.5,

    // Направление прокрутки:
    // 'vertical' — вертикальная (по умолчанию),
    // 'horizontal' — горизонтальная,
    // 'both' — оба направления (требует особой разметки)
    direction: "vertical",

    // Направление жестов (для touch-устройств и трекпада):
    // 'vertical' — только вертикальные свайпы
    // 'horizontal' — только горизонтальные
    // 'both' — любые жесты
    // Полезно, чтобы избежать конфликтов с каруселями и слайдерами
    gestureDirection: "vertical",

    // Включает плавную прокрутку при использовании колеса мыши
    smoothWheel: true,

    // Множитель скорости прокрутки колёсиком мыши.
    // Значение 1 = стандартная скорость.
    // Увеличение (>1) делает скролл быстрее, уменьшение (<1) — медленнее.
    wheelMultiplier: 1,

    // Множитель чувствительности для сенсорных экранов (свайпы).
    // Значение 2 = прокрутка в 2 раза дальше за тот же свайп.
    // Полезно для компенсации "тяжёлости" сенсорного скролла.
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
// Кнопка "наверх" с интеграцией Lenis
const scrollToTopBtn = document.querySelector(".scroll-to-top");
if (scrollToTopBtn) {
    const updateButtonVisibility = () => {
        const shouldShow = lenis.scroll > 300 || window.scrollY > 300;
        scrollToTopBtn.classList.toggle("visible", shouldShow);
    };

    lenis.on("scroll", updateButtonVisibility);
    updateButtonVisibility();

    scrollToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        lenis.scrollTo(0);
    });
}



const resetModalForm = (form) => {
    form.reset();

    const select = form.querySelector(".modal__select");

    if (select ?.choicesInstance) {
        select.choicesInstance.setChoiceByValue("Канада");
    }

    const phone = form.querySelector(".input-phone");

    if (phone) {
        phone.value = "";
    }
};

const formToast = document.getElementById("form-toast");

const showFormToast = () => {
    if (!formToast) {
        return;
    }

    formToast.classList.add("is-visible");
    formToast.setAttribute("aria-hidden", "false");
};

const hideFormToast = () => {
    if (!formToast) {
        return;
    }

    formToast.classList.remove("is-visible");
    formToast.setAttribute("aria-hidden", "true");
};

formToast ?.querySelector(".toast__close") ?.addEventListener("click", hideFormToast);

let clearFormOnClose = false;

const LEAD_ENDPOINT = "/send.php";

const COUNTRIES = [
    "Канада",
    "Казахстан",
    "Германия",
    "Польша",
    "Испания",
    "Франция",
    "Италия",
    "Чехия",
    "Великобритания",
    "США",
    "ОАЭ",
];

const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const websitePattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i;

const readLead = (form) => ({
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    country: form.country.value,
    website: form.website.value.trim(),
    consent: form.consent.checked,
});

const validateLead = (form) => {
    const lead = readLead(form);
    const fields = [form.name, form.phone, form.country, form.website, form.consent];

    fields.forEach((field) => field.setCustomValidity(""));

    if (lead.name.length < 2) {
        form.name.setCustomValidity("Укажите ФИО");
    }

    if (!phonePattern.test(lead.phone)) {
        form.phone.setCustomValidity("Введите телефон полностью: +7 (900) 999-99-99");
    }

    if (!COUNTRIES.includes(lead.country)) {
        form.country.setCustomValidity("Выберите страну продвижения");
    }

    if (lead.website && !websitePattern.test(lead.website)) {
        form.website.setCustomValidity("Укажите адрес сайта, например https://yoursite.com");
    }

    if (!lead.consent) {
        form.consent.setCustomValidity("Нужно согласие на обработку персональных данных");
    }

    return form.reportValidity() ? lead : null;
};

const sendLead = async (lead) => {
    const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(lead),
    });

    if (!response.ok) {
        throw new Error("send failed");
    }

    const result = await response.json();

    if (!result.ok) {
        throw new Error(result.message || "send failed");
    }
};

document.addEventListener("DOMContentLoaded", function () {




    const dashboardSwiper = new Swiper('.dashboard__swiper', {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 8,

        navigation: {
            nextEl: '.dashboard__nav-btn--next',
            prevEl: '.dashboard__nav-btn--prev',
        },

        breakpoints: {
            576: {
                slidesPerView: 1.1,
                spaceBetween: 8,
            },

            768: {
                slidesPerView: 1,
                spaceBetween: 20,
            }
        }
    });


    MicroModal.init({
        awaitOpenAnimation: true,
        awaitCloseAnimation: true,
        onShow: (modal, trigger) => {
            // Останавливаем Lenis (с проверкой на существование)
            if (window.lenis) window.lenis.stop();
            else if (typeof lenis !== "undefined") lenis.stop();

            if (trigger) {
                const titleText = trigger.getAttribute("data-title");
                const btnText = trigger.getAttribute("data-btn");
                const modalTitle = modal.querySelector(".modal__title");
                const modalSubmitBtn = modal.querySelector(".modal__submit");

                if (titleText && modalTitle) modalTitle.textContent = titleText;
                if (btnText && modalSubmitBtn) modalSubmitBtn.textContent = btnText;
            }
            initChoices(modal);
        },
        onClose: (modal) => {
            // 1. Запускаем Lenis обратно
            if (window.lenis) window.lenis.start();
            else if (typeof lenis !== "undefined") lenis.start();

            // 2. Страховка от CSS-блокировки (удаляем overflow: hidden)
            // Делаем небольшую задержку, чтобы анимация закрытия успела завершиться
            setTimeout(() => {
                document.documentElement.style.removeProperty("overflow");
                document.body.style.removeProperty("overflow");
            }, 100);

            if (clearFormOnClose) {
                clearFormOnClose = false;
                const form = modal.querySelector("#contactForm2");

                if (form) {
                    setTimeout(() => resetModalForm(form), 350);
                }
            }
        },
    });

    const contactForm = document.getElementById("contactForm2");

    if (contactForm) {
        contactForm.addEventListener("input", (event) => {
            event.target.setCustomValidity("");
        });

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const lead = validateLead(contactForm);

            if (!lead) {
                return;
            }

            const submitButton = contactForm.querySelector(".modal__submit");
            submitButton.disabled = true;

            try {
                await sendLead(lead);
                clearFormOnClose = true;
                MicroModal.close("modal-1");
                showFormToast();
            } catch (error) {
                submitButton.setCustomValidity("Не удалось отправить заявку. Попробуйте ещё раз.");
                submitButton.reportValidity();
                submitButton.setCustomValidity("");
            } finally {
                submitButton.disabled = false;
            }
        });
    }

});




// Выпадающий список. Инициализируем на открытии модалки:
// пока она скрыта, Choices считает ширину поля нулевой.
const initChoices = (root = document) => {
    const scope = root instanceof Element ? root : document;

    scope.querySelectorAll(".modal__select").forEach((el) => {
        if (el.dataset.choicesInitialized === "true") {
            return;
        }

        el.dataset.choicesInitialized = "true";
        el.choicesInstance = new Choices(el, {
            searchEnabled: false,
            shouldSort: false,
            itemSelectText: "",
        });

        const dropdown = el.closest(".choices") ?.querySelector(".choices__list--dropdown");
        const list = dropdown ?.querySelector(".choices__list");

        if (dropdown && list) {
            dropdown.addEventListener("wheel", (event) => {
                const maxScroll = list.scrollHeight - list.clientHeight;

                if (maxScroll <= 0) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                list.scrollTop = Math.min(maxScroll, Math.max(0, list.scrollTop + event.deltaY));
            }, {
                passive: false
            });
        }
    });
};

// Маска для формы
$(function () {
    $(".input-phone").mask("+7 (999) 999-99-99");
});