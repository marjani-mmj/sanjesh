(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // ---------- استایل‌های پنل ----------
    var style = document.createElement('style');
    style.textContent = `
        #govahi-panel {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 330px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 10px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.25);
            z-index: 100000;
            font-family: Tahoma, sans-serif;
            direction: rtl;
            cursor: default;
        }
        #govahi-panel .panel-header {
            background: #007bff;
            color: white;
            padding: 10px 15px;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        #govahi-panel .panel-header h4 {
            margin: 0;
            font-size: 16px;
        }
        #govahi-panel .panel-header .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
        }
        #govahi-panel .panel-body {
            padding: 15px;
        }
        #govahi-panel label {
            font-weight: bold;
            font-size: 13px;
            margin: 6px 0 3px;
            display: block;
        }
        #govahi-panel input, #govahi-panel button {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            box-sizing: border-box;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 13px;
        }
        #govahi-panel button {
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        #govahi-panel button:hover {
            background: #0056b3;
        }
        #govahi-panel .status {
            font-size: 12px;
            color: #28a745;
            margin-top: 5px;
            text-align: center;
        }
        #open-govahi-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 99999;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    // ---------- ایجاد دکمه شناور ----------
    var openBtn = document.createElement('button');
    openBtn.id = 'open-govahi-btn';
    openBtn.textContent = '🔧 استخراج اطلاعات';
    document.body.appendChild(openBtn);

    // ---------- ایجاد پنل ----------
    var panel = document.createElement('div');
    panel.id = 'govahi-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
        <div class="panel-header" id="panel-header">
            <h4>پنل مدیریت گواهینامه</h4>
            <button class="close-btn" id="close-panel-btn">✕</button>
        </div>
        <div class="panel-body">
            <label>آدرس API:</label>
            <input type="text" id="api-url-input" placeholder="https://example.com/api/cert" />
            <button id="extract-btn">📋 استخراج و هایلایت</button>
            <button id="send-to-api-btn" disabled>📤 ارسال به API</button>
            <div id="status-msg" class="status"></div>
        </div>
    `;
    document.body.appendChild(panel);

    // ---------- مدیریت نمایش/مخفی شدن پنل ----------
    openBtn.onclick = function() {
        panel.style.display = 'block';
        openBtn.style.display = 'none';
    };

    document.getElementById('close-panel-btn').onclick = function() {
        panel.style.display = 'none';
        openBtn.style.display = 'block';
    };

    // ---------- قابلیت درگ (Drag) ----------
    (function() {
        var header = document.getElementById('panel-header');
        var isDragging = false;
        var startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', function(e) {
            // فقط با دکمهٔ چپ ماوس
            if (e.button !== 0) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            var rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            panel.style.transition = 'none';
            e.preventDefault(); // جلوگیری از انتخاب متن
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            panel.style.left = (initialLeft + dx) + 'px';
            panel.style.top = (initialTop + dy) + 'px';
            panel.style.bottom = 'auto'; // غیرفعال کردن bottom
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                panel.style.transition = '';
            }
        });
    })();

    // ---------- API های عمومی (مطابق نسخه‌های قبلی) ----------
    GovahiApp.ui = {
        togglePanel: function() {
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                openBtn.style.display = 'none';
            } else {
                panel.style.display = 'none';
                openBtn.style.display = 'block';
            }
        },
        setStatus: function(msg) {
            document.getElementById('status-msg').textContent = msg;
        },
        getApiUrl: function() {
            return document.getElementById('api-url-input').value.trim();
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
})();
