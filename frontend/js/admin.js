// Admin panel logic
const productsApi = "https://70a1dz3t08.execute-api.us-east-1.amazonaws.com/prod/products";
const photoApi = "https://70a1dz3t08.execute-api.us-east-1.amazonaws.com/prod/photo";
const voucherApi = "https://70a1dz3t08.execute-api.us-east-1.amazonaws.com/prod/voucher";

async function loadProducts() {
    try {
        const res = await fetch(productsApi);
        const data = await res.json();
        const tbody = document.querySelector('#product-table tbody');
        tbody.innerHTML = '';
        data.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.PK}</td>
                <td>${p.product_name}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${p.PK}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${p.PK}">Delete</button>
                </td>`;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Failed to load products', err);
    }
}

async function createVoucher(code, discount) {
    try {
        await fetch(voucherApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, discount })
        });
        alert('Voucher created');
    } catch (err) {
        console.error('Failed to create voucher', err);
        alert('Failed to create voucher');
    }
}

async function deleteProduct(id) {
    if (!confirm('Delete product?')) return;
    try {
        await fetch(`${productsApi}/${id}`, { method: 'DELETE' });
        loadProducts();
    } catch (err) {
        console.error('Delete failed', err);
    }
}

async function updateProduct(id, data) {
    try {
        await fetch(`${productsApi}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        loadProducts();
    } catch (err) {
        console.error('Update failed', err);
    }
}

async function uploadPhoto(file) {
    const base64 = await new Promise(r => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    const res = await fetch(photoApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: file.type })
    });
    const result = await res.json();
    return `https://zahzouh.de/${result.key}`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('voucher-form').addEventListener('submit', e => {
        e.preventDefault();
        const code = document.getElementById('voucher-code').value.trim();
        const discount = parseFloat(document.getElementById('voucher-discount').value);
        if (code) createVoucher(code, discount);
    });

    document.querySelector('#product-table').addEventListener('click', async e => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deleteProduct(id);
        } else if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`${productsApi}/${id}`);
                const product = await res.json();
                document.getElementById('edit-id').value = id;
                document.getElementById('edit-name').value = product.product_name || '';
                document.getElementById('edit-price').value = product.price || '';
                document.getElementById('edit-description').value = product.description || '';
                document.getElementById('edit-category').value = product.categorie || '';
                document.getElementById('edit-image').value = '';
                $('#edit-modal').modal('show');
            } catch (err) {
                console.error('Failed to load product', err);
            }
        }
    });

    document.getElementById('edit-form').addEventListener('submit', async e => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const data = {
            product_name: document.getElementById('edit-name').value,
            price: parseFloat(document.getElementById('edit-price').value),
            description: document.getElementById('edit-description').value,
            categorie: document.getElementById('edit-category').value
        };
        const file = document.getElementById('edit-image').files[0];
        if (file) {
            try {
                const imageUrl = await uploadPhoto(file);
                data.image_url = imageUrl;
            } catch (err) {
                console.error('Photo upload failed', err);
            }
        }
        await updateProduct(id, data);
        $('#edit-modal').modal('hide');
    });
});
