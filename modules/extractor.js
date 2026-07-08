(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};
    var config = GovahiApp.config;

    function getTextByLabel(labelText) {
        var labels = document.querySelectorAll('.school-info .marklabel');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].textContent.trim() === labelText) {
                var next = labels[i].nextElementSibling;
                if (next && next.classList.contains('infomark')) {
                    return next.textContent.trim();
                }
            }
        }
        return '';
    }

    GovahiApp.extractor = {
        extractHeader: function() {
            var sel = config.selectors.headerLabels;
            var regionIdEl = document.querySelector(config.selectors.regionIdLabel);
            var regionId = regionIdEl ? regionIdEl.textContent.trim() : '';

            return {
                استان: getTextByLabel(sel.province),
                منطقه: getTextByLabel(sel.region),
                کد_منطقه: regionId,
                کد_مدرسه: getTextByLabel(sel.schoolCode),
                نام_مدرسه: getTextByLabel(sel.schoolName),
                رشته: getTextByLabel(sel.major),
                پایه: getTextByLabel(sel.grade),
                نوع_دانش_آموز: getTextByLabel(sel.studentType)
            };
        },

        extractStudents: function() {
            var rows = document.querySelectorAll(config.selectors.tableBody);
            var students = [];
            rows.forEach(function(row, idx) {
                var cells = row.querySelectorAll('td');
                if (cells.length >= 11) {
                    students.push({
                        ردیف: cells[0].textContent.trim(),
                        کد_دانش_آموزی: cells[1].textContent.trim(),
                        نام_خانوادگی: cells[2].textContent.trim(),
                        نام: cells[3].textContent.trim(),
                        نام_پدر: cells[4].textContent.trim(),
                        کد_ملی: cells[5].textContent.trim(),
                        محل_صدور: cells[6].textContent.trim(),
                        محل_تولد: cells[7].textContent.trim(),
                        تاریخ_تولد: cells[8].textContent.trim(),
                        جمع_نمرات: cells[9].textContent.trim(),
                        معدل_کل: cells[10].textContent.trim(),
                        شماره_گواهینامه: ''
                    });
                }
            });
            return students;
        },

        highlightRows: function() {
            var rows = document.querySelectorAll(config.selectors.tableBody);
            rows.forEach(function(row) {
                row.classList.add(config.style.extractedRow);
                row.style.backgroundColor = config.style.rowBgColor;
            });
        }
    };
})();