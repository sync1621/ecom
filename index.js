const $ = (id) => document.getElementById(id);
const peso = (n) => n.toLocaleString("en-PH", { style: "currency", currency: "PHP" });
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let query = "";
const thumb = (p) => `<i class="bi ${p.icon}"></i>` + (p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="console.warn('Hindi ma-load ang larawan:', this.src); this.remove()">` : "");
const matches = (q) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter(p => words.every(w => (p.name + " " + p.cat).toLowerCase().includes(w)));
};


const products = [
    { id: 1, name: "Classic Logo Tee",  price: 250, cat: "women", tone: "#efe6da", icon: "bi-badge-tm", img: "https://i.pinimg.com/736x/e0/9e/e6/e09ee6ca2c4de51851a37c3b59dde4a8.jpg" },
    { id: 2, name: "Architecturally Structured Snow-White Cotton Ensemble",   price: 200, cat: "men",   tone: "#dfe6ee", icon: "bi-rulers", img: "https://i.pinimg.com/736x/fb/3f/9e/fb3f9ec35fc25d177be112ccdaacf13c.jpg" },
    { id: 3, name: "Loose-Structured Heritage Denim Trousers",  price: 590, cat: "women", tone: "#e8dccb", icon: "bi-bag", img: "https://i.pinimg.com/736x/2f/aa/89/2faa89cfea932268f0827cc4d033a88b.jpg" },
    { id: 4, name: "Culturally Referenced Romantic Utility Bag",       price: 3290, cat: "kids",   tone: "#e4e4e4", icon: "bi-snow", img: "https://i.pinimg.com/736x/53/9c/ac/539cac69681b90af6d1ce1d07f3c2757.jpg" },
    { id: 5, name: "Whimsical Chromatic Entertainer’s Costume Collection",       price: 1290, cat: "men",  tone: "#f6e3e3", icon: "bi-emoji-smile", img: "https://i.pinimg.com/736x/5d/a4/b5/5da4b51ca79ccfe3a8e061cc574367f4.jpg" },
    { id: 6, name: "Premium Simulated Follicular Headpiece",       price: 599, cat: "women", tone: "#f0e0e8", icon: "bi-stars", img: "https://i.pinimg.com/736x/fa/52/d8/fa52d8da5638ed2c6a071121462bae17.jpg" },
    { id: 7, name: "Timeless Chromatic Stripe-Patterned Polo Garment",           price: 2190, cat: "men",   tone: "#e6ebdd", icon: "bi-sun", img: "https://i.pinimg.com/736x/e1/48/b5/e148b55b1d974f55e56abb08a5a52b47.jpg" },
    { id: 8, name: "Sophisticated Adjustable Visored Headpiece",      price: 2790, cat: "kids",  tone: "#dde8f0", icon: "bi-cloud", img: "https://i.pinimg.com/736x/78/a6/8f/78a68f599b193a4a1af65d962d0bc904.jpg" }
];

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

/* ---------- PRODUCT GRID AND FILTERS ---------- */
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
        <div class="wish-empty"><i class="bi bi-heart"></i><p>Wala pang laman ang wishlist mo.</p></div>`;
    $("wishlist-clear").style.display = items.length ? "" : "none";
    $("wishlist-count").textContent = items.length ? `(${items.length})` : "";
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
$("wishlist-continue").addEventListener("click", closeModal);
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

/* ---------- SEARCH ---------- */
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
