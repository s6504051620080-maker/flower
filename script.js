// ==========================================
// ส่วนที่ 1: ตั้งค่า Google Sheets
// ==========================================
const sheet_id = '1SJpLX9sapZb_Y7JU9VckW9wWIhlv5yRU4X1yrYOTA5k';
const sheet_name = 'Sheet1';
const api_url = `https://opensheet.elk.sh/${sheet_id}/${sheet_name}`;

let allProducts = [];

// ==========================================
// ส่วนที่ 2: ฟังก์ชันดึงสินค้า
// ==========================================
async function fetchProducts() {
    const container = document.getElementById('product-list');
    try {
        const response = await fetch(api_url);
        if (!response.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');
        const data = await response.json();
        allProducts = data; 
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p>ยังไม่มีสินค้าในขณะนี้</p>';
            return;
        }
        data.forEach((item, index) => {
            const cardHTML = `
                <div class="product-card">
                    <img src="${item.image}" alt="${item.name}" class="product-img-real">
                    <h4>${item.name}</h4>
                    <p class="price">${item.price} บาท</p>
                    <div class="product-actions">
                        <button class="btn-action" onclick="openModal(${index})">ดูรายละเอียด</button>
                        <button class="btn-action">สั่งซื้อ</button>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="color:red;">เกิดข้อผิดพลาด! ไม่สามารถโหลดสินค้าได้</p>';
    }
}
fetchProducts();

// ==========================================
// ส่วนที่ 3: Modal & Tabs
// ==========================================
const modal = document.getElementById("productModal");

function openModal(index) {
    const product = allProducts[index];
    if (!product) return;
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-name').innerText = product.name;
    document.getElementById('modal-price').innerText = product.price + " บาท";
    switchTab('details');
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function switchTab(mode) {
    const viewDetails = document.getElementById('view-details');
    const viewOrder = document.getElementById('view-order');
    const btnDetails = document.getElementById('btn-tab-details');
    const btnOrder = document.getElementById('btn-tab-order');

    if (mode === 'details') {
        viewDetails.style.display = 'block';
        viewOrder.style.display = 'none';
        btnDetails.classList.add('active');
        btnOrder.classList.remove('active');
    } else {
        viewDetails.style.display = 'none';
        viewOrder.style.display = 'block';
        btnDetails.classList.remove('active');
        btnOrder.classList.add('active');
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// ==========================================
// ส่วนที่ 4: Sticky Footer (Logic: ลง=แสดง, ขึ้น=ซ่อน)
// ==========================================
let lastScrollTop = 0;
const footer = document.getElementById('mobileStickyFooter');

window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop < 0) scrollTop = 0; 

        // เงื่อนไข: เลื่อนลง (Scroll Down) -> แสดง (Remove 'force-hide')
        if (scrollTop > lastScrollTop) {
            footer.classList.remove('force-hide');
        } 
        // เงื่อนไข: เลื่อนขึ้น (Scroll Up) -> ซ่อน (Add 'force-hide')
        else {
            footer.classList.add('force-hide');
        }
        
        lastScrollTop = scrollTop;
    }
});

// ==========================================
// ส่วนที่ 5: สลับหน้าหลัก
// ==========================================
function switchPage(pageName) {
    const pageHome = document.getElementById('page-home');
    const pageHowto = document.getElementById('page-howto');
    const navHome = document.getElementById('nav-home');
    const navHowto = document.getElementById('nav-howto');

    if (pageName === 'home') {
        pageHome.style.display = 'block';
        pageHowto.style.display = 'none';
        navHome.classList.add('active');
        navHowto.classList.remove('active');
    } else if (pageName === 'howto') {
        pageHome.style.display = 'none';
        pageHowto.style.display = 'block';
        navHome.classList.remove('active');
        navHowto.classList.add('active');
    }
}