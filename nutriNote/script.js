document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const saveNameButton = document.getElementById('saveNameButton');
    const greeting = document.getElementById('greeting');
    const expDisplay = document.getElementById('expDisplay');
    const checkboxes = document.querySelectorAll('.expCheckbox');
    const saveExpButton = document.getElementById('saveExpButton');
    const logoutButton = document.getElementById('logoutButton');
    const lastSavedTimeDisplay = document.getElementById('lastSavedTime');
    const initialContainer = document.getElementById('initialContainer');
    const mainContainer = document.getElementById('mainContainer');

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
            lastSavedTimeDisplay.textContent = `Last save date: ${lastSavedTime}`;
        } else {
            lastSavedTimeDisplay.textContent = '';
        }
    }

    function updateLastCheckedDates() {
        checkboxes.forEach(checkbox => {
            const checkboxId = checkbox.getAttribute('data-id');
            const lastCheckedDate = localStorage.getItem(`lastCheckedDate${checkboxId}`);
            const checkCount = localStorage.getItem(`checkCount${checkboxId}`) || 0;
            const lastCheckedDateDisplay = document.getElementById(`lastCheckedDate${checkboxId}`);
            const image = document.getElementById(`img${checkboxId}`);
            if (lastCheckedDate) {
                lastCheckedDateDisplay.textContent = `Checked ${checkCount} times / Last check: ${lastCheckedDate}`;
                image.title = `Exp. ${checkCount}`; // Update image title attribute for tooltip
            } else {
                lastCheckedDateDisplay.textContent = '';
                image.title = 'Exp. 0'; // Default title attribute
            }
        });
    }

    function initializeCheckboxes() {
        checkboxes.forEach(checkbox => {
            const checkboxId = checkbox.getAttribute('data-id');
            const checkCount = localStorage.getItem(`checkCount${checkboxId}`) || 0;
            checkbox.checked = localStorage.getItem(`checked${checkboxId}`) === 'true';
            exp += parseInt(checkCount); // Accumulate the exp value based on check count
        });
    }

    saveNameButton.addEventListener('click', () => {
        const name = nameInput.value;
        if (name) {
            localStorage.setItem('name', name);
            updateGreeting();
            location.reload();
        }
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkboxId = checkbox.getAttribute('data-id');
            let currentCheckCount = parseInt(localStorage.getItem(`checkCount${checkboxId}`)) || 0;
            if (checkbox.checked) {
                exp += 100;
                //currentCheckCount += 1;
                localStorage.setItem(`checked${checkboxId}`, 'true');
            } else {
                exp -= 100;
                //currentCheckCount = Math.max(0, currentCheckCount - 1);
                localStorage.setItem(`checked${checkboxId}`, 'false');
            }
            localStorage.setItem(`checkCount${checkboxId}`, currentCheckCount);
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

    function hideAllCheckboxes() {
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.type = 'hidden';
        });
    }

    if (savedDate === todayDate) {
        hideAllCheckboxes();
    }

    if (localStorage.getItem('name')) {
        initialContainer.style.display = 'none';
        mainContainer.style.display = 'block';
    } else {
        initialContainer.style.display = 'block';
        mainContainer.style.display = 'none';
    }

    initializeCheckboxes(); // Initialize checkbox states and accumulate exp value

    updateGreeting();
    updateExpDisplay();
    updateLastSavedTimeDisplay();
    updateLastCheckedDates();
});
