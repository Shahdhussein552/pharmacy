const buttons = document.querySelectorAll(".card .btn"); // أزرار الكروت العادية
const shoppingList = document.getElementById("shopping-list");
const cartCount = document.getElementById("cart-count");
const totalPriceEl = document.getElementById("total-price");
const clearAllBtn = document.getElementById("clear-all");
const toggleBtn = document.getElementById("toggle-mode");
const categoryBtns = document.querySelectorAll(".category-btn");
const cards = document.querySelectorAll(".card");
const otherProducts = document.querySelectorAll(".other-products .category ul li"); // ✅ منتجات other products
const searchBar = document.getElementById("searchBar");

let savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let totalPrice = parseFloat(localStorage.getItem("totalPrice")) || 0;
let selectedCategory = "all";

// استرجاع المنتجات المحفوظة
savedItems.forEach(item => addToList(item.name, item.price));
updateUI();

// ----------------------
// إضافة منتج للعربة (الكروت العادية)
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");
    const productName = card.querySelector("p").textContent;
    const productPrice = parseFloat(card.dataset.price);

    addProduct(productName, productPrice, button);
  });
});

// ----------------------
// إضافة منتجات other-products للعربة
otherProducts.forEach(item => {
  const button = item.querySelector("button");
  const productName = item.querySelector("p").textContent;

  // جلب السعر من data-price أو النص
  let productPrice = parseFloat(item.dataset.price);
  if (isNaN(productPrice)) {
    const match = productName.match(/\$?(\d+(\.\d+)?)/);
    productPrice = match ? parseFloat(match[1]) : 0;
  }

  button.addEventListener("click", () => {
    addProduct(productName, productPrice, button);
  });
});

// ----------------------
// دالة لإضافة منتج
function addProduct(productName, productPrice, button) {
  if (!savedItems.some(item => item.name === productName)) {
    savedItems.push({ name: productName, price: productPrice });
    addToList(productName, productPrice);
    updateLocalStorage();
    updateUI();

    // غير شكل الزرار
    button.classList.add("clicked");
    button.textContent = "Added ✅";
  }
}

// ----------------------
// إضافة عنصر لقائمة العربة
function addToList(name, price) {
  const li = document.createElement("li");
  li.textContent = `${name} - $${price}`;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.classList.add("remove-btn");

  removeBtn.addEventListener("click", () => {
    savedItems = savedItems.filter(item => item.name !== name);
    li.remove();
    updateLocalStorage();
    updateUI();

    // رجع الزرار الأصلي لحالته
    [...buttons, ...document.querySelectorAll(".other-products .btn")].forEach(btn => {
      const parent = btn.closest(".card") || btn.closest("li");
      const productText = parent.querySelector("p").textContent;
      if (productText === name) {
        btn.classList.remove("clicked");
        btn.textContent = "Add To Cart";
      }
    });
  });

  li.appendChild(removeBtn);
  shoppingList.appendChild(li);
}

// ----------------------
// زر مسح الكل
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    shoppingList.innerHTML = "";
    savedItems = [];
    updateLocalStorage();
    updateUI();

    // رجع كل الأزرار
    [...buttons, ...document.querySelectorAll(".other-products .btn")].forEach(btn => {
      btn.classList.remove("clicked");
      btn.textContent = "Add To Cart";
    });
  });
}

// ----------------------
// تحديث LocalStorage
function updateLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(savedItems));
  localStorage.setItem("totalPrice", calcTotalPrice());
}

// ----------------------
// تحديث واجهة المستخدم
function updateUI() {
  cartCount.textContent = `Number of Products: ${savedItems.length}`;
  totalPriceEl.textContent = `Total: $${calcTotalPrice()}`;
}

// ----------------------
// حساب السعر الكلي
function calcTotalPrice() {
  return savedItems.reduce((sum, item) => sum + item.price, 0);
}

// ----------------------
// Dark/Light Mode
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

// ----------------------
// فلترة المنتجات حسب الكاتيجوري + السيرش
function filterProducts() {
  const searchText = searchBar.value.toLowerCase();

  // فلترة الكروت
  cards.forEach(card => {
    const productCategory = card.dataset.category;
    const productName = card.querySelector("p").textContent.toLowerCase();
    const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;
    const matchesSearch = productName.includes(searchText);
    card.style.display = matchesCategory && matchesSearch ? "block" : "none";
  });

  // فلترة other-products
  otherProducts.forEach(item => {
    const productCategory = item.getAttribute("data-category");
    const productName = item.textContent.toLowerCase();
    const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;
    const matchesSearch = productName.includes(searchText);
    item.style.display = matchesCategory && matchesSearch ? "block" : "none";
  });
}

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
    filterProducts();
  });
});

searchBar.addEventListener("keyup", filterProducts);

// ----------------------
// شات
function toggleChat() {
  var chatBox = document.getElementById("chatBox");
  chatBox.style.display = (chatBox.style.display === "flex") ? "none" : "flex";
}

