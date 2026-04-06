const products = [
  {
    id: 'p1',
    name: 'Tai nghe không dây HiFi',
    price: 1299000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    description: 'Âm thanh sống động, đeo nhẹ nhàng và hỗ trợ kết nối nhiều thiết bị.'
  },
  {
    id: 'p2',
    name: 'Đồng hồ thông minh',
    price: 2890000,
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80',
    description: 'Theo dõi sức khỏe, thông báo thông minh và pin dài lâu.'
  },
  {
    id: 'p3',
    name: 'Laptop mỏng nhẹ',
    price: 13990000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    description: 'Hiệu năng ổn định cho học tập và làm việc, thiết kế hiện đại.'
  },
  {
    id: 'p4',
    name: 'Balo du lịch thời trang',
    price: 790000,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    description: 'Chống nước, nhiều ngăn tiện lợi và phong cách năng động.'
  },
  {
    id: 'p5',
    name: 'Máy pha cà phê mini',
    price: 2190000,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    description: 'Pha espresso chuyên nghiệp tại nhà, dễ sử dụng và vệ sinh.'
  },
  {
    id: 'p6',
    name: 'Đèn bàn LED thông minh',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=900&q=80',
    description: 'Ánh sáng điều chỉnh, bảo vệ mắt và kiểu dáng sang trọng.'
  }
];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const priceFilter = document.getElementById('priceFilter');
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const toastContainer = document.getElementById('toastContainer');

let cart = JSON.parse(localStorage.getItem('myShopCart')) || {};
let isDarkMode = localStorage.getItem('theme') === 'dark';

function formatCurrency(value) {
  return value.toLocaleString('vi-VN') + '₫';
}

function saveCart() {
  localStorage.setItem('myShopCart', JSON.stringify(cart));
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filter = priceFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
    if (!matchesSearch) return false;

    if (filter === 'budget') return product.price < 2000000;
    if (filter === 'mid') return product.price >= 2000000 && product.price <= 5000000;
    if (filter === 'premium') return product.price > 5000000;
    return true;
  });

  productGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">${formatCurrency(product.price)}</div>
        <button class="add-cart-btn" data-id="${product.id}">Thêm vào giỏ</button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.add-cart-btn').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.id));
  });
}

function addToCart(productId) {
  const item = products.find((product) => product.id === productId);
  if (!item) return;

  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  renderCart();
  showToast(`Đã thêm ${item.name} vào giỏ hàng.`);
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
}

function renderCart() {
  const cartEntries = Object.entries(cart);
  if (!cartEntries.length) {
    cartItemsContainer.innerHTML = '<p class="empty-message">Giỏ hàng của bạn đang trống.</p>';
    cartTotalEl.textContent = '0₫';
    cartCountEl.textContent = '0';
    return;
  }

  const cartItems = cartEntries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    const itemTotal = product.price * quantity;
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p>${formatCurrency(product.price)} x ${quantity}</p>
        </div>
        <div class="cart-item-actions">
          <button onclick="window.removeFromCart('${id}')">Xóa</button>
          <div class="subtext">${formatCurrency(itemTotal)}</div>
        </div>
      </div>
    `;
  }).join('');

  cartItemsContainer.innerHTML = cartItems;

  const totalPrice = cartEntries.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);

  cartTotalEl.textContent = formatCurrency(totalPrice);
  cartCountEl.textContent = cartEntries.reduce((sum, [, q]) => sum + q, 0);
}

function toggleCart(open) {
  cartPanel.classList.toggle('open', open);
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  darkModeToggle.textContent = isDarkMode ? 'Chế độ sáng' : 'Chế độ tối';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

window.removeFromCart = removeFromCart;

searchInput.addEventListener('input', renderProducts);
priceFilter.addEventListener('change', renderProducts);
cartToggle.addEventListener('click', () => toggleCart(true));
closeCart.addEventListener('click', () => toggleCart(false));
checkoutBtn.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    showToast('Giỏ hàng đang trống, thêm sản phẩm trước nhé.');
    return;
  }
  showToast('Cảm ơn bạn! Quy trình thanh toán sắp ra mắt.');
});

darkModeToggle.addEventListener('click', toggleTheme);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggleCart(false);
  }
});

function initTheme() {
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  darkModeToggle.textContent = isDarkMode ? 'Chế độ sáng' : 'Chế độ tối';
}

renderProducts();
renderCart();
initTheme();
