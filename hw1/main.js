(function () {
  function safeFeatherReplace() {
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace();
    }
  }

  function initIndexPage() {
    const track = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track || !prevBtn || !nextBtn) {
      return;
    }

    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const book = {
          id: button.dataset.bookId,
          title: button.dataset.bookTitle,
          author: button.dataset.bookAuthor,
          price: parseFloat(button.dataset.bookPrice),
          image: button.dataset.bookImage,
        };
        addToCart(book);
        alert('已成功加入购物车！');
      });
    });

    const slides = Array.from(track.children);
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    let currentIndex = 1;
    const totalSlides = slides.length + 2;

    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    let slideInterval;

    function updateCarousel(instant) {
      if (instant) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.5s ease-in-out';
      }
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function moveNext() {
      if (currentIndex >= totalSlides - 1) {
        return;
      }
      currentIndex += 1;
      updateCarousel(false);
    }

    function movePrev() {
      if (currentIndex <= 0) {
        return;
      }
      currentIndex -= 1;
      updateCarousel(false);
    }

    track.addEventListener('transitionend', () => {
      if (currentIndex === 0) {
        currentIndex = totalSlides - 2;
        updateCarousel(true);
      }
      if (currentIndex === totalSlides - 1) {
        currentIndex = 1;
        updateCarousel(true);
      }
    });

    function startTimer() {
      slideInterval = setInterval(moveNext, 4000);
    }

    function resetTimer() {
      clearInterval(slideInterval);
      startTimer();
    }

    nextBtn.addEventListener('click', () => {
      moveNext();
      resetTimer();
    });

    prevBtn.addEventListener('click', () => {
      movePrev();
      resetTimer();
    });

    startTimer();
  }

  function initDetailsPage() {
    const qtyInput = document.getElementById('qty');
    const addButton = document.querySelector('.js-detail-add-to-cart');

    if (!qtyInput || !addButton) {
      return;
    }

    const decreaseBtn = document.querySelector('.js-qty-decrease');
    const increaseBtn = document.querySelector('.js-qty-increase');

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        const current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = Math.max(1, current - 1);
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        const current = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = current + 1;
      });
    }

    addButton.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value, 10) || 1;
      const book = {
        id: addButton.dataset.bookId,
        title: addButton.dataset.bookTitle,
        author: addButton.dataset.bookAuthor,
        price: parseFloat(addButton.dataset.bookPrice),
        image: addButton.dataset.bookImage,
      };
      addToCart(book, qty);
      window.location.href = 'cart.html';
    });
  }

  function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    if (!container) {
      return;
    }

    container.innerHTML = '';

    if (cart.length === 0) {
      container.innerHTML = '<li class="py-12 text-center text-gray-500 text-lg">您的购物车还是空的，快去选购吧！</li>';
      updateCartSummary(cart);
      return;
    }

    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'py-6 flex flex-col sm:flex-row items-center cart-row border-b border-gray-100 last:border-0';
      li.innerHTML = `
                  <img src="${item.image || 'images/book1.jpg'}" alt="${item.title}" class="h-24 w-20 flex-shrink-0 object-contain rounded-md bg-gray-50 p-2 border border-gray-100 sm:mr-6 mb-4 sm:mb-0">
                  <div class="flex-1 text-center sm:text-left w-full sm:w-auto">
                      <h3 class="font-bold text-gray-900 text-lg mb-1"><a href="details${item.id.replace('book', '')}.html" class="hover:text-primary-600">${item.title}</a></h3>
                      <p class="text-sm text-gray-500 mb-2">${item.author || ''}</p>
                      <div class="font-bold text-primary-600 item-price text-lg">¥${item.price.toFixed(2)}</div>
                  </div>
                  <div class="flex items-center justify-between sm:justify-start space-x-6 w-full sm:w-auto mt-4 sm:mt-0 px-4 sm:px-0">
                      <div class="flex items-center border border-gray-300 rounded-md overflow-hidden h-9">
                          <button type="button" class="px-3 text-gray-500 hover:bg-gray-100 h-full qty-btn" data-cart-action="decrease" data-item-id="${item.id}">-</button>
                          <input type="number" class="w-12 text-center border-none shadow-none text-sm h-full item-qty focus:ring-0" value="${item.qty}" min="1" data-item-id="${item.id}">
                          <button type="button" class="px-3 text-gray-500 hover:bg-gray-100 h-full qty-btn" data-cart-action="increase" data-item-id="${item.id}">+</button>
                      </div>
                      <button type="button" class="text-sm font-medium text-red-500 hover:text-red-700 remove-btn transition-colors" data-cart-action="remove" data-item-id="${item.id}">移除商品</button>
                  </div>
              `;
      container.appendChild(li);
    });

    updateCartSummary(cart);
  }

  function updateCartSummary(cart) {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.qty;
    });

    const discount = cart.length > 0 ? 10.0 : 0.0;
    const total = Math.max(0, subtotal - discount);

    const summaryContainer = document.querySelector('.cart-summary');
    if (!summaryContainer) {
      return;
    }

    const summaryRows = summaryContainer.querySelectorAll('dd');
    if (summaryRows.length >= 3) {
      summaryRows[0].textContent = `¥${subtotal.toFixed(2)}`;
      summaryRows[2].textContent = cart.length > 0 ? `-¥${discount.toFixed(2)}` : '¥0.00';
      summaryRows[3].textContent = `¥${total.toFixed(2)}`;
    }
  }

  function initCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) {
      return;
    }

    if (!container.dataset.bound) {
      container.addEventListener('click', (event) => {
        const btn = event.target.closest('button[data-cart-action]');
        if (!btn) {
          return;
        }
        const action = btn.dataset.cartAction;
        const itemId = btn.dataset.itemId;
        if (action === 'decrease') {
          updateItemQty(itemId, -1);
        } else if (action === 'increase') {
          updateItemQty(itemId, 1);
        } else if (action === 'remove') {
          removeItem(itemId);
        }
      });

      container.addEventListener('change', (event) => {
        const input = event.target.closest('input.item-qty[data-item-id]');
        if (!input) {
          return;
        }
        setItemQty(input.dataset.itemId, input.value);
      });

      container.dataset.bound = '1';
    }

    window.addEventListener('cartUpdated', renderCart);
    renderCart();
  }

  function renderOrder() {
    const cart = getCart();
    const detailsContainer = document.getElementById('checkout-items-container');
    const miniContainer = document.getElementById('mini-cart-container');

    if (!detailsContainer || !miniContainer) {
      return;
    }

    detailsContainer.innerHTML = '';
    miniContainer.innerHTML = '';

    let subtotal = 0;

    if (cart.length === 0) {
      detailsContainer.innerHTML = '<li class="py-4 text-center text-gray-500">此订单中没有商品，请重试</li>';
      miniContainer.innerHTML = '<li class="py-3 text-center text-sm text-gray-500">购物车为空</li>';
    }

    cart.forEach((item) => {
      subtotal += item.price * item.qty;

      const dLi = document.createElement('li');
      dLi.className = 'py-4 flex items-center';
      dLi.innerHTML = `
                  <img src="${item.image || 'images/book1.jpg'}" alt="${item.title}" class="h-20 w-16 object-contain rounded-md border border-gray-200 p-1 mr-4 bg-gray-50">
                  <div class="flex-1">
                      <h3 class="font-bold text-gray-900 text-base mb-1">${item.title}</h3>
                      <p class="text-sm text-gray-500">作者：${item.author || ''}</p>
                  </div>
                  <div class="text-right ml-4">
                      <div class="font-bold text-gray-900 text-lg">¥${item.price.toFixed(2)}</div>
                      <div class="text-sm text-gray-500">数量: ${item.qty}</div>
                  </div>
              `;
      detailsContainer.appendChild(dLi);

      const mLi = document.createElement('li');
      mLi.className = 'py-3 flex justify-between text-sm';
      mLi.innerHTML = `
                  <span class="text-gray-600 truncate mr-4" title="${item.title}">${item.title.substring(0, 12)}... x${item.qty}</span>
                  <span class="font-medium text-gray-900">¥${(item.price * item.qty).toFixed(2)}</span>
              `;
      miniContainer.appendChild(mLi);
    });

    const discount = cart.length > 0 ? 10.0 : 0.0;
    const total = Math.max(0, subtotal - discount);

    const summaryRows = document.querySelectorAll('.cart-summary dd');
    if (summaryRows.length >= 3) {
      summaryRows[0].textContent = `¥${subtotal.toFixed(2)}`;
      summaryRows[1].textContent = cart.length > 0 ? `-¥${discount.toFixed(2)}` : '¥0.00';
      summaryRows[2].textContent = `¥${total.toFixed(2)}`;
    }
  }

  function initOrderPage() {
    if (!document.getElementById('checkout-items-container')) {
      return;
    }
    renderOrder();
  }

  function initSuccessPage() {
    const printBtn = document.querySelector('.js-print-receipt');
    if (!printBtn) {
      return;
    }
    printBtn.addEventListener('click', () => {
      window.print();
    });
    clearCart();
  }

  document.addEventListener('DOMContentLoaded', () => {
    safeFeatherReplace();
    initIndexPage();
    initDetailsPage();
    initCartPage();
    initOrderPage();
    initSuccessPage();
  });
})();