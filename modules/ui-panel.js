(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // صبر می‌کنیم تا print-settings.js هندلرها را ثبت کند
    function waitForHandlers(callback) {
        if (window.handlersRegistry && window.handlersRegistry['govahi']) {
            callback();
        } else {
            var check = setInterval(function() {
                if (window.handlersRegistry && window.handlersRegistry['govahi']) {
                    clearInterval(check);
                    callback();
                }
            }, 100);
        }
    }

    function init() {
        // ========== استایل‌ها ==========
        var style = document.createElement('style');
        style.textContent = `
            #govahi-panel {
                position: fixed; top: 100px; left: 20px; width: 300px;
                background: #fff; border: 1px solid #ddd; border-radius: 8px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.2); z-index: 100000;
                font-family: Tahoma, sans-serif; font-size: 13px;
                display: none; user-select: none;
            }
            #govahi-panel .panel-header {
                cursor: move; background: #f8f9fa;
                padding: 6px 30px 6px 10px;
                margin: -1px -1px 10px -1px;
                border-radius: 8px 8px 0 0;
                font-weight: bold; color: #333;
                border-bottom: 1px solid #dee2e6;
                position: relative;
            }
            #govahi-panel .panel-header .close-btn {
                position: absolute; top: 4px; right: 8px;
                font-size: 18px; font-weight: bold; color: #888;
                cursor: pointer; line-height: 1;
            }
            #govahi-panel .panel-body {
                padding: 10px 12px 12px;
            }
            #govahi-panel .section-title {
                font-weight: bold; color: #495057; margin-bottom: 5px;
            }
            #govahi-panel .row-control {
                display: flex; align-items: center; margin-bottom: 6px;
            }
            #govahi-panel .row-control .label {
                width: 45px; text-align: right; margin-left: 5px;
                font-weight: bold; color: #495057;
            }
            #govahi-panel button.ctrl-btn {
                width: 28px; height: 28px; font-size: 16px; font-weight: bold;
                line-height: 1; margin: 0 2px;
                background: #e9ecef; border: 1px solid #ced4da;
                border-radius: 4px; cursor: pointer; color: #495057;
            }
            #govahi-panel button.ctrl-btn.coarse-dec {
                background: #ffc9c9; border-color: #ff8787; color: #c92a2a;
            }
            #govahi-panel button.ctrl-btn.coarse-inc {
                background: #b2f2bb; border-color: #51cf66; color: #2b8a3e;
            }
            #govahi-panel .value-display {
                width: 36px; text-align: center; font-weight: bold;
                font-size: 14px; color: #0050ef;
            }
            #govahi-panel .zoom-display {
                width: 45px;
            }
            #govahi-panel button.apply-btn {
                margin-top: 8px; width: 100%; padding: 6px;
                background: #0050ef; color: white; border: none;
                border-radius: 6px; font-weight: bold; cursor: pointer;
            }
            #govahi-panel .separator {
                border-top: 1px solid #dee2e6; margin: 10px 0;
            }
            #govahi-panel .status {
                font-size: 12px; color: #28a745; margin-top: 5px;
                text-align: center;
            }
            #govahi-floating-toggle {
                position: fixed; bottom: 20px; left: 20px;
                z-index: 999999; width: 48px; height: 48px;
                background: linear-gradient(135deg, #007bff, #0056b3);
                border-radius: 50%; display: flex;
                align-items: center; justify-content: center;
                font-size: 26px; color: white; cursor: pointer;
                box-shadow: 0 6px 12px rgba(0,0,0,0.4);
                user-select: none; transition: transform 0.2s;
            }
            #govahi-floating-toggle:hover {
                transform: scale(1.1);
            }
            #govahi-panel button.action-btn {
                width: 100%; padding: 6px; margin-bottom: 6px;
                background: #007bff; color: white; border: none;
                border-radius: 4px; cursor: pointer; font-weight: bold;
            }
            #govahi-panel button.action-btn:disabled {
                background: #6c757d; cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);

        // ========== دکمه شناور ==========
        var toggleIcon = document.createElement('div');
        toggleIcon.id = 'govahi-floating-toggle';
        toggleIcon.innerHTML = '⚙️';
        toggleIcon.title = 'تنظیمات چاپ و گواهینامه';
        document.body.appendChild(toggleIcon);

        // ========== پنل ==========
        var panel = document.createElement('div');
        panel.id = 'govahi-panel';
        panel.innerHTML = `
            <div class="panel-header" id="govahi-panel-header">
                <span>تنظیمات گواهینامه</span>
                <span class="close-btn" id="govahi-close-btn">&times;</span>
            </div>
            <div class="panel-body">
                <!-- بخش تنظیمات چاپ -->
                <div class="section-title">📏 حاشیه‌ها و بزرگنمایی</div>

                <div class="row-control">
                    <span class="label">بالا</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-marginTopDec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-marginTopDec">−</button>
                    <span class="value-display" id="govahi-marginTopVal">0</span>
                    <button class="ctrl-btn" id="govahi-marginTopInc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-marginTopInc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">پایین</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-marginBottomDec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-marginBottomDec">−</button>
                    <span class="value-display" id="govahi-marginBottomVal">0</span>
                    <button class="ctrl-btn" id="govahi-marginBottomInc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-marginBottomInc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">راست</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-marginRightDec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-marginRightDec">−</button>
                    <span class="value-display" id="govahi-marginRightVal">0</span>
                    <button class="ctrl-btn" id="govahi-marginRightInc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-marginRightInc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">پهنا</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-widthDec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-widthDec">−</button>
                    <span class="value-display" id="govahi-widthVal">0</span>
                    <button class="ctrl-btn" id="govahi-widthInc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-widthInc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">Zoom</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-zoomDec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-zoomDec">−</button>
                    <span class="value-display zoom-display" id="govahi-zoomVal">100%</span>
                    <button class="ctrl-btn" id="govahi-zoomInc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-zoomInc5">+۵</button>
                </div>

                <button class="apply-btn" id="govahi-applySettingsBtn">اعمال تنظیمات</button>

                <div class="separator"></div>

                <!-- بخش عملیات گواهینامه -->
                <div class="section-title">📋 عملیات گواهینامه</div>
                <button class="action-btn" id="govahi-extract-btn">📋 استخراج و هایلایت</button>
                <button class="action-btn" id="govahi-send-to-api-btn" disabled>📤 ارسال به API</button>
                <div class="status" id="govahi-status-msg"></div>

                <div style="margin-top:10px; text-align:center; font-size:11px; color:#adb5bd;">
                    آموزش و پرورش خلیل آباد<br>کارشناسی سنجش
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // ========== نمایش / مخفی ==========
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

        // ========== قابلیت درگ ==========
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

        // ========== اتصال کنترل‌های چاپ ==========
        var handlers = window.handlersRegistry['govahi'];
        if (!handlers) return;

        var spacing = handlers.spacing;
        var zoom = handlers.zoom;

        // نمایشگرها
        var displays = {
            topHeight: document.getElementById('govahi-marginTopVal'),
            bottomHeight: document.getElementById('govahi-marginBottomVal'),
            rightHeight: document.getElementById('govahi-marginRightVal'),
            widthDisp: document.getElementById('govahi-widthVal'),
            zoomDisp: document.getElementById('govahi-zoomVal')
        };
        zoom.display = displays.zoomDisp;

        function bind(id, action) {
            document.getElementById(id).addEventListener('click', function() { action(displays); });
        }

        bind('govahi-marginTopInc', function(d) { spacing.top++; d.topHeight.textContent = spacing.top; });
        bind('govahi-marginTopDec', function(d) { spacing.top--; d.topHeight.textContent = spacing.top; });
        bind('govahi-marginTopInc5', function(d) { spacing.top += 5; d.topHeight.textContent = spacing.top; });
        bind('govahi-marginTopDec5', function(d) { spacing.top -= 5; d.topHeight.textContent = spacing.top; });

        bind('govahi-marginBottomInc', function(d) { spacing.bottom++; d.bottomHeight.textContent = spacing.bottom; });
        bind('govahi-marginBottomDec', function(d) { spacing.bottom--; d.bottomHeight.textContent = spacing.bottom; });
        bind('govahi-marginBottomInc5', function(d) { spacing.bottom += 5; d.bottomHeight.textContent = spacing.bottom; });
        bind('govahi-marginBottomDec5', function(d) { spacing.bottom -= 5; d.bottomHeight.textContent = spacing.bottom; });

        bind('govahi-marginRightInc', function(d) { spacing.right++; d.rightHeight.textContent = spacing.right; });
        bind('govahi-marginRightDec', function(d) { spacing.right--; d.rightHeight.textContent = spacing.right; });
        bind('govahi-marginRightInc5', function(d) { spacing.right += 5; d.rightHeight.textContent = spacing.right; });
        bind('govahi-marginRightDec5', function(d) { spacing.right -= 5; d.rightHeight.textContent = spacing.right; });

        bind('govahi-widthInc', function(d) { spacing.width++; d.widthDisp.textContent = spacing.width; });
        bind('govahi-widthDec', function(d) { spacing.width--; d.widthDisp.textContent = spacing.width; });
        bind('govahi-widthInc5', function(d) { spacing.width += 5; d.widthDisp.textContent = spacing.width; });
        bind('govahi-widthDec5', function(d) { spacing.width -= 5; d.widthDisp.textContent = spacing.width; });

        document.getElementById('govahi-zoomInc').addEventListener('click', function() { zoom.set(zoom.get() + 1); });
        document.getElementById('govahi-zoomDec').addEventListener('click', function() { zoom.set(zoom.get() - 1); });
        document.getElementById('govahi-zoomInc5').addEventListener('click', function() { zoom.set(zoom.get() + 5); });
        document.getElementById('govahi-zoomDec5').addEventListener('click', function() { zoom.set(zoom.get() - 5); });

        document.getElementById('govahi-applySettingsBtn').addEventListener('click', function() {
            spacing.applyStored();
        });

        // ========== API عمومی (برای govahiM1.js) ==========
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
                document.getElementById('govahi-status-msg').textContent = msg;
            },
            getApiUrl: function() {
                // آدرس ثابت در govahiM1.js تنظیم شده است
                return GovahiApp.config && GovahiApp.config.apiUrl ? GovahiApp.config.apiUrl : '';
            },
            enableSendButton: function() {
                document.getElementById('govahi-send-to-api-btn').disabled = false;
            },
            disableSendButton: function() {
                document.getElementById('govahi-send-to-api-btn').disabled = true;
            },
            onExtract: function(cb) {
                document.getElementById('govahi-extract-btn').onclick = cb;
            },
            onSend: function(cb) {
                document.getElementById('govahi-send-to-api-btn').onclick = cb;
            }
        };

        // به‌روزرسانی اولیه نمایشگرها
        displays.topHeight.textContent = spacing.top;
        displays.bottomHeight.textContent = spacing.bottom;
        displays.rightHeight.textContent = spacing.right;
        displays.widthDisp.textContent = spacing.width;
        displays.zoomDisp.textContent = zoom.scale + '%';
    }

    waitForHandlers(init);
})();
