// --- Cấu hình ---
const COMPLIMENTS = [
    "Xinh đẹp tuyệt trần", "Dễ thương nhất hệ mặt trời", "Nụ cười tỏa nắng",
    "Đôi mắt biết nói", "Thông minh, hóm hỉnh", "Dịu dàng",
    "Là duy nhất", "Đáng yêu xỉu", "Mãi yêu em",
    "Công chúa của anh", "Xinh gái số 1", "Ngọt ngào như kẹo",
    "My Sunshine", "My Everything", "Vợ tương lai",
    "Đẹp không góc chết", "Thần tiên tỷ tỷ", "Yêu em 3000",
    "Cute phô mai que", "Mãi bên nhau bạn nhé"
];

let noClickCount = 0;
let selectedDate = "";
let selectedTime = "";
let selectedLocation = ""; // Biến lưu địa điểm
const bgMusic = document.getElementById('bgMusic');

// --- 1. Xử lý Nhạc (Chiến thuật: Bắt sự kiện click đầu tiên) ---
// --- 1. Xử lý Nhạc (Phiên bản Mobile "Bắt dính") ---

// Hàm thử phát nhạc
function tryPlayMusic() {
    // Nếu nhạc chưa chạy (paused) thì mới thử phát
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            // Nếu phát thành công -> Xóa các sự kiện đi cho nhẹ máy
            removeUserInteractions();
            console.log("Đã phát nhạc thành công!");
        }).catch(error => {
            console.log("Vẫn chưa được phép phát nhạc, chờ cú chạm tiếp theo.");
        });
    }
}

// Hàm xóa sự kiện (để không gọi lại nhiều lần sau khi đã phát được)
function removeUserInteractions() {
    document.removeEventListener('click', tryPlayMusic);
    document.removeEventListener('touchstart', tryPlayMusic);
    document.removeEventListener('keydown', tryPlayMusic);
    document.removeEventListener('focusin', tryPlayMusic);
}

// Gắn sự kiện ngay khi web tải xong
window.onload = function() {
    // 1. Thử phát ngay lập tức (dành cho Chrome settings dễ)
    tryPlayMusic();

    // 2. Giăng bẫy bắt mọi hành động có thể trên điện thoại và máy tính
    document.addEventListener('click', tryPlayMusic);       // Chuột click
    document.addEventListener('touchstart', tryPlayMusic);  // Ngón tay chạm màn hình (QUAN TRỌNG CHO MOBILE)
    document.addEventListener('keydown', tryPlayMusic);     // Gõ phím

    // 3. Bắt riêng sự kiện khi chạm vào ô nhập tên
    const inputName = document.getElementById('nameInput');
    if(inputName) {
        inputName.addEventListener('focus', tryPlayMusic); // Khi ô nhập tên được chọn
    }
};

// --- Chuyển màn hình ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// --- Màn 1: Nhập tên & Bật nhạc ---
function submitName() {
    const input = document.getElementById('nameInput').value.trim();
    if (input === "") {
        document.getElementById('errorMsg').innerText = "Nhập tên cho anh biết với nào!";
    } else {
        // KÍCH HOẠT NHẠC Ở ĐÂY LÀ CHẮC CHẮN NHẤT
        bgMusic.play();

        showScreen('screen2');
        setupNoButton();
    }
}

// --- Màn 2: Nút No chạy loạn (Giữ nguyên logic cũ) ---
function setupNoButton() {
    const btnNo = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');

    // Desktop
    btnNo.addEventListener('mouseenter', () => {
        if(window.innerWidth > 768) escapeButton(btnNo);
    });
    // Mobile
    btnNo.addEventListener('click', () => {
        if(window.innerWidth <= 768) {
            noClickCount++;
            escapeButton(btnNo);
            if (noClickCount >= 3) {
                alert("Thôi đừng cố nữa bé ơi! Đồng ý đi ^^");
                btnNo.style.display = 'none';
                btnYes.style.transform = "scale(1.4)";
            }
        }
    });
}

function escapeButton(btn) {
    if (btn.style.position !== 'fixed') {
        const rect = btn.getBoundingClientRect();
        btn.style.position = 'fixed';
        btn.style.left = rect.left + 'px';
        btn.style.top = rect.top + 'px';
    }
    const width = window.innerWidth - btn.offsetWidth;
    const height = window.innerHeight - btn.offsetHeight;
    btn.style.left = Math.random() * width + 'px';
    btn.style.top = Math.random() * height + 'px';
}

function goToDatePicker() {
    showScreen('screen3');
    renderCalendar();
}

// --- Màn 3: Lịch ---
function renderCalendar() {
    const container = document.getElementById('calendar');
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
    container.innerHTML = "";
    days.forEach(day => {
        const btn = document.createElement('button');
        btn.innerText = day;
        btn.className = "day-btn";
        btn.onclick = () => {
            selectedDate = day;
            document.getElementById('timePopup').classList.remove('hidden');
        };
        container.appendChild(btn);
    });
}

function closePopup() {
    document.getElementById('timePopup').classList.add('hidden');
}

function submitDate() {
    const time = document.getElementById('timeInput').value;
    if (!time) { alert("Chọn giờ đi bé!"); return; }

    selectedTime = time; // Lưu giờ lại
    closePopup();

    // THAY ĐỔI: Không hiện kết quả ngay, mà chuyển sang chọn địa điểm
    showScreen('screenLocation');
}

// --- Màn 3.5: Chọn địa điểm (MỚI) ---

// Nếu chọn các nút có sẵn
function chooseLocation(loc) {
    selectedLocation = loc;
    saveAndFinish(); // Lưu và kết thúc
}

// Nếu chọn "Khác"
function showOtherInput() {
    document.getElementById('otherInputArea').classList.remove('hidden');
}

// Hàm chặn chữ cấm khi đang nhập
function checkForbiddenWords(input) {
    const val = input.value.toLowerCase();
    const forbidden = ["không", "khong", "no", "ko", "bận", "đéo", "cút"]; // Danh sách từ cấm
    const warning = document.getElementById('warningMsg');

    // Kiểm tra xem có chứa từ cấm không
    const hasForbidden = forbidden.some(word => val.includes(word));

    if (hasForbidden) {
        warning.innerText = "Hư nha! Không được từ chối!";
        // Xóa sạch ô nhập hoặc xóa từ đó
        input.value = "";
    } else {
        warning.innerText = "";
    }
}

function submitCustomLocation() {
    const input = document.getElementById('customLocation');
    const val = input.value.trim();
    if (val === "") {
        alert("Nhập địa điểm đi nè!");
        return;
    }
    selectedLocation = val;
    saveAndFinish();
}

// Hàm lưu chung và chuyển trang cuối
function saveAndFinish() {
    // Lưu data
    const booking = {
        name: document.getElementById('nameInput').value,
        date: selectedDate,
        time: selectedTime,
        location: selectedLocation, // Lưu thêm địa điểm
        timestamp: new Date().toLocaleString()
    };

    let allBookings = JSON.parse(localStorage.getItem('love_bookings')) || [];
    allBookings.push(booking);
    localStorage.setItem('love_bookings', JSON.stringify(allBookings));

    showFinalScreen();
}

// --- Màn 4: Kết thúc ---
function showFinalScreen() {
    showScreen('screen4');
    startFallingHearts();
}

function startFallingHearts() {
    const container = document.getElementById('fallingContainer');
    setInterval(() => {
        const span = document.createElement('span');
        span.innerText = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
        span.className = 'falling-text';
        span.style.left = Math.random() * 90 + '%';
        span.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        const colors = ['#ff8fa3', '#c9184a', '#ff4d6d', '#590d22', '#ffccd5'];
        span.style.color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 5 + 3;
        span.style.animationDuration = duration + 's';
        container.appendChild(span);
        setTimeout(() => span.remove(), duration * 1000);
    }, 300);
}