const header = document.getElementById("header");
const nav = document.getElementById("main-nav");
const menuBtn = document.getElementById("menu-btn");
const sPanel = document.getElementById("search-panel");
const sInput = document.getElementById("search-input");

function setMenu(open) {
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.firstElementChild.className = open ? "bi bi-x-lg" : "bi bi-list";
}
function openSearch() {
    setMenu(false);
    sPanel.classList.add("open");
    sPanel.setAttribute("aria-hidden", "false");
    header.classList.add("search-open");
    sInput.focus();
}
function closeSearch() {
    sPanel.classList.remove("open");
    sPanel.setAttribute("aria-hidden", "true");
    header.classList.remove("search-open");
}
menuBtn.addEventListener("click", () => { const open = !nav.classList.contains("open"); if (open) closeSearch(); setMenu(open); });
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
document.getElementById("search-btn").addEventListener("click", (e) => { e.preventDefault(); sPanel.classList.contains("open") ? closeSearch() : openSearch(); });
document.getElementById("search-close").addEventListener("click", closeSearch);
document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = sInput.value.trim();
    if (q) location.href = "index.php?q=" + encodeURIComponent(q) + "#products";
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSearch(); setMenu(false); } });

function updateBadge() {
    try {
        const count = (JSON.parse(localStorage.getItem("wishlist")) || []).length;
        const badge = document.getElementById("wishlist-badge");
        badge.textContent = count;
        badge.classList.toggle("hidden", count === 0);
    } catch (e) {}
}
updateBadge();
