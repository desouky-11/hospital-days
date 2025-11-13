// بيانات التطبيق
const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

// العناصر في الصفحة
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const startMonth = document.getElementById('startMonth');
const endMonth = document.getElementById('endMonth');
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
const rangeResults = document.getElementById('rangeResults');
const annualResults = document.getElementById('annualResults');
const rangeTableBody = document.getElementById('rangeTableBody');
const annualTableBody = document.getElementById('annualTableBody');
const rangeGroup1Total = document.getElementById('rangeGroup1Total');
const rangeGroup2Total = document.getElementById('rangeGroup2Total');
const rangeDaysTotal = document.getElementById('rangeDaysTotal');
const rangeWeekendTotal = document.getElementById('rangeWeekendTotal');
const annualGroup1Total = document.getElementById('annualGroup1Total');
const annualGroup2Total = document.getElementById('annualGroup2Total');
const annualDaysTotal = document.getElementById('annualDaysTotal');
const annualWeekendTotal = document.getElementById('annualWeekendTotal');
const rangeTitle = document.getElementById('rangeTitle');

// متغيرات التطبيق
let currentReportType = 'monthly';

// تهيئة التطبيق
function initApp() {
    initYears();
    setCurrentMonth();
    updateSelectedDaysDisplay();
    
    // إضافة مستمعي الأحداث
    calculateBtn.addEventListener('click', calculateReport);
    saveBtn.addEventListener('click', saveReport);
    
    // أحداث نوع التقرير
    document.querySelectorAll('input[name="reportType"]').forEach(radio => {
        radio.addEventListener('change', handleReportTypeChange);
    });
    
    // تحديث عرض الأيام المختارة عند تغييرها
    document.querySelectorAll('input[name="group1"], input[name="group2"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedDaysDisplay);
    });
    
    // حساب تلقائي عند تحميل الصفحة
    calculateReport();
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
    startMonth.value = currentMonth;
    endMonth.value = currentMonth;
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

// التعامل مع تغيير نوع التقرير
function handleReportTypeChange(event) {
    currentReportType = event.target.value;
    
    // إخفاء جميع وحدات الإدخال والنتائج
    document.querySelectorAll('.report-input').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.report-results').forEach(el => el.style.display = 'none');
    
    // إظهار الوحدة المناسبة
    switch(currentReportType) {
        case 'monthly':
            document.getElementById('monthlyInput').style.display = 'block';
            monthlyResults.style.display = 'block';
            break;
        case 'range':
            document.getElementById('rangeInput').style.display = 'block';
            rangeResults.style.display = 'block';
            break;
        case 'annual':
            annualResults.style.display = 'block';
            break;
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
function calculateReport() {
    const year = parseInt(yearSelect.value);
    
    if (!year) {
        alert('يرجى اختيار السنة');
        return;
    }
    
    try {
        switch(currentReportType) {
            case 'monthly':
                calculateMonthlyReport(year);
                break;
            case 'range':
                calculateRangeReport(year);
                break;
            case 'annual':
                calculateAnnualReport(year);
                break;
        }
    } catch (error) {
        console.error('حدث خطأ في الحساب:', error);
        alert('حدث خطأ في الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// حساب التقرير الشهري
function calculateMonthlyReport(year) {
    const month = parseInt(monthSelect.value);
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

// حساب تقرير نطاق الشهور
function calculateRangeReport(year) {
    const start = parseInt(startMonth.value);
    const end = parseInt(endMonth.value);
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    if (start > end) {
        alert('الشهر الأول يجب أن يكون قبل الشهر الأخير');
        return;
    }
    
    let rangeGroup1Total = 0;
    let rangeGroup2Total = 0;
    let rangeDaysTotal = 0;
    let rangeWeekendTotal = 0;
    
    // تفريغ الجدول
    rangeTableBody.innerHTML = '';
    
    // تحديث العنوان
    rangeTitle.textContent = `نتائج نطاق الشهور: من ${months[start-1]} إلى ${months[end-1]} ${year}`;
    
    // حساب كل شهر في النطاق
    for (let month = start; month <= end; month++) {
        const group1Count = countGroupDays(year, month, group1Days);
        const group2Count = countGroupDays(year, month, group2Days);
        const totalDays = getDaysInMonth(year, month);
        const fridayDays = countFridays(year, month);
        
        // تحديث المجاميع
        rangeGroup1Total += group1Count;
        rangeGroup2Total += group2Count;
        rangeDaysTotal += totalDays;
        rangeWeekendTotal += fridayDays;
        
        // إضافة صف للجدول
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${months[month - 1]}</td>
            <td>${group1Count}</td>
            <td>${group2Count}</td>
            <td>${totalDays}</td>
            <td>${fridayDays}</td>
        `;
        rangeTableBody.appendChild(row);
    }
    
    // تحديث المجاميع النهائية
    updateRangeTotals(rangeGroup1Total, rangeGroup2Total, rangeDaysTotal, rangeWeekendTotal);
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

// تحديث مجاميع نطاق الشهور
function updateRangeTotals(group1Total, group2Total, daysTotal, weekendTotal) {
    rangeGroup1Total.textContent = group1Total;
    rangeGroup2Total.textContent = group2Total;
    rangeDaysTotal.textContent = daysTotal;
    rangeWeekendTotal.textContent = weekendTotal;
}

// تحديث المجاميع السنوية
function updateAnnualTotals(group1Total, group2Total, daysTotal, weekendTotal) {
    annualGroup1Total.textContent = group1Total;
    annualGroup2Total.textContent = group2Total;
    annualDaysTotal.textContent = daysTotal;
    annualWeekendTotal.textContent = weekendTotal;
}

// حفظ التقرير الحالي
function saveReport() {
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
    
    let fileContent = '';
    let filename = '';
    
    switch(currentReportType) {
        case 'monthly':
            const month = parseInt(monthSelect.value);
            fileContent = generateMonthlyReport(year, month, group1Days, group2Days);
            filename = `تقرير_شهري_${months[month-1]}_${year}.txt`;
            break;
        case 'range':
            const start = parseInt(startMonth.value);
            const end = parseInt(endMonth.value);
            fileContent = generateRangeReport(year, start, end, group1Days, group2Days);
            filename = `تقرير_نطاق_${months[start-1]}_إلى_${months[end-1]}_${year}.txt`;
            break;
        case 'annual':
            fileContent = generateAnnualReport(year, group1Days, group2Days);
            filename = `تقرير_سنوي_${year}.txt`;
            break;
    }
    
    // إنشاء ملف وتنزيله
    downloadTextFile(fileContent, filename);
}

// إنشاء محتوى التقرير الشهري
function generateMonthlyReport(year, month, group1Days, group2Days) {
    const group1Count = countGroupDays(year, month, group1Days);
    const group2Count = countGroupDays(year, month, group2Days);
    const totalDays = getDaysInMonth(year, month);
    const fridayDays = countFridays(year, month);
    const workdays = totalDays - fridayDays;
    
    let content = `تقرير أيام الحضور الشهري\n`;
    content += '='.repeat(50) + '\n\n';
    
    content += `السنة: ${year}\n`;
    content += `الشهر: ${months[month-1]}\n\n`;
    
    content += `المجموعة الأولى: ${getSelectedDays('group1').join('، ')}\n`;
    content += `المجموعة الثانية: ${getSelectedDays('group2').join('، ')}\n\n`;
    
    content += 'نتائج الحساب:\n';
    content += '-'.repeat(30) + '\n';
    content += `المجموعة الأولى: ${group1Count} يوم\n`;
    content += `المجموعة الثانية: ${group2Count} يوم\n`;
    content += `إجمالي أيام الشهر: ${totalDays} يوم\n`;
    content += `أيام الإجازة (الجمعة): ${fridayDays} يوم\n`;
    content += `أيام العمل: ${workdays} يوم\n\n`;
    
    content += `تم إنشاء التقرير في: ${new Date().toLocaleString('ar-SA')}\n`;
    
    return content;
}

// إنشاء محتوى تقرير نطاق الشهور
function generateRangeReport(year, start, end, group1Days, group2Days) {
    let content = `تقرير أيام الحضور لنطاق الشهور\n`;
    content += '='.repeat(50) + '\n\n';
    
    content += `السنة: ${year}\n`;
    content += `نطاق الشهور: من ${months[start-1]} إلى ${months[end-1]}\n\n`;
    
    content += `المجموعة الأولى: ${getSelectedDays('group1').join('، ')}\n`;
    content += `المجموعة الثانية: ${getSelectedDays('group2').join('، ')}\n\n`;
    
    content += 'الشهر\tالمجموعة الأولى\tالمجموعة الثانية\tالإجمالي\tأيام الإجازة\n';
    content += '-'.repeat(70) + '\n';
    
    let rangeGroup1Total = 0;
    let rangeGroup2Total = 0;
    let rangeDaysTotal = 0;
    let rangeWeekendTotal = 0;
    
    // جمع البيانات لكل شهر في النطاق
    for (let month = start; month <= end; month++) {
        const group1Count = countGroupDays(year, month, group1Days);
        const group2Count = countGroupDays(year, month, group2Days);
        const totalDays = getDaysInMonth(year, month);
        const fridayDays = countFridays(year, month);
        
        rangeGroup1Total += group1Count;
        rangeGroup2Total += group2Count;
        rangeDaysTotal += totalDays;
        rangeWeekendTotal += fridayDays;
        
        content += `${months[month - 1]}\t${group1Count}\t${group2Count}\t${totalDays}\t${fridayDays}\n`;
    }
    
    content += '-'.repeat(70) + '\n';
    content += `المجموع\t${rangeGroup1Total}\t${rangeGroup2Total}\t${rangeDaysTotal}\t${rangeWeekendTotal}\n\n`;
    content += `تم إنشاء التقرير في: ${new Date().toLocaleString('ar-SA')}\n`;
    
    return content;
}

// إنشاء محتوى التقرير السنوي
function generateAnnualReport(year, group1Days, group2Days) {
    let content = `تقرير أيام الحضور السنوي\n`;
    content += '='.repeat(50) + '\n\n';
    
    content += `السنة: ${year}\n\n`;
    
    content += `المجموعة الأولى: ${getSelectedDays('group1').join('، ')}\n`;
    content += `المجموعة الثانية: ${getSelectedDays('group2').join('، ')}\n\n`;
    
    content += 'الشهر\tالمجموعة الأولى\tالمجموعة الثانية\tالإجمالي\tأيام الإجازة\n';
    content += '-'.repeat(70) + '\n';
    
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
        
        content += `${months[month - 1]}\t${group1Count}\t${group2Count}\t${totalDays}\t${fridayDays}\n`;
    }
    
    content += '-'.repeat(70) + '\n';
    content += `المجموع السنوي\t${annualGroup1Total}\t${annualGroup2Total}\t${annualDaysTotal}\t${annualWeekendTotal}\n\n`;
    content += `تم إنشاء التقرير في: ${new Date().toLocaleString('ar-SA')}\n`;
    
    return content;
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
    
    alert(`تم حفظ التقرير كملف: ${filename}`);
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