(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    var style = document.createElement('style');
    style.textContent = `
        #govahi-panel {
            position: fixed; top: 100px; left: 20px; width: 300px;
            background: #fff; border: 1px solid #ddd; border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2); z-index: 1060;
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
        #govahi-panel .panel-body { padding: 10px 12px 12px; }
        #govahi-panel .section-title { font-weight: bold; color: #495057; margin-bottom: 5px; }
        #govahi-panel .row-control { display: flex; align-items: center; margin-bottom: 6px; }
        #govahi-panel .row-control .label { width: 45px; text-align: right; margin-left: 5px; font-weight: bold; color: #495057; }
        #govahi-panel button.ctrl-btn {
            width: 28px; height: 28px; font-size: 16px; font-weight: bold;
            line-height: 1; margin: 0 2px; background: #e9ecef;
            border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; color: #495057;
        }
        #govahi-panel button.ctrl-btn.coarse-dec { background: #ffc9c9; border-color: #ff8787; color: #c92a2a; }
        #govahi-panel button.ctrl-btn.coarse-inc { background: #b2f2bb; border-color: #51cf66; color: #2b8a3e; }
        #govahi-panel .value-display { width: 36px; text-align: center; font-weight: bold; font-size: 14px; color: #0050ef; }
        #govahi-panel .zoom-display { width: 45px; }

        #govahi-panel .collapsible-header {
            background: #f1f3f5;
            padding: 6px 10px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            color: #495057;
            margin-bottom: 6px;
            user-select: none;
        }
        #govahi-panel .collapsible-header .toggle-icon {
            font-size: 14px;
            transition: transform 0.2s;
        }
        #govahi-panel .collapsible-header.collapsed .toggle-icon {
            transform: rotate(-90deg);
        }
        #govahi-panel .collapsible-content {
            padding: 0 0 4px 0;
            display: block;
        }
        #govahi-panel .collapsible-content.collapsed {
            display: none;
        }

        #govahi-gap-controls {
            display: none;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #ccc;
        }

        #govahi-panel .manual-fields {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #ccc;
        }
        #govahi-panel .manual-fields .row-control {
            flex-wrap: nowrap;
            justify-content: flex-start;
        }
        #govahi-panel .manual-fields .row-control .label {
            width: auto;
            margin-left: 0;
            margin-right: 5px;
            white-space: nowrap;
        }
        #govahi-panel .manual-fields input {
            width: 80px;
            padding: 2px 4px;
            margin: 0 4px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 12px;
        }

        #govahi-panel .status { font-size: 12px; color: #28a745; margin-top: 5px; text-align: center; }

        #govahi-panel .action-row {
            display: flex;
            gap: 6px;
            margin-bottom: 6px;
        }
        #govahi-panel .action-row .action-btn {
            flex: 1;
            margin-bottom: 0;
        }
        #govahi-panel button.action-btn {
            width: 100%; padding: 6px; margin-bottom: 6px;
            background: #007bff; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-weight: bold;
        }
        #govahi-panel button.action-btn:disabled { background: #6c757d; cursor: not-allowed; }

        #govahi-panel .reset-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-top: 8px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        #govahi-panel .reset-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
        #govahi-panel .reset-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .govahi-more-tools-btn {
            display: block;
            text-align: center;
            margin: 10px 0 8px;
            padding: 8px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 6px;
            text-decoration: none;
            color: #333;
            font-weight: bold;
            transition: background 0.2s;
        }
        .govahi-more-tools-btn:hover {
            background: #e0e0e0;
            color: #000;
        }

        #govahi-floating-toggle {
            position: fixed; bottom: 20px; left: 20px;
            z-index: 1055;
            width: 48px; height: 48px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            border-radius: 50%; display: flex;
            align-items: center; justify-content: center;
            font-size: 26px; color: white; cursor: pointer;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            user-select: none; transition: transform 0.2s;
        }
        #govahi-floating-toggle:hover { transform: scale(1.1); }
    `;
    document.head.appendChild(style);

    var toggleIcon = document.createElement('div');
    toggleIcon.id = 'govahi-floating-toggle';
    toggleIcon.innerHTML = '⚙️';
    toggleIcon.title = 'تنظیمات چاپ و گواهینامه';
    document.body.appendChild(toggleIcon);

    var panel = document.createElement('div');
    panel.id = 'govahi-panel';
    panel.innerHTML = `
        <div class="panel-header" id="govahi-panel-header">
            <span>تنظیمات گواهینامه</span>
            <span class="close-btn" id="govahi-close-btn">&times;</span>
        </div>
        <div class="panel-body">
            <div class="collapsible-header collapsed" id="govahi-print-settings-toggle"
                 onclick="var c=document.getElementById('govahi-print-settings-content');c.classList.toggle('collapsed');this.classList.toggle('collapsed');">
                <span>📏 حاشیه‌ها و بزرگنمایی</span>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="collapsible-content collapsed" id="govahi-print-settings-content">
                <div class="row-control">
                    <span class="label">بالا</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-offsetY-up-dec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-offsetY-up-dec">−</button>
                    <span class="value-display" id="govahi-offsetY-val-top">0</span>
                    <button class="ctrl-btn" id="govahi-offsetY-up-inc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-offsetY-up-inc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">راست</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-offsetX-right-dec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-offsetX-right-dec">−</button>
                    <span class="value-display" id="govahi-offsetX-val">0</span>
                    <button class="ctrl-btn" id="govahi-offsetX-right-inc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-offsetX-right-inc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">پهنا</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-width-dec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-width-dec">−</button>
                    <span class="value-display" id="govahi-width-val">0</span>
                    <button class="ctrl-btn" id="govahi-width-inc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-width-inc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">Zoom</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-scale-out5">−۵</button>
                    <button class="ctrl-btn" id="govahi-scale-out">−</button>
                    <span class="value-display zoom-display" id="govahi-scale-val">100%</span>
                    <button class="ctrl-btn" id="govahi-scale-in">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-scale-in5">+۵</button>
                </div>
                <button class="reset-btn" id="govahi-reset-settings-btn">
                    <i class="fas fa-redo-alt"></i> تنظیم مجدد
                </button>
            </div>

            <div id="govahi-gap-controls">
                <div class="section-title" style="margin-top:5px;">📐 فاصلهٔ کارت‌ها</div>
                <div class="row-control">
                    <span class="label">↕️ عمودی</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-cardGap-dec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-cardGap-dec">−</button>
                    <span class="value-display" id="govahi-cardGap-val">0</span>
                    <button class="ctrl-btn" id="govahi-cardGap-inc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-cardGap-inc5">+۵</button>
                </div>
                <div class="row-control">
                    <span class="label">↔️ افقی</span>
                    <button class="ctrl-btn coarse-dec" id="govahi-cardGapH-dec5">−۵</button>
                    <button class="ctrl-btn" id="govahi-cardGapH-dec">−</button>
                    <span class="value-display" id="govahi-cardGapH-val">0</span>
                    <button class="ctrl-btn" id="govahi-cardGapH-inc">+</button>
                    <button class="ctrl-btn coarse-inc" id="govahi-cardGapH-inc5">+۵</button>
                </div>
            </div>

            <div class="manual-fields">
                <div class="row-control">
                    <span class="label">شماره شروع:</span>
                    <input type="number" id="govahi-start-number" min="1" value="1" />
                    <span class="label" style="margin-right:10px;">تاریخ:</span>
                    <input type="text" id="govahi-issue-date" placeholder="روز/ماه/سال" style="direction: rtl; text-align: right; width:90px;" />
                </div>
            </div>

            <div class="separator"></div>

            <div class="section-title">📋 عملیات گواهینامه</div>
            <div class="action-row" id="govahi-action-row">
                <button class="action-btn" id="govahi-extract-btn">📋 شناسایی</button>
                <button class="action-btn" id="govahi-send-to-api-btn" disabled>📤 ارسال به سنجش</button>
            </div>

            <div id="govahi-manual-section" style="display:none;">
                <button class="action-btn" id="govahi-assign-local-btn" style="background:#e67e22;">📝 اختصاص شماره</button>
            </div>

            <div class="status" id="govahi-status-msg"></div>

            <a href="http://kahkeshansoft.ir" target="_blank" class="govahi-more-tools-btn">
                🔗 ابزارهای بیشتر در کهکشان‌سافت
            </a>

            <div style="margin-top:10px; text-align:center; font-size:11px; color:#adb5bd;">
                آموزش و پرورش خلیل آباد<br>کارشناسی سنجش
            </div>
        </div>
    `;
    document.body.appendChild(panel);

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

    function updateGapControlsVisibility() {
        var gapDiv = document.getElementById('govahi-gap-controls');
        if (!gapDiv) return;
        var isCertPage = document.querySelectorAll('#print-content .col-md-6').length > 0;
        gapDiv.style.display = isCertPage ? 'block' : 'none';
    }
    updateGapControlsVisibility();
    var gapObserver = new MutationObserver(updateGapControlsVisibility);
    gapObserver.observe(document.body, { childList: true, subtree: true });

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
            return '';
        },
        enableSendButton: function() {
            document.getElementById('govahi-send-to-api-btn').disabled = false;
        },
        disableSendButton: function() {
            document.getElementById('govahi-send-to-api-btn').disabled = true;
        },
        showManualInput: function() {
            document.getElementById('govahi-manual-section').style.display = 'block';
        },
        hideManualInput: function() {
            document.getElementById('govahi-manual-section').style.display = 'none';
        },
        onExtract: function(cb) {
            document.getElementById('govahi-extract-btn').onclick = cb;
        },
        onSend: function(cb) {
            document.getElementById('govahi-send-to-api-btn').onclick = cb;
        },
        setExtractEnabled: function(enabled) {
            document.getElementById('govahi-extract-btn').disabled = !enabled;
        },
        setAssignEnabled: function(enabled) {
            var assignBtn = document.getElementById('govahi-assign-local-btn');
            if (assignBtn) assignBtn.disabled = !enabled;
        }
    };

    console.log('Govahi UI Panel ready.');
})();
