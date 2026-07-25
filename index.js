const connectionModal = document.querySelector("#connection-modal");
const connectTrigger = document.querySelector("#connect-services");
const closeButton = connectionModal.querySelector(".modal-close");
const providerButtons = connectionModal.querySelectorAll(".provider-button");
let lastFocusedElement = null;

function getConnections() {
    try {
        return JSON.parse(localStorage.getItem("mudi-demo-connections")) || {};
    } catch {
        return {};
    }
}

function renderConnections() {
    const connections = getConnections();
    const connectedCount = Object.values(connections).filter(Boolean).length;

    connectTrigger.classList.toggle("has-connection", connectedCount > 0);
    connectTrigger.querySelector(".connect-label").textContent =
        connectedCount > 0 ? `${connectedCount} Connected` : "Connect";

    providerButtons.forEach((button) => {
        const isConnected = Boolean(connections[button.dataset.provider]);
        button.classList.toggle("connected", isConnected);
        button.querySelector(".provider-status").textContent =
            isConnected ? "Connected" : "Connect";
    });
}

function openModal() {
    lastFocusedElement = document.activeElement;
    connectionModal.hidden = false;
    document.body.classList.add("modal-open");
    closeButton.focus();
}

function closeModal() {
    connectionModal.hidden = true;
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
}

connectTrigger.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

connectionModal.addEventListener("click", (event) => {
    if (event.target === connectionModal) closeModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !connectionModal.hidden) closeModal();
});

providerButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const connections = getConnections();
        const provider = button.dataset.provider;
        connections[provider] = !connections[provider];
        localStorage.setItem("mudi-demo-connections", JSON.stringify(connections));
        renderConnections();
    });
});

renderConnections();
