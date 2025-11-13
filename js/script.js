// بيانات التطبيق
const groups = {
    group1: [6, 1, 3], // السبت=6, الإثنين=1, الأربعاء=3
    group2: [0, 2, 4]  // الأحد=0, الثلاثاء=2, الخميس=4
};

// العناصر في الصفحة
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const calculateBtn = document.getElementById('calculateBtn');
const group1Result = document.getElementById('group1Result');
const group2Result = document.getElementById('group2Result');
const totalResult = document.getElementById('totalResult');
const weekendResult = document.getElementById('weekendResult');
const workdaysResult = document.getElementById('workdaysResult');

// تهيئة التطبيق
function initApp() {
    initYears();
    setCurrentMonth();
    calculateBtn.addEventListener('click', calculateDays);
    
    // حساب تلقائي عند تحميل الصفحة
    calculateDays();
}

// تعبئة السنوات في القائمة المنسدلة
function initYears() {
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 20; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// تعيين الشهر الحالي
function setCurrentMonth() {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
    monthSelect.value = currentMonth;
}

// دالة لحساب عدد الأيام في الشهر
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

// دالة لحساب يوم الأسبوع (الأحد=0, السبت=6)
function getDayOfWeek(year, month, day) {
    return new Date(year, month - 1, day).getDay();
}

// دالة لحساب أيام المجموعة
function countGroupDays(year, month, groupDays) {
    const daysInMonth = getDaysInMonth(year, month);
    let count = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const weekday = getDayOfWeek(year, month, day);
        if (groupDays.includes(weekday)) {
            count++;
        }
    }
    
    return count;
}

// دالة لحساب أيام الجمعة
function countFridays(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    let count = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const weekday = getDayOfWeek(year, month, day);
        if (weekday === 5) { // الجمعة = 5
            count++;
        }
    }
    
    return count;
}

// الدالة الرئيسية للحساب
function calculateDays() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    if (!year || !month) {
        alert('يرجى اختيار السنة والشهر');
        return;
    }
    
    try {
        // حساب عدد الأيام لكل مجموعة
        const group1Days = countGroupDays(year, month, groups.group1);
        const group2Days = countGroupDays(year, month, groups.group2);
        
        // حساب إجمالي أيام الشهر
        const totalDays = getDaysInMonth(year, month);
        
        // حساب أيام الجمعة
        const fridayDays = countFridays(year, month);
        
        // حساب أيام العمل
        const workdays = totalDays - fridayDays;
        
        // تحديث النتائج مع تأثير
        updateResult(group1Result, `${group1Days} يوم`);
        updateResult(group2Result, `${group2Days} يوم`);
        updateResult(totalResult, `${totalDays} يوم`);
        updateResult(weekendResult, `${fridayDays} يوم`);
        updateResult(workdaysResult, `${workdays} يوم`);
        
    } catch (error) {
        console.error('حدث خطأ في الحساب:', error);
        alert('حدث خطأ في الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// دالة لتحديث النتائج مع تأثير
function updateResult(element, value) {
    element.textContent = value;
    element.classList.add('value-updated');
    setTimeout(() => {
        element.classList.remove('value-updated');
    }, 500);
}

// إضافة مستمع حدث للتحديث التلقائي عند تغيير القيم
yearSelect.addEventListener('change', calculateDays);
monthSelect.addEventListener('change', calculateDays);

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);