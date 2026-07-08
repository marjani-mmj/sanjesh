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

            // استخراج سال تحصیلی
            var academicYearEl = document.querySelector('.header-kar p.ng-binding[ng-bind*="timeYearTypeTitle"]');
            var academicYear = academicYearEl ? academicYearEl.textContent.trim() : '';

            // استخراج دوره
            var periodEl = document.querySelector('.header-kar p.ng-scope[ng-if*="row == 18"], .header-kar p.ng-scope[ng-if*="row == 19"]');
            var periodText = periodEl ? periodEl.textContent.trim() : '';
            // حذف پیشوند "دوره : "
            var period = periodText.replace('دوره : ', '').trim();

            // استخراج نام مدیر
            var managerName = '';
            var footRows = document.querySelectorAll('.panel-footer-report .col-md-4');
            for (var j = 0; j < footRows.length; j++) {
                var h6 = footRows[j].querySelector('h6');
                if (h6 && h6.textContent.trim() === 'مدیر') {
                    var infolabel = footRows[j].querySelector('.infomark');
                    if (infolabel) {
                        managerName = infolabel.textContent.trim();
                    }
                    break;
                }
            }

            return {
                استان: getTextByLabel(sel.province),
                منطقه: getTextByLabel(sel.region),
                کد_منطقه: regionId,
                کد_مدرسه: getTextByLabel(sel.schoolCode),
                نام_مدرسه: getTextByLabel(sel.schoolName),
                رشته: getTextByLabel(sel.major),
                پایه: getTextByLabel(sel.grade),
                نوع_دانش_آموز: getTextByLabel(sel.studentType),
                سال_تحصیلی: academicYear,
                دوره: period,
                نام_مدیر: managerName
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
