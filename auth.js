const tabs = document.querySelectorAll(".auth-tab");
const panels = document.querySelectorAll(".tab-panel");
const title = document.querySelector("#auth-title");
const description = document.querySelector("#auth-description");

const copy = {
    login: {
        title: "Welcome back",
        description: "Sign in and keep the music that fits your day."
    },
    signup: {
        title: "Create your space",
        description: "Save the songs and moods that feel like you."
    }
};

function setMode(mode, updateUrl = true) {
    const safeMode = mode === "signup" ? "signup" : "login";

    tabs.forEach((tab) => {
        const isActive = tab.dataset.mode === safeMode;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
        const isActive = panel.id === `${safeMode}-panel`;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
    });

    title.textContent = copy[safeMode].title;
    description.textContent = copy[safeMode].description;

    if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("mode", safeMode);
        history.replaceState({}, "", url);
    }
}

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
    tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        const nextIndex = event.key === "ArrowRight"
            ? (index + 1) % tabs.length
            : (index - 1 + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        setMode(tabs[nextIndex].dataset.mode);
    });
});

document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const input = button.previousElementSibling;
        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";
        button.textContent = isVisible ? "Show" : "Hide";
        button.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    });
});

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll("input").forEach((input) => {
        const error = input.closest(".field")?.querySelector(".field-error");

        if (!input.checkValidity()) {
            isValid = false;
            input.setAttribute("aria-invalid", "true");
            if (error) {
                error.textContent = input.validity.valueMissing
                    ? "Please fill in this field."
                    : input.validity.typeMismatch
                        ? "Please enter a valid email."
                        : "Password must be at least 8 characters.";
            }
        } else {
            input.removeAttribute("aria-invalid");
            if (error) error.textContent = "";
        }
    });
    return isValid;
}

document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.querySelector(".form-status");
        status.textContent = "";

        if (!validateForm(form)) return;

        status.textContent = form.id === "login-form"
            ? "Login UI is ready to connect."
            : "Sign-up UI is ready to connect.";
    });

    form.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
            input.removeAttribute("aria-invalid");
            const error = input.closest(".field")?.querySelector(".field-error");
            if (error) error.textContent = "";
        });
    });
});

document.querySelector(".quiet-link").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#login-form .form-status").textContent =
        "Password recovery can be connected with the authentication server.";
});

const initialMode = new URLSearchParams(window.location.search).get("mode");
setMode(initialMode, false);
