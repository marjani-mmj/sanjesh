/**
 * ==========================================================
 * certificate-filler.js
 * پرکنندهٔ خودکار شماره گواهینامه و تاریخ (نسخهٔ نهایی)
 * ==========================================================
 */
(function () {
    'use strict';

    // ۱. تاریخ شمسی (استفاده از Intl)
    function toPersianDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'persian' };
        const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(date).split('/');
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }

    const todayPersian = toPersianDate(new Date());

    // ۲. استخراج کد ملی (دقیقاً همان روشی که تست شده و کار می‌کند)
    function extractNationalCode(card) {
        const labels = card.querySelectorAll(".textt label");
        for (const label of labels) {
            if (label.textContent.includes("کد ملی")) {
                const span = label.nextElementSibling;
                if (span) {
                    return span.textContent.trim();
                }
            }
        }
        return null;
    }

    // ۳. انتخاب تمام کارت‌ها بر اساس سلکتور واقعی صفحه
    const cards = document.querySelectorAll("#print-content .col-md-6");

    if (cards.length === 0) {
        alert('❌ هیچ کارتی با سلکتور #print-content .col-md-6 پیدا نشد.');
        console.warn('❌ هیچ کارتی شناسایی نشد.');
        return;
    }

    console.log(`🔍 تعداد کارت‌های پیدا شده: ${cards.length}`);

    let count = 0;

    cards.forEach((card, index) => {
        const nationalCode = extractNationalCode(card);

        if (!nationalCode) {
            console.warn(`⚠️ کارت ${index + 1}: کد ملی پیدا نشد.`);
            return;
        }

        console.log(`✅ کارت ${index + 1}: کد ملی = ${nationalCode}`);

        // ۴. پیدا کردن فیلدهای هدف در همان کارت
        const numberInput = card.querySelector('#number');
        const dateInput  = card.querySelector('#StatrtDate');

        if (numberInput) {
            numberInput.value = nationalCode;                     // ← مقدار تست: خود کد ملی (بعداً با API واقعی جایگزین می‌شود)
            numberInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.warn(`⚠️ کارت ${index + 1}: فیلد #number پیدا نشد.`);
        }

        if (dateInput) {
            dateInput.value = todayPersian;                       // ← تاریخ امروز شمسی
            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.warn(`⚠️ کارت ${index + 1}: فیلد #StatrtDate پیدا نشد.`);
        }

        count++;
    });

    console.log(`🎉 ${count} از ${cards.length} کارت با موفقیت بروزرسانی شد.`);
    alert(`✅ ${count} کارت با موفقیت بروزرسانی شد.\nتاریخ امروز: ${todayPersian}`);
})();
