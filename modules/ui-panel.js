(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ---------- استایل‌های پایه ----------
    var style = document.createElement('style');
    style.textContent = `
        #govahi-panel {
            position: fixed;
            top: 100px;
            left: 20px;
            width: 300px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            z-index: 100000;
            font-family: Tahoma, sans-serif;
            font-size: 13px;
            display: none;
            user-select: none;
        }
        #govahi-panel .panel-header {
            cursor: move;
            background: #f8f9fa;
            padding: 6px 30px 6px 10px;
            margin: -1px -1px 10px -1px;
            border-radius: 8px 8px 0 0;
            font-weight: bold;
            color: #333;
            border-bottom: 1px solid #dee2e6;
            position: relative;
        }
        #govahi-panel .panel-header .close-btn {
            position: absolute;
            top: 4px;
            right: 8px;
            font-size: 18px;
            font-weight: bold;
            color: #888;
            cursor: pointer;
            line-height: 1;
        }
        #govahi-panel .panel-body {
            padding: 10px 12px 12px;
        }
        #govahi-panel label, #govahi-panel .section-title {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
            color: #495057;
        }
        #govahi-panel .row-control {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
        }
        #govahi-panel .row-control span.label {
            width: 45px;
            text-align: right;
            margin-left: 5px;
            font-weight: bold;
            color: #495057;
        }
        #govahi-panel button.ctrl-btn {
            width: 28px;
            height: 28px;
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
            margin: 0 2px;
            background: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 4px;
            cursor: pointer;
            color: #495057;
        }
        #govahi-panel button.ctrl-btn.coarse-dec {
            background: #ffc9c9; border-color: #ff8787; color: #c92a2a;
        }
        #govahi-panel button.ctrl-btn.coarse-inc {
            background: #b2f2bb; border-color: #51cf66; color: #2b8a3e;
        }
        #govahi-panel .value-display {
            width: 36px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            color: #0050ef;
        }
        #govahi-panel .zoom-display {
            width: 45px;
        }
        #govahi-panel button.apply-btn {
            margin-top: 8px;
            width: 100%;
            padding: 6px;
            background: #0050ef;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        }
        #govahi-panel .separator {
            border-top: 1px solid #dee2e6;
            margin: 10px 0;
        }
        #govahi-panel .status {
            font-size: 12px;
            color: #28a745;
            margin-top: 5px;
            text-align: center;
        }
        #govahi-floating-toggle {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999999;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            color: white;
            cursor: pointer;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            user-select: none;
            transition: transform 0.2s;
        }
        #govahi-floating-toggle:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // ---------- دکمهٔ شناور ----------
    var toggleIcon = document.createElement('div');
    toggleIcon.id = 'govahi-floating-toggle';
    toggleIcon.innerHTML = '⚙️';
    toggleIcon.title = 'تنظیمات چاپ و گواهینامه';
    document.body.appendChild(toggleIcon);

    // ---------- پنل ----------
    var panel = document.createElement('div');
    panel.id = 'govahi-panel';
    panel.innerHTML = `
        <div class="panel-header" id="govahi-panel-header">
            <span>تنظیمات گواهینامه</span>
            <span class="close-btn" id="govahi-close-btn">&times;</span>
        </div>
        <div class="panel-body">
            <!-- بخش حاشیه‌ها و پهنا -->
            <div class="section-title">📏 حاشیه‌ها و پهنا</div>
            <div class="row-control">
                <span class="label">بالا</span>
                <button class="ctrl-btn coarse-dec" id="marginTopDec5">−۵</button>
                <button class="ctrl-btn" id="marginTopDec">−</button>
                <span class="value-display" id="marginTopVal">0</span>
                <button class="ctrl-btn" id="marginTopInc">+</button>
                <button class="ctrl-btn coarse-inc" id="marginTopInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">پایین</span>
                <button class="ctrl-btn coarse-dec" id="marginBottomDec5">−۵</button>
                <button class="ctrl-btn" id="marginBottomDec">−</button>
                <span class="value-display" id="marginBottomVal">0</span>
                <button class="ctrl-btn" id="marginBottomInc">+</button>
                <button class="ctrl-btn coarse-inc" id="marginBottomInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">راست</span>
                <button class="ctrl-btn coarse-dec" id="marginRightDec5">−۵</button>
                <button class="ctrl-btn" id="marginRightDec">−</button>
                <span class="value-display" id="marginRightVal">0</span>
                <button class="ctrl-btn" id="marginRightInc">+</button>
                <button class="ctrl-btn coarse-inc" id="marginRightInc5">+۵</button>
            </div>
            <div class="row-control">
                <span class="label">پهنا</span>
                <button class="ctrl-btn coarse-dec" id="widthDec5">−۵</button>
                <button class="ctrl-btn" id="widthDec">−</button>
                <span class="value-display" id="widthVal">0</span>
                <button class="ctrl-btn" id="widthInc">+</button>
                <button class="ctrl-btn coarse-inc" id="widthInc5">+۵</button>
            </div>

            <!-- بخش Zoom -->
            <div class="section-title" style="margin-top:10px;">🔍 بزرگنمایی (Scale)</div>
            <div class="row-control">
                <span class="label">Zoom</span>
                <button class="ctrl-btn coarse-dec" id="zoomDec5">−۵</button>
                <button class="ctrl-btn" id="zoomDec">−</button>
                <span class="value-display zoom-display" id="zoomVal">100%</span>
                <button class="ctrl-btn" id="zoomInc">+</button>
                <button class="ctrl-btn coarse-inc" id="zoomInc5">+۵</button>
            </div>

            <button class="apply-btn" id="applySettingsBtn">اعمال تنظیمات چاپ</button>

            <div class="separator"></div>

            <!-- بخش عملیات استخراج / ارسال -->
            <div class="section-title">📋 عملیات گواهینامه</div>
            <input type="text" id="api-url-input" placeholder="آدرس API" style="display:none;" />
            <button id="extract-btn" style="width:100%; margin-bottom:6px;">📋 استخراج و هایلایت</button>
            <button id="send-to-api-btn" style="width:100%;" disabled>📤 ارسال به API</button>
            <div id="status-msg" class="status"></div>
            <div style="margin-top:10px; text-align:center; font-size:11px; color:#adb5bd;">
                آموزش و پرورش خلیل آباد<br>کارشناسی سنجش
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // ---------- منطق نمایش/مخفی ----------
    var isPanelVisible = false;
    toggleIcon.addEventListener('click', function() {
        if (isPanelVisible) {
            panel.style.display = 'none';
            toggleIcon.innerHTML = '⚙️';
        } else {
            panel.style.display = 'block';
            toggleIcon.innerHTML = '🔧';
        }
        isPanelVisible = !isPanelVisible;
    });

    document.getElementById('govahi-close-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        panel.style.display = 'none';
        toggleIcon.innerHTML = '⚙️';
        isPanelVisible = false;
    });

    // ---------- قابلیت درگ ----------
    (function() {
        var header = document.getElementById('govahi-panel-header');
        var dragging = false, startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', function(e) {
            if (e.target.id === 'govahi-close-btn') return;
            e.preventDefault();
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            var rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            e.preventDefault();
            panel.style.left = (initialLeft + e.clientX - startX) + 'px';
            panel.style.top = (initialTop + e.clientY - startY) + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (dragging) {
                dragging = false;
                panel.style.transition = '';
            }
        });
    })();

    // ---------- state تنظیمات چاپ ----------
    var printState = {
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,    // درصد تغییر نسبت به عرض اصلی (مثبت یعنی افزایش)
        scale: 100   // درصد
    };

    // المان مقصد چاپ
    function getPrintTarget() {
        return document.getElementById('print-content') || document.querySelector('.modal-body');
    }

    // به‌روزرسانی نمایشگرها
    function updateDisplays() {
        document.getElementById('marginTopVal').textContent = printState.top;
        document.getElementById('marginBottomVal').textContent = printState.bottom;
        document.getElementById('marginRightVal').textContent = printState.right;
        document.getElementById('widthVal').textContent = printState.width;
        document.getElementById('zoomVal').textContent = printState.scale + '%';
    }

    // اعمال تنظیمات روی المان
    function applyPrintSettings() {
        var target = getPrintTarget();
        if (!target) return;
        target.style.marginTop = printState.top + 'px';
        target.style.marginBottom = printState.bottom + 'px';
        target.style.marginRight = printState.right + 'px';
        // پهنا: بر اساس width فعلی تغییر می‌دهیم (درصد)
        if (printState.width !== 0) {
            target.style.width = (100 + printState.width) + '%';
        } else {
            target.style.width = ''; // بازنشانی
        }
        // scale
        target.style.transform = 'scale(' + (printState.scale / 100) + ')';
        target.style.transformOrigin = 'top center';
    }

    // ---------- اتصال کنترل‌ها ----------
    function bindSpacingButton(id, getter, setter, delta) {
        document.getElementById(id).addEventListener('click', function() {
            setter(getter() + delta);
            updateDisplays();
        });
    }

    bindSpacingButton('marginTopInc',  function() { return printState.top; }, function(v) { printState.top = v; }, 1);
    bindSpacingButton('marginTopDec',  function() { return printState.top; }, function(v) { printState.top = v; }, -1);
    bindSpacingButton('marginTopInc5', function() { return printState.top; }, function(v) { printState.top = v; }, 5);
    bindSpacingButton('marginTopDec5', function() { return printState.top; }, function(v) { printState.top = v; }, -5);

    bindSpacingButton('marginBottomInc',  function() { return printState.bottom; }, function(v) { printState.bottom = v; }, 1);
    bindSpacingButton('marginBottomDec',  function() { return printState.bottom; }, function(v) { printState.bottom = v; }, -1);
    bindSpacingButton('marginBottomInc5', function() { return printState.bottom; }, function(v) { printState.bottom = v; }, 5);
    bindSpacingButton('marginBottomDec5', function() { return printState.bottom; }, function(v) { printState.bottom = v; }, -5);

    bindSpacingButton('marginRightInc',  function() { return printState.right; }, function(v) { printState.right = v; }, 1);
    bindSpacingButton('marginRightDec',  function() { return printState.right; }, function(v) { printState.right = v; }, -1);
    bindSpacingButton('marginRightInc5', function() { return printState.right; }, function(v) { printState.right = v; }, 5);
    bindSpacingButton('marginRightDec5', function() { return printState.right; }, function(v) { printState.right = v; }, -5);

    bindSpacingButton('widthInc',  function() { return printState.width; }, function(v) { printState.width = v; }, 1);
    bindSpacingButton('widthDec',  function() { return printState.width; }, function(v) { printState.width = v; }, -1);
    bindSpacingButton('widthInc5', function() { return printState.width; }, function(v) { printState.width = v; }, 5);
    bindSpacingButton('widthDec5', function() { return printState.width; }, function(v) { printState.width = v; }, -5);

    bindSpacingButton('zoomInc',  function() { return printState.scale; }, function(v) { printState.scale = Math.max(10, v); }, 1);
    bindSpacingButton('zoomDec',  function() { return printState.scale; }, function(v) { printState.scale = Math.max(10, v); }, -1);
    bindSpacingButton('zoomInc5', function() { return printState.scale; }, function(v) { printState.scale = Math.max(10, v); }, 5);
    bindSpacingButton('zoomDec5', function() { return printState.scale; }, function(v) { printState.scale = Math.max(10, v); }, -5);

    document.getElementById('applySettingsBtn').addEventListener('click', applyPrintSettings);

    // ---------- API عمومی (سازگار با govahiM1.js) ----------
    GovahiApp.ui = {
        togglePanel: function() {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                toggleIcon.innerHTML = '🔧';
                isPanelVisible = true;
            } else {
                panel.style.display = 'none';
                toggleIcon.innerHTML = '⚙️';
                isPanelVisible = false;
            }
        },
        setStatus: function(msg) {
            document.getElementById('status-msg').textContent = msg;
        },
        getApiUrl: function() {
            return (GovahiApp.config && GovahiApp.config.apiUrl) ? GovahiApp.config.apiUrl : document.getElementById('api-url-input').value.trim();
        },
        enableSendButton: function() {
            document.getElementById('send-to-api-btn').disabled = false;
        },
        disableSendButton: function() {
            document.getElementById('send-to-api-btn').disabled = true;
        },
        onExtract: function(cb) {
            document.getElementById('extract-btn').onclick = cb;
        },
        onSend: function(cb) {
            document.getElementById('send-to-api-btn').onclick = cb;
        }
    };

    // مقداردهی اولیه
    updateDisplays();
})();
