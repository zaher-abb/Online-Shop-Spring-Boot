const productsApi = "https://70a1dz3t08.execute-api.us-east-1.amazonaws.com/prod/products";
let currentProduct = null;
const productsMap = {};
const orderItems = [];

// Safely extract a numeric price value from various DynamoDB style objects
function extractPrice(obj, fallback = 0) {
    if (obj === undefined || obj === null) return parseFloat(fallback);
    if (typeof obj === 'number' || typeof obj === 'string') {
        const n = parseFloat(obj);
        return isNaN(n) ? parseFloat(fallback) : n;
    }
    if (obj.price !== undefined) {
        return extractPrice(obj.price, fallback);
    }
    if (obj.N !== undefined) {
        return extractPrice(obj.N, fallback);
    }
    if (obj.M !== undefined) {
        return extractPrice(obj.M, fallback);
    }
    return parseFloat(fallback);
}

function refreshItems() {
    const tbody = document.querySelector('#order-items tbody');
    tbody.innerHTML = '';
    let hasItems = orderItems.length > 0;
    orderItems.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item.name}</td><td>${item.size||''}</td><td>${item.qty}</td><td>€${item.price.toFixed(2)}</td><td><button class="btn btn-sm btn-danger" data-idx="${idx}">Remove</button></td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('create-invoice').disabled = !hasItems;
}

async function loadProducts() {
    try {
        const res = await fetch(productsApi);
        const data = await res.json();
        const tbody = document.querySelector('#all-products tbody');
        tbody.innerHTML = '';
        data.forEach(p => {
            productsMap[p.PK] = p;
            let price = extractPrice(p.price, 0);
            if (!price && p.sizes) {
                const firstSize = Object.values(p.sizes)[0];
                if (firstSize) price = extractPrice(firstSize.price ?? firstSize, 0);
            }
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.product_name}</td><td>€${price.toFixed(2)}</td><td><button class="btn btn-sm btn-primary" data-id="${p.PK}">Add</button></td>`;
            tbody.appendChild(tr);
        });
    } catch(err) {
        console.error('loadProducts error', err);
    }
}

async function openAddModal(productId){
    let product = await getProduct(productId);
    if(!product) return;
    currentProduct = { id: productId, name: product.product_name };
    const select = document.getElementById('item-size');
    select.innerHTML = '';
    if (product.sizes && Object.keys(product.sizes).length) {
        for (const [size, details] of Object.entries(product.sizes)) {
            const price = extractPrice(details.price ?? details, product.price);
            const opt = document.createElement('option');
            opt.value = size;
            opt.textContent = `${size} - €${price.toFixed(2)}`;
            opt.dataset.price = price;
            select.appendChild(opt);
        }
        select.disabled = false;
    } else {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Default';
        opt.dataset.price = extractPrice(product.price, 0);
        select.appendChild(opt);
        select.disabled = true;
    }
    document.getElementById('item-qty').value = 1;
    $('#add-modal').modal('show');
}

async function getProduct(id){
    if(productsMap[id] && productsMap[id].sizes){
        return productsMap[id];
    }
    try{
        const res = await fetch(`${productsApi}/?PK=${id}`);
        const data = await res.json();
        productsMap[id] = Object.assign({}, productsMap[id], data);
        return productsMap[id];
    }catch(err){
        console.error('getProduct error',err);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.querySelector('#all-products').addEventListener('click', e => {
        if(e.target.matches('button[data-id]')) {
            openAddModal(e.target.dataset.id);
        }
    });

    document.getElementById('add-item').addEventListener('click', () => {
        const qty = parseInt(document.getElementById('item-qty').value) || 1;
        const select = document.getElementById('item-size');
        const size = select.value;
        const price = parseFloat(select.options[select.selectedIndex].dataset.price);
        orderItems.push({ ...currentProduct, qty, size, price });
        $('#add-modal').modal('hide');
        refreshItems();
    });

    document.querySelector('#order-items tbody').addEventListener('click', e => {
        if(e.target.matches('button[data-idx]')) {
            const idx = parseInt(e.target.dataset.idx);
            orderItems.splice(idx,1);
            refreshItems();
        }
    });

    document.getElementById('create-invoice').addEventListener('click', () => {
        const data = {
            date: new Date().toISOString().split('T')[0],
            items: orderItems
        };
        const encoded = encodeURIComponent(JSON.stringify(data));
        window.open(`../rechnung.html?data=${encoded}`,'_blank');
    });
});
