// ==========================================
// ส่วนที่ 1: ตั้งค่า Google Sheets
// ==========================================
const sheet_id = '1SJpLX9sapZb_Y7JU9VckW9wWIhlv5yRU4X1yrYOTA5k';
const sheet_name = 'Sheet1';
const api_url = `https://opensheet.elk.sh/${sheet_id}/${sheet_name}`;

// ตัวแปรเก็บข้อมูลสินค้าทั้งหมด
let allProducts = [];

// ==========================================
// ส่วนที่ 2: ฟังก์ชันดึงสินค้ามาแสดง
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

        // วนลูปสร้างการ์ดสินค้า
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

// เรียกใช้ฟังก์ชันทันทีที่เปิดเว็บ
fetchProducts();


// ==========================================
// ส่วนที่ 3: ฟังก์ชันเกี่ยวกับ Modal (Popup) & Tabs
// ==========================================
const modal = document.getElementById("productModal");

// ฟังก์ชันเปิด Modal
function openModal(index) {
    const product = allProducts[index];
    if (!product) return;

    // ใส่ข้อมูลสินค้า
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-name').innerText = product.name;
    document.getElementById('modal-price').innerText = product.price + " บาท";

    // รีเซ็ตให้กลับมาหน้า "รายละเอียด" ทุกครั้งที่เปิด
    switchTab('details');
    
    // แสดง Modal
    modal.style.display = "block";
}

// ฟังก์ชันปิด Modal
function closeModal() {
    modal.style.display = "none";
}

// ฟังก์ชันสลับแท็บ
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

// คลิกพื้นที่ว่างๆ นอกกล่องเพื่อปิด
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}


// ==========================================
// ส่วนที่ 4: Sticky Footer (ปุ่มเด้งในมือถือ)
// ==========================================
let lastScrollTop = 0;
const footer = document.getElementById('mobileStickyFooter');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop < 0) scrollTop = 0;

    if (scrollTop > lastScrollTop) {
        footer?.classList.add('show-footer');
    } else {
        footer?.classList.remove('show-footer');
    }
    lastScrollTop = scrollTop;
});