(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    GovahiApp.apiHandler = {
        send: function(data) {
            var url = GovahiApp.ui.getApiUrl();
            if (!url) {
                alert('لطفاً آدرس API را وارد کنید.');
                return Promise.reject('No URL');
            }
            if (!data || !data.students) {
                alert('داده‌ای برای ارسال وجود ندارد.');
                return Promise.reject('No data');
            }

            GovahiApp.ui.setStatus('⏳ در حال ارسال...');

            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function(result) {
                // فرض: result.students شامل آرایه‌ای از { کد_ملی, شماره_گواهینامه }
                if (result.students && Array.isArray(result.students)) {
                    GovahiApp.apiHandler.updateCertificates(result.students);
                    GovahiApp.ui.setStatus('✅ شماره گواهینامه‌ها دریافت و ثبت شد.');
                } else {
                    GovahiApp.ui.setStatus('⚠️ ساختار پاسخ نامعتبر است.');
                }
            })
            .catch(function(err) {
                GovahiApp.ui.setStatus('❌ خطا: ' + err.message);
            });
        },

        updateCertificates: function(certList) {
            var rows = document.querySelectorAll('.modal-body tbody tr');
            var students = window.extractedData ? window.extractedData.students : [];
            certList.forEach(function(cert) {
                var student = students.find(function(s) {
                    return s.کد_ملی === cert.کد_ملی || s.کد_دانش_آموزی === cert.کد_دانش_آموزی;
                });
                if (student) {
                    student.شماره_گواهینامه = cert.شماره_گواهینامه;
                    var idx = students.indexOf(student);
                    if (rows[idx]) {
                        var certCell = rows[idx].querySelectorAll('td')[11];
                        if (certCell) certCell.textContent = cert.شماره_گواهینامه;
                    }
                }
            });
        }
    };
})();