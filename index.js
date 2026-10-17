const $ = (id) => document.getElementById(id);
const peso = (n) => n.toLocaleString("en-PH", { style: "currency", currency: "PHP" });
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let query = "";
const thumb = (p) => `<i class="bi ${p.icon}"></i>` + (p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="console.warn('Hindi ma-load ang larawan:', this.src); this.remove()">` : "");
const matches = (q) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter(p => words.every(w => (p.name + " " + p.cat).toLowerCase().includes(w)));
};


/* ---------- HEADER SCROLL ---------- */
const header = $("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 50);
window.addEventListener("scroll", onScroll);
onScroll();

/* ---------- MOBILE MENU ---------- */
const menuBtn = $("menu-btn"), nav = $("main-nav");
function setMenu(open) {
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.firstElementChild.className = open ? "bi bi-x-lg" : "bi bi-list";
}
menuBtn.addEventListener("click", () => { const open = !nav.classList.contains("open"); if (open) closeSearch(); setMenu(open); });
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

/* ---------- TOAST ---------- */
let toastTimer;
function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}

/* ---------- WISHLIST STATE---------- */
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; } catch (e) { wishlist = []; }
const saveWishlist = () => { try { localStorage.setItem("wishlist", JSON.stringify(wishlist)); } catch (e) {} };

/* ---------- PRODUCT GRID + FILTERS ---------- */
let category = "all";
function renderGrid() {
    const found = query ? matches(query) : products;
    const list = found.filter(p => category === "all" || p.cat === category);
    const note = $("result-note");
    note.hidden = !query;
    note.innerHTML = query ? `Showing ${list.length} result${list.length === 1 ? "" : "s"} for "${esc(query)}" <button type="button" id="clear-search">Clear</button>` : "";
    $("grid").innerHTML = !list.length ? `<p class="grid-empty">No products found.</p>` : list.map(p => `
        <article class="card">
            <div class="thumb" style="background:${p.tone}">${thumb(p)}</div>
            <button class="heart ${wishlist.includes(p.id) ? "on" : ""}" data-id="${p.id}" aria-label="Toggle wishlist for ${p.name}">
                <i class="bi ${wishlist.includes(p.id) ? "bi-heart-fill" : "bi-heart"}"></i>
            </button>
            <p class="card-name">${p.name}</p>
            <p class="card-price">${peso(p.price)}</p>
        </article>`).join("");
}
function setCategory(cat) {
    category = cat;
    document.querySelectorAll("#filters .chip").forEach(c => c.classList.toggle("active", c.dataset.cat === cat));
    renderGrid();
}
$("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) setCategory(chip.dataset.cat);
});
/* Nav + footer links (Women / Men / Kids): filter the grid, then scroll to Products */
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-cat]");
    if (!link) return;
    e.preventDefault();
    query = "";
    sInput.value = "";
    setCategory(link.dataset.cat);
    setMenu(false);
    $("products").scrollIntoView({ behavior: "smooth" });
});
$("grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".heart");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const name = products.find(p => p.id === id).name;
    if (wishlist.includes(id)) { wishlist = wishlist.filter(x => x !== id); toast(`Removed: ${name}`); }
    else { wishlist.push(id); toast(`Added to wishlist: ${name}`); }
    update();
});

/* ---------- WISHLIST MODAL ---------- */
const overlay = $("wishlist-modal"), openBtn = $("wishlist-btn"), closeBtn = $("wishlist-close");

function renderModal() {
    const items = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
    $("wishlist-list").innerHTML = items.length ? items.map(p => `
        <div class="wish-item">
            <div class="wish-thumb" style="background:${p.tone}">${thumb(p)}</div>
            <div class="wish-info"><p class="wish-name">${p.name}</p><p class="wish-price">${peso(p.price)}</p></div>
            <button class="wish-remove" data-id="${p.id}" aria-label="Remove ${p.name}"><i class="bi bi-trash3"></i></button>
        </div>`).join("") : `
        <div class="wish-empty"><i class="bi bi-heart"></i><p>You don't have an item to checkout</p></div>`;
    $("wishlist-clear").style.display = items.length ? "" : "none";
    $("wishlist-count").textContent = items.length ? `(${items.length})` : "";
    $("wishlist-total").textContent = peso(items.reduce((sum, p) => sum + p.price, 0));
    $("wishlist-totalrow").style.display = items.length ? "" : "none";
    $("wishlist-continue").style.display = items.length ? "" : "none";
}

function update() {
    saveWishlist();
    const badge = $("wishlist-badge");
    badge.textContent = wishlist.length;
    badge.classList.toggle("hidden", wishlist.length === 0);
    renderGrid();
    renderModal();
}

function openModal() {
    setMenu(false);
    closeSearch();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
}
function closeModal() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    openBtn.focus();
}
openBtn.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
$("wishlist-clear").addEventListener("click", () => { wishlist = []; update(); });
$("wishlist-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".wish-remove");
    if (!btn) return;
    wishlist = wishlist.filter(id => id !== Number(btn.dataset.id));
    update();
});
document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (overlay.classList.contains("open")) closeModal();
    closeSearch();
    setMenu(false);
});


// SEARCH PANEL
const sPanel = $("search-panel"), sInput = $("search-input"), sBtn = $("search-btn");

function renderSearch() {
    const q = sInput.value.trim(), box = $("search-results");
    if (!q) {
        box.innerHTML = `<p class="sr-hint">Try: ${["tee", "denim", "hoodie", "dress"].map(t => `<button type="button" class="chip" data-term="${t}">${t}</button>`).join("")}</p>`;
        return;
    }
    const r = matches(q);
    box.innerHTML = r.length
        ? r.slice(0, 5).map(p => `
            <button type="button" class="sr-item" data-id="${p.id}">
                <span class="sr-thumb" style="background:${p.tone}">${thumb(p)}</span>
                <span class="sr-info"><span class="sr-name">${p.name}</span><br><span class="sr-meta">${p.cat} \u00b7 ${peso(p.price)}</span></span>
            </button>`).join("") + `<button type="button" class="sr-all" data-all="1">See all ${r.length} result${r.length === 1 ? "" : "s"}</button>`
        : `<p class="sr-empty">No results for "${esc(q)}"</p>`;
}
function openSearch() {
    setMenu(false);
    sPanel.classList.add("open");
    sPanel.setAttribute("aria-hidden", "false");
    header.classList.add("search-open");
    renderSearch();
    sInput.focus();
}
function closeSearch() {
    sPanel.classList.remove("open");
    sPanel.setAttribute("aria-hidden", "true");
    header.classList.remove("search-open");
}
function applyQuery(q) {
    query = q.trim();
    category = "all";
    document.querySelectorAll(".chip[data-cat]").forEach(c => c.classList.toggle("active", c.dataset.cat === "all"));
    renderGrid();
    closeSearch();
    $("products").scrollIntoView({ behavior: "smooth" });
}

    
sBtn.addEventListener("click", (e) => { e.preventDefault(); sPanel.classList.contains("open") ? closeSearch() : openSearch(); });
$("search-close").addEventListener("click", closeSearch);
sInput.addEventListener("input", renderSearch);
$("search-form").addEventListener("submit", (e) => { e.preventDefault(); if (sInput.value.trim()) applyQuery(sInput.value); });
$("search-results").addEventListener("click", (e) => {
    const item = e.target.closest(".sr-item"), all = e.target.closest(".sr-all"), chip = e.target.closest("[data-term]");
    if (item) applyQuery(products.find(p => p.id === Number(item.dataset.id)).name);
    else if (all) applyQuery(sInput.value);
    else if (chip) { sInput.value = chip.dataset.term; renderSearch(); sInput.focus(); }
});
$("result-note").addEventListener("click", (e) => {
    if (e.target.id !== "clear-search") return;
    query = "";
    sInput.value = "";
    renderGrid();
});

/* ---------- NEWSLETTER ---------- */
$("news-form").addEventListener("submit", (e) => {
    e.preventDefault();
    $("news-msg").textContent = "Thanks for subscribing!";
    e.target.reset();
});

update();

/* ---------- LINKS FROM OTHER PAGES (?cat=women / ?q=hoodie) ---------- */
const params = new URLSearchParams(location.search);
if (params.get("cat")) setCategory(params.get("cat"));
if (params.get("q")) { sInput.value = params.get("q"); applyQuery(params.get("q")); }
