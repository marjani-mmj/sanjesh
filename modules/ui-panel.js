(function() {
    'use strict';
    window.GovahiApp = window.GovahiApp || {};

    // افزودن استایل
    var style = document.createElement('style');
    style.textContent = `
        #govahi-panel {
            position: fixed; bottom: 20px; left: 20px; width: 330px;
            background: #fff; border: 2px solid #007bff; border-radius: 10px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.25); z-index: 100000;
            padding: 15px; font-family: Tahoma, sans-serif; direction: rtl;
        }
        #govahi-panel h4 { margin: 0 0 10px; color: #007bff; text-align: center; }
        #govahi-panel label { font-weight: bold; font-size: 13px; margin: 6px 0 3px; display: block; }
        #govahi-panel input, #govahi-panel button {
            width: 100%; padding: 8px; margin-bottom: 8px; box-sizing: border-box;
            border-radius: 5px; border: 1px solid #ccc; font-size: 13px;
        }
        #govahi-panel button {
            background: #007bff; color: white; border: none; cursor: pointer; font-weight: bold;
        }
        #govahi-panel button:hover { background: #0056b3; }
        #govahi-panel .status { font-size: 12px; color: #28a745; margin-top: 5px; text-align: center; }
        #open-govahi-btn {
            position: fixed; bottom: 20px; left: 20px; z-index: 99999;
            background: #007bff; color: white; border: none; border-radius: 20px;
            padding: 10px 20px; cursor: pointer; font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    // ایجاد دکمه و پنل
    var openBtn = document.createElement('button');
    openBtn.id = 'open-govahi-btn';
    openBtn.textContent = '🔧 استخراج اطلاعات';
    document.body.appendChild(openBtn);

    var panel = document.createElement('div');
    panel.id = 'govahi-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
        <h4>پنل مدیریت گواهینامه</h4>
        <label>آدرس API:</label>
        <input type="text" id="api-url-input" placeholder="https://example.com/api/cert" />
        <button id="extract-btn">📋 استخراج و هایلایت</button>
        <button id="send-to-api-btn" disabled>📤 ارسال به API</button>
        <div id="status-msg" class="status"></div>
    `;
    document.body.appendChild(panel);

    GovahiApp.ui = {
        togglePanel: function() {
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
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
        onExtract: function(callback) {
            document.getElementById('extract-btn').onclick = callback;
        },
        onSend: function(callback) {
            document.getElementById('send-to-api-btn').onclick = callback;
        }
    };

    openBtn.onclick = GovahiApp.ui.togglePanel;
})();