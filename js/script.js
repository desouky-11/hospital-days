// بيانات التطبيق
const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

// العناصر في الصفحة
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const annualCalculation = document.getElementById('annualCalculation');
const calculateBtn = document.getElementById('calculateBtn');
const saveBtn = document.getElementById('saveBtn');
const group1Result = document.getElementById('group1Result');
const group2Result = document.getElementById('group2Result');
const group1Days = document.getElementById('group1Days');
const group2Days = document.getElementById('group2Days');
const totalResult = document.getElementById('totalResult');
const weekendResult = document.getElementById('weekendResult');
const workdaysResult = document.getElementById('workdaysResult');
const monthlyResults = document.getElementById('monthlyResults');
const annualResults = document.getElementById('annualResults');
const annualTableBody = document.getElementById('annualTableBody');
const annualGroup1Total = document.getElementById('annualGroup1Total');
const annualGroup2Total = document.getElementById('annualGroup2Total');
const annualDaysTotal = document.getElementById('annualDaysTotal');
const annualWeekendTotal = document.getElementById('annualWeekendTotal');

// تهيئة التطبيق
function initApp() {
    initYears();
    setCurrentMonth();
    updateSelectedDaysDisplay();
    
    // إضافة مستمعي الأحداث
    calculateBtn.addEventListener('click', calculateDays);
    saveBtn.addEventListener('click', saveAnnualReport);
    annualCalculation.addEventListener('change', toggleAnnualCalculation);
    
    // تحديث عرض الأيام المختارة عند تغييرها
    document.querySelectorAll('input[name="group1"], input[name="group2"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedDaysDisplay);
    });
    
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
    const currentMonth = new Date().getMonth() + 1;
    monthSelect.value = currentMonth;
}

// تحديث عرض الأيام المختارة
function updateSelectedDaysDisplay() {
    const group1Selected = getSelectedDays('group1');
    const group2Selected = getSelectedDays('group2');
    
    group1Days.textContent = `(${group1Selected.join('، ')})`;
    group2Days.textContent = `(${group2Selected.join('، ')})`;
}

// الحصول على الأيام المختارة لمجموعة
function getSelectedDays(groupName) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const selectedDays = [];
    
    checkboxes.forEach(checkbox => {
        selectedDays.push(dayNames[parseInt(checkbox.value)]);
    });
    
    return selectedDays;
}

// الحصول على أيام المجموعة كأرقام
function getGroupDays(groupName) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
    const days = [];
    
    checkboxes.forEach(checkbox => {
        days.push(parseInt(checkbox.value));
    });
    
    return days;
}

// تبديل وضع الحساب السنوي
function toggleAnnualCalculation() {
    if (annualCalculation.checked) {
        monthSelect.value = '0';
        monthSelect.disabled = true;
        annualResults.style.display = 'block';
        monthlyResults.style.display = 'none';
    } else {
        monthSelect.disabled = false;
        annualResults.style.display = 'none';
        monthlyResults.style.display = 'block';
    }
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
    const isAnnual = annualCalculation.checked;
    
    if (!year) {
        alert('يرجى اختيار السنة');
        return;
    }
    
    try {
        if (isAnnual) {
            calculateAnnualReport(year);
        } else {
            calculateMonthlyReport(year, month);
        }
    } catch (error) {
        console.error('حدث خطأ في الحساب:', error);
        alert('حدث خطأ في الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// حساب التقرير الشهري
function calculateMonthlyReport(year, month) {
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    // حساب عدد الأيام لكل مجموعة
    const group1Count = countGroupDays(year, month, group1Days);
    const group2Count = countGroupDays(year, month, group2Days);
    
    // حساب إجمالي أيام الشهر
    const totalDays = getDaysInMonth(year, month);
    
    // حساب أيام الجمعة
    const fridayDays = countFridays(year, month);
    
    // حساب أيام العمل
    const workdays = totalDays - fridayDays;
    
    // تحديث النتائج مع تأثير
    updateResult(group1Result, `${group1Count} يوم`);
    updateResult(group2Result, `${group2Count} يوم`);
    updateResult(totalResult, `${totalDays} يوم`);
    updateResult(weekendResult, `${fridayDays} يوم`);
    updateResult(workdaysResult, `${workdays} يوم`);
}

// حساب التقرير السنوي
function calculateAnnualReport(year) {
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    let annualGroup1Total = 0;
    let annualGroup2Total = 0;
    let annualDaysTotal = 0;
    let annualWeekendTotal = 0;
    
    // تفريغ الجدول
    annualTableBody.innerHTML = '';
    
    // حساب كل شهر
    for (let month = 1; month <= 12; month++) {
        const group1Count = countGroupDays(year, month, group1Days);
        const group2Count = countGroupDays(year, month, group2Days);
        const totalDays = getDaysInMonth(year, month);
        const fridayDays = countFridays(year, month);
        
        // تحديث المجاميع
        annualGroup1Total += group1Count;
        annualGroup2Total += group2Count;
        annualDaysTotal += totalDays;
        annualWeekendTotal += fridayDays;
        
        // إضافة صف للجدول
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${months[month - 1]}</td>
            <td>${group1Count}</td>
            <td>${group2Count}</td>
            <td>${totalDays}</td>
            <td>${fridayDays}</td>
        `;
        annualTableBody.appendChild(row);
    }
    
    // تحديث المجاميع النهائية
    updateAnnualTotals(annualGroup1Total, annualGroup2Total, annualDaysTotal, annualWeekendTotal);
}

// تحديث المجاميع السنوية
function updateAnnualTotals(group1Total, group2Total, daysTotal, weekendTotal) {
    annualGroup1Total.textContent = group1Total;
    annualGroup2Total.textContent = group2Total;
    annualDaysTotal.textContent = daysTotal;
    annualWeekendTotal.textContent = weekendTotal;
}

// حفظ التقرير السنوي كملف نصي
function saveAnnualReport() {
    const year = parseInt(yearSelect.value);
    
    if (!year) {
        alert('يرجى اختيار السنة أولاً');
        return;
    }
    
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    // إعادة حساب التقرير السنوي
    calculateAnnualReport(year);
    
    // إنشاء محتوى الملف النصي
    let fileContent = `تقرير أيام الحضور السنوي - ${year}\n`;
    fileContent += '='.repeat(50) + '\n\n';
    
    fileContent += `المجموعة الأولى: ${getSelectedDays('group1').join('، ')}\n`;
    fileContent += `المجموعة الثانية: ${getSelectedDays('group2').join('، ')}\n\n`;
    
    fileContent += 'الشهر\tالمجموعة الأولى\tالمجموعة الثانية\tالإجمالي\tأيام الإجازة\n';
    fileContent += '-'.repeat(70) + '\n';
    
    let annualGroup1Total = 0;
    let annualGroup2Total = 0;
    let annualDaysTotal = 0;
    let annualWeekendTotal = 0;
    
    // جمع البيانات لكل شهر
    for (let month = 1; month <= 12; month++) {
        const group1Count = countGroupDays(year, month, group1Days);
        const group2Count = countGroupDays(year, month, group2Days);
        const totalDays = getDaysInMonth(year, month);
        const fridayDays = countFridays(year, month);
        
        annualGroup1Total += group1Count;
        annualGroup2Total += group2Count;
        annualDaysTotal += totalDays;
        annualWeekendTotal += fridayDays;
        
        fileContent += `${months[month - 1]}\t${group1Count}\t${group2Count}\t${totalDays}\t${fridayDays}\n`;
    }
    
    fileContent += '-'.repeat(70) + '\n';
    fileContent += `المجموع السنوي\t${annualGroup1Total}\t${annualGroup2Total}\t${annualDaysTotal}\t${annualWeekendTotal}\n\n`;
    fileContent += `تم إنشاء التقرير في: ${new Date().toLocaleString('ar-SA')}\n`;
    
    // إنشاء ملف وتنزيله
    downloadTextFile(fileContent, `تقرير_أيام_الحضور_${year}.txt`);
}

// دالة لتنزيل الملف النصي
function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`تم حفظ التقرير السنوي كملف: ${filename}`);
}

// دالة لتحديث النتائج مع تأثير
function updateResult(element, value) {
    element.textContent = value;
    element.classList.add('value-updated');
    setTimeout(() => {
        element.classList.remove('value-updated');
    }, 500);
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);