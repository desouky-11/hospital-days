// بيانات التطبيق
const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

// العناصر في الصفحة
const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const annualYearSelect = document.getElementById('annualYearSelect');
const startYear = document.getElementById('startYear');
const startMonthPeriod = document.getElementById('startMonthPeriod');
const endYear = document.getElementById('endYear');
const endMonthPeriod = document.getElementById('endMonthPeriod');
const calculateBtn = document.getElementById('calculateBtn');
const saveBtn = document.getElementById('saveBtn');

// عناصر النتائج
const group1Result = document.getElementById('group1Result');
const group2Result = document.getElementById('group2Result');
const group1Days = document.getElementById('group1Days');
const group2Days = document.getElementById('group2Days');
const totalResult = document.getElementById('totalResult');
const weekendResult = document.getElementById('weekendResult');
const workdaysResult = document.getElementById('workdaysResult');

// عناوين النتائج
const monthlyTitle = document.getElementById('monthlyTitle');
const annualTitle = document.getElementById('annualTitle');
const periodTitle = document.getElementById('periodTitle');

// أقسام النتائج
const monthlyResults = document.getElementById('monthlyResults');
const annualResults = document.getElementById('annualResults');
const periodResults = document.getElementById('periodResults');

// جداول النتائج
const annualTableBody = document.getElementById('annualTableBody');
const periodTableBody = document.getElementById('periodTableBody');

// مجاميع النتائج
const annualGroup1Total = document.getElementById('annualGroup1Total');
const annualGroup2Total = document.getElementById('annualGroup2Total');
const annualDaysTotal = document.getElementById('annualDaysTotal');
const annualWeekendTotal = document.getElementById('annualWeekendTotal');
const periodGroup1Total = document.getElementById('periodGroup1Total');
const periodGroup2Total = document.getElementById('periodGroup2Total');
const periodDaysTotal = document.getElementById('periodDaysTotal');
const periodWeekendTotal = document.getElementById('periodWeekendTotal');

// متغيرات التطبيق
let currentReportType = 'monthly';

// تهيئة التطبيق
function initApp() {
    initYears();
    setDefaultDates();
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
    
    // تحديث تلقائي للفترة الزمنية عند تغيير تاريخ البداية
    startYear.addEventListener('change', updatePeriodEndDate);
    startMonthPeriod.addEventListener('change', updatePeriodEndDate);
    
    // حساب تلقائي عند تحميل الصفحة
    calculateReport();
}

// تعبئة السنوات في جميع القوائم المنسدلة
function initYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i < 20; i++) {
        years.push(currentYear + i);
    }
    
    // تعبئة جميع قوائم السنوات
    fillYearSelect(yearSelect, years);
    fillYearSelect(annualYearSelect, years);
    fillYearSelect(startYear, years);
    fillYearSelect(endYear, years);
}

// دالة مساعدة لتعبية قائمة السنوات
function fillYearSelect(selectElement, years) {
    // تفريغ القائمة أولاً
    selectElement.innerHTML = '';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectElement.appendChild(option);
    });
}

// تعيين التواريخ الافتراضية
function setDefaultDates() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // تعيين التاريخ الحالي للتقارير الشهرية والسنوية
    yearSelect.value = currentYear;
    monthSelect.value = currentMonth;
    annualYearSelect.value = currentYear;
    
    // تعيين تاريخ البداية للفترة الزمنية
    startYear.value = currentYear;
    startMonthPeriod.value = currentMonth;
    
    // حساب تاريخ النهاية بعد 3 أشهر
    updatePeriodEndDate();
}

// تحديث تاريخ النهاية للفترة الزمنية (3 أشهر لاحقة) - الإصدار المصحح النهائي
function updatePeriodEndDate() {
    const startY = parseInt(startYear.value);
    const startM = parseInt(startMonthPeriod.value);
    
    // حساب تاريخ النهاية بعد 3 أشهر (بما في ذلك الشهر الحالي)
    let endMonth = startM + 2; // نهاية الفترة بعد شهرين من الشهر الحالي (المجموع 3 أشهر)
    let endYear = startY;
    
    // التصحيح: معالجة تجاوز الشهر 12 بشكل صحيح
    if (endMonth > 12) {
        // حساب عدد السنوات الإضافية
        const yearsToAdd = Math.floor((endMonth - 1) / 12);
        endYear += yearsToAdd;
        endMonth = endMonth - (yearsToAdd * 12);
    }
    
    // تحديث عناصر select بشكل صحيح
    // نبحث عن الخيار المناسب في قائمة السنوات
    const endYearSelect = document.getElementById('endYear');
    const endMonthSelect = document.getElementById('endMonthPeriod');
    
    // تعيين سنة النهاية
    if (endYearSelect.querySelector(`option[value="${endYear}"]`)) {
        endYearSelect.value = endYear;
    } else {
        // إذا لم تكن السنة موجودة، نضيفها
        const newOption = document.createElement('option');
        newOption.value = endYear;
        newOption.textContent = endYear;
        endYearSelect.appendChild(newOption);
        endYearSelect.value = endYear;
    }
    
    // تعيين شهر النهاية
    endMonthSelect.value = endMonth;
    
    console.log(`تم تحديث الفترة: من ${startM}/${startY} إلى ${endMonth}/${endYear}`);
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
        case 'annual':
            document.getElementById('annualInput').style.display = 'block';
            annualResults.style.display = 'block';
            break;
        case 'period':
            document.getElementById('periodInput').style.display = 'block';
            periodResults.style.display = 'block';
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
    try {
        switch(currentReportType) {
            case 'monthly':
                calculateMonthlyReport();
                break;
            case 'annual':
                calculateAnnualReport();
                break;
            case 'period':
                calculatePeriodReport();
                break;
        }
    } catch (error) {
        console.error('حدث خطأ في الحساب:', error);
        alert('حدث خطأ في الحساب. يرجى المحاولة مرة أخرى.');
    }
}

// حساب التقرير الشهري
function calculateMonthlyReport() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    // تحديث العنوان
    monthlyTitle.textContent = `نتائج ${months[month-1]} ${year}`;
    
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
function calculateAnnualReport() {
    const year = parseInt(annualYearSelect.value);
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    // تحديث العنوان
    annualTitle.textContent = `نتائج السنة الكاملة ${year}`;
    
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

// حساب تقرير الفترة الزمنية
function calculatePeriodReport() {
    const startY = parseInt(startYear.value);
    const startM = parseInt(startMonthPeriod.value);
    const endY = parseInt(endYear.value);
    const endM = parseInt(endMonthPeriod.value);
    const group1Days = getGroupDays('group1');
    const group2Days = getGroupDays('group2');
    
    if (group1Days.length === 0 || group2Days.length === 0) {
        alert('يرجى اختيار أيام على الأقل لكل مجموعة');
        return;
    }
    
    // التحقق من صحة الفترة
    if (startY > endY || (startY === endY && startM > endM)) {
        alert('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
        return;
    }
    
    // تحديث العنوان
    periodTitle.textContent = `نتائج الفترة: من ${months[startM-1]} ${startY} إلى ${months[endM-1]} ${endY}`;
    
    let periodGroup1Total = 0;
    let periodGroup2Total = 0;
    let periodDaysTotal = 0;
    let periodWeekendTotal = 0;
    
    // تفريغ الجدول
    periodTableBody.innerHTML = '';
    
    // حساب الفترة الزمنية
    let currentYear = startY;
    let currentMonth = startM;
    let monthCount = 0;
    
    while (currentYear < endY || (currentYear === endY && currentMonth <= endM)) {
        const group1Count = countGroupDays(currentYear, currentMonth, group1Days);
        const group2Count = countGroupDays(currentYear, currentMonth, group2Days);
        const totalDays = getDaysInMonth(currentYear, currentMonth);
        const fridayDays = countFridays(currentYear, currentMonth);
        
        // تحديث المجاميع
        periodGroup1Total += group1Count;
        periodGroup2Total += group2Count;
        periodDaysTotal += totalDays;
        periodWeekendTotal += fridayDays;
        monthCount++;
        
        // إضافة صف للجدول
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${months[currentMonth - 1]} ${currentYear}</td>
            <td>${group1Count}</td>
            <td>${group2Count}</td>
            <td>${totalDays}</td>
            <td>${fridayDays}</td>
        `;
        periodTableBody.appendChild(row);
        
        // الانتقال إلى الشهر التالي
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
    }
    
    // تحديث المجاميع النهائية
    updatePeriodTotals(periodGroup1Total, periodGroup2Total, periodDaysTotal, periodWeekendTotal);
}

// تحديث المجاميع السنوية
function updateAnnualTotals(group1Total, group2Total, daysTotal, weekendTotal) {
    annualGroup1Total.textContent = group1Total;
    annualGroup2Total.textContent = group2Total;
    annualDaysTotal.textContent = daysTotal;
    annualWeekendTotal.textContent = weekendTotal;
}

// تحديث مجاميع الفترة الزمنية
function updatePeriodTotals(group1Total, group2Total, daysTotal, weekendTotal) {
    periodGroup1Total.textContent = group1Total;
    periodGroup2Total.textContent = group2Total;
    periodDaysTotal.textContent = daysTotal;
    periodWeekendTotal.textContent = weekendTotal;
}

// حفظ التقرير الحالي
function saveReport() {
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
            const year = parseInt(yearSelect.value);
            const month = parseInt(monthSelect.value);
            fileContent = generateMonthlyReport(year, month, group1Days, group2Days);
            filename = `تقرير_شهري_${months[month-1]}_${year}.txt`;
            break;
        case 'annual':
            const annualYear = parseInt(annualYearSelect.value);
            fileContent = generateAnnualReport(annualYear, group1Days, group2Days);
            filename = `تقرير_سنوي_${annualYear}.txt`;
            break;
        case 'period':
            const startY = parseInt(startYear.value);
            const startM = parseInt(startMonthPeriod.value);
            const endY = parseInt(endYear.value);
            const endM = parseInt(endMonthPeriod.value);
            fileContent = generatePeriodReport(startY, startM, endY, endM, group1Days, group2Days);
            filename = `تقرير_فترة_${startY}_${months[startM-1]}_إلى_${endY}_${months[endM-1]}.txt`;
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
    
    content += `الفترة: ${months[month-1]} ${year}\n\n`;
    
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

// إنشاء محتوى التقرير السنوي
function generateAnnualReport(year, group1Days, group2Days) {
    let content = `تقرير أيام الحضور السنوي\n`;
    content += '='.repeat(50) + '\n\n';
    
    content += `الفترة: السنة الكاملة ${year}\n\n`;
    
    content += `المجموعة الأولى: ${getSelectedDays('group1').join('، ')}\n`;
    content += `المجموعة الثانية: ${getSelectedDays('group2').join('، ')}\n\n`;
    
    content += 'الشهر\t\tالمجموعة الأولى\tالمجموعة الثانية\tالإجمالي\tأيام الإجازة\n';
    content += '-'.repeat(80) + '\n';
    
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
        
        content += `${months[month - 1]}\t\t${group1Count}\t\t${group2Count}\t\t${totalDays}\t\t${fridayDays}\n`;
    }
    
    content += '-'.repeat(80) + '\n';
    content += `المجموع السنوي\t${annualGroup1Total}\t\t${annualGroup2Total}\t\t${annualDaysTotal}\t\t${annualWeekendTotal}\n\n`;
    content += `تم إنشاء التقرير في: ${new Date().toLocaleString('ar-SA')}\n`;
    
    return content;
}

// إنشاء محتوى تقرير الفترة الزمنية
function generatePeriodReport(startY, startM, endY, endM, group1Days, group2Days) {
    let content = `تقرير أيام الحضور للفترة الزمنية\n`;
    content += '='.repeat(50) + '\n\n';
    
    content += `الفترة: من ${months[startM-1]} ${startY} إلى ${months[endM-1]} ${endY}\n\n`;
    
    content += `المجموعة الأولى: ${getSelectedDays('group1').join('، ')}\n`;
    content += `المجموعة الثانية: ${getSelectedDays('group2').join('، ')}\n\n`;
    
    content += 'الشهر/السنة\t\tالمجموعة الأولى\tالمجموعة الثانية\tالإجمالي\tأيام الإجازة\n';
    content += '-'.repeat(90) + '\n';
    
    let periodGroup1Total = 0;
    let periodGroup2Total = 0;
    let periodDaysTotal = 0;
    let periodWeekendTotal = 0;
    
    // جمع البيانات لكل شهر في الفترة
    let currentYear = startY;
    let currentMonth = startM;
    
    while (currentYear < endY || (currentYear === endY && currentMonth <= endM)) {
        const group1Count = countGroupDays(currentYear, currentMonth, group1Days);
        const group2Count = countGroupDays(currentYear, currentMonth, group2Days);
        const totalDays = getDaysInMonth(currentYear, currentMonth);
        const fridayDays = countFridays(currentYear, currentMonth);
        
        periodGroup1Total += group1Count;
        periodGroup2Total += group2Count;
        periodDaysTotal += totalDays;
        periodWeekendTotal += fridayDays;
        
        content += `${months[currentMonth - 1]} ${currentYear}\t\t${group1Count}\t\t${group2Count}\t\t${totalDays}\t\t${fridayDays}\n`;
        
        // الانتقال إلى الشهر التالي
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
    }
    
    content += '-'.repeat(90) + '\n';
    content += `المجموع الكلي\t\t${periodGroup1Total}\t\t${periodGroup2Total}\t\t${periodDaysTotal}\t\t${periodWeekendTotal}\n\n`;
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