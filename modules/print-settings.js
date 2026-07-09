// modules/print-settings.js
(function () {
    'use strict';

    window.GovahiApp = window.GovahiApp || {};

    var spacing = {
        moveX: 0,      // حرکت افقی
        moveY: 0,      // حرکت عمودی
        zoom: 100      // درصد
    };

    function getTarget() {
        return document.querySelector("#print-content .panel-body-print")
            || document.getElementById("print-content");
    }

    function applySettings() {

        var target = getTarget();

        if (!target) {
            console.warn("print-content پیدا نشد.");
            return;
        }

        target.style.setProperty("max-height","none","important");
        target.style.setProperty("overflow","visible","important");

        target.style.setProperty(
            "transform",
            "translate(" +
            spacing.moveX + "px," +
            spacing.moveY + "px) scale(" +
            (spacing.zoom/100) +
            ")",
            "important"
        );

        target.style.setProperty(
            "transform-origin",
            "top right",
            "important"
        );
    }

    function updateDisplay(){

        var top=document.getElementById("govahi-marginTopVal");
        var bottom=document.getElementById("govahi-marginBottomVal");
        var right=document.getElementById("govahi-marginRightVal");
        var zoom=document.getElementById("govahi-zoomVal");

        if(top) top.textContent=spacing.moveY;
        if(bottom) bottom.textContent=-spacing.moveY;
        if(right) right.textContent=spacing.moveX;
        if(zoom) zoom.textContent=spacing.zoom+"%";
    }

    function refresh(){

        applySettings();
        updateDisplay();

    }

    function bindControls(){

        //---------------- بالا ----------------

        document.getElementById("govahi-marginTopInc")?.addEventListener("click",function(){

            spacing.moveY-=1;
            refresh();

        });

        document.getElementById("govahi-marginTopDec")?.addEventListener("click",function(){

            spacing.moveY+=1;
            refresh();

        });

        document.getElementById("govahi-marginTopInc5")?.addEventListener("click",function(){

            spacing.moveY-=5;
            refresh();

        });

        document.getElementById("govahi-marginTopDec5")?.addEventListener("click",function(){

            spacing.moveY+=5;
            refresh();

        });

        //---------------- پایین ----------------

        document.getElementById("govahi-marginBottomInc")?.addEventListener("click",function(){

            spacing.moveY+=1;
            refresh();

        });

        document.getElementById("govahi-marginBottomDec")?.addEventListener("click",function(){

            spacing.moveY-=1;
            refresh();

        });

        document.getElementById("govahi-marginBottomInc5")?.addEventListener("click",function(){

            spacing.moveY+=5;
            refresh();

        });

        document.getElementById("govahi-marginBottomDec5")?.addEventListener("click",function(){

            spacing.moveY-=5;
            refresh();

        });

        //---------------- راست ----------------

        document.getElementById("govahi-marginRightInc")?.addEventListener("click",function(){

            spacing.moveX-=1;
            refresh();

        });

        document.getElementById("govahi-marginRightDec")?.addEventListener("click",function(){

            spacing.moveX+=1;
            refresh();

        });

        document.getElementById("govahi-marginRightInc5")?.addEventListener("click",function(){

            spacing.moveX-=5;
            refresh();

        });

        document.getElementById("govahi-marginRightDec5")?.addEventListener("click",function(){

            spacing.moveX+=5;
            refresh();

        });

        //---------------- زوم ----------------

        document.getElementById("govahi-zoomInc")?.addEventListener("click",function(){

            spacing.zoom=Math.min(200,spacing.zoom+1);
            refresh();

        });

        document.getElementById("govahi-zoomDec")?.addEventListener("click",function(){

            spacing.zoom=Math.max(30,spacing.zoom-1);
            refresh();

        });

        document.getElementById("govahi-zoomInc5")?.addEventListener("click",function(){

            spacing.zoom=Math.min(200,spacing.zoom+5);
            refresh();

        });

        document.getElementById("govahi-zoomDec5")?.addEventListener("click",function(){

            spacing.zoom=Math.max(30,spacing.zoom-5);
            refresh();

        });

        //---------------- اعمال ----------------

        document.getElementById("govahi-applySettingsBtn")
        ?.addEventListener("click",refresh);

        updateDisplay();
    }

    // هنگام چاپ دوباره اعمال شود
    window.addEventListener("beforeprint",applySettings);

    GovahiApp.printSettings={

        spacing:spacing,
        applySettings:applySettings,
        bindControls:bindControls,
        updateDisplay:updateDisplay

    };

})();
