/* lingdongyun.best · shared behaviour: menu, FAQ, plan filter, traffic estimator, steppers, sticky CTA bar, TOC */

/* Traffic estimator. Same maths and wording as v2: hours/day x rate x 30 + monthly downloads, +20% margin.
   Optional `on(total, withMargin)` lets the page highlight the matching plan. */
function ldyEstimate(root, dl, gb, mar, rec, on) {
  if (!root || !dl) return;
  var ins = root.querySelectorAll("input[data-rate]");
  function n(v) { v = parseFloat(v); return isFinite(v) && v > 0 ? v : 0; }
  function fmt(x) { return x >= 1000 ? (x / 1000).toFixed(2) + " TB" : Math.round(x) + " GB"; }
  function run() {
    var t = 0;
    ins.forEach(function (i) { t += Math.min(n(i.value), 24) * parseFloat(i.dataset.rate); });
    t = t * 30 + n(dl.value);
    var m = t * 1.2;
    gb.textContent = fmt(t);
    mar.textContent = "含 20% 余量约 " + fmt(m);
    rec.textContent = m <= 70 ? "参考：灵动·穿云（年付，每 30 天 70GB），或月付的灵动·拂风" : m <= 100 ? "参考：灵动·拂风（100GB/月）" : m <= 300 ? "参考：灵动·驭浪（300GB/月）" : m <= 700 ? "参考：灵动·破晓（700GB/月）" : m <= 1500 ? "参考：灵动·凌霄（1.5TB/月）" : "超过最高档 1.5TB/月：建议先核对各项时长，或联系在线客服确认方案";
    if (on) on(t, m);
  }
  root.addEventListener("input", run);
  run();
}

(function () {
  "use strict";
  var d = document;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* mobile menu */
  var mb = d.getElementById("menuBtn"), mn = d.getElementById("mobileNav"), bar = d.getElementById("mbar");
  function setMenu(open) {
    mn.hidden = !open;
    mb.setAttribute("aria-expanded", open ? "true" : "false");
    mb.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    if (bar) bar.classList.toggle("is-menu", open);
  }
  if (mb && mn) {
    mb.addEventListener("click", function () { setMenu(mn.hidden); });
    mn.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mn.hidden) { setMenu(false); mb.focus(); } });
  }

  /* FAQ accordion */
  var PLUS = '<svg viewBox="0 0 12 12"><path d="M2.5 6h7M6 2.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var MINUS = '<svg viewBox="0 0 12 12"><path d="M2.5 6h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  d.querySelectorAll(".acc-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      d.getElementById(btn.getAttribute("aria-controls")).hidden = open;
      var ic = btn.querySelector(".acc-ic");
      if (ic) ic.innerHTML = open ? PLUS : MINUS;
    });
  });

  /* plan-type filter (+ links that preselect a type) */
  var table = d.getElementById("planTable");
  var tabs = d.querySelectorAll(".tab[data-filter]");
  function filter(f) {
    tabs.forEach(function (t) { t.setAttribute("aria-pressed", t.dataset.filter === f ? "true" : "false"); });
    if (table) table.querySelectorAll("tbody tr").forEach(function (r) { r.hidden = !(f === "all" || r.dataset.type === f); });
  }
  tabs.forEach(function (tab) { tab.addEventListener("click", function () { filter(tab.dataset.filter); }); });
  d.querySelectorAll("[data-filter-link]").forEach(function (a) {
    a.addEventListener("click", function () { if (table) filter(a.getAttribute("data-filter-link")); });
  });

  /* steppers around the estimator inputs */
  d.querySelectorAll(".stepper").forEach(function (s) {
    var inp = s.querySelector("input");
    s.querySelectorAll(".step").forEach(function (b) {
      b.addEventListener("click", function () {
        var st = parseFloat(b.getAttribute("data-step")) || 1;
        var v = parseFloat(inp.value); if (!isFinite(v)) v = 0;
        var lo = inp.min !== "" ? parseFloat(inp.min) : -Infinity, hi = inp.max !== "" ? parseFloat(inp.max) : Infinity;
        v = Math.min(hi, Math.max(lo, Math.round((v + st) * 2) / 2));
        inp.value = String(v);
        inp.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  });

  /* estimator → meter, matching plan, table highlight */
  var PLANS = {
    cy: { name: "灵动·穿云", short: "穿云", type: "年付", price: "¥99/年", q: 70 },
    ff: { name: "灵动·拂风", short: "拂风", type: "月付", price: "¥20/月 · 年付折合 ¥17/月", q: 100 },
    yl: { name: "灵动·驭浪", short: "驭浪", type: "月付", price: "¥50/月 · 年付折合 ¥42.5/月", q: 300 },
    px: { name: "灵动·破晓", short: "破晓", type: "月付", price: "¥100/月 · 年付折合 ¥85/月", q: 700 },
    lx: { name: "灵动·凌霄", short: "凌霄", type: "月付", price: "¥180/月 · 年付折合 ¥153/月", q: 1500 }
  };
  function pick(m) { return m <= 70 ? "cy" : m <= 100 ? "ff" : m <= 300 ? "yl" : m <= 700 ? "px" : "lx"; }
  function pos(v) { var p = (Math.log(Math.max(v, 10)) / Math.LN10 - 1) / (Math.log(2000) / Math.LN10 - 1); return Math.max(0, Math.min(1, p)) * 100; }
  function bind(rootId, dlId, gbId, marId, recId) {
    var root = d.getElementById(rootId);
    if (!root) return;
    var fill = root.querySelector(".meter-fill"), margin = root.querySelector(".meter-margin"), pin = root.querySelector(".meter-pin");
    var nums = root.querySelectorAll(".meter-num"), match = root.querySelector(".match");
    var mType = root.querySelector("[data-m=type]"), mPrice = root.querySelector("[data-m=price]"), mBtn = root.querySelector("[data-m=btn]");
    var last = null;
    ldyEstimate(root, d.getElementById(dlId), d.getElementById(gbId), d.getElementById(marId), d.getElementById(recId), function (t, m) {
      var k = pick(m), p = PLANS[k];
      if (fill) fill.style.width = pos(t).toFixed(1) + "%";
      if (margin) margin.style.width = pos(m).toFixed(1) + "%";
      if (pin) { pin.style.left = pos(p.q).toFixed(2) + "%"; pin.textContent = p.short; }
      nums.forEach(function (x) { x.classList.toggle("is-on", x.getAttribute("data-k") === k); });
      if (mType) mType.textContent = p.type;
      if (mPrice) mPrice.textContent = p.price;
      if (mBtn) mBtn.setAttribute("aria-label", "选这一档：" + p.name);
      if (last !== null && last !== k && match && !reduced) {
        match.classList.remove("is-pulse"); void match.offsetWidth; match.classList.add("is-pulse");
      }
      if (table) {
        table.querySelectorAll("tbody tr").forEach(function (r) {
          var on = r.getAttribute("data-plan") === k;
          r.classList.toggle("is-match", on);
          var chip = r.querySelector(".tag-match");
          if (on && !chip) { chip = d.createElement("span"); chip.className = "tag tag-match"; chip.textContent = "估算推荐"; r.querySelector("th").appendChild(chip); }
          if (!on && chip) chip.remove();
        });
      }
      last = k;
    });
  }
  bind("miniCalc", "mdl", "mgb", "mmar", "mrec");
  bind("calc", "cdl", "cgb", "cmar", "crec");

  /* "估算流量" jumps to the tool: flash it, focus the first field on pointer devices */
  var tool = d.getElementById("estimate");
  if (tool && tool.classList.contains("tool")) {
    d.querySelectorAll('a[href="#estimate"]').forEach(function (a) {
      a.addEventListener("click", function () {
        tool.classList.remove("is-flash"); void tool.offsetWidth; tool.classList.add("is-flash");
        setTimeout(function () { tool.classList.remove("is-flash"); }, 1200);
        if (window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches) {
          var first = tool.querySelector("input");
          if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, reduced ? 0 : 450);
        }
      });
    });
  }

  /* sticky mobile CTA bar: hidden while the footer is on screen */
  var ft = d.querySelector(".ft");
  if (bar && ft && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { bar.classList.toggle("is-off", e.isIntersecting); });
    }, { rootMargin: "0px 0px -24px 0px" }).observe(ft);
  }

  /* article table of contents: mark the section being read */
  var toc = d.querySelector(".toc");
  if (toc) {
    var links = [], ticking = false;
    toc.querySelectorAll("a[href^='#']").forEach(function (a) {
      var h = d.getElementById(a.getAttribute("href").slice(1));
      if (h) links.push([h, a]);
    });
    function spy() {
      ticking = false;
      var cur = -1, line = window.innerHeight * 0.3;
      links.forEach(function (p, i) { if (p[0].getBoundingClientRect().top < line) cur = i; });
      links.forEach(function (p, i) { p[1].classList.toggle("is-active", i === cur); });
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }
})();
