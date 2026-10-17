const $ = (id) => document.getElementById(id);
const peso = (n) => Number(n).toLocaleString("en-PH", { style: "currency", currency: "PHP" });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));


let ids = [];
try { ids = JSON.parse(localStorage.getItem("wishlist")) || []; } catch (e) { ids = []; }
ids = ids.filter((id) => products.some((p) => p.id === id));
let voucher = "";

function saveIds() {
    try { localStorage.setItem("wishlist", JSON.stringify(ids)); } catch (e) {}
    if (window.updateBadge) updateBadge();
}

function renderItems() {
    $("co-items").innerHTML = ids.length ? ids.map((id) => {
        const p = products.find((x) => x.id === id);
        const img = p.img ? `<img src="${p.img}" alt="${esc(p.name)}" referrerpolicy="no-referrer" onerror="this.remove()">` : "";
        return `<div class="co-item">
            <div class="co-thumb" style="background:${p.tone}"><i class="bi ${p.icon}"></i>${img}</div>
            <div class="co-info"><p class="co-name">${esc(p.name)}</p><p class="co-price">${peso(p.price)}</p></div>
            <button type="button" class="co-remove" data-id="${p.id}" aria-label="Remove ${esc(p.name)}">&times;</button>
        </div>`;
    }).join("") : `<p class="co-empty">Your bag is empty. <a href="index.php#products">Keep shopping</a></p>`;
    $("co-ids").innerHTML = ids.map((id) => `<input type="hidden" name="ids[]" value="${id}">`).join("");
    $("place-btn").disabled = !ids.length;
}

async function refreshQuote() {
    const shipping = document.querySelector("input[name=shipping]:checked").value;
    try {
        const res = await fetch("quote.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids, shipping, voucher }),
        });
        const q = await res.json();
        $("t-sub").textContent = peso(q.subtotal);
        $("r-disc").hidden = !(q.discount > 0);
        $("t-disc").textContent = "-" + peso(q.discount);
        $("t-ship").textContent = q.subtotal > 0 && q.shipping === 0 ? "Free" : peso(q.shipping);
        $("t-total").textContent = peso(q.total);
        $("voucher-field").value = q.voucher_ok ? q.voucher : "";
        const msg = $("voucher-msg");
        msg.textContent = voucher ? q.voucher_msg : "";
        msg.className = "voucher-msg " + (q.voucher_ok ? "ok" : "err");
    } catch (e) {
        $("voucher-msg").textContent = "Could not reach the server. Is Apache running?";
        $("voucher-msg").className = "voucher-msg err";
    }
}

function showNote() {
    $("pay-note").textContent = document.querySelector("input[name=payment]:checked").dataset.note;
}

$("co-items").addEventListener("click", (e) => {
    const btn = e.target.closest(".co-remove");
    if (!btn) return;
    ids = ids.filter((id) => id !== Number(btn.dataset.id));
    saveIds();
    renderItems();
    refreshQuote();
});
document.querySelectorAll("input[name=shipping]").forEach((r) => r.addEventListener("change", refreshQuote));
document.querySelectorAll("input[name=payment]").forEach((r) => r.addEventListener("change", showNote));
$("voucher-apply").addEventListener("click", () => { voucher = $("voucher-input").value.trim(); refreshQuote(); });
$("voucher-input").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("voucher-apply").click(); } });
$("checkout-form").addEventListener("submit", (e) => { if (!ids.length) e.preventDefault(); });

renderItems();
showNote();
refreshQuote();
