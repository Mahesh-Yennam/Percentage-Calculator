/**
 * ============================================================================
 * Percentage, Discount & Tip Calculator — Gamility Tools
 * Standalone pure client-side financial & mathematical calculation suite.
 * Copyright © 2026 Gamility (All Rights Reserved)
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Constants & Storage ---
  const STORAGE_KEY_TAB = 'gamility_pct_tab';
  const STORAGE_KEY_CURRENCY = 'gamility_pct_currency';
  const STORAGE_KEY_PRECISION = 'gamility_pct_precision';

  // --- Global Controls ---
  const currencySelect = document.getElementById('currency-select');
  const decimalSelect = document.getElementById('decimal-select');
  const btnResetCurrent = document.getElementById('btn-reset-current');
  const tabButtons = document.querySelectorAll('.calc-tab-btn');
  const calcCards = document.querySelectorAll('.calc-card');

  // --- Tab 1: Direct Percentage Elements ---
  const directAPercent = document.getElementById('direct-a-percent');
  const directATotal = document.getElementById('direct-a-total');
  const directAResult = document.getElementById('direct-a-result');
  const directAFormula = document.getElementById('direct-a-formula');
  const btnCopyDirectA = document.getElementById('btn-copy-direct-a');

  const directBPart = document.getElementById('direct-b-part');
  const directBWhole = document.getElementById('direct-b-whole');
  const directBResult = document.getElementById('direct-b-result');
  const directBFormula = document.getElementById('direct-b-formula');
  const btnCopyDirectB = document.getElementById('btn-copy-direct-b');

  // --- Tab 2: Percentage Change Elements ---
  const changeV1 = document.getElementById('change-v1');
  const changeV2 = document.getElementById('change-v2');
  const changeResult = document.getElementById('change-result');
  const changeArrow = document.getElementById('change-arrow');
  const changeDirectionBadge = document.getElementById('change-direction-badge');
  const changeDiff = document.getElementById('change-diff');
  const changeMultiplier = document.getElementById('change-multiplier');
  const changeFormula = document.getElementById('change-formula');
  const btnCopyChange = document.getElementById('btn-copy-change');

  // --- Tab 3: Discount Elements ---
  const discountPrice = document.getElementById('discount-price');
  const discountPct = document.getElementById('discount-pct');
  const discountTax = document.getElementById('discount-tax');
  const discountFinalPrice = document.getElementById('discount-final-price');
  const discountSavings = document.getElementById('discount-savings');
  const discountSubtotal = document.getElementById('discount-subtotal');
  const discountTaxAmt = document.getElementById('discount-tax-amt');
  const btnCopyDiscount = document.getElementById('btn-copy-discount');

  // --- Tab 4: Margin Elements ---
  const marginCost = document.getElementById('margin-cost');
  const marginMarkup = document.getElementById('margin-markup');
  const marginSellingPrice = document.getElementById('margin-selling-price');
  const marginProfit = document.getElementById('margin-profit');
  const marginMarginPct = document.getElementById('margin-margin-pct');
  const marginRatio = document.getElementById('margin-ratio');
  const marginFormula = document.getElementById('margin-formula');
  const btnCopyMargin = document.getElementById('btn-copy-margin');

  // --- Tab 5: Tip Elements ---
  const tipBill = document.getElementById('tip-bill');
  const tipPct = document.getElementById('tip-pct');
  const tipPeople = document.getElementById('tip-people');
  const tipPerPerson = document.getElementById('tip-per-person');
  const tipAmtPerPerson = document.getElementById('tip-amt-per-person');
  const tipTotalAmt = document.getElementById('tip-total-amt');
  const tipGrandTotal = document.getElementById('tip-grand-total');
  const btnCopyTip = document.getElementById('btn-copy-tip');

  // --- Preset Pills ---
  const presetPills = document.querySelectorAll('.preset-pill');

  // --- Toast Elements ---
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // State
  let activeTabId = 'direct';
  let currentCurrency = '$';
  let currentPrecision = 2;
  let toastTimer = null;

  // --- Number Formatter Helper ---
  function fmtNum(val) {
    if (isNaN(val) || !isFinite(val)) return '0.00';
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: currentPrecision,
      maximumFractionDigits: currentPrecision
    });
  }

  function fmtCurrency(val) {
    return `${currentCurrency}${fmtNum(val)}`;
  }

  // --- Calculator Engines ---

  // 1. Direct Percentage Calculations
  function calcDirectA() {
    const pct = parseFloat(directAPercent.value) || 0;
    const total = parseFloat(directATotal.value) || 0;
    const res = (pct / 100) * total;
    directAResult.textContent = fmtNum(res);
    directAFormula.textContent = `Formula: (${pct} ÷ 100) × ${total} = ${fmtNum(res)}`;
  }

  function calcDirectB() {
    const part = parseFloat(directBPart.value) || 0;
    const whole = parseFloat(directBWhole.value) || 0;
    if (whole === 0) {
      directBResult.textContent = '0.00%';
      directBFormula.textContent = 'Formula: Division by zero is undefined';
      return;
    }
    const res = (part / whole) * 100;
    directBResult.textContent = `${fmtNum(res)}%`;
    directBFormula.textContent = `Formula: (${part} ÷ ${whole}) × 100 = ${fmtNum(res)}%`;
  }

  // 2. Percentage Change Calculation
  function calcChange() {
    const v1 = parseFloat(changeV1.value) || 0;
    const v2 = parseFloat(changeV2.value) || 0;
    const diff = v2 - v1;

    let pctChange = 0;
    let multiplier = 1;

    if (v1 !== 0) {
      pctChange = (diff / Math.abs(v1)) * 100;
      multiplier = v2 / v1;
    } else if (v2 !== 0) {
      pctChange = v2 > 0 ? 100 : -100;
    }

    // Direction Badge
    changeDirectionBadge.className = 'change-badge';
    if (pctChange > 0) {
      changeDirectionBadge.classList.add('badge-increase');
      changeArrow.textContent = '▲';
      changeResult.textContent = `+${fmtNum(pctChange)}%`;
    } else if (pctChange < 0) {
      changeDirectionBadge.classList.add('badge-decrease');
      changeArrow.textContent = '▼';
      changeResult.textContent = `${fmtNum(pctChange)}%`;
    } else {
      changeDirectionBadge.classList.add('badge-neutral');
      changeArrow.textContent = '=';
      changeResult.textContent = `0.00%`;
    }

    changeDiff.textContent = (diff >= 0 ? '+' : '') + fmtNum(diff);
    changeMultiplier.textContent = `${fmtNum(multiplier)}×`;
    changeFormula.textContent = `Formula: ((${v2} - ${v1}) ÷ |${v1}|) × 100 = ${pctChange >= 0 ? '+' : ''}${fmtNum(pctChange)}%`;
  }

  // 3. Retail Discount & Sales Tax Calculation
  function calcDiscount() {
    const price = parseFloat(discountPrice.value) || 0;
    const pct = parseFloat(discountPct.value) || 0;
    const tax = parseFloat(discountTax.value) || 0;

    const savings = price * (pct / 100);
    const subtotal = Math.max(0, price - savings);
    const taxAmt = subtotal * (tax / 100);
    const finalPrice = subtotal + taxAmt;

    discountFinalPrice.textContent = fmtCurrency(finalPrice);
    discountSavings.textContent = fmtCurrency(savings);
    discountSubtotal.textContent = fmtCurrency(subtotal);
    discountTaxAmt.textContent = fmtCurrency(taxAmt);
  }

  // 4. Markup & Profit Margin Calculation
  function calcMargin() {
    const cost = parseFloat(marginCost.value) || 0;
    const markup = parseFloat(marginMarkup.value) || 0;

    const sellingPrice = cost * (1 + markup / 100);
    const profit = sellingPrice - cost;
    const marginPct = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const ratio = cost > 0 ? sellingPrice / cost : 0;

    marginSellingPrice.textContent = fmtCurrency(sellingPrice);
    marginProfit.textContent = fmtCurrency(profit);
    marginMarginPct.textContent = `${fmtNum(marginPct)}%`;
    marginRatio.textContent = `${fmtNum(ratio)}×`;
    marginFormula.textContent = `Selling Price = ${cost} + (${cost} × ${markup}%) = ${fmtCurrency(sellingPrice)} • Margin = ${fmtNum(marginPct)}%`;
  }

  // 5. Tip & Bill Splitter Calculation
  function calcTip() {
    const bill = parseFloat(tipBill.value) || 0;
    const pct = parseFloat(tipPct.value) || 0;
    const people = Math.max(1, parseInt(tipPeople.value, 10) || 1);

    const tipTotal = bill * (pct / 100);
    const grandTotal = bill + tipTotal;
    const tipPerPersonAmt = tipTotal / people;
    const totalPerPersonAmt = grandTotal / people;

    tipPerPerson.textContent = fmtCurrency(totalPerPersonAmt);
    tipAmtPerPerson.textContent = fmtCurrency(tipPerPersonAmt);
    tipTotalAmt.textContent = fmtCurrency(tipTotal);
    tipGrandTotal.textContent = fmtCurrency(grandTotal);
  }

  // --- Recalculate Active Tab ---
  function recalculateAll() {
    calcDirectA();
    calcDirectB();
    calcChange();
    calcDiscount();
    calcMargin();
    calcTip();
  }

  // --- Currency & Currency Addons Update ---
  function updateCurrencyAddons(curr) {
    currentCurrency = curr;
    document.querySelectorAll('.addon-currency').forEach(addon => {
      addon.textContent = curr;
    });
    recalculateAll();
  }

  // --- Tab Switcher ---
  function switchTab(tabId) {
    activeTabId = tabId;

    tabButtons.forEach(btn => {
      const match = btn.dataset.tab === tabId;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    calcCards.forEach(card => {
      card.classList.toggle('hidden', card.id !== `tab-${tabId}`);
      card.classList.toggle('active', card.id === `tab-${tabId}`);
    });

    try {
      localStorage.setItem(STORAGE_KEY_TAB, tabId);
    } catch (e) {}
  }

  // --- Reset Values for Active Tab ---
  function resetActiveTabDefaults() {
    switch (activeTabId) {
      case 'direct':
        directAPercent.value = 15;
        directATotal.value = 250;
        directBPart.value = 45;
        directBWhole.value = 180;
        break;
      case 'change':
        changeV1.value = 80;
        changeV2.value = 120;
        break;
      case 'discount':
        discountPrice.value = 129.99;
        discountPct.value = 25;
        discountTax.value = 8.5;
        break;
      case 'margin':
        marginCost.value = 40.00;
        marginMarkup.value = 50;
        break;
      case 'tip':
        tipBill.value = 84.50;
        tipPct.value = 18;
        tipPeople.value = 3;
        break;
    }
    recalculateAll();
    showToast('Values reset to defaults.');
  }

  // --- Toast Notification ---
  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Copy failed. Please copy manually.');
    }
    document.body.removeChild(temp);
  }

  // --- Event Listeners Setup ---
  function initEvents() {
    // Mode tabs
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Global Settings
    currencySelect.addEventListener('change', () => {
      updateCurrencyAddons(currencySelect.value);
      try {
        localStorage.setItem(STORAGE_KEY_CURRENCY, currencySelect.value);
      } catch (e) {}
    });

    decimalSelect.addEventListener('change', () => {
      currentPrecision = parseInt(decimalSelect.value, 10);
      recalculateAll();
      try {
        localStorage.setItem(STORAGE_KEY_PRECISION, decimalSelect.value);
      } catch (e) {}
    });

    btnResetCurrent.addEventListener('click', resetActiveTabDefaults);

    // Tab 1: Direct inputs
    [directAPercent, directATotal].forEach(inp => inp.addEventListener('input', calcDirectA));
    [directBPart, directBWhole].forEach(inp => inp.addEventListener('input', calcDirectB));

    // Tab 2: Change inputs
    [changeV1, changeV2].forEach(inp => inp.addEventListener('input', calcChange));

    // Tab 3: Discount inputs
    [discountPrice, discountPct, discountTax].forEach(inp => inp.addEventListener('input', calcDiscount));

    // Tab 4: Margin inputs
    [marginCost, marginMarkup].forEach(inp => inp.addEventListener('input', calcMargin));

    // Tab 5: Tip inputs
    [tipBill, tipPct, tipPeople].forEach(inp => inp.addEventListener('input', calcTip));

    // Preset Pills
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetId = pill.dataset.target;
        const val = pill.dataset.val;
        const input = document.getElementById(targetId);
        if (input) {
          input.value = val;
          input.dispatchEvent(new Event('input'));
          showToast(`Set to ${val}%`);
        }
      });
    });

    // Copy Buttons
    btnCopyDirectA.addEventListener('click', () => {
      copyToClipboard(directAResult.textContent, 'Result copied to clipboard!');
    });

    btnCopyDirectB.addEventListener('click', () => {
      copyToClipboard(directBResult.textContent, 'Proportion copied to clipboard!');
    });

    btnCopyChange.addEventListener('click', () => {
      copyToClipboard(changeResult.textContent, 'Percentage change copied!');
    });

    btnCopyDiscount.addEventListener('click', () => {
      copyToClipboard(discountFinalPrice.textContent, 'Final price copied!');
    });

    btnCopyMargin.addEventListener('click', () => {
      copyToClipboard(marginSellingPrice.textContent, 'Selling price copied!');
    });

    btnCopyTip.addEventListener('click', () => {
      copyToClipboard(tipPerPerson.textContent, 'Per-person amount copied!');
    });
  }

  // --- Bootstrap ---
  function initApp() {
    initEvents();

    // Restore saved currency
    try {
      const savedCurr = localStorage.getItem(STORAGE_KEY_CURRENCY);
      if (savedCurr && ['$', '€', '£', '₹', '¥'].includes(savedCurr)) {
        currencySelect.value = savedCurr;
        currentCurrency = savedCurr;
      }
    } catch (e) {}

    // Restore saved precision
    try {
      const savedPrec = localStorage.getItem(STORAGE_KEY_PRECISION);
      if (savedPrec !== null) {
        decimalSelect.value = savedPrec;
        currentPrecision = parseInt(savedPrec, 10);
      }
    } catch (e) {}

    // Restore saved tab
    try {
      const savedTab = localStorage.getItem(STORAGE_KEY_TAB);
      if (savedTab && ['direct', 'change', 'discount', 'margin', 'tip'].includes(savedTab)) {
        switchTab(savedTab);
      }
    } catch (e) {}

    updateCurrencyAddons(currentCurrency);
    recalculateAll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
