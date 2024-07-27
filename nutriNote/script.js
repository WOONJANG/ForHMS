document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const saveNameButton = document.getElementById('saveNameButton');
    const greeting = document.getElementById('greeting');
    const expDisplay = document.getElementById('expDisplay');
    const checkboxes = document.querySelectorAll('.expCheckbox');
    const saveExpButton = document.getElementById('saveExpButton');
    const logoutButton = document.getElementById('logoutButton');
    const lastSavedTimeDisplay = document.getElementById('lastSavedTime');

    let exp = parseInt(localStorage.getItem('exp')) || 0;
    let savedDate = localStorage.getItem('savedDate') || '';
    let lastSavedTime = localStorage.getItem('lastSavedTime') || '';
    let todayDate = new Date().toLocaleDateString();

    function updateGreeting() {
        const name = localStorage.getItem('name');
        if (name) {
            greeting.textContent = `${name} 님의 영양노트`;
		   nameInput.style.display = "none";
		   saveNameButton.style.display = "none";
        } else {
            greeting.textContent = '';
        }
    }

    function updateExpDisplay() {
        expDisplay.textContent = `Exp. ${exp}`;
    }

    function updateLastSavedTimeDisplay() {
        if (lastSavedTime) {
            lastSavedTimeDisplay.textContent = `last save date: ${lastSavedTime}`;
        } else {
            lastSavedTimeDisplay.textContent = '';
        }
    }

    function updateLastCheckedDates() {
        checkboxes.forEach(checkbox => {
            const checkboxId = checkbox.getAttribute('data-id');
            const lastCheckedDate = localStorage.getItem(`lastCheckedDate${checkboxId}`);
            const checkCount = localStorage.getItem(`checkCount${checkboxId}`) || 1;
            const lastCheckedDateDisplay = document.getElementById(`lastCheckedDate${checkboxId}`);
            if (lastCheckedDate) {
                lastCheckedDateDisplay.textContent = `act Exp: ${checkCount} / last che: ${lastCheckedDate}`;
            } else {
                lastCheckedDateDisplay.textContent = '';
            }
        });
    }

    saveNameButton.addEventListener('click', () => {
        const name = nameInput.value;
        if (name) {
            localStorage.setItem('name', name);
            updateGreeting();
location.reload()
        }
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkboxId = checkbox.getAttribute('data-id');
            let currentDate = new Date().toLocaleDateString();
            if (checkbox.checked) {
                exp += 1;
            } else {
                exp -= 1;
            }
            localStorage.setItem(`lastCheckedDate${checkboxId}`, currentDate);
            updateExpDisplay();
            updateLastCheckedDates();
        });
    });

    saveExpButton.addEventListener('click', () => {
        if (savedDate !== todayDate) {
            localStorage.setItem('exp', exp);
            localStorage.setItem('savedDate', todayDate);
            let currentTime = new Date().toLocaleString();
            localStorage.setItem('lastSavedTime', currentTime);
            lastSavedTime = currentTime;
            updateLastSavedTimeDisplay();
            location.reload();
            alert('오늘의 기록이 저장되었습니다.');
        } else {
            alert('오늘은 이미 저장했습니다.');
        }
    });

    logoutButton.addEventListener('click', () => {
        if (confirm('정말 로그아웃 하시겠습니까? 모든 데이터가 초기화됩니다.')) {
            localStorage.clear();
            location.reload();
        }
    });

    // 모든 체크박스를 hidden으로 변경하는 함수
    function hideAllCheckboxes() {
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.type = 'hidden';
        });
    }

    // 저장된 날짜와 오늘 날짜를 비교하여 동일하면 체크박스 숨기기
    if (savedDate === todayDate) {
        hideAllCheckboxes();
    }

    // 페이지 로드 시 로컬스토리지에 이름이 있으면 초기화 화면을 숨기고 메인 화면을 보임
    if (localStorage.getItem('name')) {
        initialContainer.style.display = 'none';
        mainContainer.style.display = 'block';
    } else {
        initialContainer.style.display = 'block';
        mainContainer.style.display = 'none';
    }


    updateGreeting();
    updateExpDisplay();
    updateLastSavedTimeDisplay();
    updateLastCheckedDates();
});
