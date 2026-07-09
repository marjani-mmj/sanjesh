// C:\Users\manager\Desktop\sida cod\govahiM1\modules\local-assigner.js
(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    /**
     * ماژول تخصیص شماره گواهینامه به‌صورت محلی
     * در صورتی که منطقه مجاز نباشد استفاده می‌شود.
     */
    GovahiApp.localAssigner = {

        /**
         * اختصاص شماره گواهینامه به تمام دانش‌آموزان استخراج‌شده
         * @param {number} startNumber - شماره شروع
         * @param {string} date - تاریخ صدور (مثلاً "1402/04/15")
         */
        assign: function(startNumber, date) {
            var students = window.extractedData ? window.extractedData.students : [];
            if (students.length === 0) {
                console.warn('localAssigner: لیست دانش‌آموزان خالی است.');
                return;
            }

            students.forEach(function(student, index) {
                student.شماره_گواهینامه = (startNumber + index).toString();
                student.تاریخ_صدور = date;
            });

            // به‌روزرسانی ردیف‌های جدول (اگر وجود داشته باشند)
            var rows = document.querySelectorAll('.modal-body tbody tr');
            students.forEach(function(student, idx) {
                if (rows[idx]) {
                    var cells = rows[idx].querySelectorAll('td');
                    if (cells.length >= 12) {
                        cells[11].textContent = student.شماره_گواهینامه; // ستون شماره گواهینامه
                        if (cells.length >= 13) {
                            cells[12].textContent = student.تاریخ_صدور; // ستون یادداشت/تاریخ
                        }
                    }
                }
            });
        },

        /**
         * دریافت اطلاعات گواهینامهٔ یک کد ملی
         * @param {string} nationalCode
         * @returns {object|null} {number, date} یا null در صورت عدم تخصیص
         */
        getCertificate: function(nationalCode) {
            var students = window.extractedData ? window.extractedData.students : [];
            var student = students.find(function(s) {
                return s.کد_ملی === nationalCode;
            });
            if (student && student.شماره_گواهینامه) {
                return {
                    number: student.شماره_گواهینامه,
                    date: student.تاریخ_صدور
                };
            }
            return null;
        }
    };
})();
