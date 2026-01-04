// --- 1. CẤU HÌNH EMAIL (THAY CỦA BẠN VÀO ĐÂY) ---
const EMAIL_SERVICE_ID = "service_a25r0vi";  // Thay Service ID
const EMAIL_TEMPLATE_ID = "template_24twxza"; // Thay Template ID
const EMAIL_PUBLIC_KEY = "Afc7tgUxfB9aumfpD";     // Thay Public Key

// Khởi tạo EmailJS
(function() {
    emailjs.init(EMAIL_PUBLIC_KEY);
})();

// --- 2. Cấu hình nội dung ---
// --- Thay thế danh sách cũ bằng danh sách này ---
const COMPLIMENTS = [
    "Xinh đẹp tuyệt trần",
    "Dễ thương nhất hệ mặt trời",
    "Nụ cười tỏa nắng",
    "Đôi mắt biết nói",
    "Thần thái ngút ngàn",
    "Xinh lung linh",
    "Đáng yêu xỉu",
    "Xinh không góc chết",
    "Duyên dáng quá nè",
    "Xinh gái số 1",
    "Ngọt ngào như kẹo",
    "Cute phô mai que",
    "Xinh như búp bê",
    "Rạng rỡ như hoa",
    "Dễ thương muốn xỉu",
    "Siêu cấp đáng yêu"
];

let noClickCount = 0;
let selectedDate = "";
let selectedTime = "";
let selectedLocation = "";
const bgMusic = document.getElementById('bgMusic');

// --- 3. Xử lý Nhạc (Phiên bản "Bắt dính" Mobile/PC) ---
function tryPlayMusic() {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            removeUserInteractions();
        }).catch(e => console.log("Chờ tương tác..."));
    }
}
function removeUserInteractions() {
    document.removeEventListener('click', tryPlayMusic);
    document.removeEventListener('touchstart', tryPlayMusic);
    document.removeEventListener('keydown', tryPlayMusic);
    document.removeEventListener('focusin', tryPlayMusic);
}
window.onload = function() {
    tryPlayMusic(); // Thử ngay khi load
    // Giăng bẫy bắt sự kiện để bật nhạc
    document.addEventListener('click', tryPlayMusic);
    document.addEventListener('touchstart', tryPlayMusic);
    document.addEventListener('keydown', tryPlayMusic);
    const inputName = document.getElementById('nameInput');
    if(inputName) inputName.addEventListener('focus', tryPlayMusic);
};

// --- 4. Chuyển màn hình ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// --- Màn 1: Nhập tên ---
function submitName() {
    const input = document.getElementById('nameInput').value.trim();
    if (input === "") {
        document.getElementById('errorMsg').innerText = "Nhập tên cho anh biết với nào!";
    } else {
        bgMusic.play(); // Kích hoạt lại cho chắc
        showScreen('screen2');
        setupNoButton();
    }
}

// --- Màn 2: Nút No chạy trốn ---
function setupNoButton() {
    const btnNo = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');

    // PC: Di chuột
    btnNo.addEventListener('mouseenter', () => {
        if(window.innerWidth > 768) escapeButton(btnNo);
    });
    // Mobile: Chạm
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
    selectedTime = time;
    closePopup();
    showScreen('screenLocation'); // Chuyển sang chọn địa điểm
}

// --- Màn 3.5: Chọn địa điểm & GỬI EMAIL ---
function chooseLocation(loc) {
    selectedLocation = loc;
    sendEmailAndFinish();
}

function showOtherInput() {
    document.getElementById('otherInputArea').classList.remove('hidden');
}

function checkForbiddenWords(input) {
    const val = input.value.toLowerCase();
    const forbidden = ["không", "khong", "no", "ko", "bận", "đéo", "cút"];
    if (forbidden.some(word => val.includes(word))) {
        document.getElementById('warningMsg').innerText = "Hư nha! Không được từ chối!";
        input.value = "";
    } else {
        document.getElementById('warningMsg').innerText = "";
    }
}

function submitCustomLocation() {
    const val = document.getElementById('customLocation').value.trim();
    if (val === "") { alert("Nhập địa điểm đi nè!"); return; }
    selectedLocation = val;
    sendEmailAndFinish();
}

// HÀM QUAN TRỌNG: GỬI EMAIL
function sendEmailAndFinish() {
    const btnSubmit = document.querySelector('#screenLocation button');
    if(btnSubmit) btnSubmit.innerText = "Đang gửi cho anh...";

    const params = {
        from_name: document.getElementById('nameInput').value,
        date: selectedDate,
        time: selectedTime,
        location: selectedLocation
    };

    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, params)
        .then(function(res) {
            console.log('Email sent!', res.status);
            showFinalScreen();
        }, function(error) {
            console.log('Failed...', error);
            alert("Lỗi mạng xíu, nhưng anh đã ghi nhận trong tim rồi ^^");
            showFinalScreen();
        });
}

// --- Màn 4: Kết thúc ---
function showFinalScreen() {
    showScreen('screen4');
    const container = document.getElementById('fallingContainer');
    setInterval(() => {
        const span = document.createElement('span');
        span.innerText = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
        span.className = 'falling-text';
        span.style.left = Math.random() * 90 + '%';
        span.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        const colors = ['#ff8fa3', '#c9184a', '#ff4d6d', '#590d22', '#ffccd5'];
        span.style.color = colors[Math.floor(Math.random() * colors.length)];
        span.style.animationDuration = (Math.random() * 5 + 3) + 's';
        container.appendChild(span);
        setTimeout(() => span.remove(), 8000);
    }, 300);
}