// cart.js
function getCart() {
    try {
        const cart = localStorage.getItem('shopping_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
}

function addToCart(book, qty = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({...book, qty: qty});
    }
    saveCart(cart);
}

function updateItemQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty = Math.max(1, item.qty + delta);
        saveCart(cart);
        window.dispatchEvent(new Event('cartUpdated'));
    }
}

function setItemQty(id, val) {
    const qty = parseInt(val);
    if (qty >= 1) {
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty = qty;
            saveCart(cart);
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    window.dispatchEvent(new Event('cartUpdated'));
}

function clearCart() {
    localStorage.removeItem('shopping_cart');
}
