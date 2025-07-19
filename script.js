const apiKey = key.apiKey;
const baseCurrencySelect = document.getElementById('baseCurrency');
const resultsDiv = document.getElementById('results');

let currencyNameMap = {};

async function Currencies() {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
    const data = await res.json();
    const codes = data.supported_codes;

    codes.forEach(([code, name]) => {
        currencyNameMap[code] = name;

        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${name}`;
        baseCurrencySelect.appendChild(option);
    });
}

async function convertToAll() {
    const amount = parseFloat(document.getElementById('amount').value);
    const base = baseCurrencySelect.value;

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const rates = data.conversion_rates;

        resultsDiv.innerHTML = '';
        for (let [currency, rate] of Object.entries(rates)) {
            const converted = (amount * rate).toFixed(2);
            const name = currencyNameMap[currency] || "Unknown Currency";
            const div = document.createElement('div');
            div.textContent = `${name} (${currency}): ${converted}`;
            resultsDiv.appendChild(div);
        }
    } catch (err) {
        console.error("Fetch error:", err);
        resultsDiv.innerHTML = 'Error fetching conversion data.';
    }
}

Currencies();
