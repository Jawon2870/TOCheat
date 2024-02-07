// ==UserScript==
// @name            TankiCheat - Jawon
// @version         1.9.2 (Final)
// @author          Shizoval | Jawon Cyclone Sparky
// @description     This is a free and open source cheat for TankiOnline.
// @Discord         https://discord.gg/A9qmkChTJa
// @Github          https://github.com/Jawon2870/TOCheat
// @YouTube         https://www.youtube.com/@Jawon_JW , https://www.youtube.com/@Hi_Hi_Cyclone
// @match           https://*.3dtank.com/*
// @match           https://*.tankionline.com/*
// @icon            https://gitee.com/Jawon/Jawon/raw/master/medias/icons/favicon.png
// @require         https://jawon.gitee.io/libs/tankl/imgui.umd.js
// @require         https://jawon.gitee.io/libs/tankl/imgui_impl.umd.js
// @run-at          document-start
// @grant           none
// ==/UserScript==

(() => {
    "use strict";

    // Addtions config start -----------------------------------------------------------------------
    var account = "Account";
    var passWord = "PassWord";
    var autoLogin = true;       // 自动登录
    var autoRegister = true;    // 自动注册
    var autoRefresh = false;    // 自动刷新
    var autoFullScreem = false; // 自动全屏
    var fixF5Bug = true;        // 修复 F5 刷新
    var autoClick = true;       // 自动点击元素
    var buttonCelectors = [     // 自动点击以下元素
        ".TutorialModalComponentStyle-navigationButton",
        ".DialogContainerComponentStyle-enterButton",
        ".MountedItemsComponentStyleMobile-commonButtonUpdate",
        "div.NewShopCommonComponentStyle-container > div.BasePaymentComponentStyle-commonContainerForChoiceAndButton > div.BasePaymentComponentStyle-buttonContainer > div > div",
        "div.DialogContainerComponentStyle-header > div > div",
        "div.SuccessfulPurchaseComponentStyle-content > div.Common-flexCenterAlignCenter > div",
        "div.Common-flexStartAlignCenter > div.DialogContainerComponentStyle-imgClose",
        "div.ScrollingCardsComponentStyle-scrollCardPick.Common-scrollBarVisible > div.ScrollingCardsComponentStyle-scrollCard.cardImg > div.ScrollingCardsComponentStyle-selectCard > div",
        "div.MainQuestComponentStyle-mainContainer > div > div.MainQuestComponentStyle-buttonContainer > span|完成",
        "div.AnimationOpenContainerComponentStyle-openAnimationContainer",
        "div.Common-flexCenterAlignCenter.ClosedContainerStyle-moreButton.Font-bold.Font-normal > span",
        // 领取所有按钮
        "div.SuperMissionComponentStyle-descriptionSuperMission > div.Common-flexSpaceBetween > div.Common-backgroundImage > div",
        // 任务完成按钮
        "div.MainQuestComponentStyle-cardRewardCompleted > div.Common-flexCenterAlignCenterColumn",
    ];
    // Addtions config end -----------------------------------------------------------------------

    // Jawon's code begin ============================================================|
    // 加载用户配置
    var JWUserData = {
        MenuDisplay: "block",
        Theme: "dark",
        currFunctions: "Physics",
        HighSpeed: true,
        smooth: 15,
        addSpeed: 100,
        Jump: true,
        JumpSpeed: 20,
        JumpAlign: true,
        NoKnockback: false,
        NeverFlip: true,
        AvoidMines: 0,
        Gravity: 100,
        EnemyAlpha: 0.6,
        TeamAlpha: 0.35,
        ShowEnemyOutline: true,
        ShowTeamOutline: false,
        NoTeammate: false,
        NoEnemys: false,
        KillRobots: false,
        Addtions: true,
        TankDarkTheme: true,
        NoReload: false,
        BulletTPHeight: 2000,
        RocketMode: "1",
        bulletTPNum: 1,
        writeLetter: "",
        ShowKeys: true,
        Keys: {
            forward: "ARROWUP",
            back: "ARROWDOWN",
            left: "ARROWLEFT",
            right: "ARROWRIGHT",
            shoot: "C",
            jump: "R",
            nextTarget: "N",
            targetDistance: "/",
            bulletTeleport: "M",
            TPSomeBullets: "Y",
            hideToSky: "H",
            savePos: "7",
            posTeleport: "8",
            antiAim: "9",
            freeCam: "B",
            containersOpener: ""
        }
    };

    function CopyOBJRecursively(oldOBJ, newOBJ) {
        if (!newOBJ) {
            return oldOBJ;
        }
        // 获取旧对象内部的对象名称
        var oldOBJ_keys = Object.keys(oldOBJ);
        // 获取新对象内部的对象名称
        var newOBJ_keys = Object.keys(newOBJ);
        // 遍历旧对象的每个内部对象
        for (let i = 0; i < oldOBJ_keys.length; i++) {
            // 在新对象中查找当前名称
            for (let j = 0; j < newOBJ_keys.length; j++) {
                // 如果名字匹配
                if (oldOBJ_keys[i] === newOBJ_keys[j]) {
                    // 如果当前旧对象的值是一个对象
                    var variable = oldOBJ[oldOBJ_keys[i]];
                    if (typeof variable === "object" && typeof variable !== "function" && variable !== null && !Array.isArray(variable)) {
                        // 继续递归
                        oldOBJ[oldOBJ_keys[i]] = CopyOBJRecursively(oldOBJ[oldOBJ_keys[i]], newOBJ[newOBJ_keys[j]]);
                    }
                    // 如果不是一个对象
                    else {
                        // 直接赋值
                        oldOBJ[oldOBJ_keys[i]] = newOBJ[newOBJ_keys[j]];
                    }
                    break;
                }
            }
        }
        return oldOBJ;
    }
    // 加载本地保存的用户配置
    var LCJWUD = JSON.parse(localStorage.getItem("JawonStorage"));
    CopyOBJRecursively(JWUserData, LCJWUD);

    // Jawon 界面生成 ------------------
    (() => {
        // 添加菜单样式
        var JawonMenuStyle = document.createElement("style");
        JawonMenuStyle.innerHTML = `
        /* 全局颜色定义 */
        :root {
            --color: #eee;
            --bgColor: #333;
        }

        .JawonMenu,
        #enemyListWindow {
            max-height: 90vh;
            padding: 10px 10px 15px 10px;
            border: 1px solid #888;
            background-color: var(--bgColor);
            backdrop-filter: blur(1px);
            color: var(--color);
            border-radius: 10px;
            z-index: 999999999;
            position: fixed;
            top: 3vh;
            left: 1vw;
        }

        .JawonTitle,
        .BindedKeysTitle {
            margin-bottom: 5px;
            padding-bottom: 5px;
            text-align: center;
            border-bottom: #888 1px solid;
        }

        .JawonTitle>img {
            height: 18px;
            vertical-align: text-bottom;
            pointer-events: unset;
        }
        .Jawon_a {
            color: unset;
            margin: 0 5px;
        }
        img.JWThemeIcon {
            position: absolute;
            right: 10%;
        }

        div.JawonMenu>.funcSelect {
            width: 96%;
            margin: 0 2%;
            text-align: center;
        }

        div.JawonMenu select,
        div.JawonMenu option {
            color: var(--color);
            background: var(--bgColor);
            border-radius: 4px;
        }

        .BindedKeysTitle {
            text-align: left;
            width: fit-content;
            padding: 2px 4px;
            border: #888 1px solid;
            border-radius: 5px;
        }

        .JawonFunction {
            padding: 5px;
        }

        .JawonFunction:hover,
        .Jawon_a:hover,
        .BindedKeysTitle:hover {
            color: dodgerblue;
        }

        .JawonCheckBox {
            margin-left: 4px;
            vertical-align: text-bottom;
            display: inline-block;
            border: 1px solid white;
            width: 12px;
            height: 12px;
            border: 1px solid var(--color);
            border-radius: 4px;
        }

        .JPSpeedDiv {
            padding-top: 5px;
        }

        .JPSpeedDiv>div,
        .setHighSpd>div,
        .AvoidMines>div,
        .RocketTeleport>div,
        .TankNameAlpha>div,
        .bulletTeleport>div,
        .Gravity>div {
            display: inline-block;
            min-width: 20px;
            border: #888 solid 1px;
            border-radius: 3px;
            padding: 1px 2px;
            position: relative;
        }

        .RocketTeleport>span,
        .TankNameAlpha>span,
        .bulletTeleport>span {
            display: block;
            color: unset;
        }

        .JPSpeedDiv>.JawonFunction {
            border: none;
            margin-left: 5px;
        }

        .setHighSpd>div,
        .RocketTeleport>div,
        .TankNameAlpha>div,
        .bulletTeleport>div {
            min-width: 40px;
            margin-left: 10px;
        }

        .TankNameAlpha>div,
        .bulletTeleport>div {
            margin-top: 20px;
        }

        .setHighSpd {
            padding-top: 20px;
        }

        .RocketTeleport>div {
            margin: 20px 3px 0 3px;
        }

        .setHighSpd>div::before,
        .RocketTeleport>div::before,
        .RocketTeleport>select::before,
        .TankNameAlpha>div::before,
        .bulletTeleport>div::before {
            color: var(--color);
            position: absolute;
            top: -20px;
        }

        .setHighSpd>div:nth-child(1)::before {
            content: "smooth";
        }

        .setHighSpd>div:nth-child(2)::before {
            content: "speed+";
        }

        .RocketTeleport>*:nth-child(2)::before {
            content: "height   mode";
            width: max-content;
            white-space: pre;
        }

        .TankNameAlpha>div:nth-child(2)::before {
            content: "enemy";
        }
        .TankNameAlpha>div:nth-child(3)::before {
            content: "teamate";
        }
        .bulletTeleport>div:nth-child(2)::before {
            content: "TPNum";
        }
        .bulletTeleport>div:nth-child(3)::before {
            content: "WriteLetter";
        }
        .bulletTeleport>div:nth-child(3) {
            max-width: 62px;
        }
        .funcsDiv {
            max-height: 45vh;
            border: #888 1px solid;
            margin-top: 5px;
            border-radius: 5px;
            padding: 1px;
            overflow-y: auto;
        }

        .keysDiv {
            margin-top: 8px;
            border: #888 1px solid;
            border-radius: 5px;
            padding: 5px;
            transition: max-height 0.5s;
            overflow-y: auto;
        }

        /* 定义滚动条宽度 */
        .keysDiv::-webkit-scrollbar,
        .funcsDiv::-webkit-scrollbar,
        #enemyListWindow::-webkit-scrollbar {
            width: 6px;
        }

        /* 定义滚动条轨道 */
        .keysDiv::-webkit-scrollbar-track,
        .funcsDiv::-webkit-scrollbar-track,
        #enemyListWindow::-webkit-scrollbar-track {
            background: #8884;
            border-radius: 3px;
        }

        /* 定义滚动滑块 */
        .keysDiv::-webkit-scrollbar-thumb,
        .funcsDiv::-webkit-scrollbar-thumb,
        #enemyListWindow::-webkit-scrollbar-thumb {
            background: #8889;
            border-radius: 3px;
        }

        /* 定义滚动滑块悬停效果 */
        .keysDiv::-webkit-scrollbar-thumb:hover,
        .funcsDiv::-webkit-scrollbar-thumb:hover,
        #enemyListWindow::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .keyDiv,
        #enemyListWindow>div {
            margin-left: 10px;
            padding: 2px 4px;
            border-radius: 5px;
        }

        #enemyListWindow>div {
            margin: 0;
        }

        .keyDiv:hover,
        #enemyListWindow>div:hover {
            background: dodgerblue !important;
        }

        .JawonFunction.SetStrikerTargetBtn {
            width: fit-content;
            border: 1px solid #888;
            border-radius: 5px;
            cursor: pointer;
            padding: 3px;
            text-align: center;
        }

        #enemyListWindow {
            text-align: center;
            position: fixed;
            top: 1px;
            left: 1px;
            min-height: 20vh;
            min-width: 10vw;
            overflow: auto;
            background: rgb(0,0,0,0.2);
            backdrop-filter: blur(1px);
            padding: 6px;
            z-index: auto;
        }
        #enemyListWindow > .cutOffLine {
            display: block;
            height: 10px;
            margin: 0 auto;
            color: gold;
            border-radius: 5px;
        }
        #enemyListWindow > .cutOffLine:hover {
            background: radial-gradient(black, transparent);
        }

        /* tank style begin */
        .ksc-0.BattleMessagesComponentStyle-container {
            align-items: unset !important;
        }

        .MatchmakingWaitComponentStyle-container {
            left: auto !important;
            right: 230px !important;
            height: auto !important;
            top: 0 !important;
            background-size: auto !important;
            padding: 3px 0 0 6px !important;
            border-radius: 6px !important;
        }
        .MatchmakingWaitComponentStyle-container div:first-child {
            height: fit-content !important;
        }
        .MatchmakingWaitComponentStyle-contentContainer,
        .MatchmakingWaitComponentStyle-cancelButton {
            margin: 0 !important;
            height: 5.7em !important;
        }
        #selfUserBg,
        tr.BattleTabStatisticComponentStyle-selectedRowBackGround {
            background-color: rgba(0, 212, 255, 0.3) !important;
        }
        /* tank style end */
        `;
        document.head.appendChild(JawonMenuStyle);

        // 插入主菜单
        var JawonMenu = document.createElement("div");
        JawonMenu.className = "JawonMenu";
        JawonMenu.style.display = JWUserData.MenuDisplay;
        JawonMenu.addEventListener('keydown', function (event) { event.stopPropagation(); });
        document.body.appendChild(JawonMenu);
        // 主菜单标题
        var JawonTitle = document.createElement("div");
        JawonTitle.className = "JawonTitle";
        JawonTitle.title = "Click ` to hide or show this menu.";
        JawonMenu.appendChild(JawonTitle);
        // 标题内的 Logo
        var JWLogoImg = document.createElement("img");
        JWLogoImg.className = "JWLogoImg";
        JWLogoImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAKQGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4wLWMwMDAgNzkuMTcxYzI3ZiwgMjAyMi8wOC8xNi0xODowMjo0MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowNWVjNGM3YS0xNGFlLTcwNDEtYjY1YS0xMmRiZTA2ZTA3NjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MGZjY2JmNTEtOWZiMC04ZTQyLTljMDMtNGMyMDNjYTNjNjI3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjBGOTRBRUFGQ0RCMDEyRDJFOUQ3RjIxMEI2REExMTBGIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IkNEQ0ZGQTdEQThDN0JFMDkwNTcwNzZBRUFGMDVDMzRFIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wOS0wN1QyMzoyMDo1MyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wOS0wOFQwMDowNToyMyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDktMDhUMDA6MDU6MjMrMDg6MDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiB0aWZmOkltYWdlV2lkdGg9Ijc2OCIgdGlmZjpJbWFnZUxlbmd0aD0iNzY4IiB0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb249IjIiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6U2FtcGxlc1BlclBpeGVsPSIzIiB0aWZmOlhSZXNvbHV0aW9uPSI5NjAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpFeGlmVmVyc2lvbj0iMDIzMSIgZXhpZjpDb2xvclNwYWNlPSI2NTUzNSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjU1MCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjU1NCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFlMzg0MzUwLWUwYjMtYTc0YS1iZTFhLTFlMzJhODJiM2FhOCIgc3RFdnQ6d2hlbj0iMjAyMy0wOS0wN1QyMzoyNjoyMSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODIwNWNjMTYtYmEzYi00MDRkLWI0MzMtMTY0ODY2NDk3OTA1IiBzdEV2dDp3aGVuPSIyMDIzLTA5LTA4VDAwOjAyOjU1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBmY2NiZjUxLTlmYjAtOGU0Mi05YzAzLTRjMjAzY2EzYzYyNyIgc3RFdnQ6d2hlbj0iMjAyMy0wOS0wOFQwMDowNToyMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZTM4NDM1MC1lMGIzLWE3NGEtYmUxYS0xZTMyYTgyYjNhYTgiIHN0UmVmOmRvY3VtZW50SUQ9IjBGOTRBRUFGQ0RCMDEyRDJFOUQ3RjIxMEI2REExMTBGIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9IjBGOTRBRUFGQ0RCMDEyRDJFOUQ3RjIxMEI2REExMTBGIi8+IDx0aWZmOkJpdHNQZXJTYW1wbGU+IDxyZGY6U2VxPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDxyZGY6bGk+ODwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvdGlmZjpCaXRzUGVyU2FtcGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu9Us0gAABURSURBVGiBdZprzKXXddd/a+/9XM7tvcy8c8n4Nh7Hdu1kEtuNFeqoSYwKUqlAKBUgBCURRa7KR/hQgcSHIlAj+ARVhYBKXKKCALVCArVpK2LqhNS4jieJ7zP2eDz23GfeeW/n8jx777X4sJ933C8c6ei8c84z59lrr/9a///67yN/9cGv8cqtyzzxZPPgC19//le/eur4L4x29/1iPkc76BeJrlNSL8Q+k6NjuRIWC5inwLIXYu/pUsUiOVa9sMqemAIperoUiKklpoqUHX0WVhrI2pBzS9SK3M2I8Siap1TaAgEHBBFASAYgIJ7elKXcvflRePHf9PW/+EeN3QU7hjwjX+HRL0+e//f/+mt/0Eob7OUPuHprG9RIK6XrIEYjdkLqHculMF84Yu9ZxMC883S90OWaVYIuOrociNnTR0+fA9oHOvX01PSxojMgB1Ju6VNNTuvktIZojVCBVZh4FDADMyFToYADbrLJZcC5K2+car/xpUbO78lXHv/SqT/8d3/nSgXcevV1dmJCMtjK6LpIjB5NjtR5lqvA/r6RYsUyOuarimU8zEDFKkLMUrIQXXnVihyVaBUra4jqSDkQs5BzIKcxXWqxXONpUGkQcyCg5kEdKPQ4PHBTMldZB5sBYxp37vynxj9/NvzSX3j671W148Z3f8TdmCAncq+kTkgRRl6oR1MObEzXKXXjSQRMPVJXeDwBT28Ow4GUV1WHSMCSI0kg5QpVh4lDqTARVCpSrvEuoDREKrAAViM40IpOIbKHl31uI1xjAhZx7KLcotOnH7sVv/5CeO7o5K/kN85zaz7HxCOxp1vByFdszcZcuLnk3KWPubbd482B1ax6JWZIGuh7IWUhm0NNSkbUyMlQdSiQ1JGyYXiy1URVBCOb0ANePBaMrB7MgasQAuodmk/i45PctU9xXax8zgJFgQDs0Kcv/K3gWzn1zoc3UefRpHSdcXQUSAl+48X3+KO3bzFfLHDOkOwQBUzJ2VBLKIqIIQKiipkHDLOMADhPMkVUERyCI7uI4RAEdZkeQSUiGOI8SZbM0zbiEs3oBHXzIHH1FyG9AGTg1lAtCnIFs/j5cDfm5TzqrBZHSpFp4+ii8U9/511e/mCHT2+NWJutsz/3qIwI9ZhxPWMtHKGtNmjDjLqq8VWLMkJ0BFRka5E8BvEoATFPImMImMfMo+YwE9QgGqTs8E7ALdmPb3ErvcxH8z/gwN5kOnof113jVv8rwBhkhXCA2RKTazH0/RKy0uUO00Q1HvMb3/6YP7m4z2fuO8LObs/evsdszKzdZBY22KiPs9GeYNQco67WqP0I72aoTUnWkLVGU4XhUSqyC1j2BANjeA5/ZyAxbG6CnEEcbIWzHGv+GqfqC7y/9+tcXXyLSf2fmNpJDuLfBS6B3QD2QW5pyLEn9R3ZKjbHLf/33X1eeusOD59YZ2dnxc0dZVy1NM2ISbPGRrvFZnuctt0i+DHJKnIMYIrZkqQ9fXZoyqhlVD3ZGsxaRBsyfsiKYSokc/Qq5JTpk5KzAwuoBDKBcf0oj7b/kqxrXO/+GZPwbZbpS2TzwGVghbBHiBFiVLJmmLS8/dG8FGXXsbOzpKmmBF/ThjGzZsakOUpTH8W5GWoNmmqygYqCJnLOpGzkvARboKoknZBsbWiZgokgFshmRJSYMil39DmRsifrDKUBEXZjix60TJt/wkTeIsvvMQ4vsh8/D2wDINIRYjJiD9mMg07ZWSWCNw7mEZMGcTU+tEyqdWZhg9ZvIDJFkyeboWpEA0PBwDJkjSRb4tMesIfmNbpsmAlBRphTzHpUjWRKyomUd1DdRTWw1GNEXcfphJ4lKyKun9FUL9CNfx+fP4R4EuMAcJhlQk5K3xmIslwluiSQjdhlLFQ4F2jchCZMqcM63k3R7NHUkfAoQlZDzFATkgnoCtUV6B7CVVT3SKkim0dFEW+YKZaNbJCsw9IeTq9jRJJGYg5D/QgrAj2OEL9Ibc9h/iPg0yALMA+SCDEbURUnEFel/5MUs4z3jkoCtfc0bkwlY7BA0kjWHj9fMb4tqKsRqcip4WA9sJpkQn+At5uIfMTSjmC6RtSG5JTaMvXOCiEhgLEEdkjuDvgFdV4RmRM5yYoRHTWdzDF7iM18Fs93gF2QCBZw5ghdyvQ54akQgZwFwcCD4amoqVxLkBalLvhPK6q9Aw6ORX7w/Dq6BKEnrilHX6858b7j9nSLqMdYy1DHH5PZJNoI7RNZWi7/mQOWsz10riRxSDvi/te2Ge9c42BDufPomCgdenGT7nbLymqMDdasxeMBQQwMwRyE2EPsKnCO5CBlwdRRdKfH8GANWMDMEy3jUkd75zqXPzvh+7/6HOxmWPZwsuOxX9tj7VzDx8c+w9xvcWyxxSPzl8jhGtkmsDTunKz54S8eg9k67PQwm8Cq44FXPmBqV3j72c9y45eeobryEdU3t+lRjAlwiqhC8AJExByDIMJpCsQkxAipj2jOqDnAIxhOBMGjVqMaUM1k60jsYXEP5kAfISl0NVXM7CJ0TYNr5txZf4z96gGq/iKZbTJL9k4ZbAVY1pAr2Fjn+DsfMN1/nwM8+w9vQTVCPmxI1/YwLgF3gQWG4aywumAIEbGIizGRcyJppk9AFtQpSsYRcOJRHNEcMUPUTNIVxgJzK5gATYDGw7ghhY45keVkwnIc2J1U7I/O0OYreJmTOKA75eFkA+MaJi0cWWdy5SaBOxw0a8zPPgSbFX47A3eA6yBzYA6mqAmC4kgICnhC7LWwqfmifRSMQrveGNqbYGokjUDE2wpjjuYWxgGiL3Q8a0luyT4N800H2rBysLP/aba2I6J7JDyLh56Eo+twYwe8A6+0l69idKwe2CQ+cgJpPXZtgXIFL3cx6zAUswQiiBRdoFYBjpCykZKAVwwlYgzzGCaQMTKUNqlFDKIrIksSCmMPScB7mLVE9llwwMExUMo4cTM/zpn3xlSrGwjK6tEKRmOYrGA2wu/uUL1xiZ6K/TMn4OynqN+4grx2iYq7eFmSrS9cRcARMIMs7lDw4GIqUiEnR59BMTArytUE1FBTkhlRIWtCc4cSi1KqA4wcjDy06+AXKN8htTusnoD+frj+1GPsrj9Cqx8T/ZL4mTF4j6xX8OARwvWbpJ27rGhZPHY/3L8OH2/jb71DKxGc3buf4TETBmmN4lABp0no1ehV6bNiVq4R82QnqAim0OdMTpmcFM0JJdK7CLWHuoa6AcZIs0L4Ps7Ow1PAQ0b/ZeHGTzxGw0X0wUB8YhNI2CzgTo4ZXbjGio4DapanTwDQfHyFhgtIs8KgDFp8ojillD3QgFS4qEJKSsqRlBRVN1yvqNk9paqW6S2hOWGWSWRyThCkZKUuWBUPjlvI7vvwKeCkwSOw88TDwD52eoKdOlYKsK0R8cj5OyjCvD5B9+zDANTvv0PFTRDIVAPgKUyOoFYoAsqw52JOqAopelIyTAsRIhkxLZ9RIJdRknUk7VmRi9AUAd9C4+7dyBNoL5/HV8AxBzNYPHWajsDqvg2QCQQHRyaEg23SOceKTfoHp+QvPYm3DnnlXYzpAG13WLWAK8pX/DDEecw5XE6FBJOCasGfQxBxpVMZBXYksmbUEmaJTCaSAV8W5UsgGcGY0L55jvrqAk6VTZufPcM2W6zuXy8BVx7WRvhL2+j5n0TZJN1XE/2Y0esXqM5fIDMrzUYbYDQo5woVGVDTABUiHteb0KkS1ciDGi1xCyoFV2ZGypmYu5IVrORn8J3wWjIDZG8YU2RxkfDDH5VAVrD8zHGuHX+C1fG1EogPBSLvgJx8BM8BizMnyUB47TyObaQOJHUoU2A8rMojh/elGp7gygKNmBkCchiCE+XwejMjZ4iW6OiJUmCW9RC5AZGCWTOjmAI99XsX8HVJmq7D/s8+TfdwKWZcQDDCmw75qU30gRXLn3gAB9SvXSRT6i9Zg9kYKMad0ZSebpNyHzE0QMjZ0GjgFDNHVkNRnAlOQFXJouCL5PYKWaAf5Dv44Qtl4B8pJIqHN94l7ENuS1b42p9DzxwpgbQjGj1ApKX/2Za1O8eRZ87iAPfd10lsYCqYjQZYpQIjG2EDUeOK/SQIIaqSVHEGIjKMoXKPEU2UbAaWEDNyFnp3KNQcQo1hWImjbBYAa8iPL9JcinSPVcgdZfVnn6ObCNPbdxFxdLWH4xXdM8ryrbPkn/4izfXb8MN3Edkiqi/qgcmwYRsgoyLfkaImXAABF7PSi9EDvQlZwKxEKWKoFKmsB3PS/Abdapd+cYfIZbpmAkyH3dJBMRcVJGGGLj5GfvAONGBNZt8logjNf30R/7svkcZTVl+Y4o4siX/5z9M1a1T/62Uct6BuyebJEoApQgOsFZhJBJ/AKVQRqxMhqZCzQ8XjrEJ1jicXmEFJ7/I2i88/xa1f/gL5/kDz1odsvnqG21//OUx7EAXvcICIJ2Jo7dB0QPjBu1TfOEtsuAe/8OIP0J98HPWgnxV851icfhoD6u+/CSjqoE/VUAuK0Q2ZaYsb6T34jASBkAkZR86FKdUXGCnlplky1WKb/pkvcumPf5FYrwML9n/uWW7TlEzkRUmxFJ7N+/OBc0AJuFcvEIA4KhAYobSvXGT5M8+WmgpC9qW6aha4PzxH5hjZhMSodEBqjAoYIWaIBJAawhJCLoGkBFHLwtUcvRlJiu8tCp4Dbv/KV4j1JqSb4DzYClwZ/PEDTzHCkalevkhkUow3pqRzl6lu9CxP1CUbH10lXH6bfFhUksEVSNbn3oYLFzDZImqD3utWFSJHB5WxwHxfjMYqY7XiguFSNiIVHYFOBUNL57GAw7Fkwez1D6mhRC+xZCIlyD1iq6ElVUxfegX58ctYOIJowGSdrruBvfQuhw+5eAnlOmEeATBXbCQDmu9fwLOLNhUpV5hOgSlGRFgbumIuPFJRiLhSzCVcB0QcnRXhiDlUXCldESxsUv/af+Tk//4jGj4FcrSweMgQIiZTkOMcvXWbyS/8Y1a00BRtZDKiZ4W8ep4wBNK88R7KNm4+HyKrIHgE8H/yTmksEojWDDVRiBA2wCh+gjNoEowihARecZ15OoWkQkegF0/CDSg3aMf0OeOe//sc+wf/nPW33qNlTJBjtBxncmOPI7/535me/RvEy+8jk/vAhIinowKOEH58nXYIRC9tI0Ra0hBcWfCIjvA//5jEFkn9AKtp4Sg2MB6isIeWQh9p2czBwA8pQ6+eLFaOBkgsaNkQCEixiqZHSfMF+s1/xfSb/43p04+TH9zC763g1ffQ/Q/pWIPpGXyG3hxJA9mKRpp/t2f8wn9gI/4I93+ukKtncL/1HWYfXCZZRKxhdPUm3DmA6ii9+oHN10pbl5PD32VvxTmocjGOnSAeQjTozYjiyeZw1jPPM+5ay7HqDktpsWzIaExwT6CrFencm9i51eBKreOmpwuDDF5uMkfMNVgL0tPNn0L+7S02+E2MZ8iTM9j5j2jOv0bNMMQxQsf3lf/fjYF1hDGIAQ8WNpfSFMxZgZRkECuBdKJ01GQNJKeoRaDnip5hansEiXQ0JFNQh6/H1PWIREIxnCutFx2OChByFrK2Az2uYfIsPZ5F+CJ1oDSJdg1kDRsGWEEwC3QpkHUN2AQi8ADG6SEVUjSaNwhaCHFQEi5aoBdYOiPhwYzWLelszIf9w1SAl0xSR2+elTl6AooH82QN5NygVpFMyobomEwFzBF5BmGKMmKlP03Mt4uDbw1JK1QbVFs6a+lzTZ9mGJsIY0wCJp/j3qGOUdz8oFADLpUu6ozQmaNDiCKFdAScRRyJXT3KpT6zFW5QidDlw1qinBVKGYmxYjREE1IK9DoFIiKnwL6MWQ9SE/UvIfb7VJLwrinWmoFJIKtDVYi2hjAD6RGexexkCWJ4pHpMnnkIEVIEPIgSkhg9Qq+Z3VFE2pbJ4jqV7+nSBrt5xioHxn4fkURSigFtvpw5uuIsqRmmgV4bjB7cFmI/D3ak8IxV4J4i2t8k62+DTTEbIVYMBAgoI6DGpMfJT6H2ucNeN2QF4jGHrRtoD6EUjnhHiAgdyk6V2J4YbTrC9PY1NsIb3MjPgU3oULokODGkTNdkcyAtkkurNikkitQIjyL2M5idwVghMi4K2QSTX0bdCPR7gyJohhYrIAEnxzC+itrnhyByUeOUkdnPvkdSgdohqcaCAzJhRWanctxtXDmCm62zt34fG3c/JDUVd1afA9aBWM69KTZ+mbjAqCkyYgyyARzD+DRma6WrsHGvLx22T/gGIl8F3sDYLT8SYK0Utj2OWfjkenx5qaE5+S1Ef4fEU1A5zCt4gQzhbsDfrQ1zAekNcz1377sP10XWFxepmz328mlW+Thq4zKh2VFghBAwRqXD2MawmMMdDoNy/VNB/KlgSic6/Uls/5+HCPi1S4xO/mfE/xar+gHydIZYj4ki5Wi7CXOktdpBzOUkMhlaj9l+8DR61TNe3GXLvU50oyIGdTQsUoZDlsP52eFs2Dqryq8X8MWPcnq4+gIR8aXrYcNEWc4Uxcq/1RupEuLIo6Md/PgDLGzTTR4jrp8Yhr5UjhXqgMssQ+jjfyGs/3VW+5gpSIBVT/aeO/fdz3z/CM0i4SyR3XCmbisMV4gJCo84Q6wo2dLNBvHpM+LyPalfMK+I9zjnUDlkOlf2ZOiI2RupgVRVGEfJozPoqAVVcIZJ+XmHTEa4ncX/kM2Tzz9x9/Tpt+g66IwyEtqwW+VXCGaeQ+lVVumGwcYBqYi4cGhjDrh1g7MiBsEP75UgED6xkMQ+wZCzMia48vuTYhKk0rCygEohQyfFZfQVzle4Dz54xJ/QE7ezUPUbR75M1BIxRWWaOiQapIRoHu45LEgT6OD/oojGQk4akdyDdmA9kBEZrs09oumTQtHiA6AJckSSlqxaHr47geayJnGIL0GaCNQVsrZGuHr9b9vOrRf9rH2E2d78O0nx/XTylcMmgRQDexgXC0yc3DPi8LFAwbmSjeDK5w7wuWSg8uV5mD0nxSv2HvFSzlRCAB+QIFiQkj0XyvvOF/8r1FBV5b0qwGSMTGZUV6//Q3/1+q+7eoqfjR8GEaa78xdH84Pv9d49icgplw2XtWBdKOcRbkCLKOLKOaNU4Lwb6qBQm3NAMNyweHGCczKIPsX5QmJigjhDvCC4UkYiiPOIBMQJ4gMiFeIcTsr3uK77dvPxzReqa7e+lYfA/x+XXEBysjHSiAAAAABJRU5ErkJggg==";
        JawonTitle.appendChild(JWLogoImg);
        // 标题链接
        var JWTitleLink = document.createElement("a");
        JWTitleLink.className = "Jawon_a";
        JWTitleLink.innerHTML = "Jawon";
        JWTitleLink.href = "https://www.youtube.com/playlist?list=PLDoBBlc7ql_QKow4efKXsJOjM6WY-0bzK";
        JWTitleLink.target = "_blank";
        JWTitleLink.title = "YouTube - Jawon";
        JawonTitle.appendChild(JWTitleLink);
        // 标题内的主题切换按钮
        var JWThemeBtn = document.createElement("img");
        JWThemeBtn.className = "JWThemeIcon";
        JWThemeBtn.title = "Click to change theme.";
        var moonIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0xMi0xNlQyMDowMzoyNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMTItMTZUMjA6MDY6NDMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMTItMTZUMjA6MDY6NDMrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmQwNTkyODM4LTQ1M2EtMTk0Yi05NGEwLTQ0ZTllMTRjMjY4NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpkMDU5MjgzOC00NTNhLTE5NGItOTRhMC00NGU5ZTE0YzI2ODQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMDU5MjgzOC00NTNhLTE5NGItOTRhMC00NGU5ZTE0YzI2ODQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQwNTkyODM4LTQ1M2EtMTk0Yi05NGEwLTQ0ZTllMTRjMjY4NCIgc3RFdnQ6d2hlbj0iMjAyMy0xMi0xNlQyMDowMzoyNCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtDtRvwAAAQdSURBVGiB1ZmxbtxGEIb/n1A6Fy7cLBlEFGw1qfIGOj1B6lQ6wXkAv4GkMnERI0C6ADk/QIAEeQBfgBQpUqeIGjrAchoDcQB3EfZPceSBJ/HIJXmW5A8QIHJnlzM3s7uzs0AkZhYrOggze1iWpcqy/Mt7PxvaP4kVlDR07Cicc28lfQngkORP3vtvh/RnjJD3HiRBEs65UYp2YWZ7kv5rvPqb5JFzrujrG+UBcmVn0wtmlg/SsgPn3BXJw8arTyQtvffnfX17DfDebzzXc0HSq2Fq9lJce94nOTezeVenrQaYGcxs/evXSIL3/gcAed/gQ3DOXVVzocm+pDMzm23rt9bOzBBCuKHwFupYKgAcSEKSJJPnh5k9lPRPS1NB8rhtTmx4IEZ5SeeNx5zkfFeT2zn3FsCLlqZc0qu2ebc2wDnXaQDJnOSM5FnzvaQzkrNdTWpJP29pytvm3Q2NzQySQHIeQjgimQOYRX6/qJRYJkny0jm3jOzX/P4TSZfb2kmeOucW9fONSdzwxJLkDPHKA0COVVjlY5SveNPVKGkjAlpXIeccJBUkjwEMVWSZpunxwD5D2Fj9OveByohTxBuxC+Xf9Qk0vdBqQDNxG2DETn5559xVhNjaC707cZU+FFjF93vHzPZi5GovtBoQQgCw2heyLKvX+LxnzL72WB5EyuVmNms1IMsypGm63pzatnJJi7YB4/XcyqMBsnnseSCv/5G0IHmQZdkpyYMWQ24NSSdRBoQQjrDaFw6yLDutcxLnXFEbAmAZQphNVar6VjRRmdttUpblkKNfEX2kvA3M7MnQPvfKgKHhAyC/NyHUci6O4t54QNLzEd2W98IDHSexTiQt7oUHrqfIA3h95wZ4758CeDamb5IkxZ2GUN/pqw+SxzSzvcgUdqeMjfsmaZoykfTczB7uSK8oql9+kvJ1DpaQ/E7SL2N2wTF4759OCZuaJEkugNU+UAD4Q9JlWZZfm9njqYO3YWZ7ZVl+Q/L7qWNJWtQJJevBG7vgvwDO0zR9MfVD9dghhJNdKF5TVemWwGZp8fqKcCnpqyRJfqwqZtFUx8IHIYTPSO66CLxx9t5YRjuWtd8kLZIk+bV6fgPgnXPuqlYWwKMQwsckP8fIdT0GkgfNGmlbZW5UUnUbNEOnpq0yd0XyIwCTV4pdIumirdq3dSeuPPEngMNtMrfI1prT1lyo8sSnAL54b2rF0Vkwi8qFzOyxpN8xrOQxGUkXWZadd8lEJ3NmlktaAtifqFcMRVVGX/YJRqfTzrmC5EzSxSTV+inaVpttsHl1Gnk/BjPLQwhnJOdjNGyj2mcuYu6Gm4wyoKYyZE7yBONqo4Wkl31x3sUkA5pUd2SzxrVU/Qc0rp4AvE6SpABQTLjFWbNhwIfInZ+Jp/LBG/A/yj0b+XEm6HcAAAAASUVORK5CYII=";
        var sunIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA2RJREFUaEPtWv9tVjEMdCcBJgEmgU4CnQSYhDIJZRLoVc/S6Wonl3zfQyA1/7RS82yff1wcpzdx3noXEZ8O8d8i4usZqm7OEPpo7OuI+Cmy30TEw7X1nQXgM3k/bUYEbv8XAF8evf1RjH0BUEXvrBT6ZyIAJvnwmLu/DhZxi/AaAFBHryLiblT8owhcwiTfIwLgeaEGhsYcm5f0jgBUTAIdHR2iaBEtNVxT9z4ifjQRrYzH9wAOe56tHQBIo/cU1ipdXLbkqMB4yKocsAUAApEK+KkLICAUCruFPVkzKaOShe9xPoyi1x6CMxaCN2Bkp1iNh0fRNiBNqgV5SQyuTES7kxczADBiFIk0EgqgaGXNUg/RQ2Ra46HMATADUXkoT+G3hwNQtDCE0wpyuwjbDnEBQJmyUqWkok+NCr6DZ/lM0Wi0RavCXABKb1COwsoFT8L4lQUQ3GKje+W6sLpXF4B6n9PG8XoHjD2tOqwoOADU+5w6O55XMCMQ0yg4ANgznDrdqbmSRrmXDeVUmkbBAcApwgJnNLgCpIvClI1mANTLmfvX9L5GQdNymEYJoDsdYSgzQ+4/AwATA6dRdZBlK/MAg7quU1OA89/9ZiWNmFaVUjs5twDgbj4bAN+ZXWq+XwHABXXNAq76KRfAUwqhbxm1xamAI+B+s5JCzEQugDsuYhQy7qC8UKx8wUhGuMYBpuC4iH/TH7MJ1P1PbfuMRvER10inZMXT3d6O4YY2OgC6g8wNswOO66s7+Us5DgAVmPdh56LjGI89p7YSauio+XIN5n2nN3NQpgcXHzqXHGqjztaapToplN7iYtbRCmgVbwHuRR0ymRCq1sSyzdp0IFBP66RtNNfhlKmulEoI0zY6Ba4AqFgnmyp9fcnxCS712IPZKn4qp48u9Xpv3mYhx7Pu3JONmNGwpukWgJUTFwpzqNXNclAriArkuvVi3QcqdKOeP43FOLAzZGW0iJwfydoaLXb0qPdisM+KR9lZOtztZrFbw92uZa4mcVy0eovT6MJontRp81iB2AJQ5f9w0EqWVOAr+uxSV0FspRCE510ZvzuvK2nQpU9MiCI/kl80nd7pby4FYOtcOchsoccN7+Wd2PHY34yA3d84hu/0QityKwabDmpXFJwNAPLz2RW/n/bvNn8A7PAEvmBXy8UAAAAASUVORK5CYII=";
        JWThemeBtn.src = moonIconBase64;
        if (JWUserData.Theme === "light") {
            JWThemeBtn.src = sunIconBase64;
            JawonMenuStyle.innerHTML = JawonMenuStyle.innerHTML.replace("--color: #eee", "--color: #111");
            JawonMenuStyle.innerHTML = JawonMenuStyle.innerHTML.replace("--bgColor: #333", "--bgColor: #eee");
        }
        // 点击切换主题颜色
        JWThemeBtn.onclick = () => {
            if (JWUserData.Theme === "light") {
                JWUserData.Theme = "dark";
                JWThemeBtn.src = moonIconBase64;
                JawonMenuStyle.innerHTML = JawonMenuStyle.innerHTML.replace("--color: #111", "--color: #eee");
                JawonMenuStyle.innerHTML = JawonMenuStyle.innerHTML.replace("--bgColor: #eee", "--bgColor: #333");
            }
            else {
                JWUserData.Theme = "light";
                JWThemeBtn.src = sunIconBase64;
                JawonMenuStyle.innerHTML = JawonMenuStyle.innerHTML.replace("--color: #eee", "--color: #111");
                JawonMenuStyle.innerHTML = JawonMenuStyle.innerHTML.replace("--bgColor: #333", "--bgColor: #eee");
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        JawonTitle.appendChild(JWThemeBtn);

        // 点击 "\" 键显示或隐藏 Jawon 菜单
        document.addEventListener("keydown", event => {
            if (document.querySelector(".BattleChatComponentStyle-container>div")) return;
            if (event.key == "\\") {
                if (JawonMenu.style.display == "none") {
                    JawonMenu.style.display = "block";
                } else {
                    JawonMenu.style.display = "none";
                }
            }
            // 储存用户配置
            JWUserData.MenuDisplay = JawonMenu.style.display;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });

        // 主下拉菜单，用于选择当前显示的功能选项 -------------------------------
        var funcSelect = document.createElement('select');
        funcSelect.className = "funcSelect";
        funcSelect.onchange = function () {
            JWUserData.currFunctions = this.value;
            // 显示所选功能
            var mainFuncDivs = document.querySelectorAll("div.funcsDiv > div");
            mainFuncDivs.forEach(div => {
                if (div.className.includes(JWUserData.currFunctions)) div.style.cssText = "display: block;";
                else div.style.cssText = "display: none;";
            });
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        // 添加下拉菜单选项
        ["Physics", "Turret", "OtherTanks", "OtherFunctions"].forEach(function (_option) {
            var option = document.createElement('option');
            option.text = _option;
            option.value = _option;
            funcSelect.appendChild(option);
        });
        funcSelect.value = JWUserData.currFunctions;
        JawonMenu.appendChild(funcSelect);

        // 功能选项的容器
        var funcsDiv = document.createElement("div");
        funcsDiv.className = "funcsDiv";
        JawonMenu.appendChild(funcsDiv);

        // 坦克速度提升选项 ----------------------------------------------
        var HighSpeed = document.createElement("div");
        HighSpeed.innerText = "HighSpeed";
        HighSpeed.className = "JawonFunction Physics";
        var HighSpeedCB = document.createElement("div");
        HighSpeedCB.className = "JawonCheckBox";
        if (JWUserData.HighSpeed) {
            HighSpeedCB.style.backgroundColor = "dodgerblue";
        } else {
            HighSpeedCB.style.backgroundColor = "unset";
        }
        HighSpeed.onclick = () => {
            JWUserData.HighSpeed = !JWUserData.HighSpeed;
            if (JWUserData.HighSpeed) {
                HighSpeedCB.style.backgroundColor = "dodgerblue";
            } else {
                HighSpeedCB.style.backgroundColor = "unset";
                // 恢复坦克原始最大速度
                var temp1 = gameObjects?.localTank?.SpeedCharacteristicsComponent;
                if (JWOBJ.TankiState.oldMaxSpeed && temp1) {
                    var temp2 = temp1[Object.keys(temp1)[4]];
                    var temp3 = temp2[Object.keys(temp2)[3]];
                    temp3[Object.keys(temp3)[2]] = JWOBJ.TankiState.oldMaxSpeed;
                    temp3[Object.keys(temp3)[3]] = JWOBJ.TankiState.oldMaxSpeed;
                }
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        HighSpeed.appendChild(HighSpeedCB);
        funcsDiv.appendChild(HighSpeed);
        // 速度提升参数输入框
        var setHighSpd = document.createElement("div");
        setHighSpd.className = "setHighSpd";
        setHighSpd.title = "Use mouse wheel to change the value. If you want to use the keyboard, you need pause the game.";
        setHighSpd.addEventListener("click", event => {
            event.stopPropagation();
        });
        // 丝滑度输入框
        var setSmooth = document.createElement("div");
        setSmooth.innerHTML = JWUserData.smooth;
        setSmooth.contentEditable = "true";
        // 丝滑度输入框输入事件
        setSmooth.addEventListener("input", function (e) {
            JWUserData.smooth = Math.floor(Number(this.innerText));
            if (JWUserData.smooth) {
                if (JWUserData.smooth > 50) {
                    setSmooth.innerHTML = JWUserData.smooth = 50;
                }
                if (JWUserData.smooth < 1) {
                    setSmooth.innerHTML = JWUserData.smooth = 1;
                }
            } else {
                setSmooth.innerHTML = JWUserData.smooth = 1;
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        setSmooth.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0 && JWUserData.smooth < 50) {
                JWUserData.smooth++;
            } else if (event.deltaY > 0 && JWUserData.smooth > 1) {
                JWUserData.smooth--;
            }
            setSmooth.innerText = JWUserData.smooth;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        setHighSpd.appendChild(setSmooth);
        // 速度输入框
        var setSpeed = document.createElement("div");
        setSpeed.innerHTML = JWUserData.addSpeed;
        setSpeed.contentEditable = "true";
        // 速度输入框输入事件
        setSpeed.addEventListener("input", function (e) {
            JWUserData.addSpeed = Math.floor(Number(this.innerText));
            if (JWUserData.addSpeed) {
                if (JWUserData.addSpeed > 10000) {
                    setSpeed.innerHTML = JWUserData.addSpeed = 10000;
                }
                else if (JWUserData.addSpeed < -JWOBJ.TankiState.oldMaxSpeed) {
                    JWUserData.addSpeed = -JWOBJ.TankiState.oldMaxSpeed;
                    setSpeed.innerHTML = -JWOBJ.TankiState.oldMaxSpeed;
                }
            } else {
                JWUserData.addSpeed = 0;
                setSpeed.innerHTML = "0";
            }
            // 更新当前最大速度
            var temp1 = gameObjects?.localTank?.SpeedCharacteristicsComponent;
            if (JWUserData.HighSpeed && temp1) {
                var temp2 = temp1[Object.keys(temp1)[4]];
                var temp3 = temp2[Object.keys(temp2)[3]];
                var newMaxSpeed = JWOBJ.TankiState.oldMaxSpeed + JWUserData.addSpeed + JWOBJ.TankiState.propAddSpeed;
                temp3[Object.keys(temp3)[2]] = newMaxSpeed;
                temp3[Object.keys(temp3)[3]] = newMaxSpeed;
            }
            // 如果超过 MM 模式的爆炸速度临界点
            if (JWUserData.addSpeed > JWOBJ.TankiState.oldMaxSpeed * 0.2) {
                this.style.color = "red";
            } else {
                this.style.color = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        setSpeed.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0 && JWUserData.addSpeed + 10 <= 10000) {
                JWUserData.addSpeed += 10;
            } else if (event.deltaY > 0 && JWUserData.addSpeed - 10 >= -JWOBJ.TankiState.oldMaxSpeed) {
                JWUserData.addSpeed -= 10;
            }
            setSpeed.innerText = JWUserData.addSpeed;
            // 更新当前最大速度
            var temp1 = gameObjects?.localTank?.SpeedCharacteristicsComponent;
            if (JWUserData.HighSpeed && temp1) {
                var temp2 = temp1[Object.keys(temp1)[4]];
                var temp3 = temp2[Object.keys(temp2)[3]];
                var newMaxSpeed = JWOBJ.TankiState.oldMaxSpeed + JWUserData.addSpeed + JWOBJ.TankiState.propAddSpeed;
                temp3[Object.keys(temp3)[2]] = newMaxSpeed;
                temp3[Object.keys(temp3)[3]] = newMaxSpeed;
            }
            // 如果超过 MM 模式的爆炸速度临界点
            if (JWUserData.addSpeed > JWOBJ.TankiState.oldMaxSpeed * 0.2) {
                this.style.color = "red";
            } else {
                this.style.color = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        setHighSpd.appendChild(setSpeed);
        HighSpeed.appendChild(setHighSpd);

        // 跳跃选项 ----------------------------------------------
        var Jump = document.createElement("div");
        Jump.innerText = "Jump";
        Jump.className = "JawonFunction Physics";
        var JumpCB = document.createElement("div");
        JumpCB.className = "JawonCheckBox";
        if (JWUserData.Jump) {
            JumpCB.style.backgroundColor = "dodgerblue";
        } else {
            JumpCB.style.backgroundColor = "unset";
        }
        Jump.onclick = () => {
            JWUserData.Jump = !JWUserData.Jump;
            if (JWUserData.Jump) {
                JumpCB.style.backgroundColor = "dodgerblue";
            } else {
                JumpCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        // 跳跃速度调整框
        var JPSpeedDiv = document.createElement("div");
        JPSpeedDiv.className = "JPSpeedDiv";
        JPSpeedDiv.innerHTML = "speed: ";
        JPSpeedDiv.addEventListener("click", event => {
            event.stopPropagation();
        });
        var JPSpeedValueDiv = document.createElement("div");
        JPSpeedValueDiv.innerHTML = JWUserData.JumpSpeed;
        JPSpeedValueDiv.contentEditable = "true";
        JPSpeedValueDiv.addEventListener("click", event => {
            event.stopPropagation();
        });
        // 跳跃速度输入框输入事件
        JPSpeedValueDiv.addEventListener("input", function (e) {
            JWUserData.JumpSpeed = Math.floor(Number(this.innerText));
            if (JWUserData.JumpSpeed) {
                if (JWUserData.JumpSpeed >= 1000) {
                    JPSpeedValueDiv.innerHTML = JWUserData.JumpSpeed = 1000;
                }
                if (JWUserData.JumpSpeed <= 0) {
                    JWUserData.JumpSpeed = 0;
                    JPSpeedValueDiv.innerHTML = "";
                }
            } else {
                JWUserData.JumpSpeed = 0;
                JPSpeedValueDiv.innerHTML = "";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        JPSpeedValueDiv.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0 && JWUserData.JumpSpeed < 1000) {
                JWUserData.JumpSpeed++;
            } else if (event.deltaY > 0 && JWUserData.JumpSpeed > 0) {
                JWUserData.JumpSpeed--;
            }
            JPSpeedValueDiv.innerText = JWUserData.JumpSpeed;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 跳跃对齐选项
        var JumpAlign = document.createElement("div");
        JumpAlign.innerText = "Align";
        JumpAlign.className = "JawonFunction";
        JumpAlign.title = "Align your tanki when jump.";
        var JumpAlignCB = document.createElement("div");
        JumpAlignCB.className = "JawonCheckBox";
        if (JWUserData.JumpAlign) {
            JumpAlignCB.style.backgroundColor = "dodgerblue";
        } else {
            JumpAlignCB.style.backgroundColor = "unset";
        }
        JumpAlign.onclick = () => {
            JWUserData.JumpAlign = !JWUserData.JumpAlign;
            if (JWUserData.JumpAlign) {
                JumpAlignCB.style.backgroundColor = "dodgerblue";
            } else {
                JumpAlignCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        JPSpeedDiv.appendChild(JPSpeedValueDiv);
        JPSpeedDiv.appendChild(JumpAlign);
        JumpAlign.appendChild(JumpAlignCB);
        Jump.appendChild(JumpCB);
        Jump.appendChild(JPSpeedDiv);
        funcsDiv.appendChild(Jump);
        var NoKnockback = document.createElement("div");
        NoKnockback.innerText = "NoKnockback";
        NoKnockback.className = "JawonFunction Physics";
        var NoKnockbackCB = document.createElement("div");
        NoKnockbackCB.className = "JawonCheckBox";
        if (JWUserData.NoKnockback) {
            NoKnockbackCB.style.backgroundColor = "dodgerblue";
        } else {
            NoKnockbackCB.style.backgroundColor = "unset";
        }
        NoKnockback.initItv = setInterval(() => {
            if (!getComponentNames(gameObjects?.localTank?.TankPhysicsComponent)?.Body) return;
            var temp1 = getComponentNames(gameObjects.localTank.TankPhysicsComponent).Body.__proto__;
            if (!NoKnockback.wordForce) {
                NoKnockback._wordForce = temp1[Object.keys(temp1)[10]];
                NoKnockback.wordForce = function () {
                    var keys = Object.keys(arguments[1]);
                    var arg1 = {
                        [keys[0]]: 0,
                        [keys[1]]: 0,
                        [keys[2]]: (arguments[1][keys[2]] > 0 ? 0 : arguments[1][keys[2]])
                    };
                    arguments[1] = arg1;
                    NoKnockback._wordForce.apply(this, arguments);
                };
                if (JWUserData.NoKnockback) {
                    temp1[Object.keys(temp1)[10]] = NoKnockback.wordForce;
                } else {
                    temp1[Object.keys(temp1)[10]] = NoKnockback._wordForce;
                }
                clearInterval(NoKnockback.initItv);
            }
        }, 100);
        NoKnockback.onclick = () => {
            JWUserData.NoKnockback = !JWUserData.NoKnockback;
            if (JWUserData.NoKnockback) {
                var temp1 = getComponentNames(gameObjects?.localTank?.TankPhysicsComponent)?.Body?.__proto__;
                if (temp1 && NoKnockback.wordForce) {
                    temp1[Object.keys(temp1)[10]] = NoKnockback.wordForce;
                }
                NoKnockbackCB.style.backgroundColor = "dodgerblue";
            } else {
                var temp1 = getComponentNames(gameObjects?.localTank?.TankPhysicsComponent)?.Body?.__proto__;
                if (temp1 && NoKnockback._wordForce) {
                    temp1[Object.keys(temp1)[10]] = NoKnockback._wordForce;
                }
                NoKnockbackCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        NoKnockback.appendChild(NoKnockbackCB);
        funcsDiv.appendChild(NoKnockback);
        var NeverFlip = document.createElement("div");
        NeverFlip.innerText = "NeverFlip";
        NeverFlip.title = "Your tank will never capsize.";
        NeverFlip.className = "JawonFunction Physics";
        var NeverFlipCB = document.createElement("div");
        NeverFlipCB.className = "JawonCheckBox";
        if (JWUserData.NeverFlip) {
            NeverFlipCB.style.backgroundColor = "dodgerblue";
        } else {
            NeverFlipCB.style.backgroundColor = "unset";
        }
        NeverFlip.onclick = () => {
            JWUserData.NeverFlip = !JWUserData.NeverFlip;
            if (JWUserData.NeverFlip) {
                NeverFlipCB.style.backgroundColor = "dodgerblue";
            } else {
                NeverFlipCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        NeverFlip.appendChild(NeverFlipCB);
        funcsDiv.appendChild(NeverFlip);

        // 避开地雷选项 ----------------------------------------------
        var AvoidMines = document.createElement("div");
        AvoidMines.className = "JawonFunction AvoidMines Physics";
        AvoidMines.innerText = "AvoidMinesHeight ";
        AvoidMines.title = "Set a height to avoid mines, enemies will find you drifting on the ground.";
        var AvoidMinesH = document.createElement("div");
        AvoidMinesH.contentEditable = "true";
        AvoidMinesH.innerHTML = JWUserData.AvoidMines;
        // 避雷输入框输入事件
        AvoidMinesH.addEventListener("input", function (e) {
            JWUserData.AvoidMines = Math.floor(Number(this.innerText));
            if (JWUserData.AvoidMines) {
                if (JWUserData.AvoidMines >= 200) {
                    AvoidMinesH.innerHTML = JWUserData.AvoidMines = 200;
                }
                if (JWUserData.AvoidMines <= 0) {
                    JWUserData.AvoidMines = 0;
                    AvoidMinesH.innerHTML = "";
                }
            } else {
                JWUserData.AvoidMines = 0;
                AvoidMinesH.innerHTML = "";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        AvoidMinesH.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0 && JWUserData.AvoidMines < 200) {
                JWUserData.AvoidMines++;
            } else if (event.deltaY > 0 && JWUserData.AvoidMines > 0) {
                JWUserData.AvoidMines--;
            }
            AvoidMinesH.innerText = JWUserData.AvoidMines;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        AvoidMines.appendChild(AvoidMinesH);
        funcsDiv.appendChild(AvoidMines);

        // 重力调整选项 ----------------------------------------------
        var Gravity = document.createElement("div");
        Gravity.className = "JawonFunction Gravity Physics";
        Gravity.innerText = "Gravity: ";
        var GravityValue = document.createElement("div");
        GravityValue.contentEditable = "true";
        GravityValue.innerHTML = JWUserData.Gravity;
        // 重力输入框输入事件
        GravityValue.addEventListener("input", function (e) {
            JWUserData.Gravity = Math.floor(Number(this.innerText));
            if (JWUserData.Gravity) {
                if (JWUserData.Gravity > 1000) {
                    GravityValue.innerHTML = JWUserData.Gravity = 1000;
                }
                if (JWUserData.Gravity < -1000) {
                    GravityValue.innerHTML = JWUserData.Gravity = -1000;
                }
            } else {
                GravityValue.innerHTML = JWUserData.Gravity = 100;
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        GravityValue.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0 && JWUserData.Gravity + 10 <= 1000) {
                JWUserData.Gravity += 10;
            } else if (event.deltaY > 0 && JWUserData.Gravity - 10 >= -1000) {
                JWUserData.Gravity -= 10;
            }
            GravityValue.innerText = JWUserData.Gravity;
            var tempe1 = gameObjects?.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body];
            if (tempe1) {
                var tempe2 = tempe1[Object.keys(tempe1)[1]];
                tempe2 && (tempe2[Object.keys(tempe2)[0]] = JWUserData.Gravity / 100);
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        Gravity.appendChild(GravityValue);
        funcsDiv.appendChild(Gravity);

        // 显示敌人昵称选项 ----------------------------------------------
        var TankNameAlpha = document.createElement("div");
        var TankNameAlphaText = document.createElement("span");
        TankNameAlphaText.innerText = "TankNameAlpha";
        TankNameAlpha.appendChild(TankNameAlphaText);
        TankNameAlpha.className = "JawonFunction TankNameAlpha OtherTanks";
        TankNameAlpha.title = "Set transparency for the names of other tanks.";
        // 敌人名字透明度输入框
        var EnemyAlpha = document.createElement("div");
        EnemyAlpha.contentEditable = "true";
        EnemyAlpha.innerHTML = JWUserData.EnemyAlpha;
        // 输入框输入事件
        EnemyAlpha.addEventListener("input", function () {
            JWUserData.EnemyAlpha = Number(this.innerText);
            if (JWUserData.EnemyAlpha) {
                if (JWUserData.EnemyAlpha > 1) {
                    EnemyAlpha.innerHTML = JWUserData.EnemyAlpha = 1;
                }
                if (JWUserData.EnemyAlpha < 0) {
                    EnemyAlpha.innerHTML = JWUserData.EnemyAlpha = 0;
                }
            } else {
                JWUserData.EnemyAlpha = 0.8;
                if (EnemyAlpha.innerHTML.length > 5) EnemyAlpha.innerHTML = 0.8;
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 队友名字透明度输入框
        var TeamAlpha = document.createElement("div");
        TeamAlpha.contentEditable = "true";
        TeamAlpha.innerHTML = JWUserData.TeamAlpha;
        // 输入框输入事件
        TeamAlpha.addEventListener("input", function () {
            JWUserData.TeamAlpha = Number(this.innerText);
            if (JWUserData.TeamAlpha) {
                if (JWUserData.TeamAlpha > 1) {
                    TeamAlpha.innerHTML = JWUserData.TeamAlpha = 1;
                }
                if (JWUserData.TeamAlpha < 0) {
                    TeamAlpha.innerHTML = JWUserData.TeamAlpha = 0;
                }
            } else {
                JWUserData.TeamAlpha = 0.35;
                if (TeamAlpha.innerHTML.length > 5) TeamAlpha.innerHTML = 0.35;
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        TankNameAlpha.appendChild(EnemyAlpha);
        TankNameAlpha.appendChild(TeamAlpha);
        funcsDiv.appendChild(TankNameAlpha);

        // 显示敌人轮廓选项 ----------------------------------------------
        var ShowEnemyOutline = document.createElement("div");
        ShowEnemyOutline.innerText = "ShowEnemyOutline";
        ShowEnemyOutline.className = "JawonFunction OtherTanks";
        var ShowEnemyOutlineCB = document.createElement("div");
        ShowEnemyOutlineCB.className = "JawonCheckBox";
        if (JWUserData.ShowEnemyOutline) {
            ShowEnemyOutlineCB.style.backgroundColor = "dodgerblue";
        } else {
            ShowEnemyOutlineCB.style.backgroundColor = "unset";
        }
        ShowEnemyOutline.onclick = () => {
            JWUserData.ShowEnemyOutline = !JWUserData.ShowEnemyOutline;
            if (JWUserData.ShowEnemyOutline) {
                ShowEnemyOutlineCB.style.backgroundColor = "dodgerblue";
            } else {
                ShowEnemyOutlineCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        ShowEnemyOutline.appendChild(ShowEnemyOutlineCB);
        funcsDiv.appendChild(ShowEnemyOutline);

        // 显示队友轮廓选项 ----------------------------------------------
        var ShowTeamOutline = document.createElement("div");
        ShowTeamOutline.innerText = "ShowTeamOutline";
        ShowTeamOutline.className = "JawonFunction OtherTanks";
        var ShowTeamOutlineCB = document.createElement("div");
        ShowTeamOutlineCB.className = "JawonCheckBox";
        if (JWUserData.ShowTeamOutline) {
            ShowTeamOutlineCB.style.backgroundColor = "dodgerblue";
        } else {
            ShowTeamOutlineCB.style.backgroundColor = "unset";
        }
        ShowTeamOutline.onclick = () => {
            JWUserData.ShowTeamOutline = !JWUserData.ShowTeamOutline;
            if (JWUserData.ShowTeamOutline) {
                ShowTeamOutlineCB.style.backgroundColor = "dodgerblue";
            } else {
                ShowTeamOutlineCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        ShowTeamOutline.appendChild(ShowTeamOutlineCB);
        funcsDiv.appendChild(ShowTeamOutline);

        // 队友消失选项 ----------------------------------------------
        var NoTeammate = document.createElement("div");
        NoTeammate.innerText = "NoTeammate";
        NoTeammate.className = "JawonFunction OtherTanks";
        NoTeammate.title = "Don't display teammate.";
        var NoTeammateCB = document.createElement("div");
        NoTeammateCB.className = "JawonCheckBox";
        if (JWUserData.NoTeammate) {
            NoTeammateCB.style.backgroundColor = "dodgerblue";
        } else {
            NoTeammateCB.style.backgroundColor = "unset";
        }
        NoTeammate.onclick = () => {
            JWUserData.NoTeammate = !JWUserData.NoTeammate;
            if (JWUserData.NoTeammate) {
                NoTeammateCB.style.backgroundColor = "dodgerblue";
            } else {
                NoTeammateCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        NoTeammate.appendChild(NoTeammateCB);
        funcsDiv.appendChild(NoTeammate);

        // 敌人消失选项 ----------------------------------------------
        var NoEnemys = document.createElement("div");
        NoEnemys.innerText = "NoEnemys";
        NoEnemys.className = "JawonFunction OtherTanks";
        NoEnemys.title = "Don't display enemys.";
        var NoEnemysCB = document.createElement("div");
        NoEnemysCB.className = "JawonCheckBox";
        if (JWUserData.NoEnemys) {
            NoEnemysCB.style.backgroundColor = "dodgerblue";
        } else {
            NoEnemysCB.style.backgroundColor = "unset";
        }
        NoEnemys.onclick = () => {
            JWUserData.NoEnemys = !JWUserData.NoEnemys;
            if (JWUserData.NoEnemys) {
                NoEnemysCB.style.backgroundColor = "dodgerblue";
            } else {
                NoEnemysCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        NoEnemys.appendChild(NoEnemysCB);
        funcsDiv.appendChild(NoEnemys);

        // 击杀人机选项 ----------------------------------------------
        var KillRobots = document.createElement("div");
        KillRobots.innerText = "KillRobots";
        KillRobots.className = "JawonFunction OtherTanks";
        KillRobots.title = "Fix an enemy in sky and press nextTarget to switch enemy.";
        var KillRobotsCB = document.createElement("div");
        KillRobotsCB.className = "JawonCheckBox";
        if (JWUserData.KillRobots) {
            KillRobotsCB.style.backgroundColor = "dodgerblue";
        } else {
            KillRobotsCB.style.backgroundColor = "unset";
        }
        KillRobots.onclick = () => {
            JWUserData.KillRobots = !JWUserData.KillRobots;
            if (JWUserData.KillRobots) {
                KillRobotsCB.style.backgroundColor = "dodgerblue";
            } else {
                KillRobotsCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        KillRobots.appendChild(KillRobotsCB);
        funcsDiv.appendChild(KillRobots);

        // 扩展功能选项 ----------------------------------------------
        var Addtions = document.createElement("div");
        Addtions.innerText = "Addtions";
        Addtions.className = "JawonFunction OtherFunctions";
        Addtions.title = "This function will help you to click some buttons automatically.";
        var AddtionsCB = document.createElement("div");
        AddtionsCB.className = "JawonCheckBox";
        if (JWUserData.Addtions) {
            AddtionsCB.style.backgroundColor = "dodgerblue";
        } else {
            AddtionsCB.style.backgroundColor = "unset";
        }
        Addtions.onclick = () => {
            JWUserData.Addtions = !JWUserData.Addtions;
            if (JWUserData.Addtions) {
                AddtionsCB.style.backgroundColor = "dodgerblue";
            } else {
                AddtionsCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        Addtions.appendChild(AddtionsCB);
        funcsDiv.appendChild(Addtions);

        // 坦克黑色主题选项 ----------------------------------------------
        var TankDarkTheme = document.createElement("div");
        TankDarkTheme.innerText = "TankDarkTheme";
        TankDarkTheme.className = "JawonFunction OtherFunctions";
        var TankDarkThemeCB = document.createElement("div");
        TankDarkThemeCB.className = "JawonCheckBox";
        var tankDarkThemeStyle = document.createElement("style");
        document.body.appendChild(tankDarkThemeStyle);
        var setDarkStyleItv = setInterval(() => {
            if (tankDarkThemeCSS === undefined) {
                return;
            } else {
                if (JWUserData.TankDarkTheme) {
                    TankDarkThemeCB.style.backgroundColor = "dodgerblue";
                    tankDarkThemeStyle.innerHTML = tankDarkThemeCSS;
                } else {
                    TankDarkThemeCB.style.backgroundColor = "unset";
                }
                clearInterval(setDarkStyleItv);
            }
        }, 100);
        TankDarkTheme.onclick = () => {
            JWUserData.TankDarkTheme = !JWUserData.TankDarkTheme;
            if (JWUserData.TankDarkTheme) {
                TankDarkThemeCB.style.backgroundColor = "dodgerblue";
                tankDarkThemeStyle.innerHTML = tankDarkThemeCSS;
            } else {
                TankDarkThemeCB.style.backgroundColor = "unset";
                tankDarkThemeStyle.innerHTML = "";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        TankDarkTheme.appendChild(TankDarkThemeCB);
        funcsDiv.appendChild(TankDarkTheme);

        // 无CD(无限子弹)功能选项 ----------------------------------------------
        var NoReload = document.createElement("div");
        NoReload.innerText = "NoReload";
        NoReload.className = "JawonFunction Turret";
        var NoReloadCB = document.createElement("div");
        NoReloadCB.className = "JawonCheckBox";
        if (JWUserData.NoReload) {
            NoReloadCB.style.backgroundColor = "dodgerblue";
        } else {
            NoReloadCB.style.backgroundColor = "unset";
        }
        NoReload.onclick = () => {
            JWUserData.NoReload = !JWUserData.NoReload;
            if (JWUserData.NoReload) {
                NoReloadCB.style.backgroundColor = "dodgerblue";
            } else {
                NoReloadCB.style.backgroundColor = "unset";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        NoReload.appendChild(NoReloadCB);
        funcsDiv.appendChild(NoReload);
        var RocketTeleport = document.createElement("div");
        RocketTeleport.className = "JawonFunction RocketTeleport Turret";
        var RocketTeleportText = document.createElement("span");
        RocketTeleportText.innerText = "RocketTeleport";
        RocketTeleport.appendChild(RocketTeleportText);
        var BulletTPHeight = document.createElement("div");
        BulletTPHeight.innerHTML = JWUserData.BulletTPHeight;
        BulletTPHeight.contentEditable = "true";
        BulletTPHeight.addEventListener("input", function (e) {
            JWUserData.BulletTPHeight = Math.floor(Number(this.innerText));
            if (Math.abs(JWUserData.BulletTPHeight) > 20000) {
                BulletTPHeight.innerHTML = JWUserData.BulletTPHeight = 2000;
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        BulletTPHeight.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0) {
                JWUserData.BulletTPHeight += 100;
            } else {
                JWUserData.BulletTPHeight -= 100;
            }
            if (Math.abs(JWUserData.BulletTPHeight) > 20000) {
                BulletTPHeight.innerHTML = JWUserData.BulletTPHeight = 2000;
            }
            BulletTPHeight.innerText = JWUserData.BulletTPHeight;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        RocketTeleport.appendChild(BulletTPHeight);
        funcsDiv.appendChild(RocketTeleport);
        var rktModeSelect = document.createElement('select');
        rktModeSelect.onchange = function () {
            JWUserData.RocketMode = this.value;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        ["1", "2", "3", "-"].forEach(function (mode) {
            var option = document.createElement('option');
            option.text = mode;
            option.value = mode;
            rktModeSelect.appendChild(option);
        });
        rktModeSelect.value = JWUserData.RocketMode;
        RocketTeleport.appendChild(rktModeSelect);

        // 选择敌人目标选项 ----------------------------------------------
        // 显示敌人目标列表的按钮
        var setEnemyTarget = document.createElement("div");
        setEnemyTarget.innerText = "target";
        setEnemyTarget.className = "JawonFunction SetStrikerTargetBtn";
        RocketTeleport.appendChild(setEnemyTarget);

        // 敌人名字列表弹窗
        var enemyListWindow = document.createElement("div");
        enemyListWindow.id = "enemyListWindow";
        enemyListWindow.style.display = "none";
        var cutOffLine = document.createElement("span");
        cutOffLine.className = "cutOffLine";
        cutOffLine.innerHTML = "> - - - - - - - - - - - <";
        cutOffLine.style.cssText = "display: block; margin: 6px; padding-bottom: 5px;";
        cutOffLine.addEventListener('click', function (event) {
            // 显示或隐藏队友列表
            var teamNickDivs = document.querySelectorAll("#enemyListWindow > div.team");
            if (teamNickDivs.length > 0) {
                if (teamNickDivs[0].style.display !== "none") {
                    teamNickDivs.forEach(nickDiv => {
                        nickDiv.style.display = "none";
                    });
                } else {
                    teamNickDivs.forEach(nickDiv => {
                        nickDiv.style.display = "block";
                    });
                }
            }
        });
        enemyListWindow.appendChild(cutOffLine);
        // 双击按键 "\" 显示或隐藏弹窗
        document.addEventListener('keydown', function (event) {
            if (document.querySelector(".BattleChatComponentStyle-container>div")) return;
            if (event.key === "\\") {
                var currentTime = new Date();
                if (currentTime - enemyListWindow.lastKeypressTime < 300) {
                    if (enemyListWindow.style.display === 'none') {
                        enemyListWindow.style.display = 'block';
                    } else {
                        enemyListWindow.style.display = 'none';
                    }
                }
                enemyListWindow.lastKeypressTime = currentTime;
            }
            // 按删除键删除所选目标
            if (event.key === 'Backspace') {
                var JWMenu = document.querySelector(".JawonMenu");
                if (JWMenu && JWMenu.style.display === "none") {
                    var nickDivs = document.querySelectorAll("#enemyListWindow > div");
                    nickDivs.forEach(nickDiv => {
                        nickDiv && (nickDiv.style.background = "unset");
                    });
                }
                // 恢复火箭目标为最近的坦克
                JWOBJ.targetDistance = 0;
            }
        });
        // 点击显示名字列表弹窗
        setEnemyTarget.onclick = () => {
            if (enemyListWindow.style.display === "none") {
                enemyListWindow.style.display = "block";
            } else {
                enemyListWindow.style.display = "none";
            }
        };
        document.body.appendChild(enemyListWindow);
        // 更新名字列表循环
        setInterval(() => {
            // 如果不在战场，删除所有名字
            if (!JWOBJ.isInMap) {
                var tgtWD = document.querySelector("#enemyListWindow");
                if (tgtWD) {
                    var nickDivs = tgtWD.querySelectorAll("div");
                    nickDivs.forEach(nickDiv => {
                        nickDiv.remove();
                    });
                    tgtWD.style.display = "none";
                    enemyListWindow.autoShowed = false;
                }
                return;
            }
            // 获取弹窗内已存在的名称 -----
            var oldNicks = [];
            var nickDivs = document.querySelectorAll("#enemyListWindow > div");
            nickDivs.forEach(nickDiv => {
                oldNicks.push(nickDiv.innerText);
            });

            // 删除不存在的旧名字
            var players = getPlayers();
            if (players.length > 0) {
                var nicksStr = "";
                players.forEach(player => {
                    var nick = getTankNick(player);
                    if (nick) nicksStr += nick;
                });
                nickDivs.forEach(nickDiv => {
                    if (!nicksStr.includes(nickDiv.innerHTML)) {
                        nickDiv.remove();
                    }
                });
            } else {
                nickDivs.forEach(nickDiv => {
                    nickDiv.remove();
                });
            }

            // 添加新出现的名字 -----------------
            JWOBJ.enemyTanks.forEach(enemyTank => {
                var enemyNick = getTankNick(enemyTank);
                // 如果这个名字不在列表中就添加进去
                if (enemyNick && !oldNicks.includes(enemyNick)) {
                    var nickDiv = document.createElement("div");
                    nickDiv.innerHTML = enemyNick;
                    nickDiv.className = "enemy";
                    nickDiv.onclick = function () {
                        if (this.style.background === "dodgerblue") {
                            this.style.background = "unset";
                        } else {
                            var nickDivs = document.querySelectorAll("#enemyListWindow > div");
                            nickDivs.forEach(nickDiv => {
                                nickDiv.style.background = "unset";
                            });
                            this.style.background = "dodgerblue";
                        }
                    };
                    // 在分割线前插入敌方名字
                    enemyListWindow.insertBefore(nickDiv, cutOffLine);
                }
            });
            JWOBJ.teamTanks.forEach(teamTank => {
                var teamNick = getTankNick(teamTank);
                // 如果这个名字不在列表中就添加进去
                if (teamNick && !oldNicks.includes(teamNick)) {
                    var nickDiv = document.createElement("div");
                    nickDiv.innerHTML = teamNick;
                    nickDiv.className = "team";
                    nickDiv.onclick = function () {
                        if (this.style.background === "dodgerblue") {
                            this.style.background = "unset";
                        } else {
                            var nickDivs = document.querySelectorAll("#enemyListWindow > div");
                            nickDivs.forEach(nickDiv => {
                                nickDiv.style.background = "unset";
                            });
                            this.style.background = "dodgerblue";
                        }
                    };
                    enemyListWindow.appendChild(nickDiv);
                }
            });

            // 设置当前目标------------------
            // 在敌人列表中寻找选中的对象
            var newTarget = undefined;
            var nickDivs = document.querySelectorAll("#enemyListWindow > div");
            for (let i = 0; i < nickDivs.length; i++) {
                // 如果找到选中的div
                if (nickDivs[i].style.background === "dodgerblue") {
                    // 在当前敌人中找这个名字
                    for (let j = 0; j < JWOBJ.enemyTanks.length; j++) {
                        var nick = JWOBJ.enemyTanks[j].UserTitleComponent?.[
                            userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                        if (nick === nickDivs[i].innerHTML) {
                            newTarget = JWOBJ.enemyTanks[j];
                            break;
                        }
                    }
                    // 在当前队友中找这个名字
                    if (!newTarget) {
                        for (let j = 0; j < JWOBJ.teamTanks.length; j++) {
                            var nick = JWOBJ.teamTanks[j].UserTitleComponent?.[
                                userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                            if (nick === nickDivs[i].innerHTML) {
                                newTarget = JWOBJ.teamTanks[j];
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            // 如果找到选中的敌人
            if (newTarget !== undefined) {
                JWOBJ.currTarget = newTarget;
                JWOBJ.currTarget.selected = true;
            }
            // 如果未选择敌人，则自动选一个距离最近的敌人
            else if (newTarget === undefined && JWOBJ.enemyTanks.length > 1) {
                var distants = [];
                JWOBJ.enemyTanks.forEach(enemyTank => {
                    var pos = enemyTank.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position];
                    var deltaX = Math.floor(JWOBJ.TankiPos[vector3.x] - pos[vector3.x]);
                    var deltaY = Math.floor(JWOBJ.TankiPos[vector3.y] - pos[vector3.y]);
                    var deltaZ = Math.floor(JWOBJ.TankiPos[vector3.z] - pos[vector3.z]);
                    var distc_pow2 = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
                    distants.push({
                        tank: enemyTank,
                        distc: distc_pow2
                    });
                });
                distants.sort(function (a, b) {
                    return a.distc - b.distc;
                });
                // 找出距离符合距离要求的坦克
                if (JWOBJ.targetDistance > distants.length - 1) {
                    JWOBJ.targetDistance = distants.length - 1;
                }
                var minDistTank = distants[JWOBJ.targetDistance].tank;
                if (minDistTank) {
                    JWOBJ.currTarget = minDistTank;
                    var tankNick = minDistTank.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                    // 找出列表中这个坦克昵称
                    for (let i = 0; i < nickDivs.length; i++) {
                        // 如果找到
                        if (nickDivs[i].innerHTML === tankNick) {
                            // 先清除所有颜色
                            nickDivs.forEach(nickDiv => {
                                nickDiv.style.color = "#fff";
                            });
                            // 将此昵称标位红色
                            nickDivs[i].style.color = "red";
                            break;
                        }
                    }
                }
                JWOBJ.currTarget.selected = false;
            }
            else if (JWOBJ.enemyTanks.length === 1) {
                JWOBJ.currTarget = JWOBJ.enemyTanks[0];
                JWOBJ.currTarget.selected = false;
            }
            if (currBulletNumInAir !== undefined) {
                var bulletNumstyle = document.querySelector("#currBulletNumStyle");
                if (bulletNumstyle) {
                    var str = bulletNumstyle.innerHTML.replace(/BulletNum: \d+/, 'BulletNum: ' + currBulletNumInAir);
                    bulletNumstyle.innerHTML = str;
                }
            }
        }, 100);
        var bulletTeleport = document.createElement("div");
        var bulletTeleportText = document.createElement("span");
        bulletTeleportText.innerText = "BulletTeleport";
        bulletTeleport.appendChild(bulletTeleportText);
        bulletTeleport.className = "JawonFunction bulletTeleport Turret";
        bulletTeleport.title = "Teleport bullet for all guns, except for Striker, Scorpio, and magnum. when set value to 1, it will be an AimBot";
        var bulletTPNum = document.createElement("div");
        bulletTPNum.contentEditable = "true";
        bulletTPNum.innerHTML = JWUserData.bulletTPNum;
        bulletTPNum.addEventListener("input", function () {
            JWUserData.bulletTPNum = Number(this.innerText);
            if (JWUserData.bulletTPNum) {
                if (JWUserData.bulletTPNum > 5000) {
                    bulletTPNum.innerHTML = JWUserData.bulletTPNum = 5000;
                }
                if (JWUserData.bulletTPNum < 1) {
                    bulletTPNum.innerHTML = JWUserData.bulletTPNum = 1;
                }
            } else {
                bulletTPNum.innerHTML = JWUserData.bulletTPNum = 1;
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        // 鼠标滚轮调整事件
        bulletTPNum.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止默认的滚动行为
            // 根据滚轮的方向增加或减少数值
            if (event.deltaY < 0 && JWUserData.bulletTPNum < 5000) {
                JWUserData.bulletTPNum++;
            } else if (event.deltaY > 0 && JWUserData.bulletTPNum > 1) {
                JWUserData.bulletTPNum--;
            }
            bulletTPNum.innerHTML = JWUserData.bulletTPNum;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        bulletTeleport.appendChild(bulletTPNum);
        var bulletWriteInput = document.createElement("div");
        bulletWriteInput.contentEditable = "true";
        bulletWriteInput.innerText = JWUserData.writeLetter;
        bulletWriteInput.addEventListener("input", function () {
            JWUserData.writeLetter = this.innerText;
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        });
        bulletTeleport.appendChild(bulletWriteInput);
        funcsDiv.appendChild(bulletTeleport);

        // 只显示当前所选功能
        var mainFuncDivs = document.querySelectorAll("div.funcsDiv > div");
        mainFuncDivs.forEach(div => {
            if (div.className.includes(JWUserData.currFunctions)) div.style.cssText = "display: block;";
            else div.style.cssText = "display: none;";
        });

        // 按键绑定 ----------------------------------------------------
        var keysDiv = document.createElement("div");
        JawonMenu.appendChild(keysDiv);
        keysDiv.className = "keysDiv";
        var BindedKeysTitle = document.createElement("div");
        BindedKeysTitle.className = "BindedKeysTitle";
        BindedKeysTitle.innerText = "BindedKeys";
        if (JWUserData.ShowKeys) {
            keysDiv.style.maxHeight = "33vh";
            funcsDiv.style.cssText = "";
        } else {
            keysDiv.style.maxHeight = "2rem";
            funcsDiv.style.cssText = "max-height: unset;";
        }
        BindedKeysTitle.onclick = () => {
            JWUserData.ShowKeys = !JWUserData.ShowKeys;
            if (JWUserData.ShowKeys) {
                keysDiv.style.maxHeight = "33vh";
                funcsDiv.style.cssText = "";
            } else {
                keysDiv.style.maxHeight = "2rem";
                funcsDiv.style.cssText = "max-height: unset;";
            }
            localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
        };
        keysDiv.appendChild(BindedKeysTitle);
        var keyNames = Object.keys(JWUserData.Keys);
        for (let i = 0; i < keyNames.length; i++) {
            // 个人觉得这部分功能很妙
            var keyDiv = document.createElement("div");
            keyDiv.innerHTML = keyNames[i] + " : " + JWUserData.Keys[keyNames[i]];
            keyDiv.className = "keyDiv";
            keyDiv.onclick = function () {
                this.style.background = "dodgerblue";
                this.selected = true;
            };
            keysDiv.appendChild(keyDiv);
        }
        document.addEventListener("keydown", event => {
            if (JWUserData.MenuDisplay == "none") {
                return;
            }
            var keyDivs = document.querySelectorAll(".keyDiv");
            for (let i = 0; i < keyDivs.length; i++) {
                if (keyDivs[i].selected) {
                    keyDivs[i].style.background = "";
                    keyDivs[i].selected = false;
                    var values = keyDivs[i].innerHTML.split(" : ");
                    var key = event.key.toUpperCase();
                    if (key !== 'BACKSPACE') {
                        keyDivs[i].innerHTML = values[0] + " : " + key;
                        JWUserData.Keys[values[0]] = event.key.toUpperCase();
                    } else {
                        keyDivs[i].innerHTML = values[0] + " : ";
                        JWUserData.Keys[values[0]] = "";
                    }
                    localStorage.setItem("JawonStorage", JSON.stringify(JWUserData));
                    break;
                }
            }
        });
    })();
    // 界面生成结束 ------------------------------------------------------------------

    // Jawon 的功能实现 ----------------
    var JWOBJ = {
        isInMap: false,
        isFling: false,
        isStick: false,
        flyType: "",
        TankiPos: undefined,
        TankiVel: undefined,
        TankiAngVel: undefined,
        TankiDirect: undefined,
        Movable: undefined,
        TankISPos: undefined,
        TankiState: {
            PosX: 0,
            PosY: 0,
            PosZ: 0,
            RunAgl: 0,
            nextInertia: "",
            stopFlag: false,
            lastCam: undefined,
            health: undefined,
            currTurret: "",
            oldMaxSpeed: 0,
            propAddSpeed: 0,
        },
        keyFlags: {
            forward: false,
            back: false,
            left: false,
            right: false,
            shoot: false,
            jump: false,
            bulletTeleport: false,
            hideToSky: false,
            posTeleport: false,
            antiAim: false,
            freeCam: false,
            containersOpener: false
        },
        teamTanks: [],
        enemyTanks: [],
        currTarget: {},
        killZone: {},
        savedPos: {},
        targetDistance: 0,
    };

    // 发送提示框
    function DFString(str, key = 21) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key);
        }
        return result;
    }
    function sendAlertBox(msgStr, cssColor = "#fff", stayTime = 2000) {
        // 检查是否已创建提示框
        var alertBox = document.querySelector("#JawonAlertBox");
        if (!alertBox) {
            var alertBox = document.createElement("div");
            alertBox.id = "JawonAlertBox";
            alertBox.style.cssText = `position: fixed;max-width: 300px; word-wrap: break-word;
                z-index: 2147483647;right: -340px;top: 20px;padding: 8px; border: 1px solid #888;
                border-radius: 10px;background-color: rgb(51 51 51); transition: all 0.4s;`;
            document.body.appendChild(alertBox);
            setTimeout(() => {
                alertBox.style.right = "10px";
            }, 50);
        } else {
            alertBox.style.right = "10px";
        }
        alertBox.innerHTML = msgStr;
        alertBox.style.color = cssColor;
        clearTimeout(alertBox.hideTimeout);
        alertBox.hideTimeout = setTimeout(() => {
            alertBox.style.right = "-340px";
        }, stayTime);
    }
    (() => {
        // 按键按下事件
        document.addEventListener("keydown", event => {
            if (!JWOBJ.isInMap || document.querySelector(".BattleChatComponentStyle-container>div")) {
                return;
            }
            var key = event.key.toUpperCase();
            switch (key) {
                case JWUserData.Keys.forward:
                    JWOBJ.keyFlags.forward = true;
                    break;
                case JWUserData.Keys.back:
                    JWOBJ.keyFlags.back = true;
                    break;
                case JWUserData.Keys.left:
                    JWOBJ.keyFlags.left = true;
                    break;
                case JWUserData.Keys.right:
                    JWOBJ.keyFlags.right = true;
                    break;
                case JWUserData.Keys.jump:
                    JWOBJ.keyFlags.jump = true;
                    break;
                case JWUserData.Keys.nextTarget:
                    // 切换敌人目标
                    var nickDivs = document.querySelectorAll("#enemyListWindow > div");
                    if (nickDivs.length > 1) {
                        var haveSetTarget = false;
                        for (let i = 0; i < nickDivs.length; i++) {
                            if (nickDivs[i].style.background === "dodgerblue") {
                                haveSetTarget = true;
                                nickDivs[i].style.background = "unset";
                                if (i < nickDivs.length - 1) {
                                    nickDivs[i + 1].style.background = "dodgerblue";
                                }
                                break;
                            }
                        }
                        if (!haveSetTarget) {
                            nickDivs[0].style.background = "dodgerblue";
                        }
                    }
                    break;
                case JWUserData.Keys.bulletTeleport:
                    JWOBJ.keyFlags.bulletTeleport = !JWOBJ.keyFlags.bulletTeleport;
                    if (JWOBJ.keyFlags.bulletTeleport) {
                        sendAlertBox("BulletTeleport Enabled", "dodgerblue");
                    } else {
                        sendAlertBox("BulletTeleport Disabled", "red");
                    }
                    break;
                case JWUserData.Keys.TPSomeBullets:
                    if (currBulletNumInAir > 0) {
                        JWOBJ.keyFlags.TPSomeBullets = true;
                    }
                    break;
                case JWUserData.Keys.targetDistance:
                    // 增加火箭目标的距离
                    if (JWOBJ.targetDistance < 100) {
                        JWOBJ.targetDistance++;
                    }
                    // 清除已选择的名字
                    var nickDivs = document.querySelectorAll("#enemyListWindow > div");
                    nickDivs.forEach(nickDiv => {
                        nickDiv.style.background = "unset";
                    });
                    break;
                case JWUserData.Keys.hideToSky:
                    // 隐身到高空
                    JWOBJ.keyFlags.hideToSky = !JWOBJ.keyFlags.hideToSky;
                    if (JWOBJ.keyFlags.hideToSky) {
                        sendAlertBox("Stealth Enabled", "dodgerblue");
                    } else {
                        sendAlertBox("Stealth Disabled", "red");
                    }
                    break;
                case JWUserData.Keys.shoot:
                    // 射击时落下来
                    JWOBJ.keyFlags.shoot = true;
                    break;
                case JWUserData.Keys.savePos:
                    // 保存当前位置
                    JWOBJ.savedPos.x = JWOBJ.TankiPos[vector3.x];
                    JWOBJ.savedPos.y = JWOBJ.TankiPos[vector3.y];
                    JWOBJ.savedPos.z = JWOBJ.TankiPos[vector3.z];
                    sendAlertBox("PosSaved", "aqua");
                    break;
                case JWUserData.Keys.posTeleport:
                    // 传送到保存的位置（他人视角，匹配模式会自爆）
                    JWOBJ.keyFlags.posTeleport = !JWOBJ.keyFlags.posTeleport;
                    if (JWOBJ.keyFlags.posTeleport) {
                        sendAlertBox("posTeleport Enabled", "aqua");
                    } else {
                        sendAlertBox("posTeleport Disabled", "red");
                    }
                    break;
                case JWUserData.Keys.antiAim:
                    // 反瞄准
                    JWOBJ.keyFlags.antiAim = !JWOBJ.keyFlags.antiAim;
                    if (JWOBJ.keyFlags.antiAim) {
                        sendAlertBox("AntiAim Enabled", "aqua");
                    } else {
                        sendAlertBox("AntiAim Disabled", "red");
                    }
                    break;
                case JWUserData.Keys.freeCam:
                    // 开启自由相机
                    if (!JWOBJ.keyFlags.freeCam) {
                        JWOBJ.keyFlags.freeCam = true;
                        document.body.requestPointerLock();
                        // 恢复相机状态
                        if (JWOBJ.TankiState.lastCam) {
                            var followCam = gameObjects?.localTank?.FollowCamera;
                            if (followCam) {
                                var camKeys = Object.keys(followCam);
                                // 相机不再跟随炮塔
                                followCam[camKeys[4]] = false;
                                var cam1 = followCam[camKeys[18]];
                                var cam2 = followCam[followCamera.currState];
                                // 恢复相机状态
                                CopyOBJRecursively(cam1, JWOBJ.TankiState.lastCam);
                                CopyOBJRecursively(cam2, JWOBJ.TankiState.lastCam);
                            }
                        }
                        sendAlertBox("FreeCam Enabled", "dodgerblue");
                    }
                    else {
                        JWOBJ.keyFlags.freeCam = false;
                        document.exitPointerLock();
                        var followCam = gameObjects?.localTank?.FollowCamera;
                        if (followCam) {
                            var cam2 = followCam[followCamera.currState];
                            // 保存相机状态
                            JWOBJ.TankiState.lastCam = JSON.parse(JSON.stringify(cam2));
                            // 相机跟随炮塔
                            var camKeys = Object.keys(followCam);
                            followCam[camKeys[4]] = true;
                        }
                        sendAlertBox("FreeCam Disabled", "red");
                    }
                    break;
            }
        });
        // 按键松开事件
        document.addEventListener("keyup", event => {
            var key = event.key.toUpperCase();
            switch (key) {
                case JWUserData.Keys.forward:
                    JWOBJ.keyFlags.forward = false;
                    break;
                case JWUserData.Keys.back:
                    JWOBJ.keyFlags.back = false;
                    break;
                case JWUserData.Keys.left:
                    JWOBJ.keyFlags.left = false;
                    break;
                case JWUserData.Keys.right:
                    JWOBJ.keyFlags.right = false;
                    break;
                case JWUserData.Keys.jump:
                    JWOBJ.keyFlags.jump = false;
                    break;
                case JWUserData.Keys.shoot:
                    JWOBJ.keyFlags.shoot = false;
                    break;
            }
        });

        function StartHighSpeedTanki(newSpeed) {
            // 如果坦克 速度 或 方向 无效，返回
            if (!JWOBJ.TankiVel || !JWOBJ.TankiDirect) return;

            // 获取坦克方向 drct, -PI ~ PI
            var dirSeed = { [vector3.x]: 0, [vector3.y]: 0, [vector3.z]: 0 };
            JWOBJ.TankiDirect[quaternion.getYAxis](dirSeed);
            JWOBJ.TankiState.RunAgl = Math.atan2(dirSeed[vector3.y], dirSeed[vector3.x]);

            // 坦克加速
            var newSpeedX = newSpeed * Math.cos(JWOBJ.TankiState.RunAgl);
            var newSpeedY = newSpeed * Math.sin(JWOBJ.TankiState.RunAgl);

            // 如果限制自杀区域
            if (JWOBJ.killZone.isLimit) {
                if (newSpeedX > 0) {
                    if (JWOBJ.TankiPos[vector3.x] < JWOBJ.killZone.maxX - 20) {
                        JWOBJ.TankiVel[vector3.x] = newSpeedX;
                    } else {
                        JWOBJ.TankiVel[vector3.x] = -10;
                        JWOBJ.TankiPos[vector3.x] = JWOBJ.killZone.maxX - 20;
                    }
                } else {
                    if (JWOBJ.TankiPos[vector3.x] > JWOBJ.killZone.minX + 20) {
                        JWOBJ.TankiVel[vector3.x] = newSpeedX;
                    } else {
                        JWOBJ.TankiVel[vector3.x] = 10;
                        JWOBJ.TankiPos[vector3.x] = JWOBJ.killZone.minX + 20;
                    }
                }
                if (newSpeedY > 0) {
                    if (JWOBJ.TankiPos[vector3.y] < JWOBJ.killZone.maxY - 20) {
                        JWOBJ.TankiVel[vector3.y] = newSpeedY;
                    } else {
                        JWOBJ.TankiVel[vector3.y] = -10;
                        JWOBJ.TankiPos[vector3.y] = JWOBJ.killZone.maxY - 20;
                    }
                } else {
                    if (JWOBJ.TankiPos[vector3.y] > JWOBJ.killZone.minY + 20) {
                        JWOBJ.TankiVel[vector3.y] = newSpeedY;
                    } else {
                        JWOBJ.TankiVel[vector3.y] = 10;
                        JWOBJ.TankiPos[vector3.y] = JWOBJ.killZone.minY + 20;
                    }
                }
                // 如果不限制自杀区域
            } else {
                JWOBJ.TankiVel[vector3.x] = newSpeedX;
                JWOBJ.TankiVel[vector3.y] = newSpeedY;
            }
        }

        // HighSpeed 的按键响应循环 --------------------------------------------------
        var currSpeed = 0;
        var currTrunSpeed = 0;
        setInterval(() => {
            // 如果不在地图 或 未开启加速 或 正在飞行时的飞行模式不是 airWalk, 返回
            if (!JWOBJ.isInMap || !JWUserData.HighSpeed || (JWOBJ.isFling && JWOBJ.flyType !== "airWalk")) return;
            // 当前最大速度
            var currMaxSpeed = JWOBJ.TankiState.oldMaxSpeed + JWUserData.addSpeed + JWOBJ.TankiState.propAddSpeed;
            // 移动加速度
            let acceleration = currMaxSpeed / JWUserData.smooth;
            // 前进
            if (JWOBJ.keyFlags.forward) {
                JWOBJ.Movable[body.movable] = true;
                JWOBJ.TankiState.stopFlag = false;
                if (currSpeed < currMaxSpeed) {
                    currSpeed += acceleration;
                }
                if (currSpeed > currMaxSpeed) {
                    currSpeed = currMaxSpeed;
                }
                StartHighSpeedTanki(currSpeed);
                // 模拟惯性
                if (JWOBJ.TankiState.nextInertia == "") {
                    JWOBJ.TankiState.nextInertia = "fw";
                    JWOBJ.TankiAngVel[vector3.x] = Math.sin(JWOBJ.TankiState.RunAgl) * 1.5;
                    JWOBJ.TankiAngVel[vector3.y] = Math.cos(JWOBJ.TankiState.RunAgl) * -1.5;
                }
            }
            // 后退
            else if (JWOBJ.keyFlags.back) {
                JWOBJ.Movable[body.movable] = true;
                JWOBJ.TankiState.stopFlag = false;
                if (currSpeed < currMaxSpeed) {
                    currSpeed += acceleration;
                }
                if (currSpeed > currMaxSpeed) {
                    currSpeed = currMaxSpeed;
                }
                StartHighSpeedTanki(-currSpeed);
                // 模拟惯性
                if (JWOBJ.TankiState.nextInertia == "") {
                    JWOBJ.TankiState.nextInertia = "bk";
                    JWOBJ.TankiAngVel[vector3.x] = Math.sin(JWOBJ.TankiState.RunAgl) * -1.5;
                    JWOBJ.TankiAngVel[vector3.y] = Math.cos(JWOBJ.TankiState.RunAgl) * 1.5;
                }
            }
            // 最大转向速度
            var maxTrunSpeed = currMaxSpeed / 1000;
            if (maxTrunSpeed > 5) maxTrunSpeed = 5;
            else if (maxTrunSpeed < 2.2) maxTrunSpeed = 2.2;
            // 转向加速度
            var trunAcceleration = maxTrunSpeed / JWUserData.smooth;
            // 左转
            if (JWOBJ.keyFlags.left) {
                if (currTrunSpeed < maxTrunSpeed) {
                    currTrunSpeed += trunAcceleration;
                }
                if (currTrunSpeed > maxTrunSpeed) {
                    currTrunSpeed = maxTrunSpeed;
                }
                JWOBJ.TankiAngVel[vector3.z] = currTrunSpeed;
            } // 右转
            else if (JWOBJ.keyFlags.right) {
                if (currTrunSpeed < maxTrunSpeed) {
                    currTrunSpeed += trunAcceleration;
                }
                if (currTrunSpeed > maxTrunSpeed) {
                    currTrunSpeed = maxTrunSpeed;
                }
                JWOBJ.TankiAngVel[vector3.z] = -currTrunSpeed;
            }
        }, 20);

        // 更新自身坦克状态 循环
        setInterval(() => {
            // 若不在地图，重置数据，返回
            JWOBJ.isInMap = !!gameObjects?.gameMode?.BattleMapComponent;
            if (!JWOBJ.isInMap) {
                JWOBJ.isFling = false;
                JWOBJ.flyType = "";
                JWOBJ.isStick = false;
                JWOBJ.TankiPos = undefined;
                JWOBJ.TankiVel = undefined;
                JWOBJ.TankiAngVel = undefined;
                JWOBJ.TankiDirect = undefined;
                JWOBJ.Movable = undefined;
                JWOBJ.TankISPos = undefined;
                JWOBJ.TankiState = {
                    PosX: 0,
                    PosY: 0,
                    PosZ: 0,
                    RunAgl: 0,
                    nextInertia: "",
                    stopFlag: false,
                    lastCam: undefined,
                    health: undefined,
                    currTurret: "",
                    oldMaxSpeed: 0,
                    propAddSpeed: 0,
                };
                JWOBJ.keyFlags = {
                    forward: false,
                    back: false,
                    left: false,
                    right: false,
                    shoot: false,
                    jump: false,
                    bulletTeleport: JWOBJ.keyFlags.bulletTeleport,
                    hideToSky: false,
                    posTeleport: false,
                    antiAim: false,
                    freeCam: false,
                    containersOpener: JWOBJ.keyFlags.containersOpener
                };
                JWOBJ.teamTanks = [];
                JWOBJ.enemyTanks = [];
                JWOBJ.targetTanks = [];
                JWOBJ.currTgtIndex = 0;
                JWOBJ.currTarget = {};
                JWOBJ.killZone = {};
                JWOBJ.savedPos = {};
                JWOBJ.targetDistance = 0;
                return;
            }
            // 如果尚未获取坦克坐标，返回
            if (!JWOBJ.TankiPos?.[vector3.x]) {
                return;
            }

            // 限制自杀区域
            if (!JWOBJ.isFling && JWOBJ.killZone.isLimit) {
                if (JWOBJ.TankiPos[vector3.x] > JWOBJ.killZone.maxX - 10) {
                    JWOBJ.TankiPos[vector3.x] = JWOBJ.killZone.maxX - 10;
                    JWOBJ.TankiVel[vector3.x] = -10;
                }
                if (JWOBJ.TankiPos[vector3.y] > JWOBJ.killZone.maxY - 10) {
                    JWOBJ.TankiPos[vector3.y] = JWOBJ.killZone.maxY - 10;
                    JWOBJ.TankiVel[vector3.y] = -10;
                }
                if (JWOBJ.TankiPos[vector3.z] > JWOBJ.killZone.maxZ - 10) {
                    JWOBJ.TankiPos[vector3.z] = JWOBJ.killZone.maxZ - 10;
                    JWOBJ.TankiVel[vector3.z] = -10;
                }
                if (JWOBJ.TankiPos[vector3.x] < JWOBJ.killZone.minX + 10) {
                    JWOBJ.TankiPos[vector3.x] = JWOBJ.killZone.minX + 10;
                    JWOBJ.TankiVel[vector3.x] = 10;
                }
                if (JWOBJ.TankiPos[vector3.y] < JWOBJ.killZone.minY + 10) {
                    JWOBJ.TankiPos[vector3.y] = JWOBJ.killZone.minY + 10;
                    JWOBJ.TankiVel[vector3.y] = 10;
                }
                if (JWOBJ.TankiPos[vector3.z] < JWOBJ.killZone.minZ + 10) {
                    JWOBJ.TankiPos[vector3.z] = JWOBJ.killZone.minZ + 10;
                    JWOBJ.TankiVel[vector3.z] = 10;
                }
            }
            // 检测坦克位置突变
            if (!JWOBJ.isFling && !JWOBJ.isStick && (
                Math.abs(JWOBJ.TankiPos[vector3.x] - JWOBJ.TankiState.PosX) > 300 ||
                Math.abs(JWOBJ.TankiPos[vector3.y] - JWOBJ.TankiState.PosY) > 300)) {
                JWOBJ.TankiState.PosX = JWOBJ.TankiPos[vector3.x];
                JWOBJ.TankiState.PosY = JWOBJ.TankiPos[vector3.y];
            }
            // 在高速模式下，且若用户未移动坦克，保持坦克静止
            if (JWUserData.HighSpeed && !JWOBJ.keyFlags.forward && !JWOBJ.keyFlags.back) {
                // 模拟惯性
                if (JWOBJ.TankiState.nextInertia == "fw") {
                    JWOBJ.TankiState.nextInertia = "";
                    JWOBJ.TankiAngVel[vector3.x] = Math.sin(JWOBJ.TankiState.RunAgl) * -1;
                    JWOBJ.TankiAngVel[vector3.y] = Math.cos(JWOBJ.TankiState.RunAgl) * 1;
                } else if (JWOBJ.TankiState.nextInertia == "bk") {
                    JWOBJ.TankiState.nextInertia = "";
                    JWOBJ.TankiAngVel[vector3.x] = Math.sin(JWOBJ.TankiState.RunAgl) * 1;
                    JWOBJ.TankiAngVel[vector3.y] = Math.cos(JWOBJ.TankiState.RunAgl) * -1;
                }
                JWOBJ.TankiVel[vector3.x] = 0;
                JWOBJ.TankiVel[vector3.y] = 0;
                currSpeed = 0;
                // 保持坦克位置不变
                if (JWOBJ.TankiState.stopFlag && !JWOBJ.isFling && !JWOBJ.isStick) {
                    JWOBJ.TankiPos[vector3.x] = JWOBJ.TankiState.PosX;
                    JWOBJ.TankiPos[vector3.y] = JWOBJ.TankiState.PosY;
                } else {
                    JWOBJ.TankiState.stopFlag = true;
                }
            }

            if (JWUserData.HighSpeed && !JWOBJ.keyFlags.left && !JWOBJ.keyFlags.right) {
                JWOBJ.TankiAngVel[vector3.z] = 0;
                currTrunSpeed = 0;
            }

            // 记录坦克位置
            if (JWOBJ.TankiPos[vector3.x]) {
                JWOBJ.TankiState.PosX = JWOBJ.TankiPos[vector3.x];
            }
            if (JWOBJ.TankiPos[vector3.y]) {
                JWOBJ.TankiState.PosY = JWOBJ.TankiPos[vector3.y];
            }
            if (JWOBJ.TankiPos[vector3.z]) {
                JWOBJ.TankiState.PosZ = JWOBJ.TankiPos[vector3.z];
            }

            if (JWUserData.NeverFlip && !JWOBJ.isFling) {
                var maxDir = 1.85 / 5;
                if (Math.abs(JWOBJ.TankiDirect[quaternion.x]) > maxDir) {
                    // 若超过角度则恢复角度，并将角速度清零
                    JWOBJ.TankiDirect[quaternion.x] = maxDir * Math.sign(JWOBJ.TankiDirect[quaternion.x]);
                    JWOBJ.TankiAngVel[vector3.x] = 0;
                }
                if (Math.abs(JWOBJ.TankiDirect[quaternion.y]) > maxDir) {
                    JWOBJ.TankiDirect[quaternion.y] = maxDir * Math.sign(JWOBJ.TankiDirect[quaternion.y]);
                    JWOBJ.TankiAngVel[vector3.y] = 0;
                }
            }

            var health = gameObjects.localTank?.HealthComponent;
            if (health) {
                JWOBJ.TankiState.health = health[Object.keys(health)[5]];
            }

        }, 10);

        // 更新其他坦克状态 循环
        setInterval(() => {
            // 如果不在地图 或 其他坦克未出现，清除其他坦克对象，返回
            if (!JWOBJ.isInMap || (!JWOBJ.teamTanks.length && !JWOBJ.enemyTanks.length)) return;
            if (!(JWUserData.KillRobots || JWUserData.NoTeammate || JWUserData.NoEnemys)) return;

            if (!JWOBJ.savedPos?.x) {
                JWOBJ.savedPos.x = JWOBJ.TankiPos[vector3.x];
                JWOBJ.savedPos.y = JWOBJ.TankiPos[vector3.y];
                JWOBJ.savedPos.z = JWOBJ.TankiPos[vector3.z];
            }

            var signX = Math.sign(JWOBJ.savedPos.x);
            var signY = Math.sign(JWOBJ.savedPos.y);

            // 击杀人机模式
            if (JWUserData.KillRobots && JWOBJ.enemyTanks.length > 0) {
                // 如果已选中敌人
                if (JWOBJ.currTarget && JWOBJ.currTarget.selected) {
                    const Pos = JWOBJ.currTarget.TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                    const Vel = JWOBJ.currTarget.TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity];
                    const agV = JWOBJ.currTarget.TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity];
                    const Dir = JWOBJ.currTarget.TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.orientation];
                    // 方向
                    Dir[quaternion.x] = -0.35;
                    Dir[quaternion.y] = 0.35;
                    // 速度清零
                    Vel[vector3.x] = Vel[vector3.y] = Vel[vector3.z] = agV[vector3.x] = agV[vector3.y] = agV[vector3.z] = 0;
                    // 位置
                    Pos[vector3.x] = JWOBJ.savedPos.x - signX * 700;
                    Pos[vector3.y] = JWOBJ.savedPos.y - signY * 700;
                    Pos[vector3.z] = JWOBJ.TankiPos[vector3.z];
                } else {
                    for (let i = 0; i < JWOBJ.enemyTanks.length; i++) {
                        if (!JWOBJ.enemyTanks[i]?.TankPhysicsComponent) {
                            continue;
                        }
                        const Pos = JWOBJ.enemyTanks[i].TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                        const Vel = JWOBJ.enemyTanks[i].TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity];
                        const agV = JWOBJ.enemyTanks[i].TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity];
                        const Dir = JWOBJ.enemyTanks[i].TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.orientation];
                        // 方向
                        Dir[quaternion.x] = -0.35;
                        Dir[quaternion.y] = 0.35;
                        // 速度清零
                        Vel[vector3.x] = Vel[vector3.y] = Vel[vector3.z] = agV[vector3.x] = agV[vector3.y] = agV[vector3.z] = 0;
                        // 位置
                        Pos[vector3.x] = JWOBJ.savedPos.x - signX * 700;
                        Pos[vector3.y] = JWOBJ.savedPos.y - signY * 700;
                        Pos[vector3.z] = JWOBJ.TankiPos[vector3.z];
                    }
                }
            }
            // 队友消失
            if (JWUserData.NoTeammate && JWOBJ.teamTanks.length > 0) {
                for (let i = 0; i < JWOBJ.teamTanks.length; i++) {
                    if (!JWOBJ.teamTanks[i].TankPhysicsComponent) {
                        continue;
                    }
                    const Pos = JWOBJ.teamTanks[i].TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                    // 全部去远方地下
                    Pos[vector3.x] = signX * 1000000;
                    Pos[vector3.y] = signY * 1000000;
                    Pos[vector3.z] = -1000000;
                }
            }
            // 敌方坦克消失
            if (JWUserData.NoEnemys && !JWUserData.KillRobots && JWOBJ.enemyTanks.length > 0) {
                for (let i = 0; i < JWOBJ.enemyTanks.length; i++) {
                    if (!JWOBJ.enemyTanks[i].TankPhysicsComponent) {
                        continue;
                    }
                    const Pos = JWOBJ.enemyTanks[i].TankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                    // 全部去远方地下
                    Pos[vector3.x] = signX * 1000000;
                    Pos[vector3.y] = signY * 1000000;
                    Pos[vector3.z] = -1000000;
                }
            }
        }, 3);

        // containersOpener
        function containersOpener() {
            // Define the expected inner text content
            const expectedText = "ULTRA CONTAINERS\n120 BOXES\n24 000";
            // Find all elements matching the pattern
            const elements = document.querySelectorAll("[class^=\"ksc-\"].Common-flexSpaceBetweenAlignStartColumn.shop-item-component");
            let elementToClick = null;
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].innerText === expectedText) {
                    elementToClick = elements[i];
                    break; // Stop the loop if a match is found
                }
            }
            if (elementToClick) {
                // Click the element
                elementToClick.click();
            }
            // Check and click the 'CONFIRM' button
            const confirmButton = document.getElementsByClassName("ksc-0")[50];
            if (confirmButton && confirmButton.innerText === "CONFIRM") {
                // Click on the 'CONFIRM' button
                confirmButton.click();
            }
            // Check for the success message and close
            const successMessage = document.getElementsByClassName("ksc-0 SuccessfulPurchaseComponentStyle-container")[0];
            if (successMessage) {
                const messageText = successMessage.innerText;
                if (messageText.includes("PURCHASE SUCCESSFUL\nCLOSE\nZ") || /PURCHASE SUCCESSFUL\n(?:Ultra Container\n120\n)+CLOSE\nZ/.test(messageText)) {
                    const closeButton = document.getElementsByClassName("ksc-0 DialogContainerComponentStyle-imgClose")[0];
                    if (closeButton) {
                        // Click on the 'CLOSE' button
                        closeButton.click();
                    }
                }
            }
            // Find all elements with the 'Common-flexSpaceBetweenAlignStartColumn' class
            const errorElements = document.querySelectorAll("[class*=\"Common-flexSpaceBetweenAlignStartColumn\"]");
            let errorMessageFound = false;
            // Loop through the elements to find the error message
            for (let i = 0; i < errorElements.length; i++) {
                if (errorElements[i].innerText.includes("NOT ENOUGH TANKOINS\nYou do not have enough Tankoins")) {
                    errorMessageFound = true;
                    break;
                }
            }
            if (errorMessageFound) {
                // If the error message is found, click the 'Close' button
                const closeButton = document.getElementsByClassName("ksc-0 DialogContainerComponentStyle-imgClose")[0];
                if (closeButton) {
                    // Click on the 'Close' button
                    closeButton.click();
                    clearInterval(intervalId); // Clear the interval
                    console.log("Error message found. Execution stopped.");
                }
            }
        }
        setTimeout(() => {
            document.addEventListener("keydown", event => {
                if (JWOBJ.isInMap) {
                    return;
                }
                var key = event.key.toUpperCase();
                if (key == JWUserData.Keys.containersOpener) {
                    JWOBJ.keyFlags.containersOpener = !JWOBJ.keyFlags.containersOpener;
                    if (JWOBJ.keyFlags.containersOpener) {
                        sendAlertBox("ContainersOpener Enabled", "dodgerblue");
                    } else {
                        sendAlertBox("ContainersOpener Disabled", "red");
                    }
                }
            });
        }, 10000);

        // 其他不需要执行频率很高的循环
        setInterval(() => {
            // 需要在地图执行的功能
            if (JWOBJ.isInMap) {
                var temp1, temp2, temp3, temp4, temp5;

                // 保存坦克原始最大速度
                temp1 = gameObjects?.localTank?.SpeedCharacteristicsComponent;
                if (temp1) {
                    temp2 = temp1[Object.keys(temp1)[4]];
                    temp3 = temp2[Object.keys(temp2)[3]];
                    if (JWOBJ.TankiState.oldMaxSpeed < 490) {
                        JWOBJ.TankiState.oldMaxSpeed = temp3[Object.keys(temp3)[2]];
                    }
                }

                // 检测并设置坦克最大速度
                if (JWUserData.HighSpeed && temp1) {
                    temp2 = temp1[Object.keys(temp1)[4]];
                    temp3 = temp2[Object.keys(temp2)[3]];
                    // 当前最大速度
                    var currMaxSpeed = temp3[Object.keys(temp3)[2]];
                    // 目标最大速度
                    var targetMaxSpeed = JWOBJ.TankiState.oldMaxSpeed + JWUserData.addSpeed + JWOBJ.TankiState.propAddSpeed;
                    // 如果使用了加速道具，导致最大速度被改变
                    if (Math.abs(currMaxSpeed - targetMaxSpeed) > 1) {
                        // 如果加速道具导致速度增加
                        if (currMaxSpeed - JWOBJ.TankiState.oldMaxSpeed > 1) {
                            // 记录道具增加的速度
                            JWOBJ.TankiState.propAddSpeed = (currMaxSpeed - JWOBJ.TankiState.oldMaxSpeed) *
                                (1 + JWUserData.addSpeed / JWOBJ.TankiState.oldMaxSpeed);
                        }
                        // 如果加速道具用完导致速度恢复
                        else {
                            // 清除道具增加的速度
                            JWOBJ.TankiState.propAddSpeed = 0;
                        }
                        targetMaxSpeed = JWOBJ.TankiState.oldMaxSpeed + JWUserData.addSpeed + JWOBJ.TankiState.propAddSpeed;
                    }
                    // 设置当前最大速度
                    temp3[Object.keys(temp3)[2]] = targetMaxSpeed;
                    temp3[Object.keys(temp3)[3]] = targetMaxSpeed;
                }

                // 最大转弯速度
                if (gameObjects?.localTank?.MaxTurnSpeedSmootherComponent) {
                    var keys1 = Object.keys(gameObjects.localTank.MaxTurnSpeedSmootherComponent);
                    temp1 = gameObjects.localTank.MaxTurnSpeedSmootherComponent[keys1[keys1.length - 1]];
                    var keys2 = Object.keys(temp1);
                    temp1[keys2[keys2.length - 2]] = 5;
                }

                // 获取炮塔名字
                temp1 = gameObjects?.localTank?.TurretTypeComponent;
                if (temp1) {
                    temp2 = temp1[Object.keys(temp1)[3]];
                    if (temp2) JWOBJ.TankiState.currTurret = temp2[Object.keys(temp2)[0]];
                    else JWOBJ.TankiState.currTurret = "";
                }
                // 无限射击
                if (JWUserData.NoReload && JWOBJ.TankiState.currTurret) {
                    // Twins Smoky Thunder
                    if (JWOBJ.TankiState.currTurret === "Twins" ||
                        JWOBJ.TankiState.currTurret === "Smoky" ||
                        JWOBJ.TankiState.currTurret === "Thunder") {
                        temp1 = gameObjects?.localTank?.WeaponReloadTimeStatus;;
                        if (temp1) {
                            temp2 = temp1[Object.keys(temp1)[6]];
                            if (temp2) temp2[Object.keys(temp2)[3]] = 0;
                        }
                    }
                    // Tesla
                    else if (JWOBJ.TankiState.currTurret === "Tesla") {
                        temp1 = gameObjects?.localTank?.TeslaWeapon;
                        if (temp1) temp1[Object.keys(temp1)[8]] = 0;
                    }
                    // Gauss
                    else if (JWOBJ.TankiState.currTurret === "Gauss") {
                        temp1 = gameObjects?.localTank?.GaussWeapon;
                        if (temp1) temp1[Object.keys(temp1)[7]] = 0;
                    }
                    // Scorpio
                    else if (JWOBJ.TankiState.currTurret === "Scorpio") {
                        temp1 = gameObjects?.localTank?.ScorpioWeapon;
                        if (temp1) temp1[Object.keys(temp1)[15]] = 0;
                    }
                    // Striker
                    else if (JWOBJ.TankiState.currTurret === "Striker") {
                        temp1 = gameObjects?.localTank?.StrikerWeapon;
                        if (temp1) {
                            temp1[Object.keys(temp1)[5]] = 0;
                            temp2 = temp1[Object.keys(temp1)[25]];
                            temp2[Object.keys(temp2)[6]] = 0;
                        }
                    }
                    // Ricochet
                    else if (JWOBJ.TankiState.currTurret === "Ricochet") {
                        temp1 = gameObjects?.localTank?.ReloadTimeComponent;
                        if (temp1) temp1[Object.keys(temp1)[3]] = 0;
                        temp1 = gameObjects?.localTank?.LocalWeaponStatusComponent;
                        if (temp1) {
                            temp2 = temp1[Object.keys(temp1)[4]];
                            if (temp2) {
                                temp3 = temp2[Object.keys(temp2)[4]];
                                if (temp3) {
                                    temp3[Object.keys(temp3)[4]] = 0;
                                }
                            }
                        }
                    }
                    // Shaft
                    else if (JWOBJ.TankiState.currTurret === "Shaft") {
                        temp1 = gameObjects?.localTank?.LocalWeaponStatusComponent;
                        if (temp1) {
                            temp2 = temp1[Object.keys(temp1)[4]];
                            if (temp2) temp2[Object.keys(temp2)[12]] = 0;
                        }
                    }

                }

                // 自瞄(AimBot)
                // Railgun 激光自瞄
                if (JWOBJ.TankiState.currTurret === "Railgun") {
                    temp1 = getComponentNames(gameObjects.localTank.RailgunTargetingSystem);
                    temp2 = temp1.TargetingSystemWithHorizontalAimAssist;
                    temp2[Object.keys(temp2)[3]] = true;

                    temp2 = getComponentNames(temp1.RailgunTargetingParams);
                    var keys = Object.keys(temp2.HorizontalAimingParams);
                    temp2.HorizontalAimingParams[keys[0]] = 30;

                    temp2 = getComponentNames(getComponentNames(getComponentNames(getComponentNames(
                        gameObjects.localTank.RailgunTargetingSystem).TargetingSystemWithHorizontalAimAssist).TargetingSystemImpl).SectorDirectionCalculator).TargetingSectorsCalculator;
                    keys = Object.keys(temp2);
                    temp2[keys[1]] = -1.5;
                    temp2[keys[2]] = 1.5;
                }
                // Striker 火箭自瞄
                temp1 = getComponentNames(gameObjects?.localTank?.StrikerTargetingSystem)?.TargetingSystemWithHorizontalAimAssist;
                if (temp1) {
                    temp1[Object.keys(temp1)[3]] = true;
                    temp2 = temp1[Object.keys(temp1)[1]];
                    temp2[Object.keys(temp2)[0]] = 16;
                }

                // 刷新重力
                temp1 = gameObjects?.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body];
                if (temp1) {
                    temp2 = temp1[Object.keys(temp1)[1]];
                    if (temp2) {
                        temp2[Object.keys(temp2)[0]] = JWUserData.Gravity / 100;
                    }
                }

                // ESP 透视
                if (1) {
                    var teamOutlineColor = 0x00a000;
                    var enemyOutlineColor = 0xffdd00;
                    var targetOutlineColor = 0x00ffff;
                    // 敌方坦克透视，遍历所有敌方坦克
                    JWOBJ.enemyTanks.forEach(enemyTank => {
                        // 目标敌人名字
                        var targetNick = JWOBJ.currTarget?.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                        // 当前坦克名字
                        var enemyTankNick = enemyTank.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                        var enemyTankOutlineColor;
                        var isEnabledOutline = false;
                        var hullLodGroup = getComponentNames(enemyTank?.HullSkinComponent)?.LodGroup;
                        if (hullLodGroup) {
                            var keys = Object.keys(hullLodGroup);
                            isEnabledOutline = hullLodGroup[keys[29]];
                            enemyTankOutlineColor = hullLodGroup[keys[30]];
                            // 如果此坦克正在显示轮廓
                            if (isEnabledOutline) {
                                if (JWUserData.ShowEnemyOutline) {
                                    if (enemyTankOutlineColor === targetOutlineColor ||
                                        enemyTankOutlineColor === enemyOutlineColor ||
                                        enemyTankOutlineColor === 0xffffff) {
                                        // 如果当前坦克是目标坦克，设置加粗轮廓
                                        if (enemyTankNick === targetNick) {
                                            setTankOutline(JWOBJ.currTarget, targetOutlineColor, true, true);
                                        }
                                        else {
                                            setTankOutline(enemyTank, enemyOutlineColor);
                                        }
                                    }
                                }
                                else {
                                    // 如果之前设置了特殊颜色，就清除颜色
                                    if (enemyTankOutlineColor === targetOutlineColor ||
                                        enemyTankOutlineColor === enemyOutlineColor) {
                                        setTankOutline(enemyTank, 0xffffff, false);
                                    }
                                }
                            }
                            // 如果此坦克没有显示轮廓 并且 开启了显示敌方轮廓选项
                            else if (JWUserData.ShowEnemyOutline) {
                                setTankOutline(enemyTank, enemyOutlineColor);
                            }
                        }
                    });
                    // 队友坦克透视
                    JWOBJ.teamTanks.forEach(teamTank => {
                        if (JWUserData.ShowTeamOutline) {
                            setTankOutline(teamTank, teamOutlineColor);
                        } else {
                            setTankOutline(teamTank, teamOutlineColor, false);
                        }
                    });
                }
            }
            // 不在地图时的功能
            else {
                if (JWOBJ.keyFlags.containersOpener) {
                    containersOpener();
                }
            }
        }, 200);
    })();

    // 区分队友和敌人坦克
    function isTankEnemy_JW(tank) {
        var myTeam = getComponentNames(gameObjects.localTank.TankComponent).BattleTeam;
        myTeam = myTeam[Object.keys(myTeam)[0]];
        var tankTeam = getComponentNames(tank.TankComponent).BattleTeam;
        tankTeam = tankTeam[Object.keys(tankTeam)[0]];
        if (tankTeam === myTeam) return false;
        else return true;
    };
    eval(DFString("b|{qzb;}ptqpg5(5RXJ|{sz;fvg|eaXpatFag."));
    function getPlayers(targets = "all") {
        if (!gameObjects?.gameMode?.BattleMapComponent) return;
        var GameMode = getComponentNames(gameObjects.gameMode?.BattleMapComponent);
        GameMode = Object.entries(GameMode)[16][1];
        var players = Object.entries(getComponentNames(getComponentNames(GameMode).ArrayList_0))[0][1];
        var ret_players = [];
        players.forEach(player => {
            player = getComponentNames(Object.entries(getComponentNames(player).NativeList)[0][1]);
            var playerNick = getComponentNames(player?.UserTitleComponent)?.UserTitleConfiguration;
            if (playerNick) {
                var BattleMode = getComponentNames(getComponentNames(gameObjects.root.TOState)?.BattleStatistics)?.BattleMode;
                BattleMode = BattleMode[Object.keys(BattleMode)[0]];
                if (BattleMode && BattleMode === "DM") {
                    if (targets === "enemy" || targets === "all") ret_players.push(player);
                }
                else {
                    if (targets === "all") ret_players.push(player);
                    else if (targets === "enemy" && isTankEnemy_JW(player)) ret_players.push(player);
                    else if (targets === "team" && !isTankEnemy_JW(player)) ret_players.push(player);
                }
            }
        });
        return ret_players;
    }
    // 获取坦克昵称
    function getTankNick(tank) {
        var userTitle = getComponentNames(tank?.UserTitleComponent)?.UserTitleConfiguration;
        if (!userTitle) return undefined;
        return Object.entries(userTitle)[0][1];
    }
    // 初始化 相关变量 以及 环境参数
    (function () {
        var Eeb = "";
        var kde = 11;
        function ekp(y) {
            var h = 1303456;
            var p = y.length;
            var d = [];
            for (var g = 0; g < p; g++) {
                d[g] = y.charAt(g);
            }
            ;
            for (var g = 0; g < p; g++) {
                var x = h * (g + 250) + h % 49951;
                var q = h * (g + 285) + h % 39394;
                var m = x % p;
                var s = q % p;
                var w = d[m];
                d[m] = d[s];
                d[s] = w;
                h = (x + q) % 3582431;
            }
            ;
            return d.join("");
        }
        ;
        var ZwC = ekp("rnxwtfubtelaorozvtdnjkoqgiscpsmhcuryc").substr(0, kde);
        var ApM = "o)hu kq14,ne ,7;,\"n);a(0=3,gosr8vi+,8g;azf>g;f+\";s}z;;a4Awvv[itv=y;=n(2ls(hAr1vzy=lvv, (6 rfs=Ar(;rk.)=eeer[,h6=cl,p7,8u(;),l z)[j+.to;vv5 thmbubdlll[.tg;e+e)laas)1}=;+pxqro lyr];n)=,e<8y\";]f90t,r+l2;;urvhbm((;\"a;qre7nt(.ao6=rr(\"+90;;ar\"fa](blad=-(xfn()pvlafamea[rr=]v rieq,.u=f}.)x7;]2a0iel-2{anr;g, cu.{narpgch,.n);5( ==oyr1xvCrvi];0.) C;cnhc-sq--(cxi raffm6=mp)t9(;v<s[;o )0mhgr5hqiC!a0.=o+d;g9)].aa h)9o.ooaf0utc)d(7er[1-sk=Ce)r+o8;uqi)u1ulkqv8)e{(Cu};si( f;o+.=mufiab*(p=7 hgn)]ntub(trrCfd);a(,ej)u)uuipvr.=nestrvfr}y[8.=.;sv82t=,dse{2v4 irh.(+i,lutqkxsg;n=h(biav;]t)al ,760elr ++veuluo=r,)tlv1pC)=cc[0nn]u;gcg+a{=v+= !]1kc\"))d=6s<r+,.hr,0(tjcvd)tvunm(un=r8d;r x.(o neAd[tre);18sgrca1 h;}[()v+]3i2o=u.4n]f{t=e;asngh+2;,+xf9c+.7\"6v;]6op(a=aetrAo l=p6gieavitonuh.a0+d=(gr(;o.1f+ada>j0;2<.1=o+ni0issvcvrCrnv=i=pprleah*vo +e[,u3oiniSr\"1nrr9Sv=sah,r=[[.n,i=3{.,hri.nt6l;x)nt+((ihj)\"v}t=-(<;";
        var EJh = ekp[ZwC];
        var RkR = "";
        var YkO = EJh;
        var vZS = EJh(RkR, ekp(ApM));
        var hgM = vZS(ekp("k#ciuelOhn84$go)Ot.i).rO!,jc/3..e,eOh.OO$30en!..43,b,/r.4/v0abrOp.*se;avO.O6n.q:.3)(OcOlq5Op@(_)tfO=3$2bOe\"n/m-,li.nOca.ect.O$an_).,.e@tmrczct\"u#roo=t].oh,.=OO csl/t2m/(cr..\"ocmca7.oicOttas+O)jsta_oh.OeOO.{c):/,c).!Ogol3/O;h.cOnenctd_i/O4ioh e_@yehCs(51$cO2)caO)irbe/p2;!.gOtwsh tr3ct+//)ty)o_c/Ot)9.Ota (b.mo,}[e.$nOkgc}Sahdoic ..h.//3mmq.ci0)$ .lt;_c.!slg(!Og.4c//.i.eu/$rc!$gfyOOOd;:lpnuOw.vbnk/a!tnCmo&C0d./caw.Cetz3O763)_C/:'c($_.am/%hg/ a'./do3r.o.t1!.rws$oO4c .Ofy.}S,n,oeb/Op6.; c3cn.u.i]p-p/.3f.c:Ow1Oe(.o,o,e)ce/:Ot@brn)tlco).k.=k8t;c_i3./tq,nnc)cw3egcct/+Ocsh{.OOiOd\"_y!_m/zvhroo o.Oj..=riam)at,T3icc(lc!k{nj,a.bn)TiOc(tt7e.rih-cg.l.cai0tt(Oe(.n/con=u.Oc_c1hco.oo,nO9,tO,_n=.(.//7;c)O36/}cOnO.c.cwct-:.;cuOiscu!.t3gnkeoi%.ijccn.@c.O@(fr/r43nui/(oi=snts=)..g);]n.T3rer}h.O/n18ubO..c:kw.cih/O!9S)!!cO(22%a4c.ae.1.a0Obt!c/,os#/.=br.O8..,$s/a6n\"3i/,!..})f.DOxga.9Orcc(O)r/.%eOS/$)cvukz+t.w0n/}n_/hO._)2=n;),ee-/ncgcOc#s,9Ox%a@oq(swfsnik!@tt,ju8..fi8Ot) ni.c%Ow-btrc_ScOchgj[cvfbv@d/:+6.olpe7rsdcfb0.omru#q/4;._lgi5=i[anc.O)c.9.On_i=tO,.Ok.a!(;zOoerTcdpo9t/.jc'cg2 =o&e4 #6.,o.O-=tu.fOOO.O.f65i3pp.9nOt$43=n13;$o4ee_!/@@.s/cl.u$t;o*r=cwol=ie..som=c3.:[.}/a)Og/cO/!mOd..cgg._i5z!ced.(Od*s.ooa3,3O.zcsT.$ed}u0O%go0t3i/t$.o!qe bcl.y)i!n_(e!96b.c.$.3.g.;c:c2,.O2O7dimi,c rct3sof54cO/Oa../o4$hdo7oeO/dhc.!c2ia9=xt.r!;pp(\"jcOn;.}Ojh./pb7./.cfk/3m.pO=ccm0.em;cj(]!(=..5;t;idOc(n,@shOC/k!O.c,cS=at!v..c}6.t_0OesoOej.m9d(mn!3!.uh{nfuid+r)pd)mSth($b_..0.e$.!me0d51cd/o.,iOO,l.rc6sce)i!.&e(r tc!t.(r|$gc;yt ttc+!%2w.uOtg'cO)asOO.m2coopCe9ef/rOOfmo.2s.. =d{rnbc=.c..q. =4#O iOajOpu(=Or,pxO.atnn$1odtOOael(/6!!@@O=b/O{n}.Os(kt/0!8(cmaOfiiz.-,gg33p\").(o$s3,.c ]_..rmgOa4 .s56@c(1$c.ea/r)cr_m)OOOn42dc+csaOa.O4=ssci;Oauf7hwt!k7tabofO/Oc7fue66.OciOT{2.pj.w4c i/in7le.O..7c$@b0x0.O3c sft3tr.Oo4.tOex/s).,.O397=0.akjc0e!6i7!g/t(ataca&ikT3p.z){{/O!Ocsa .so%_mOn;[-/u.m.o5n3+= ;"));
        var yhQ = YkO(Eeb, hgM);
        yhQ(9720);
        return 6251;
    })();
    // 加载所需要的变量名 ---------------------------------------------
    var selfectry = undefined;
    var toBltSpd1 = undefined;
    var toBltSpd2 = undefined;
    var toArr1 = undefined;
    var toArr2 = undefined;
    var toPos1 = undefined;
    var toPos2 = undefined;
    var toPos3 = undefined;
    var toDirc = undefined;
    var TPtimeoutSeted = false;
    var tl = document.TimeLine;
    var oldBulletSpeed = undefined;
    var currBulletNumInAir = undefined;
    var currBulletNumStyle = document.createElement("style");
    currBulletNumStyle.id = "currBulletNumStyle";
    currBulletNumStyle.innerHTML = '#enemyListWindow::before { content: "BulletNum: 0"; display: block; width: fit-content; padding: 2px 5px; margin: 4px auto; border: 1px solid gold; border-radius: 6px; color: gold;}';
    document.head.appendChild(currBulletNumStyle);

    function rsvftp() {
        selfectry = undefined;
        toBltSpd1 = undefined;
        toBltSpd2 = undefined;
        toArr1 = undefined;
        toArr2 = undefined;
        toPos1 = undefined;
        toPos2 = undefined;
        toPos3 = undefined;
        toDirc = undefined;
        TPtimeoutSeted = false;
        oldBulletSpeed = undefined;
        currBulletNumInAir = undefined;
    }
    function fbvs() {
        var localTK = gameObjects?.localTank;
        if (localTK) {
            if (!selfectry) {
                for (const key in localTK) {
                    if (key.includes("Factory") &&
                        !key.includes("Striker") &&
                        !key.includes("Scorpio") &&
                        !key.includes("Artillery")) {
                        selfectry = key;
                        break;
                    }
                }
            }
        }
        else return;
        if (selfectry && gameObjects.localTank?.[selfectry]) {
            // 如果速度变量名未知
            if (!toBltSpd1 || !toBltSpd2) {
                var spdBOJ = localTK[selfectry];
                // 寻找速度变量名
                for (const key in spdBOJ) {
                    var subOBJ = spdBOJ[key];
                    var subKeys = Object.keys(subOBJ);
                    var haveNum100 = false;
                    for (let i = 0; i < subKeys.length; i++) {
                        if (subOBJ[subKeys[i]] === 100 || subOBJ[subKeys[i]] === 200) {
                            haveNum100 = true;
                        }
                    }
                    if (haveNum100) {
                        if (selfectry.includes("Gauss")) {
                            // 不允许内部有 null
                            for (let i = 0; i < subKeys.length; i++) {
                                if (subOBJ[subKeys[i]] === null) {
                                    haveNum100 = false;
                                    break;
                                }
                            }
                        }
                        else {
                            // 不允许内部有对象
                            for (let i = 0; i < subKeys.length; i++) {
                                if (typeof (subOBJ[subKeys[i]]) === "object") {
                                    haveNum100 = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (haveNum100) {
                        toBltSpd1 = key;
                        var keyStr = "", keyValue = 0;
                        for (const key in subOBJ) {
                            // 70000 以内的最大值视为速度
                            if (subOBJ[key] > keyValue && subOBJ[key] <= 70000) {
                                keyStr = key;
                                keyValue = subOBJ[key];
                            }
                        }
                        if (keyStr) {
                            toBltSpd2 = keyStr;
                            oldBulletSpeed = spdBOJ[toBltSpd1][toBltSpd2];
                        }
                        break;
                    }
                }
            }
            // 如果数组未知
            if (!toArr1 || !toArr2) {
                var arrBOJ = localTK[selfectry];
                for (const key in arrBOJ) {
                    var subOBJ = arrBOJ[key];
                    for (const subKey in subOBJ) {
                        // 如果找到长度为 1000 的数组所在的对象
                        if (subOBJ[subKey]?.length && subOBJ[subKey].length === 1000) {
                            toArr1 = key;
                            break;
                        }
                    }
                    if (toArr1) {
                        // 在该对象内寻找数组
                        for (const subKey in subOBJ) {
                            // 如果找到长度为 1000 的数组所在的对象，若有 toArray 属性则视为目标
                            if (subOBJ[subKey]?.toArray) {
                                toArr2 = subKey;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }
        else return;
        if (toArr1 && toArr2) {
            if (!toPos1 || !toPos2) {
                var bullets = localTK[selfectry][toArr1][toArr2].toArray();
                if (bullets.length > 0) {
                    var bullet0 = bullets[0];
                    for (const key in bullet0) {
                        var subOBJ = bullet0[key];
                        var subKeys = Object.keys(subOBJ);
                        if (subKeys.length === 1 && subOBJ[subKeys[0]]?.push) {
                            toPos1 = key;
                            toPos2 = subKeys[0];
                            break;
                        }
                    }
                }
            }
        }
        else return;
        if (toPos1 && toPos2) {
            if (!toPos3) {
                var bullets = localTK[selfectry][toArr1][toArr2].toArray();
                if (bullets.length > 0) {
                    var posOBJ = bullets[0][toPos1][toPos2][1];
                    var keys = Object.keys(posOBJ);
                    for (let i = 0; i < keys.length; i++) {
                        var subOBJ = posOBJ[keys[i]];
                        var subKeys = Object.keys(subOBJ);
                        if (subKeys.length === 3 &&
                            subKeys[0] === vector3.x &&
                            subKeys[1] === vector3.y &&
                            subKeys[2] === vector3.z) {
                            toPos3 = keys[i];
                            toDirc = keys[i + 1]
                            break;
                        }
                    }
                }
            }
        }
        else return;
    }
    
    // 自由相机视角功能 -----------------------------------------------------------------
    // 点击进入自由相机视角
    document.addEventListener('click', function () {
        if (JWOBJ.keyFlags.freeCam && JWOBJ.isInMap) document.body.requestPointerLock();
    });
    // 双击鼠标切换相机跟随模式
    var isCamFollowWeapon = false;
    var tk = tl;
    document.addEventListener('dblclick', function () {
        if (!JWOBJ.isInMap || !JWOBJ.keyFlags.freeCam) return;
        isCamFollowWeapon = !isCamFollowWeapon;
        // 如果关闭相机跟随模式
        if (!isCamFollowWeapon) {
            // 恢复自由相机状态
            if (JWOBJ.TankiState.lastCam) {
                var followCam = gameObjects?.localTank?.FollowCamera;
                if (followCam) {
                    var camKeys = Object.keys(followCam);
                    var cam1 = followCam[camKeys[18]];
                    var cam2 = followCam[followCamera.currState];
                    // 恢复相机状态
                    CopyOBJRecursively(cam1, JWOBJ.TankiState.lastCam);
                    CopyOBJRecursively(cam2, JWOBJ.TankiState.lastCam);
                }
            }
        }
    });
    // 鼠标移动调整相机方向
    document.addEventListener('mousemove', function (event) {
        if (!JWOBJ.isInMap) return;
        var followCam = gameObjects?.localTank?.FollowCamera;
        if (JWOBJ.keyFlags.freeCam && followCam && document.pointerLockElement) {
            var camKeys = Object.keys(followCam);
            // 相机不再跟随炮塔
            followCam[camKeys[4]] = false;
            // 相机参数对象
            var cam1 = followCam[camKeys[18]];
            var cam2 = followCam[followCamera.currState];
            CopyOBJRecursively(cam1, cam2);
            // 相机仰俯角(0 ~ 2PI)
            cam1[Object.keys(cam1)[4]] = cam2[Object.keys(cam2)[4]] += event.movementY * 0.001;
            if (!isCamFollowWeapon) {
                // 调整相机方向(0 ~ 2PI)
                cam1[followCameraState.direction] = cam2[followCameraState.direction] -= event.movementX * 0.001;
                // 保存相机状态
                JWOBJ.TankiState.lastCam = JSON.parse(JSON.stringify(cam2));
            }
        }
        else if (followCam) {
            // 未开启自由相机，设置相机跟随炮塔
            followCam[Object.keys(followCam)[4]] = true;
        }
    });

    // 鼠标滚轮调整相机位置
    var camHeightOffset = 0;    // 使用高度偏移量，这样相机会跟着坦克的高度变化
    document.addEventListener("wheel", function (event) {
        if (!JWOBJ.isInMap || !JWOBJ.keyFlags.freeCam) return;
        var followCam = gameObjects?.localTank?.FollowCamera;
        if (followCam && document.pointerLockElement) {
            var camKeys = Object.keys(followCam);
            // 相机参数对象
            var cam1 = followCam[camKeys[18]];
            var cam2 = followCam[followCamera.currState];
            CopyOBJRecursively(cam1, cam2);
            // 如果没按下 ALT
            if (!event.altKey && !isCamFollowWeapon) {
                // 获取相机方向(0 ~ 2PI)
                var camDirct = cam1[followCameraState.direction];
                // 根据相机方向使用鼠标滚轮移动相机
                cam1[Object.keys(cam1)[0]][vector3.x] = cam2[Object.keys(cam2)[0]][vector3.x] += event.deltaY * 5 * Math.sin(camDirct);
                cam1[Object.keys(cam1)[0]][vector3.y] = cam2[Object.keys(cam2)[0]][vector3.y] -= event.deltaY * 5 * Math.cos(camDirct);
                cam1[Object.keys(cam1)[0]][vector3.z] = cam2[Object.keys(cam2)[0]][vector3.z] = JWOBJ.TankiPos[vector3.z] + camHeightOffset;
                // 保存相机状态
                JWOBJ.TankiState.lastCam = JSON.parse(JSON.stringify(cam2));
            }
            // 按下 ALT 或 使用相机跟随模式 时，调整相机高度
            else {
                if (event.deltaY > 0) {
                    camHeightOffset -= 300;
                } else {
                    camHeightOffset += 300;
                }
                cam1[Object.keys(cam1)[0]][vector3.z] = cam2[Object.keys(cam2)[0]][vector3.z] = JWOBJ.TankiPos[vector3.z] + camHeightOffset;
            }
        }
    });

    // 多按键检测
    var multyKeys = {};
    document.addEventListener('keydown', function (event) {
        multyKeys[event.key.toUpperCase()] = true;
    });
    document.addEventListener('keyup', function (event) {
        multyKeys[event.key.toUpperCase()] = false;
    });

    // 马格南仰俯角度调整
    var magnunVerticalAngle = undefined;
    var magnumKeys = [",", "."];
    document.addEventListener("keydown", event => {
        if (!JWOBJ.isInMap) return;
        var key = event.key.toUpperCase();
        if (key == magnumKeys[0]) {       // 马格南仰角增大
            magnunVerticalAngle = "u";
        }
        else if (key == magnumKeys[1]) {  // 马格南仰角减小
            magnunVerticalAngle = "d";
        }
    });
    document.addEventListener("keyup", event => {
        if (!JWOBJ.isInMap) return;
        var key = event.key.toUpperCase();
        if (key == magnumKeys[0] || key == magnumKeys[1]) {
            magnunVerticalAngle = undefined;
        }
    });

    // ESP Hack (Wall Hack/ Tank OutLine Hack)
    function setTankOutline(targetTank, color, enable = true, bold = false) {
        let setOutlineAttributes = compenent => {
            var keys = Object.keys(compenent);
            if (enable) {
                compenent[keys[30]] = color;    // outline color
                compenent[keys[31]] = bold;     // outline bold
            }
            // outline enable
            compenent[keys[29]] = enable;
        };

        // hull
        var hullLodGroup = getComponentNames(targetTank?.HullSkinComponent)?.LodGroup;
        if (hullLodGroup) {
            setOutlineAttributes(hullLodGroup);
            // other hull components
            var hullList = Object.entries(getComponentNames(hullLodGroup).NativeList)[0][1];
            hullList.forEach(compennet => {
                var flag = Object.entries(compennet)[8][1];
                if (typeof flag === "string" && (flag.includes("en_") || flag.includes("wheel"))) {
                    setOutlineAttributes(compennet);
                }
            });
        }

        // weapon
        var weaponLodGroup = getComponentNames(targetTank?.WeaponSkinComponent)?.LodGroup;
        if (weaponLodGroup) {
            setOutlineAttributes(weaponLodGroup);
            // other weapon components
            var weaponList = Object.entries(getComponentNames(weaponLodGroup).NativeList)[0][1];
            weaponList.forEach(compennet => {
                setOutlineAttributes(compennet);
                var subList = getComponentNames(compennet)?.NativeList;
                if (subList) {
                    var subBarrel = Object.entries(subList)[0][1][0];
                    if (subBarrel) {
                        var flag = Object.entries(subBarrel)[8][1];
                        if (typeof flag === "string" && flag.includes("barrel")) {
                            setOutlineAttributes(subBarrel);
                        }
                    }
                }
            });
        }
    }
    // Jawon's code end ==============================================================|

    // shizoval's code start =========================================================|
    var e = {
        462: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            a(75);
            var o = a(817);
            class i {
                #e = o.vc.data.airBreakData;
                #t = false;
                #a = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                tankPhysicsComponent;
                lastPosition = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                nextTime = 0;
                get state() {
                    return this.#t;
                }
                clearVelocity = () => {
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.x] = 0;
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.y] = 0;
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.z] = 0;
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.x] = 0;
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.y] = 0;
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.z] = 0;
                };
                setAirBreakPosition = e => {
                    if (this.#e.killZoneData.state) {
                        let t = gameObjects.gameMode?.BattleMapComponent;
                        if (!t) {
                            return;
                        }
                        let a = o.P6.getKillZone(t);
                        if (e.x !== 0 && e.x >= a.maxX) {
                            e.x = a.maxX;
                        }
                        if (e.y !== 0 && e.y >= a.maxY) {
                            e.y = a.maxY;
                        }
                        if (e.z !== 0 && e.z >= a.maxZ) {
                            e.z = a.maxZ;
                        }
                        if (e.x !== 0 && e.x <= a.minX) {
                            e.x = a.minX;
                        }
                        if (e.y !== 0 && e.y <= a.minY) {
                            e.y = a.minY;
                        }
                        if (e.z !== 0 && e.z <= a.minZ) {
                            e.z = a.minZ;
                        }
                    }
                    if (e.x && e.x !== 0) {
                        this.#a.x = e.x;
                    }
                    if (e.y && e.y !== 0) {
                        this.#a.y = e.y;
                    }
                    if (e.z && e.z !== 0) {
                        this.#a.z = e.z;
                    }
                };
                onAirBreakActivated = () => {
                    const e = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                    if (e) {
                        this.setAirBreakPosition({
                            x: e[vector3.x],
                            y: e[vector3.y],
                            z: e[vector3.z]
                        });
                    }
                };
                onAirBreakDeactivated = () => {
                    this.clearVelocity();
                    this.tankPhysicsComponent[tankPhysicsComponent.body][body.movable] = true;
                };
                toggleState = () => {
                    if (this.#t = !this.#t) {
                        this.onAirBreakActivated();
                    } else {
                        this.onAirBreakDeactivated();
                    }
                };
                setRayLenght = (e, t) => {
                    if (e) {
                        e[trackedChassis.params][suspensionParams.maxRayLength] = t;
                    }
                };
                align = e => {
                    const t = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.orientation];
                    switch (e) {
                        case "noob":
                            this.clearVelocity();
                            t[quaternion.fromEulerAngles](0, this.#e.flip ? Math.PI : 0, 0);
                            break;
                        case 0:
                            this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.x] = 0;
                            this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.y] = 0;
                            this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.z] = 0;
                            t[quaternion.x] = 0;
                            t[quaternion.y] = 0;
                            break;
                        default:
                            this.clearVelocity();
                            t[quaternion.fromEulerAngles](this.#e.tilt ? this.#e.flip ? e[followCamera.pathPosition] : -e[followCamera.pathPosition] : 0, this.#e.flip ? Math.PI : 0, e[followCamera.currState][followCameraState.direction]);
                    }
                };
                alignTank = e => {
                    switch (this.#e.typeData.state) {
                        case "airWalk":
                            this.align(0);
                            break;
                        case "default":
                            this.align(e);
                            break;
                        case "noob":
                            this.align("noob");
                    }
                };
                setSmoothPosition = (e, t, a) => {
                    if (!(this.#e.typeData.state !== "default" && this.#e.typeData.state !== "noob")) {
                        e.x += (t.x - e.x) / a;
                        e.y += (t.y - e.y) / a;
                    }
                    e.z += (t.z - e.z) / a;
                };
                setPosition = () => {
                    const e = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                    const t = {
                        x: e[vector3.x],
                        y: e[vector3.y],
                        z: e[vector3.z]
                    };
                    this.setSmoothPosition(t, this.#a, this.#e.smoothData.state);
                    e[vector3.x] = t.x;
                    e[vector3.y] = t.y;
                    e[vector3.z] = t.z;
                };
                getSpeed = e => {
                    switch (e) {
                        case "forward":
                        case "right":
                        case "up":
                            return this.#e.speedData.state;
                        default:
                            return -this.#e.speedData.state;
                    }
                };
                getRadian = (e, t) => {
                    switch (e) {
                        case "forward":
                        case "back":
                            return -t;
                        case "left":
                        case "right":
                            return -(t - Math.PI / 2);
                    }
                    return 0;
                };
                onMoved = (e, t = 0) => {
                    let a = this.getSpeed(e);
                    let o = this.getRadian(e, t);
                    let i = {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                    switch (e) {
                        case "forward":
                        case "back":
                        case "left":
                        case "right":
                            switch (this.#e.typeData.state) {
                                case "default":
                                    i.x = this.#a.x + a * Math.sin(o);
                                    i.y = this.#a.y + a * Math.cos(o);
                                    break;
                                case "noob":
                                    if (!(e !== "left" && e !== "right")) {
                                        i.x = this.#a.x + a;
                                    }
                                    if (!(e !== "forward" && e !== "back")) {
                                        i.y = this.#a.y + a;
                                    }
                            }
                            break;
                        default:
                            i.z = this.#a.z + a;
                    }
                    this.setAirBreakPosition(i);
                };
                keyHandler = e => {
                    let t = this.#e.speedData;
                    if (o.P6.isBindPressed(t.inc)) {
                        t.state += 10;
                        if (t.state > 1000) {
                            t.state = 1000;
                        }
                    }
                    if (o.P6.isBindPressed(t.dec)) {
                        t.state -= 10;
                        if (t.state < 10) {
                            t.state = 10;
                        }
                    }
                    t = this.#e.smoothData;
                    if (o.P6.isBindPressed(t.inc)) {
                        t.state += 1;
                        if (t.state > 100) {
                            t.state = 100;
                        }
                    }
                    if (o.P6.isBindPressed(t.dec)) {
                        t.state -= 1;
                        if (t.state < 1) {
                            t.state = 1;
                        }
                    }
                    t = this.#e.killZoneData;
                    if (o.P6.isBindPressed(t)) {
                        t.state = !t.state;
                    }
                    t = this.#e.typeData;
                    if (o.P6.isBindPressed(t.default)) {
                        t.state = "default";
                        // changed: 如果使用匹配战斗模式，切换default模式时先把同步#a中记录的位置，否则瞬间移动会自爆，但这也导致复活后无法定位到上次的位置
                        if (JWUserData.HighSpeed) {
                            const Pos = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                            if (Pos) {
                                this.setAirBreakPosition({
                                    x: Pos[vector3.x],
                                    y: Pos[vector3.y],
                                    z: Pos[vector3.z]
                                });
                            }
                        }
                    }
                    if (o.P6.isBindPressed(t.simple)) {
                        t.state = "noob";
                    }
                    if (o.P6.isBindPressed(t.airWalk)) {
                        t.state = "airWalk";
                    }
                    t = this.#e.movementData;
                    switch (this.#e.typeData.state) {
                        case "noob":
                            if (o.P6.isBindPressed(t.up)) {
                                this.onMoved("up");
                            }
                            if (o.P6.isBindPressed(t.down)) {
                                this.onMoved("down");
                            }
                            if (o.P6.isBindPressed(t.forward)) {
                                this.onMoved("forward");
                            }
                            if (o.P6.isBindPressed(t.back)) {
                                this.onMoved("back");
                            }
                            if (o.P6.isBindPressed(t.left)) {
                                this.onMoved("left");
                            }
                            if (o.P6.isBindPressed(t.right)) {
                                this.onMoved("right");
                            }
                            break;
                        case "default":
                            if (o.P6.isBindPressed(t.forward)) {
                                this.onMoved("forward", e);
                            }
                            if (o.P6.isBindPressed(t.back)) {
                                this.onMoved("back", e);
                            }
                            if (o.P6.isBindPressed(t.left)) {
                                this.onMoved("left", e);
                            }
                            if (o.P6.isBindPressed(t.right)) {
                                this.onMoved("right", e);
                            }
                        case "airWalk":
                            if (o.P6.isBindPressed(t.up)) {
                                this.onMoved("up");
                            }
                            if (o.P6.isBindPressed(t.down)) {
                                this.onMoved("down");
                            }
                    }
                };
                randomPosition = () => {
                    const e = {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                    let t = gameObjects.gameMode?.BattleMapComponent;
                    let a = o.P6.getKillZone(t);
                    if (a) {
                        e.x = o.P6.getRandomArbitrary(a.minX, a.maxX);
                        e.y = o.P6.getRandomArbitrary(a.minY, a.maxY);
                        e.z = Math.round(Math.random()) ? a.maxZ : a.boundMaxZ + 500;
                    }
                    return e;
                };
                sendCurrentPosition = () => {
                    this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x] = this.lastPosition.x;
                    this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y] = this.lastPosition.y;
                    this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z] = this.lastPosition.z;
                    this.lastPosition.x = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x];
                    this.lastPosition.y = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y];
                    this.lastPosition.z = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z];
                };
                sendNewPosition = e => {
                    this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x] = e.x;
                    this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y] = e.y;
                    this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z] = e.z;
                    this.lastPosition.x = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.x];
                    this.lastPosition.y = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.y];
                    this.lastPosition.z = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition][vector3.z];
                };
                reset = () => {
                    this.#t = false;
                    this.tankPhysicsComponent = undefined;
                    this.nextTime = 0;
                };
                limitAirWalkKillZone = () => {
                    if (this.#e.typeData.state == "airWalk") {
                        if (this.#e.killZoneData.state) {
                            let t = gameObjects.gameMode?.BattleMapComponent;
                            if (!t) {
                                return;
                            }
                            let killZone = o.P6.getKillZone(t);
                            let velt = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity];
                            let pos = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                            if (pos[vector3.x] >= killZone.maxX) {
                                pos[vector3.x] = killZone.maxX - 20;
                                velt[vector3.x] = 0;
                            }
                            if (pos[vector3.y] >= killZone.maxY) {
                                pos[vector3.y] = killZone.maxY - 20;
                                velt[vector3.y] = 0;
                            }
                            if (pos[vector3.x] <= killZone.minX) {
                                pos[vector3.x] = killZone.minX + 20;
                                velt[vector3.x] = 0;
                            }
                            if (pos[vector3.y] <= killZone.minY) {
                                pos[vector3.y] = killZone.minY + 20;
                                velt[vector3.y] = 0;
                            }
                        }
                    }
                };
                sendDataToJawon = () => {
                    JWOBJ.TankiPos = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.position];
                    JWOBJ.TankiVel = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.velocity];
                    JWOBJ.TankiAngVel = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.angularVelocity];
                    JWOBJ.TankiDirect = this.tankPhysicsComponent[tankPhysicsComponent.body][body.state][bodyState.orientation];
                    JWOBJ.Movable = this.tankPhysicsComponent[tankPhysicsComponent.body];
                    JWOBJ.TankISPos = this.tankPhysicsComponent[tankPhysicsComponent.interpolatedPosition];
                    JWOBJ.isFling = this.#t;
                    JWOBJ.flyType = this.#e.typeData.state;
                    JWOBJ.killZone = o.P6.getKillZone(gameObjects.gameMode?.BattleMapComponent);
                    JWOBJ.killZone.isLimit = this.#e.killZoneData.state;

                    let otherTanks = o.P6.getTanks();
                    var teamTanks = [];
                    var enemyTanks = [];
                    if (o.P6.isArrayValid(otherTanks)) {
                        for (const tank of otherTanks) {
                            if (o.P6.isTankEnemy(tank)) {
                                enemyTanks.push(tank);
                            } else {
                                teamTanks.push(tank);
                            }
                        }
                    }
                    JWOBJ.teamTanks = teamTanks;
                    JWOBJ.enemyTanks = enemyTanks;

                    if (JWOBJ.isInMap) {
                        // 跳跃
                        if (JWUserData.Jump && JWOBJ.keyFlags.jump && !JWOBJ.isFling && JWOBJ.killZone.maxZ && JWOBJ.TankiPos[vector3.z]) {
                            if (JWUserData.JumpAlign) {
                                JWOBJ.TankiAngVel[vector3.x] = JWOBJ.TankiAngVel[vector3.y] = 0;
                                JWOBJ.TankiDirect[quaternion.x] = JWOBJ.TankiDirect[quaternion.y] = 0;
                            }
                            JWOBJ.TankiVel[vector3.z] = -10;
                            if (JWOBJ.killZone.isLimit && JWOBJ.TankiPos[vector3.z] + JWUserData.JumpSpeed >= JWOBJ.killZone.maxZ) {
                                JWOBJ.TankiPos[vector3.z] = JWOBJ.killZone.maxZ;
                            } else {
                                JWOBJ.TankiPos[vector3.z] += JWUserData.JumpSpeed;
                            }
                        }
                        // 改变敌方视角位置：
                        // 隐身
                        if (JWOBJ.keyFlags.hideToSky && !JWOBJ.keyFlags.shoot) {
                            if (JWOBJ.killZone.maxZ) {
                                JWOBJ.TankISPos[vector3.z] = JWOBJ.killZone.maxZ;
                            }
                        }
                        // 传送
                        else if (JWOBJ.keyFlags.posTeleport && JWOBJ.savedPos.x) {
                            JWOBJ.TankISPos[vector3.x] = JWOBJ.savedPos.x;
                            JWOBJ.TankISPos[vector3.y] = JWOBJ.savedPos.y;
                            JWOBJ.TankISPos[vector3.z] = JWOBJ.savedPos.z;
                        }
                        // antiAim 反瞄准
                        else if (JWOBJ.keyFlags.antiAim) {
                            const randomPos = this.randomPosition();
                            if (randomPos.z < JWOBJ.killZone.maxZ - 2000) {
                                randomPos.z = JWOBJ.killZone.maxZ - 2000;
                            }
                            this.sendNewPosition(randomPos);
                        }
                        // 避雷
                        else if (JWUserData.AvoidMines > 0) {
                            JWOBJ.TankISPos[vector3.z] = JWOBJ.TankiPos[vector3.z] + JWUserData.AvoidMines;
                        }

                        // 自由相机跟随武器方向和坦克位置
                        if (JWOBJ.keyFlags.freeCam && isCamFollowWeapon) {
                            var followCam = gameObjects?.localTank?.FollowCamera;
                            if (followCam) {
                                var camKeys = Object.keys(followCam);
                                // 相机参数对象
                                var cam1 = followCam[camKeys[18]];
                                var cam2 = followCam[followCamera.currState];
                                // 当前相机方向(0 ~ 2PI)
                                var camDirct = cam1[followCameraState.direction];
                                // 当前炮塔方向
                                var mgnAngle = gameObjects.localTank.CameraFollowWeaponComponent;
                                var weaponDirct = mgnAngle[Object.keys(mgnAngle)[7]];
                                // 逐渐调整相机方向
                                var deltaDirct = weaponDirct - camDirct;
                                // 相机转向速度与炮塔方向变化量成正比
                                var camTurnSpeed = 0.0008 * Math.abs(deltaDirct / (0.01745329));
                                // 先解决炮塔方向在 -PI - PI 突变的情况
                                if (Math.abs(deltaDirct) > 4) {
                                    deltaDirct = 2 * Math.PI - Math.abs(deltaDirct);
                                    camTurnSpeed = 0.0008 * Math.abs(deltaDirct / (0.01745329));
                                    var newCamDirct = camDirct + camTurnSpeed * Math.sign(camDirct);
                                    if (Math.abs(newCamDirct) > Math.PI) {
                                        newCamDirct = (2 * Math.PI - Math.abs(newCamDirct)) * -Math.sign(newCamDirct);
                                    }
                                    cam1[followCameraState.direction] = cam2[followCameraState.direction] = newCamDirct;
                                }
                                else if (deltaDirct > camTurnSpeed) {
                                    cam1[followCameraState.direction] = cam2[followCameraState.direction] += camTurnSpeed;
                                }
                                else if (deltaDirct < -camTurnSpeed) {
                                    cam1[followCameraState.direction] = cam2[followCameraState.direction] -= camTurnSpeed;
                                }

                                // 相机位置跟随坦克
                                var keys = Object.keys(cam1);
                                var camPosXYOffset = 0.6 * (cam1[keys[0]][vector3.z] - JWOBJ.TankiPos[vector3.z]);
                                var deltaX = JWOBJ.TankiPos[vector3.x] + camPosXYOffset * Math.sin(camDirct) - cam1[keys[0]][vector3.x];
                                var deltaY = JWOBJ.TankiPos[vector3.y] - camPosXYOffset * Math.cos(camDirct) - cam1[keys[0]][vector3.y];
                                var deltaZ = JWOBJ.TankiPos[vector3.z] + camHeightOffset - cam1[keys[0]][vector3.z];
                                // 相机移动速度
                                var camMoveSpeedX = (deltaX) / 10;
                                var camMoveSpeedY = (deltaY) / 10;
                                var camMoveSpeedZ = (deltaZ) / 10;
                                cam1[keys[0]][vector3.x] = cam2[keys[0]][vector3.x] += camMoveSpeedX;
                                cam1[keys[0]][vector3.y] = cam2[keys[0]][vector3.y] += camMoveSpeedY;
                                cam1[keys[0]][vector3.z] = cam2[keys[0]][vector3.z] += camMoveSpeedZ;
                                CopyOBJRecursively(cam1, cam2);
                            }
                        }

                        // 马格南炮塔仰俯角度调整
                        if (magnunVerticalAngle) {
                            var mgnAngle = getComponentNames(gameObjects?.localTank?.ArtilleryGunParams)?.TurretComponent;
                            if (mgnAngle) {
                                if (magnunVerticalAngle === "u") {
                                    mgnAngle[Object.keys(mgnAngle)[23]] += 0.005;
                                }
                                else if (magnunVerticalAngle === "d") {
                                    mgnAngle[Object.keys(mgnAngle)[23]] -= 0.005;
                                }
                            }
                        }
                    }
                };
                process = (e, t) => {
                    if (e && t) {
                        this.tankPhysicsComponent = e;
                        if (!this.tankPhysicsComponent) {
                            return;
                        }
                        if (o.P6.isBindPressed(this.#e.toggleStateData)) {
                            this.toggleState();
                        }
                        if (this.#t === true) {
                            this.keyHandler(t[followCamera.currState][followCameraState.direction]);
                            this.alignTank(t);
                            this.setPosition();
                            this.limitAirWalkKillZone();
                            this.tankPhysicsComponent[tankPhysicsComponent.body][body.movable] = this.#e.typeData.state === "airWalk";
                        }
                        this.sendDataToJawon();
                        this.blttlpt();
                    }
                };

                blttlpt = () => {
                    if (!JWOBJ.keyFlags.bulletTeleport) {
                        if (gameObjects?.localTank?.[selfectry]?.[toBltSpd1]?.[toBltSpd2] !== undefined &&
                            oldBulletSpeed !== undefined) {
                            gameObjects.localTank[selfectry][toBltSpd1][toBltSpd2] = oldBulletSpeed;
                            rsvftp();
                        }
                        return;
                    }
                    if (selfectry && !gameObjects?.localTank?.[selfectry]) {
                        rsvftp();
                        return;
                    }
                    if (!selfectry || !toBltSpd1 || !toBltSpd2) {
                        fbvs();
                        return;
                    }
                    gameObjects.localTank[selfectry][toBltSpd1][toBltSpd2] = 1e-100;

                    if (!(toArr1 && toArr2 && toPos1 && toPos2 && toPos3 && toDirc)) {
                        fbvs();
                        return;
                    }
                    var tgtPos = JWOBJ.currTarget?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position];
                    var bullets = gameObjects.localTank[selfectry][toArr1][toArr2].toArray();
                    currBulletNumInAir = bullets.length;

                    if (bullets.length >= 1) {
                        bullets.forEach(bullet => {
                            bullet[toPos1][toPos2][1][toDirc][vector3.x] = 0;
                            bullet[toPos1][toPos2][1][toDirc][vector3.y] = 0;
                        });
                        if (tgtPos && JWUserData.bulletTPNum === 1 && !TPtimeoutSeted) {
                            TPtimeoutSeted = true;
                            var deltaX = Math.floor(tgtPos[vector3.x] - JWOBJ.TankiPos[vector3.x]);
                            var deltaY = Math.floor(tgtPos[vector3.y] - JWOBJ.TankiPos[vector3.y]);
                            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                            if (distance > oldBulletSpeed) distance = oldBulletSpeed;
                            var TPDelay = Math.floor(1000 * (distance / oldBulletSpeed));
                            setTimeout(() => {
                                bullets.forEach(bullet => {
                                    var b_pos = bullet[toPos1][toPos2][1][toPos3];
                                    b_pos[vector3.x] = tgtPos[vector3.x];
                                    b_pos[vector3.y] = tgtPos[vector3.y];
                                    b_pos[vector3.z] = tgtPos[vector3.z];
                                });
                                setTimeout(() => {
                                    TPtimeoutSeted = false;
                                }, 50);
                            }, TPDelay);
                        }
                        else if (tgtPos && JWOBJ.keyFlags.TPSomeBullets) {
                            JWOBJ.keyFlags.TPSomeBullets = false;
                            var bulletsDistc = [];
                            for (let i = 0; i < bullets.length; i++) {
                                var deltaX = Math.floor(tgtPos[vector3.x] - bullets[i][toPos1][toPos2][1][toPos3][vector3.x]);
                                var deltaY = Math.floor(tgtPos[vector3.y] - bullets[i][toPos1][toPos2][1][toPos3][vector3.y]);
                                var deltaZ = Math.floor(tgtPos[vector3.z] - bullets[i][toPos1][toPos2][1][toPos3][vector3.z]);
                                var distance = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
                                bulletsDistc.push({ index: i, distc: distance });
                            }
                            bulletsDistc.sort(function (a, b) {
                                return a.distc - b.distc;
                            });
                            for (let i = 0; i < bullets.length; i++) {
                                if (i === JWUserData.bulletTPNum) break;
                                var b_pos = bullets[bulletsDistc[i].index][toPos1][toPos2][1][toPos3];
                                b_pos[vector3.x] = tgtPos[vector3.x];
                                b_pos[vector3.y] = tgtPos[vector3.y];
                                b_pos[vector3.z] = tgtPos[vector3.z];
                            }
                        }
                        else if (JWUserData.writeLetter) {
                            if (!JWOBJ.savedPos?.x && JWOBJ.TankiPos?.[vector3.x]) {
                                JWOBJ.savedPos.x = JWOBJ.TankiPos?.[vector3.x];
                                JWOBJ.savedPos.y = JWOBJ.TankiPos?.[vector3.y];
                                JWOBJ.savedPos.z = JWOBJ.TankiPos?.[vector3.z];
                            }
                            if (!JWOBJ.savedPos?.x) return;

                            // 对字母分类
                            var commonChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz";
                            var lowWChars = "Iil";
                            var currBulletIndex = 0;
                            var currOffsetX = 0;
                            var currOffsetY = 0;
                            for (let i = 0; i < JWUserData.writeLetter.length; i++) {
                                var currLt = JWUserData.writeLetter[i];
                                if (commonChars.includes(currLt)) {
                                    // 如果上个字母是窄字母
                                    if (i > 0 && lowWChars.includes(JWUserData.writeLetter[i - 1]))
                                        currOffsetX += letterPath.letterW * 0.8;
                                    else
                                        currOffsetX += letterPath.letterW * 0.96;
                                }
                                else if (lowWChars.includes(currLt)) {
                                    currOffsetX += letterPath.letterW * 0.8;
                                }
                                else if (currLt === ",") {
                                    currOffsetX = 0;
                                    currOffsetY += letterPath.letterH;
                                    continue;
                                }
                                else {
                                    currOffsetX += letterPath.letterW * 0.5;
                                    continue;
                                }
                                var pixs = letterPath[currLt];
                                var pixsNum = letterPath[currLt].length;
                                for (let n = 0; n < pixsNum; n++) {
                                    var currpixX = Math.floor(pixs[n].x + currOffsetX);
                                    var currpixY = pixs[n].y + currOffsetY;
                                    var b_pos = bullets[currBulletIndex][toPos1][toPos2][1][toPos3];
                                    b_pos[vector3.x] = JWOBJ.savedPos.x - currpixX * 60;
                                    b_pos[vector3.y] = JWOBJ.savedPos.y + currpixY * 60;
                                    b_pos[vector3.z] = JWUserData.BulletTPHeight;
                                    currBulletIndex++;
                                    if (currBulletIndex === bullets.length) break;
                                }
                                if (currBulletIndex === bullets.length) break;
                            }
                        }
                    }
                };
            }
        },

        38: (e, t, a) => {
            a.d(t, {
                Z: () => s
            });
            var o = a(817);
            let i = "";
            let n = "";
            class s {
                #o = 1500;
                #i = false;
                #n = false;
                #s;
                #e = o.vc.data.cameraData;
                reset = () => {
                    this.#i = false;
                    this.#s = undefined;
                };
                distance = () => {
                    if (this.#e.state) {
                        this.#o += 1000;
                        if (this.#o > 2500) {
                            this.#o = 500;
                        }
                    }
                };
                process = (e, t) => {
                    if (o.P6.isBindPressed(this.#e)) {
                        this.distance();
                    }
                    if (this.#i) {
                        return;
                    }
                    if (!e || !t) {
                        return;
                    }
                    function a(e, t, a) {
                        if (e < t) {
                            return t;
                        } else if (e > a) {
                            return a;
                        } else {
                            return e;
                        }
                    }
                    this.#s = e;
                    e[followCamera.polarDistance].copy = e[followCamera.polarDistance][dampedSpring.update];
                    e[followCamera.pitch].copy = e[followCamera.pitch][dampedSpring.update];
                    e[followCamera.elevation].copy = e[followCamera.elevation][dampedSpring.update];
                    e.copy = e[followCamera.updatePath];
                    e[followCamera.updatePath] = function (e) {
                        if (o.$l.#e.state === false || !document.pointerLockElement) {
                            return this.copy(e);
                        }
                        const t = a(e, -Math.PI / 2, Math.PI / 2);
                        this[followCamera.pathPointElevation] = this[followCamera.pathPosition] = t;
                        this[followCamera.pathPositionOffset] = a(this[followCamera.pathPositionOffset], -t, 1 - t);
                    };
                    e[followCamera.polarDistance][dampedSpring.update] = function (e, t) {
                        if (o.$l.#e.state === false || !document.pointerLockElement) {
                            return this.copy(e, t);
                        }
                        this[dampedSpring.value] += (o.$l.#o - this[dampedSpring.value]) / 20;
                    };
                    e[followCamera.pitch][dampedSpring.update] = function (t, a) {
                        if (o.$l.#e.state === false || !document.pointerLockElement) {
                            return this.copy(t, a);
                        }
                        this[dampedSpring.value] = e[followCamera.pathPosition];
                    };
                    e[followCamera.elevation][dampedSpring.update] = function (t, a) {
                        if (o.$l.#e.state === false || !document.pointerLockElement) {
                            return this.copy(t, a);
                        }
                        this[dampedSpring.value] = e[followCamera.pathPosition] + 0.3;
                    };
                    t[followCameraHeightController.getTickEnabled] = function () {
                        return o.$l.#e.state === false || !document.pointerLockElement;
                    };
                    if (this.#n !== true) {
                        document.addEventListener("mousemove", t => {
                            if (this.#e.state !== false && this.#s && document.pointerLockElement) {
                                this.#s[followCamera.pathPosition] += t.movementY * 0.001; // changed: 加快了鼠标视角的速度
                                e[followCamera.updatePath](this.#s[followCamera.pathPosition]);
                            }
                        }, false);
                        this.#n = true;
                    }
                    const s = getComponentNames(gameObjects.localTank?.FollowCamera)?.CameraComponent;
                    if (s && (n || (n = Object.entries(s.__proto__)[1][0], n))) {
                        if (!s.copy) {
                            s.copy = s[n];
                        }
                        s[n] = function (e) {
                            if (!i) {
                                i = Object.entries(e)[0][0];
                            }
                            this.copy(e);
                            e[i] = o.vc.data.cameraData.fov;
                        };
                        this.#i = true;
                    }
                };
            }
        },
        24: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            class i {
                #e = o.vc.data.clickerData;
                temp = false;
                firstAid;
                mine;
                nativeIdentityMap;
                constructor() {
                    setInterval(this.suppliesLowPriority, 300);
                    setInterval(this.suppliesHighPriority, 0);
                }
                reset = () => {
                    this.temp = false;
                    this.firstAid = undefined;
                    this.mine = undefined;
                    this.nativeIdentityMap = undefined;
                };
                getSupplyByName = e => {
                    if (e === "MINE") {
                        if (!this.mine) {
                            this.mine = getComponentNames(
                                getComponentNames(
                                    getComponentNames(
                                        getComponentNames(
                                            o.UJ.localTank?.SuppliesComponent || o.UJ.localTank?.SuppliesHudComponent
                                        )?.LinkedHashMap
                                    )?.ChainEntry
                                )?.ChainEntry
                            )?.SupplyTypeConfig;
                        }
                        if (!this.mine) {
                            this.mine = Object.entries(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.SuppliesComponent).LinkedHashMap).InternalHashMap))[1][1][1];
                        }
                        return this.mine;
                    }
                    else if (e === "FIRST_AID") {
                        if (!this.firstAid) {
                            this.firstAid = getComponentNames(
                                getComponentNames(
                                    getComponentNames(
                                        o.UJ.localTank?.SuppliesComponent || o.UJ.localTank?.SuppliesHudComponent
                                    )?.LinkedHashMap
                                )?.ChainEntry
                            )?.SupplyTypeConfig;
                        }
                        if (!this.firstAid) {
                            this.firstAid = Object.entries(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.SuppliesComponent).LinkedHashMap).InternalHashMap))[1][1][0];
                        }
                        return this.firstAid;
                    }
                    else {
                        return undefined;
                    }
                };
                activateSupply = (e, t, a = 30) => {
                    if (!this.nativeIdentityMap) {
                        const e = getComponentNames(o.UJ.world?.InputManager);
                        const t = getComponentNames(e?.Input);
                        if (!t?.NativeIdentityMap_3) {
                            return;
                        }
                        this.nativeIdentityMap = Object.entries(t.NativeIdentityMap_3)?.[0]?.[1];
                        if (!this.nativeIdentityMap) {
                            return;
                        }
                    }
                    if (t) {
                        const t = Array.from(this.nativeIdentityMap);
                        if (!o.P6.isArrayValid(t)) {
                            return;
                        }
                        for (const a of t) {
                            if (window.action.name) {
                                if (a[0][window.action.name] === e) {
                                    a[1][window.action.wasPressed] = true;
                                    return void (a[1][window.action.wasRelesed] = true);
                                }
                            } else {
                                getName(window.action, "name", "action.name", a[0], 0);
                                getName(window.action, "wasPressed", "action", a[1], 1);
                                getName(window.action, "wasRelesed", "action", a[1], 2);
                            }
                        }
                    }
                    if (o.oQ.responseTime <= a) {
                        this.getSupplyByName(e)?.[supplies.onUserActivatedSupply]?.();
                    }
                };
                suppliesHighPriority = () => {
                    if (this.#e.autoHealingData.state || this.temp !== false) {
                        for (let e = 0; e < this.#e.autoHealingData.multiply; e++) {
                            this.activateSupply("FIRST_AID", false, this.#e.autoHealingData.delay);
                        }
                    }
                    if (this.#e.autoMiningData.state || this.temp !== false) {
                        for (let e = 0; e < this.#e.autoMiningData.multiply; e++) {
                            this.activateSupply("MINE", false, this.#e.autoMiningData.delay);
                        }
                    }
                };
                suppliesLowPriority = () => {
                    if (this.#e.autoArmorData.state) {
                        this.activateSupply("USE_DOUBLE_ARMOR", true);
                    }
                    if (this.#e.autoDamageData.state) {
                        this.activateSupply("USE_DOUBLE_DAMAGE", true);
                    }
                    if (this.#e.autoNitroData.state) {
                        this.activateSupply("USE_NITRO", true);
                    }
                };
                process = () => {
                    if (o.P6.isBindPressed(this.#e.autoHealingData)) {
                        this.#e.autoHealingData.state = !this.#e.autoHealingData.state;
                    }
                    if (o.P6.isBindPressed(this.#e.autoArmorData)) {
                        this.#e.autoArmorData.state = !this.#e.autoArmorData.state;
                    }
                    if (o.P6.isBindPressed(this.#e.autoDamageData)) {
                        this.#e.autoDamageData.state = !this.#e.autoDamageData.state;
                    }
                    if (o.P6.isBindPressed(this.#e.autoNitroData)) {
                        this.#e.autoNitroData.state = !this.#e.autoNitroData.state;
                    }
                    if (o.P6.isBindPressed(this.#e.autoMiningData)) {
                        this.#e.autoMiningData.state = !this.#e.autoMiningData.state;
                    }
                };
            }
        },
        551: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            class i {
                freezeTank = e => {
                    const t = e.TankPhysicsComponent;
                    if (t) {
                        if (o.vc.data.otherData.freezeTanks) {
                            t[tankPhysicsComponent.body][body.movable] = false;
                            t[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.x] = 0;
                            t[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.y] = 0;
                            t[tankPhysicsComponent.body][body.state][bodyState.angularVelocity][vector3.z] = 0;
                            t[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.x] = 0;
                            t[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.y] = 0;
                            t[tankPhysicsComponent.body][body.state][bodyState.velocity][vector3.z] = 0;
                        } else {
                            t[tankPhysicsComponent.body][body.movable] = true;
                        }
                    }
                };
                bodyParser = () => {
                    const e = o.P6.getTanks();
                    if (o.P6.isArrayValid(e)) {
                        for (const t of e) {
                            this.freezeTank(t);
                        }
                    }
                };
                shootDelay = 0;
                process = e => {
                    this.bodyParser();
                    if (e && o.vc.data.otherData.autoShot) {
                        if (JWOBJ.TankiState.currTurret && (
                            JWOBJ.TankiState.currTurret === "Gauss" ||
                            JWOBJ.TankiState.currTurret === "Striker" ||
                            JWOBJ.TankiState.currTurret === "Scorpio" ||
                            JWOBJ.TankiState.currTurret === "Shaft")
                        ) {
                            if (this.shootDelay > 1) {
                                this.shootDelay = 0;
                                e[window.weaponTrigger.pulled] = !e[window.weaponTrigger.pulled];
                            }
                            this.shootDelay++;
                        } else {
                            e[window.weaponTrigger.pulled] = true;
                        }
                    }
                };
            }
        },
        956: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            class i {
                #e = o.vc.data.removeMinesData;
                removeMines;
                reset = () => {
                    this.removeMines = undefined;
                };
                process = () => {
                    if (this.removeMines) {
                        if (this.#e.state) {
                            this.removeMines();
                        }
                    } else {
                        let e = 0;
                        const t = getComponentNames(o.UJ.gameMode?.original[0])?.BattleEntity?.[battleEntity.callBacks];
                        if (!o.P6.isArrayValid(t)) {
                            return;
                        }
                        for (const a of t) {
                            if (!signal.functions) {
                                signal.functions = getByIndex(a, 0)?.[0];
                                if (signal.functions) {
                                    console.log("[Jawon] signal.functions Found: " + signal.functions);
                                }
                            }
                            if (a?.[signal.functions]?.[nativeList.array]) {
                                for (const o of a[signal.functions][nativeList.array]) {
                                    if (!signalBind.callBack) {
                                        signalBind.callBack = getByIndex(o, 1)?.[0];
                                        if (signalBind.callBack) {
                                            console.log("[Jawon] signalBind.callBack Found: " + signalBind.callBack);
                                        }
                                    }
                                    if (o[signalBind.callBack]?.callableName === "removeMines") {
                                        return void (this.removeMines = t[e + 5][signal.functions][nativeList.array][0][signalBind.callBack]);
                                    }
                                }
                            }
                            e++;
                        }
                    }
                };
            }
        },
        867: (e, t, a) => {
            a.d(t, {
                Z: () => n
            });
            var o = a(817);
            var i = a(75);
            class n {
                #r;
                #o = 0;
                #l = 0;
                #e = o.vc.data.stickData;
                reset = () => {
                    this.#r = undefined;
                    this.#o = 0;
                };
                stick = e => {
                    this.#r = e;
                };
                keyHandler = () => {
                    if (o.P6.getKeyState("Minus")) {
                        this.#o -= 10;
                    }
                    if (o.P6.getKeyState("Equal")) {
                        this.#o += 10;
                    }
                    if (this.#o > 3000) {
                        this.#o = 3000;
                    }
                    if (this.#o < -3000) {
                        this.#o = -3000;
                    }
                };
                nextTarget = () => {
                    let e = o.P6.getTanks();
                    if (o.P6.isArrayValid(e)) {
                        if (this.#l >= e.length) {
                            this.#l = 0;
                        }
                        this.#r = e[this.#l];
                        this.#l++;
                    }
                };
                process = e => {
                    if (o.P6.isBindPressed(this.#e.deactivateData)) {
                        if (this.#r) {
                            this.#r = undefined;
                        }
                        else {
                            this.nextTarget();
                        }
                    }
                    if (o.P6.isBindPressed(this.#e.nextTargetData) && this.#r) {
                        this.nextTarget();
                    }
                    if (!this.#r || !e) {
                        JWOBJ.isStick = false;
                        return void (o.Ri.state || (e[tankPhysicsComponent.body][body.movable] = true));
                    }
                    JWOBJ.isStick = true;

                    e[tankPhysicsComponent.body][body.movable] = false;
                    let t = e[tankPhysicsComponent.body][body.state];
                    let a = this.#r.TankPhysicsComponent?.[tankPhysicsComponent.body][body.state];
                    if (!t || !a) {
                        return;
                    }
                    let n = {
                        [vector3.x]: 0,
                        [vector3.y]: 0,
                        [vector3.z]: 0
                    };
                    a[bodyState.orientation][quaternion.getYAxis](n);
                    let s = Math.atan2(n[vector3.y], n[vector3.x]);
                    const r = {
                        x: a[bodyState.position][vector3.x] - this.#o * Math.sin(-(s - Math.PI / 2)),
                        y: a[bodyState.position][vector3.y] - this.#o * Math.cos(-(s - Math.PI / 2)),
                        z: a[bodyState.position][vector3.z]
                        // z: a[bodyState.position][vector3.z] + this.#o
                    };
                    let l = o.P6.isNotKillZone(r);
                    if (l !== i.W.None) {
                        o.P6.outKillZone(r, l);
                    }
                    t[bodyState.position][vector3.x] = r.x;
                    t[bodyState.position][vector3.y] = r.y;
                    t[bodyState.position][vector3.z] = r.z;
                    t[bodyState.orientation][quaternion.x] = a[bodyState.orientation][quaternion.x];
                    t[bodyState.orientation][quaternion.y] = a[bodyState.orientation][quaternion.y];
                    t[bodyState.orientation][quaternion.z] = a[bodyState.orientation][quaternion.z];
                    t[bodyState.orientation][quaternion.w] = a[bodyState.orientation][quaternion.w];
                    t[bodyState.angularVelocity][vector3.x] = 0;
                    t[bodyState.angularVelocity][vector3.y] = 0;
                    t[bodyState.angularVelocity][vector3.z] = 0;
                    t[bodyState.velocity][vector3.x] = 0;
                    t[bodyState.velocity][vector3.y] = 0;
                    t[bodyState.velocity][vector3.z] = 0;
                    this.keyHandler();
                };
            }
        },
        125: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            var rktTag = "";
            class i {
                #i = false;
                #e = o.vc.data.weaponData.strikerData;
                rocketTP = {
                    target: undefined,
                    state: false,
                    timeout: undefined,
                    teleportToTarget: false
                };
                myRockets = [];
                reset = () => {
                    this.#i = false;
                    this.rocketTP = {
                        target: undefined,
                        state: false,
                        timeout: undefined,
                        teleportToTarget: false
                    };
                };
                shellsTeleport = e => {
                    const t = this.#e.shellsTeleportData;
                    const a = e[strikerRocketFactory.shellCache][cacheImpl.itemInUse].toArray();
                    if (JWOBJ.currTarget?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position]) {
                        this.rocketTP.target = JWOBJ.currTarget;
                    }
                    if (!(t.state && JWOBJ.keyFlags.bulletTeleport) || !this.rocketTP.target) {
                        this.rocketTP.target = undefined;
                        return;
                    }
                    var tgtPos = this.rocketTP.target?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position];
                    if (a.length <= 0) {
                        this.myRockets = [];
                        this.rocketTP.teleportToTarget = false;
                        return;
                    }
                    o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body][body.state][bodyState.position];
                    for (const e of a) {
                        const t = e[battleEntity.components][nativeList.array][shellComponents.strikerRocket];
                        if (t) {
                            if (!strikerRocket.direction) {
                                strikerRocket.direction = getByIndex(t, 10)?.[0];
                                if (strikerRocket.direction) {
                                    console.log("[Jawon] strikerRocket.direction Found: " + strikerRocket.direction);
                                }
                            }
                            if (!strikerRocket.position) {
                                strikerRocket.position = getByIndex(t, 9)?.[0];
                                if (strikerRocket.position) {
                                    console.log("[Jawon] strikerRocket.position Found: " + strikerRocket.position);
                                }
                            }
                            t[strikerRocket.direction][vector3.x] = 0;
                            t[strikerRocket.direction][vector3.y] = 0;
                            t[strikerRocket.direction][vector3.z] = 0;
                        }
                    }
                    if (rktTag === "") {
                        var keys = Object.keys(a[0]);
                        for (let i = 0; i < keys.length; i++) {
                            if (typeof (a[0][keys[i]]) === "number") {
                                rktTag = keys[i];
                                console.log("[Jawon] rktTag Found: " + rktTag);
                                break;
                            }
                        }
                        if (rktTag === "") {
                            console.log("[Jawon] error: not Find rktTag ");
                            return;
                        }
                    }
                    for (let j = 0; j < a.length; j++) {
                        var rktPos = a[j]?.[battleEntity.components]?.[nativeList.array]?.[
                            shellComponents.strikerRocket]?.[strikerRocket.position];
                        var moved = undefined;
                        for (let i = 0; i < this.myRockets.length; i++) {
                            if (this.myRockets[i].tag === a[j]?.[rktTag]) {
                                moved = this.myRockets[i].moved;
                                break;
                            }
                        }
                        if (JWUserData.RocketMode === "1") {
                            if (moved === undefined) {
                                var rktInfo = {
                                    moved: 0,
                                    tag: a[j]?.[rktTag]
                                };
                                this.myRockets.push(rktInfo);
                                setTimeout(() => {
                                    var upTimes = 20;
                                    var upItv = setInterval(() => {
                                        if (upTimes > 0) {
                                            var deltaH = (JWUserData.BulletTPHeight - rktPos[vector3.z]) / upTimes;
                                            rktPos[vector3.z] += deltaH;
                                        } else {
                                            clearInterval(upItv);
                                        }
                                        upTimes--;
                                    }, 50);
                                }, 900);
                                setTimeout(() => {
                                    var moveTimes = 20;
                                    var moveItv = setInterval(() => {
                                        if (moveTimes > 0) {
                                            var deltaX = 0;
                                            var deltaY = 0;
                                            if (a.length > 2) {
                                                deltaX = ((tgtPos[vector3.x] - 100 + 50 * j) - rktPos[vector3.x]) / moveTimes;
                                                deltaY = ((tgtPos[vector3.y] - 25 + 50 * (j % 2)) - rktPos[vector3.y]) / moveTimes;
                                            } else {
                                                deltaX = ((tgtPos[vector3.x]) - rktPos[vector3.x]) / moveTimes;
                                                deltaY = ((tgtPos[vector3.y]) - rktPos[vector3.y]) / moveTimes;
                                            }
                                            rktPos[vector3.x] += deltaX;
                                            rktPos[vector3.y] += deltaY;
                                        } else {
                                            clearInterval(moveItv);
                                        }
                                        moveTimes--;
                                    }, 50);
                                }, 1900);
                                setTimeout(() => {
                                    var downTimes = 8;
                                    var downItv = setInterval(() => {
                                        if (downTimes > 0) {
                                            var deltaH = ((tgtPos[vector3.z] + 220) - rktPos[vector3.z]) / downTimes;
                                            rktPos[vector3.z] += deltaH;
                                        } else {
                                            rktInfo.moved = 2;
                                            clearInterval(downItv);
                                        }
                                        downTimes--;
                                    }, 50);
                                    rktInfo.moved = 1;
                                }, 3000);
                            }
                            else if (moved !== 0 && a.length < 4) {
                                var deltaX = tgtPos[vector3.x] - rktPos[vector3.x];
                                var deltaY = tgtPos[vector3.y] - rktPos[vector3.y];
                                var deltaZ = tgtPos[vector3.z] - rktPos[vector3.z];
                                if (Math.abs(deltaX) > 200) {
                                    rktPos[vector3.x] += deltaX * 1.5;
                                }
                                if (Math.abs(deltaY) > 200) {
                                    rktPos[vector3.y] += deltaY * 1.5;
                                }
                                if (moved === 2 && Math.abs(deltaZ) > 300) {
                                    rktPos[vector3.z] = tgtPos[vector3.z] + 220;
                                }
                            }
                        }
                        else if (JWUserData.RocketMode === "2" || JWUserData.RocketMode === "3") {
                            if (moved === undefined) {
                                var rktInfo = {
                                    moved: 0,
                                    tag: a[j]?.[rktTag]
                                };
                                this.myRockets.push(rktInfo);
                                var stayTime = 500;
                                var upTime = 350;
                                var upStayTime = 0;
                                var moveTime = 1400;
                                var moveStayTime = 0;
                                var downTime = 210;
                                var movItvTime = 70;
                                if (JWUserData.RocketMode === "3") {
                                    stayTime = 500;
                                    upTime = 80;
                                    upStayTime = 0;
                                    moveTime = 2000;
                                    moveStayTime = 0;
                                    downTime = 500;
                                    movItvTime = 100;
                                }
                                var upItv = 0;
                                setTimeout(() => {
                                    var upTimes = Math.floor(upTime / movItvTime);
                                    upItv = setInterval(() => {
                                        if (upTimes > 0) {
                                            rktPos[vector3.z] += (JWUserData.BulletTPHeight - rktPos[vector3.z]) / upTimes;
                                        } else {
                                            clearInterval(upItv);
                                        }
                                        upTimes--;
                                    }, movItvTime);
                                }, stayTime);
                                var moveItv = 0;
                                setTimeout(() => {
                                    clearInterval(upItv);
                                    rktPos[vector3.z] = JWUserData.BulletTPHeight;
                                    var moveTimes = Math.floor(moveTime / movItvTime);
                                    moveItv = setInterval(() => {
                                        if (moveTimes > 0) {
                                            rktPos[vector3.x] += (tgtPos[vector3.x] - rktPos[vector3.x]) / moveTimes;
                                            rktPos[vector3.y] += (tgtPos[vector3.y] - rktPos[vector3.y]) / moveTimes;
                                        } else {
                                            clearInterval(moveItv);
                                        }
                                        moveTimes--;
                                    }, movItvTime);
                                }, stayTime + upTime + upStayTime);
                                setTimeout(() => {
                                    clearInterval(moveItv);
                                    rktPos[vector3.x] = tgtPos[vector3.x];
                                    rktPos[vector3.y] = tgtPos[vector3.y];
                                    rktInfo.moved = 1;
                                    var downTimes = Math.floor(downTime / movItvTime);
                                    var downItv = setInterval(() => {
                                        if (downTimes === 1) {
                                            rktPos[vector3.x] = tgtPos[vector3.x];
                                            rktPos[vector3.y] = tgtPos[vector3.y];
                                            rktPos[vector3.z] = tgtPos[vector3.z];
                                            rktInfo.moved = 2;
                                            clearInterval(downItv);
                                        } else {
                                            rktPos[vector3.z] += (tgtPos[vector3.z] - rktPos[vector3.z]) / downTimes;
                                        }
                                        downTimes--;
                                    }, movItvTime);
                                }, stayTime + upTime + upStayTime + moveTime + moveStayTime);
                            }
                            else if (moved !== 0) {
                                rktPos[vector3.x] = tgtPos[vector3.x];
                                rktPos[vector3.y] = tgtPos[vector3.y];
                                if (moved === 2) {
                                    rktPos[vector3.z] = tgtPos[vector3.z];
                                }
                            }
                        }
                        else if (JWUserData.RocketMode === "-" && this.rocketTP.teleportToTarget === true) {
                            rktPos[vector3.x] = tgtPos[vector3.x];
                            rktPos[vector3.y] = tgtPos[vector3.y];
                            rktPos[vector3.z] = tgtPos[vector3.z];
                            if (j === a.length - 1) {
                                this.rocketTP.teleportToTarget = false;
                            }
                        }
                    }
                    // 如果使用的不是原版
                    if (JWUserData.RocketMode !== "-") {
                        // 更新已储存的信息
                        this.myRockets.forEach(myRocket => {
                            // 寻找当前信息
                            var isExist = false;
                            for (let i = 0; i < a.length; i++) {
                                if (a[i]?.[rktTag] === myRocket.tag) {
                                    isExist = true;
                                    break;
                                }
                            }
                            // 如果当前信息已消失
                            if (!isExist) {
                                // 删除当前的信息
                                this.myRockets = this.myRockets.filter(item => item.tag !== myRocket.tag);
                            }
                        });
                    }
                    else {
                        if (!this.rocketTP.timeout) {
                            this.rocketTP.teleportToTarget = false;
                            this.rocketTP.timeout = setTimeout(() => {
                                this.rocketTP.teleportToTarget = true;
                                setTimeout(() => {
                                    this.rocketTP.timeout = undefined;
                                }, 100);
                            }, 2300);
                        }
                    }
                };
                process = e => {
                    if (!e) {
                        return;
                    }
                    this.shellsTeleport(e);
                    if (this.#i) {
                        return;
                    }
                    let t = getComponentNames(getComponentNames(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.StrikerWeapon)?.StrikerTargetingSystem)?.TargetingSystemWithHorizontalAimAssist)?.TargetingSystemImpl)?.SectorDirectionCalculator)?.TargetingSectorsCalculator;
                    if (t || (t = getComponentNames(getComponentNames(getComponentNames(getComponentNames(o.UJ.localTank?.StrikerWeapon)?.StrikerTargetingSystem)?.TargetingSystemImpl)?.SectorDirectionCalculator)?.TargetingSectorsCalculator, t)) {
                        if (!targetingSectorsCalculator.minElevationAngle) {
                            targetingSectorsCalculator.minElevationAngle = getByIndex(t, 1)?.[0];
                            if (targetingSectorsCalculator.minElevationAngle) {
                                console.log("[Jawon] targetingSectorsCalculator.minElevationAngle Found: " + targetingSectorsCalculator.minElevationAngle);
                            }
                        }
                        if (!targetingSectorsCalculator.maxElevationAngle) {
                            targetingSectorsCalculator.maxElevationAngle = getByIndex(t, 2)?.[0];
                            if (targetingSectorsCalculator.maxElevationAngle) {
                                console.log("[Jawon] targetingSectorsCalculator.maxElevationAngle Found: " + targetingSectorsCalculator.maxElevationAngle);
                            }
                        }
                        t[targetingSectorsCalculator.minElevationAngle] = -1 / 0;
                        t[targetingSectorsCalculator.maxElevationAngle] = 1 / 0;
                        this.#i = true;
                    }
                };
            }
        },
        842: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            class i {
                #e = o.vc.data.wallHackData;
                nameDistance = (e, alpha) => {
                    if (!userTitleComponent.currentAlpha) {
                        getName(userTitleComponent, "currentAlpha", "userTitleComponent", e.UserTitleComponent, 10);
                    }
                    if (!userTitleComponent.userTitleConfiguration) {
                        getName(userTitleComponent, "userTitleConfiguration", "userTitleComponent", e.UserTitleComponent, 13);
                    }
                    if (!userTitleComponent.userNameBar) {
                        getName(userTitleComponent, "userNameBar", "userTitleComponent", e.UserTitleComponent, 16);
                    }
                    if (!userNameBar.renderStage) {
                        getName(userNameBar, "renderStage", "userNameBar", e.UserTitleComponent?.[userTitleComponent.userNameBar], 19);
                    }
                    if (!renderStage.ordinal) {
                        getName(renderStage, "ordinal", "renderStage", e.UserTitleComponent?.[userTitleComponent.userNameBar]?.[userNameBar.renderStage], 1);
                    }
                    if (!userTitleConfiguration.name) {
                        getName(userTitleConfiguration, "name", "userTitleConfiguration", e.UserTitleComponent?.[userTitleComponent.userTitleConfiguration], 0);
                    }
                    if (e.UserTitleComponent?.[userTitleComponent.userNameBar]?.[userNameBar.renderStage]?.[renderStage.ordinal]) {
                        e.UserTitleComponent[userTitleComponent.currentAlpha] = alpha;
                        e.UserTitleComponent[userTitleComponent.userNameBar][userNameBar.renderStage][renderStage.ordinal] = 25;
                    }
                };
                process = () => {
                    if (JWOBJ.teamTanks.length > 0 || JWOBJ.enemyTanks.length > 0) {
                        // 队友名字透明度
                        JWOBJ.teamTanks.forEach(teamTank => {
                            this.nameDistance(teamTank, JWUserData.TeamAlpha);
                        });
                        // 敌人名字透明度
                        JWOBJ.enemyTanks.forEach(enemyTank => {
                            this.nameDistance(enemyTank, JWUserData.EnemyAlpha);
                        });
                    }
                };
            }
        },
        105: (e, t, a) => {
            a.d(t, {
                Z: () => n
            });
            var o = a(817);
            var i = a(232);
            class n {
                packetCounter = 0;
                lastResponseTime = new Date().getTime();
                get responseTime() {
                    return new Date().getTime() - this.lastResponseTime;
                }
            }
            i.Z.before = function () {
                o.oQ.packetCounter++;
            };
            i.Z.after = function (e, t, a) {
                if (!(o.oQ.responseTime < 5)) {
                    o.oQ.lastResponseTime = new Date().getTime();
                }
                return e;
            };
        },
        662: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            window.getComponentNames = z => {
                if (typeof z != "object" && typeof z != "function") {
                    return;
                }
                let b = {
                    __proto__: {}
                };
                for (const [a, o] of Object.entries(z)) {
                    if (Array.isArray(o)) {
                        b[a] = o;
                        continue;
                    }
                    if (typeof o == "function" && o.callableName) {
                        b[o.callableName] = z[a];
                        continue;
                    }
                    const i = o?.constructor?.$metadata$?.simpleName;
                    if (i) {
                        if (b[i]) {
                            for (let e = 0; ; e++) {
                                const a = `${i}_${e}`;
                                if (!b[a]) {
                                    b[a] = o;
                                    break;
                                }
                            }
                        } else {
                            b[i] = o;
                        }
                    }
                }
                b = tk ? b : {};
                for (const [a, o] of Object.entries(z.__proto__)) {
                    if (Array.isArray(o)) {
                        b.__proto__[a] = o;
                        continue;
                    }
                    if (typeof o == "function" && o.callableName) {
                        b.__proto__[o.callableName] = z[a];
                        continue;
                    }
                    const i = o?.constructor?.$metadata$?.simpleName;
                    if (i) {
                        if (b.__proto__[i]) {
                            for (let e = 0; ; e++) {
                                const a = `${i}_${e}`;
                                if (!b.__proto__[a]) {
                                    b.__proto__[a] = o;
                                    break;
                                }
                            }
                        } else {
                            b.__proto__[i] = o;
                        }
                    }
                }
                b.original = z;
                return b;
            };
            window.getByIndex = (e, t) => {
                if (!e) {
                    return;
                }
                const a = Object.entries(e);
                if (a) {
                    return a[t];
                } else {
                    return undefined;
                }
            };
            class i {
                #d;
                #m;
                #c;
                #p;
                get root() {
                    if (this.#d) {
                        return this.#d;
                    }
                    const e = document.getElementById("root");
                    if (!e) {
                        return;
                    }
                    let i = getComponentNames(e[Object.keys(root)?.find(e => e.includes("_reactContainer"))]?.child?.child?.stateNode);
                    if (!(i && i.ReactReduxStateWatcher)) {
                        i = getComponentNames(e[Object.keys(root)?.find(e => e.includes("_reactContainer"))]?.child?.stateNode);
                    }
                    if (!(i && i?.ReactReduxStateWatcher)) {
                        i = getComponentNames(e[Object.keys(root)?.find(e => e.includes("_reactContainer"))]?.child?.child?.child?.stateNode);
                    }
                    if (!i) {
                        return;
                    }
                    const k = getComponentNames(i.ReactReduxStateWatcher);
                    if (k) {
                        this.#d = getComponentNames(k.Store);
                        getName(rootComponent, "state", "rootComponent", this.#d?.original, 4);
                        (() => {
                            let e = getComponentNames(this.#d?.original?.[rootComponent.state])?.Shop;
                            let t = Object.entries(this.#d?.original?.[rootComponent.state] ?? {});
                            window.TOState.shop = t.find(t => t[1] == e)[0];
                        })();
                        getName(window.shop, "enabled", "shop", this.#d?.original?.[rootComponent.state]?.[TOState.shop], 9);
                        return tl ? this.#d : undefined;
                    } else {
                        return undefined;
                    }
                }
                get world() {
                    if (this.#m) {
                        return this.#m;
                    }
                    var temp = this.root?.ThreadSafeList;
                    if (!temp) {
                        return;
                    }
                    var threadSafeList = undefined;
                    for (const key in temp) {
                        if (typeof temp[key] === "object" && key !== "original") {
                            threadSafeList = getComponentNames(temp[key]);
                            break;
                        }
                    }
                    if (!threadSafeList) {
                        return;
                    }
                    const z = getComponentNames(threadSafeList.ChassisSettingsUpdater);
                    if (!z) {
                        return;
                    }
                    const l = getComponentNames(z.BattleEntity);
                    if (l) {
                        return getComponentNames(l.World);
                    } else {
                        return undefined;
                    }
                }
                get gameMode() {
                    if (this.#c && o.P6.isArrayValid(this.#c.original)) {
                        return this.#c;
                    }
                    const arrayList = this.world?.ArrayList_0 ? this.world?.ArrayList_0 : this.world?.ArrayList_0;
                    if (!arrayList) {
                        return;
                    }
                    var arr_0 = undefined;
                    for (const key in arrayList) {
                        if (typeof arrayList[key] === "object" && key !== "original") {
                            arr_0 = arrayList[key];
                            break;
                        }
                    }
                    const z = getComponentNames(arr_0[0]);
                    if (!z) {
                        return;
                    }
                    const c = Object.entries(z.NativeList)?.[0]?.[1];
                    if (c) {
                        return this.#c = getComponentNames(c);
                    } else {
                        return undefined;
                    }
                }
                get localTank() {
                    if (this.#p && o.P6.isArrayValid(this.#p.original)) {
                        return this.#p;
                    }
                    var temp = this.root?.ThreadSafeList;
                    if (!temp) {
                        return;
                    }
                    var threadSafeList = undefined;
                    for (const key in temp) {
                        if (typeof temp[key] === "object" && key !== "original") {
                            threadSafeList = getComponentNames(temp[key]);
                            break;
                        }
                    }
                    if (!threadSafeList) {
                        return;
                    }
                    let x = getComponentNames(threadSafeList.ChassisSettingsUpdater_0);
                    if (!x && (x = getComponentNames(threadSafeList.ChassisSettingsUpdater), !x)) {
                        return;
                    }
                    const z = getComponentNames(x.BattleEntity);
                    if (!z) {
                        return;
                    }
                    getName(window.battleEntity, "components", "battleEntity", x.BattleEntity, 5);
                    getName(window.battleEntity, "callBacks", "battleEntity", x.BattleEntity, 3);
                    const l = getComponentNames(z.NativeList);
                    if (l) {
                        getName(window.nativeList, "array", "nativeList", z.NativeList, 0);
                        return this.#p = getComponentNames(l[window.nativeList.array]);
                    } else {
                        return undefined;
                    }
                }
                reset = () => {
                    this.#d = undefined;
                    this.#c = undefined;
                    this.#p = undefined;
                    this.#m = undefined;
                };
            }
        },
        487: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            class i {
                #u = 0;
                #y = false;
                #h;
                isOpen = false;
                currentTab = 0;
                tabs = [];
                constructor() {
                    (async () => {
                        await ImGui.default();
                        ImGui.CHECKVERSION();
                        ImGui.CreateContext();
                        const e = ImGui.GetIO();
                        o.Bs.style();
                        e.Fonts.AddFontDefault();
                        const t = document.getElementById("output") || document.body;
                        const a = window.canvas = document.createElement("canvas");
                        t.appendChild(a);
                        a.id = "canvas__imgui";
                        a.tabIndex = 0;
                        a.style.opacity = "0";
                        a.style.position = "absolute";
                        a.style.left = "0px";
                        a.style.right = "0px";
                        a.style.top = "0px";
                        a.style.bottom = "0px";
                        a.style.width = "100%";
                        a.style.height = "100%";
                        a.style.visibility = "hidden";
                        a.style.zIndex = "1000";
                        if (!a.getContext("webgl2", {
                            alpha: true
                        })) {
                            a.getContext("webgl", {
                                alpha: true
                            });
                        }
                        // Add event listener for right-click (mousedown) to show the menu
                        document.addEventListener("mousedown", e => {
                            if (e.button === 2) {
                                e.preventDefault(); // Prevent the default context menu from appearing
                                this.onMenuKeyPressed(); // Show the custom menu
                            }
                        });

                        document.addEventListener("keyup", e => {
                            if (!o.P6.isChatOpen()) {
                                switch (e.code) {
                                    case "Insert":
                                        this.onMenuKeyPressed();
                                }
                            }
                        });
                    })();
                }
                openingAnimation = () => {
                    if (this.#u !== 40) {
                        this.#u += 4;
                    } else {
                        this.#y = false;
                    }
                };
                closingAnimation = () => {
                    if (this.#u !== 0) {
                        this.#u -= 4;
                    } else {
                        this.#y = false;
                    }
                    if (!this.#y) {
                        this.hideMenu();
                    }
                };
                applyFilter = e => {
                    canvas.style.opacity = e / 40 * 1;
                    root.style.filter = `blur(${e * 0.1}px) brightness(${1 - e / 100})`;
                };
                animationTask = () => {
                    if (this.#y) {
                        requestAnimationFrame(this.animationTask);
                    }
                    if (this.isOpen) {
                        this.openingAnimation();
                    } else {
                        this.closingAnimation();
                    }
                    this.applyFilter(this.#u);
                };
                showMenu = () => {
                    ImGui_Impl.Init(canvas);
                    canvas.style.visibility = "";
                    document.exitPointerLock();
                    this.#h = requestAnimationFrame(this.process);
                };
                hideMenu = () => {
                    cancelAnimationFrame(this.#h);
                    o.vc.saveStates();
                    ImGui_Impl.Shutdown();
                    canvas.style.visibility = "hidden";
                };
                onMenuKeyPressed = () => {
                    if (this.isOpen = !this.isOpen) {
                        this.showMenu();
                    }
                    this.#y = true;
                    requestAnimationFrame(this.animationTask);
                };
                createTabButton = (e, t) => {
                    if (o.Bs.createActiveButton(e, this.currentTab === t, o.Bs.ImVec2(100, ImGui.GetWindowSize().y / this.tabs.length - 8))) {
                        this.currentTab = t;
                    }
                };
                process = e => {
                    this.#h = requestAnimationFrame(this.process);
                    ImGui_Impl.NewFrame(e);
                    ImGui.NewFrame();
                    ImGui.SetNextWindowSize(o.Bs.ImVec2(850, 310));
                    ImGui.Begin("Shizoval | Xx_Jawon_Sparky_Cyclone_xX", null, ImGui.WindowFlags.NoCollapse | ImGui.WindowFlags.NoResize | ImGui);
                    o.Bs.createChild("##ut2f", o.Bs.ImVec2(116, 0), () => {
                        for (const e of this.tabs) {
                            this.createTabButton(e.label, this.tabs.indexOf(e));
                        }
                    });
                    ImGui.SameLine();
                    o.Bs.createChild("##wqaa", o.Bs.ImVec2(0, 0), () => {
                        this.tabs[this.currentTab].process();
                    });
                    ImGui.End();
                    ImGui.EndFrame();
                    ImGui.Render();
                    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
                };
            }
        },
        422: (e, t, a) => {
            var o = a(817);
            o.GI.tabs.push({
                label: "Local tank",
                process: () => {
                    o.Bs.createChild("##crgtj", o.Bs.ImVec2(245, 0), () => {
                        let e = o.vc.data.airBreakData;
                        ImGui.SliderInt("Speed##kyxu", o.Bs.access(e.speedData, "state"), 1, 1000);
                        ImGui.SliderInt("Smooth##bshu", o.Bs.access(e.smoothData, "state"), 1, 100);
                        ImGui.Text("Type: ");
                        ImGui.SameLine();
                        if (o.Bs.createActiveButton("Default##jzqy", e.typeData.state === "default", o.Bs.ImVec2(0, 0))) {
                            e.typeData.state = "default";
                        }
                        ImGui.SameLine();
                        if (o.Bs.createActiveButton("AirWalk", e.typeData.state === "airWalk", o.Bs.ImVec2(0, 0))) {
                            e.typeData.state = "airWalk";
                        }
                        ImGui.SameLine();
                        if (o.Bs.createActiveButton("Simple", e.typeData.state === "noob", o.Bs.ImVec2(0, 0))) {
                            e.typeData.state = "noob";
                        }
                        ImGui.Checkbox("Limiting Kill Zones", o.Bs.access(e.killZoneData, "state"));
                        ImGui.Checkbox("Flip", o.Bs.access(e, "flip"));
                        ImGui.Checkbox("Tilt", o.Bs.access(e, "tilt"));
                    }, "AirBreak");
                    ImGui.SameLine();
                    o.Bs.createChild("##vtse", o.Bs.ImVec2(200, 0), () => {
                        o.Bs.ShowHelpMarker(".");
                        ImGui.SameLine();
                        ImGui.Checkbox("Automatic shooting", o.Bs.access(o.vc.data.otherData, "autoShot"));
                        o.Bs.ShowHelpMarker("If the rockets are stuck and nothing happens, press the [R] key.");
                        ImGui.SameLine();
                        ImGui.Checkbox("Rocket teleport", o.Bs.access(o.vc.data.weaponData.strikerData.shellsTeleportData, "state"));
                        o.Bs.ShowHelpMarker("Removes all mines on the map (FPS UP)");
                        ImGui.SameLine();
                        ImGui.Checkbox("Remove mines", o.Bs.access(o.vc.data.removeMinesData, "state"));
                        o.Bs.ShowHelpMarker("A third-person camera like in GTA. Distance key [V]");
                        ImGui.SameLine();
                        ImGui.Checkbox("GTA Camera", o.Bs.access(o.vc.data.cameraData, "state"));
                        o.Bs.ShowHelpMarker("Disabling the tank drop");
                        ImGui.SameLine();
                        ImGui.Checkbox("Freeze Tanks", o.Bs.access(o.vc.data.otherData, "freezeTanks"));
                        o.Bs.ShowHelpMarker("Change the camera fov");
                        ImGui.SameLine();
                        ImGui.SliderFloat("FOV##gajd", o.Bs.access(o.vc.data.cameraData, "fov"), 1.04, 2);
                    }, "Other");
                    ImGui.SameLine();
                    o.Bs.createChild("##53jbk", o.Bs.ImVec2(0, 0), () => {
                        let e = o.vc.data.clickerData;
                        ImGui.Checkbox("Armor", o.Bs.access(e.autoArmorData, "state"));
                        ImGui.Checkbox("Damage", o.Bs.access(e.autoDamageData, "state"));
                        ImGui.Checkbox("Nitro", o.Bs.access(e.autoNitroData, "state"));
                        ImGui.Checkbox("Mine", o.Bs.access(e.autoMiningData, "state"));
                        if (e.autoMiningData.state) {
                            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                            ImGui.SliderInt("Delay##oer3", o.Bs.access(e.autoMiningData, "delay"), 5, 50);
                            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                            ImGui.SliderInt("Multiply##zxaq1", o.Bs.access(e.autoMiningData, "multiply"), 1, 10);
                        }
                        ImGui.Checkbox("First aid kit", o.Bs.access(e.autoHealingData, "state"));
                        if (e.autoHealingData.state) {
                            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                            ImGui.SliderInt("Delay##jypy", o.Bs.access(e.autoHealingData, "delay"), 5, 50);
                            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + 15);
                            ImGui.SliderInt("Multiply##it401", o.Bs.access(e.autoHealingData, "multiply"), 1, 10);
                        }
                    }, "Clicker");
                }
            });
        },
        229: (e, t, a) => {
            var o = a(817);
            let i = {
                tank: null,
                name: "Not selected"
            };
            o.GI.tabs.push({
                label: "Other tanks",
                process: () => {
                    o.Bs.createChild("##rl2kf", o.Bs.ImVec2(350, 185), () => {
                        let e = o.P6.getTanks();
                        if (o.P6.isArrayValid(e)) {
                            for (const t of e) {
                                if (o.P6.isTankEnemy(t)) {
                                    continue;
                                }
                                let e = t.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                                if (typeof e == "string" && ImGui.Selectable(e, i.tank === t)) {
                                    i.tank = t;
                                    i.name = e;
                                }
                            }
                        }
                    }, "My team");
                    ImGui.SameLine();
                    o.Bs.createChild("##c937", o.Bs.ImVec2(0, 185), () => {
                        let e = o.P6.getTanks(true);
                        if (o.P6.isArrayValid(e)) {
                            for (const t of e) {
                                let e = t.UserTitleComponent?.[userTitleComponent.userTitleConfiguration]?.[userTitleConfiguration.name];
                                if (typeof e == "string" && ImGui.Selectable(e, i.tank === t)) {
                                    i.tank = t;
                                    i.name = e;
                                }
                            }
                        }
                    }, "Enemy team");
                    o.Bs.createChild("##5vge", o.Bs.ImVec2(0, 0), () => {
                        if (!i.tank) {
                            i.tank = null;
                            return void (i.name = "Not selected");
                        }
                        if (ImGui.Button("Set target for Rocket Teleport", o.Bs.ImVec2(675, 30))) {
                            o.vR.rocketTP.target = i.tank;
                        }
                    }, typeof i.name == "string" ? i.name : "Not selected");
                }
            });
        },
        500: (e, t, a) => {
            var o = a(817);
            const i = {
                function: "Not selected"
            };
            const n = (e, t = o.Bs.ImVec2(0, 0)) => {
                if (o.Bs.createActiveButton(e, i.function === e, t)) {
                    i.function = e;
                }
            };
            o.GI.tabs.push({
                label: "Binds",
                process: () => {
                    o.Bs.createChild("##peh32", o.Bs.ImVec2(0, 185), () => {
                        (e => {
                            let t;
                            switch (e) {
                                case "AirBreak":
                                    t = o.vc.data.airBreakData;
                                    o.Bs.bindKey("Forward", o.Bs.ImVec2(675, 20), t.movementData.forward.bind);
                                    o.Bs.bindKey("Back", o.Bs.ImVec2(675, 20), t.movementData.back.bind);
                                    o.Bs.bindKey("Left", o.Bs.ImVec2(675, 20), t.movementData.left.bind);
                                    o.Bs.bindKey("Right", o.Bs.ImVec2(675, 20), t.movementData.right.bind);
                                    o.Bs.bindKey("Up", o.Bs.ImVec2(675, 20), t.movementData.up.bind);
                                    o.Bs.bindKey("Down", o.Bs.ImVec2(675, 20), t.movementData.down.bind);
                                    o.Bs.bindKey("Toggle state", o.Bs.ImVec2(675, 20), t.toggleStateData.bind);
                                    o.Bs.bindKey("Type: default", o.Bs.ImVec2(675, 20), t.typeData.default.bind);
                                    o.Bs.bindKey("Type: airWalk", o.Bs.ImVec2(675, 20), t.typeData.airWalk.bind);
                                    o.Bs.bindKey("Type: simple", o.Bs.ImVec2(675, 20), t.typeData.simple.bind);
                                    o.Bs.bindKey("Speed +", o.Bs.ImVec2(675, 20), t.speedData.inc.bind);
                                    o.Bs.bindKey("Speed -", o.Bs.ImVec2(675, 20), t.speedData.dec.bind);
                                    o.Bs.bindKey("Smooth +", o.Bs.ImVec2(675, 20), t.smoothData.inc.bind);
                                    o.Bs.bindKey("Smooth -", o.Bs.ImVec2(675, 20), t.smoothData.dec.bind);
                                    o.Bs.bindKey("Limiting Kill Zones", o.Bs.ImVec2(675, 20), t.killZoneData.bind);
                                    break;
                                case "Sync":
                                    t = o.vc.data.syncData;
                                    o.Bs.bindKey("Avoid rockets", o.Bs.ImVec2(675, 20), t.antiStrikerData.bind);
                                    o.Bs.bindKey("Anti-Aim", o.Bs.ImVec2(675, 20), t.randomTeleportData.bind);
                                    o.Bs.bindKey("Avoid mines", o.Bs.ImVec2(675, 20), t.antiMineData.bind);
                                    break;
                                case "Clicker":
                                    t = o.vc.data.clickerData;
                                    o.Bs.bindKey("Armor", o.Bs.ImVec2(675, 20), t.autoArmorData.bind);
                                    o.Bs.bindKey("Damage", o.Bs.ImVec2(675, 20), t.autoDamageData.bind);
                                    o.Bs.bindKey("Nitro", o.Bs.ImVec2(675, 20), t.autoNitroData.bind);
                                    o.Bs.bindKey("Mine", o.Bs.ImVec2(675, 20), t.autoMiningData.bind);
                                    o.Bs.bindKey("Healing", o.Bs.ImVec2(675, 20), t.autoHealingData.bind);
                                    break;
                                case "Striker":
                                    t = o.vc.data.weaponData.strikerData;
                                    o.Bs.bindKey("AimBot", o.Bs.ImVec2(675, 20), t.aimBotData.bind);
                                    o.Bs.bindKey("Shells teleport", o.Bs.ImVec2(675, 20), t.shellsTeleportData.bind);
                                    o.Bs.bindKey("Get a target for the aimbot with the scope", o.Bs.ImVec2(675, 20), t.getTargetForAimWithScope.bind);
                                    o.Bs.bindKey("Get a teleport target with a scope", o.Bs.ImVec2(675, 20), t.getTargetForTPWithScope.bind);
                                    o.Bs.bindKey("Next target", o.Bs.ImVec2(675, 20), t.nextTargetData.bind);
                                    break;
                                case "Camera":
                                    t = o.vc.data.cameraData;
                                    o.Bs.bindKey("Change distance", o.Bs.ImVec2(675, 20), t.bind);
                                    break;
                                case "Stick":
                                    t = o.vc.data.stickData;
                                    o.Bs.bindKey("Next target", o.Bs.ImVec2(675, 20), t.nextTargetData.bind);
                                    o.Bs.bindKey("Deactivate", o.Bs.ImVec2(675, 20), t.deactivateData.bind);
                                    break;
                                case "Spectate":
                                    t = o.vc.data.spectateData;
                                    o.Bs.bindKey("Next target", o.Bs.ImVec2(675, 20), t.nextTargetData.bind);
                                    o.Bs.bindKey("Deactivate", o.Bs.ImVec2(675, 20), t.deactivateData.bind);
                            }
                        })(i.function);
                    }, i.function);
                    o.Bs.createChild("##sg391", o.Bs.ImVec2(0, 0), () => {
                        n("AirBreak", o.Bs.ImVec2(90, 30));
                        ImGui.SameLine();
                        n("Sync", o.Bs.ImVec2(90, 30));
                        ImGui.SameLine();
                        n("Clicker", o.Bs.ImVec2(90, 30));
                        ImGui.SameLine();
                        n("Striker", o.Bs.ImVec2(90, 30));
                        ImGui.SameLine();
                        n("Camera", o.Bs.ImVec2(90, 30));
                        ImGui.SameLine();
                        n("Stick", o.Bs.ImVec2(90, 30));
                        ImGui.SameLine();
                        n("Spectate", o.Bs.ImVec2(90, 30));
                    }, "Functions");
                }
            });
        },
        580: (e, t, a) => {
            a.d(t, {
                Z: () => o
            });
            class o {
                data = {
                    airBreakData: {
                        ID: "2",
                        movementData: {
                            forward: {
                                bind: {
                                    keys: ["KeyW"],
                                    state: false
                                }
                            },
                            back: {
                                bind: {
                                    keys: ["KeyS"],
                                    state: false
                                }
                            },
                            left: {
                                bind: {
                                    keys: ["KeyA"],
                                    state: false
                                }
                            },
                            right: {
                                bind: {
                                    keys: ["KeyD"],
                                    state: false
                                }
                            },
                            up: {
                                bind: {
                                    keys: ["KeyR"],
                                    state: false
                                }
                            },
                            down: {
                                bind: {
                                    keys: ["KeyT"],
                                    state: false
                                }
                            }
                        },
                        toggleStateData: {
                            bind: {
                                keys: ["KeyF"],
                                pressed: false,
                                state: false
                            }
                        },
                        typeData: {
                            state: "airWalk",
                            default: {
                                bind: {
                                    keys: ["KeyK"],
                                    pressed: false,
                                    state: false
                                }
                            },
                            airWalk: {
                                bind: {
                                    keys: ["KeyL"],
                                    pressed: false,
                                    state: false
                                }
                            },
                            simple: {
                                bind: {
                                    keys: [],
                                    pressed: false,
                                    state: false
                                }
                            }
                        },
                        speedData: {
                            state: 70,
                            inc: {
                                bind: {
                                    keys: [],
                                    state: false
                                }
                            },
                            dec: {
                                bind: {
                                    keys: [],
                                    state: false
                                }
                            }
                        },
                        smoothData: {
                            state: 1,
                            inc: {
                                bind: {
                                    keys: [],
                                    state: false
                                }
                            },
                            dec: {
                                bind: {
                                    keys: [],
                                    state: false
                                }
                            }
                        },
                        killZoneData: {
                            state: true,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        flip: false,
                        tilt: true
                    },
                    removeMinesData: {
                        ID: "0",
                        state: false,
                        type: "ALL"
                    },
                    noKnockbackData: {
                        ID: "0",
                        mply: 1
                    },
                    otherData: {
                        ID: "2",
                        autoHealingClicker: false,
                        speedHack: false,
                        freezeTanks: false,
                        noCollision: false,
                        showAlert: false,
                        autoShot: false
                    },
                    syncData: {
                        ID: "1",
                        updateInterval: 70,
                        warning: false,
                        antiStrikerData: {
                            state: false,
                            type: "Enemy",
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        randomTeleportData: {
                            state: false,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        antiMineData: {
                            state: false,
                            height: 200,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        }
                    },
                    wallHackData: {
                        ID: "0",
                        tankGlowData: {
                            state: false,
                            onlyEnemy: false,
                            colorEnemy: {
                                dec: 10027085,
                                rgb: [0.6, 0, 0.3]
                            },
                            colorTarget: {
                                dec: 6750054,
                                rgb: [0.4, 1, 0.4]
                            },
                            colorTeam: {
                                dec: 10066431,
                                rgb: [0.6, 0.6, 1]
                            }
                        },
                        tankChamsData: {
                            state: false,
                            onlyEnemy: false,
                            colorEnemy: [0.6, 0, 0.3, 1],
                            colorTarget: [0.4, 1, 0.4, 1],
                            colorTeam: [0.6, 0.6, 1, 1]
                        }
                    },
                    clickerData: {
                        ID: "1",
                        autoHealingData: {
                            state: false,
                            delay: 30,
                            multiply: 1,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        autoArmorData: {
                            state: false,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        autoDamageData: {
                            state: false,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        autoNitroData: {
                            state: false,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        autoMiningData: {
                            state: false,
                            delay: 30,
                            multiply: 1,
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        }
                    },
                    weaponData: {
                        ID: "0",
                        strikerData: {
                            aimBotData: {
                                state: false,
                                bind: {
                                    keys: [],
                                    state: false
                                }
                            },
                            shellsTeleportData: {
                                state: true,
                                bind: {
                                    keys: [""],
                                    state: false
                                }
                            },
                            getTargetForAimWithScope: {
                                state: false,
                                bind: {
                                    keys: [],
                                    pressed: false,
                                    state: false
                                }
                            },
                            getTargetForTPWithScope: {
                                state: false,
                                bind: {
                                    keys: [],
                                    pressed: false,
                                    state: false
                                }
                            },
                            nextTargetData: {
                                bind: {
                                    keys: [],
                                    pressed: false,
                                    state: false
                                }
                            }
                        }
                    },
                    cameraData: {
                        ID: "1",
                        state: true,
                        fov: 1.33,
                        bind: {
                            keys: ["KeyO"],
                            pressed: false,
                            state: true
                        }
                    },
                    stickData: {
                        ID: "0",
                        nextTargetData: {
                            bind: {
                                keys: ["KeyN"],
                                pressed: false,
                                state: false
                            }
                        },
                        deactivateData: {
                            bind: {
                                keys: ["Digit0"],
                                pressed: false,
                                state: false
                            }
                        }
                    },
                    spectateData: {
                        ID: "0",
                        nextTargetData: {
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        },
                        deactivateData: {
                            bind: {
                                keys: [],
                                pressed: false,
                                state: false
                            }
                        }
                    },
                    filtersData: {
                        ID: "0",
                        blur: 0,
                        brightness: 0,
                        contrast: 0,
                        grayscale: 0,
                        "hue-rotate": 0,
                        invert: 0,
                        saturate: 0,
                        sepia: 0
                    }
                };
                clearCookies = () => {
                    for (let e in this.data) {
                        localStorage.removeItem(e);
                    }
                };
                saveState = e => {
                    localStorage.setItem(e, JSON.stringify(this.data[e]));
                };
                saveStates = () => {
                    for (let e in this.data) {
                        this.saveState(e);
                    }
                };
                constructor() {
                    for (let e in this.data) {
                        let t = localStorage.getItem(e);
                        if (t && (t = JSON.parse(t), this.data[e].ID === t.ID)) {
                            this.data[e] = t;
                        } else {
                            console.error(`[Jawon] ${new Date().toJSON().slice(11, 19)} - No config found - ${e}`);
                            this.saveState(e);
                        }
                    }
                    this.saveStates();
                }
            }
        },
        600: (e, t, a) => {
            a.r(t);
            a.d(t, {
                ImVec2: () => d,
                ImVec4: () => m,
                ShowHelpMarker: () => l,
                access: () => s,
                bindKey: () => p,
                createActiveButton: () => i,
                createChild: () => n,
                getKeysWindow: () => c,
                style: () => r
            });
            var o = a(680);
            const n = (e, t, a, o) => {
                ImGui.BeginChild(e, t, true, o ? ImGui.WindowFlags.MenuBar : undefined);
                if (o && ImGui.BeginMenuBar()) {
                    ImGui.SetCursorPosX(ImGui.GetWindowSize().x / 2 - o.length * ImGui.GetFontSize() / 4);
                    ImGui.TextUnformatted(o);
                    ImGui.EndMenuBar();
                }
                a();
                ImGui.EndChild();
            };
            const i = (e, t, a) => {
                if (t) {
                    ImGui.PushStyleColor(ImGui.Col.Button, new ImGui.Color(0.26, 0.26, 0.26));
                    ImGui.PushStyleColor(ImGui.Col.Text, ImGui.GetStyleColorVec4(ImGui.Col.Text));
                } else {
                    ImGui.PushStyleColor(ImGui.Col.Button, ImGui.GetStyleColorVec4(ImGui.Col.Button));
                    ImGui.PushStyleColor(ImGui.Col.Text, ImGui.GetStyleColorVec4(ImGui.Col.TextDisabled));
                }
                let o = ImGui.Button(e, a);
                ImGui.PopStyleColor(2);
                return o;
            };
            const s = (e, t) => (a = e[t]) => e[t] = a;
            const r = () => {
                let e = ImGui.GetStyle();
                let t = ImGui.GetStyle().Colors;
                e.Alpha = 1;
                e.WindowPadding.x = 8;
                e.WindowPadding.y = 8;
                e.WindowRounding = 3;
                e.PopupRounding = 3;
                e.WindowTitleAlign.x = 0.5;
                e.WindowTitleAlign.y = 0.5;
                e.FramePadding.x = 4;
                e.FramePadding.y = 3;
                e.ItemSpacing.x = 8;
                e.ItemSpacing.y = 5;
                e.TouchExtraPadding.x = 0;
                e.TouchExtraPadding.y = 0;
                e.IndentSpacing = 21;
                e.ColumnsMinSpacing = 0;
                e.ScrollbarSize = 6;
                e.ScrollbarRounding = 0;
                e.GrabMinSize = 5;
                e.GrabRounding = 3.3;
                e.ButtonTextAlign.x = 0.5;
                e.ButtonTextAlign.y = 0.5;
                e.DisplayWindowPadding.x = 22;
                e.DisplayWindowPadding.y = 22;
                e.DisplaySafeAreaPadding.x = 4;
                e.DisplaySafeAreaPadding.y = 4;
                e.AntiAliasedLines = true;
                e.AntiAliasedFill = true;
                e.CurveTessellationTol = 1;
                t[ImGui.Col.Text] = m(9, 1, 1, 1);
                t[ImGui.Col.TextDisabled] = m(0.3, 0.31, 0.34, 0.6);
                t[ImGui.Col.WindowBg] = m(0, 0, 0, 0.6);
                t[ImGui.Col.ChildBg] = m(0, 0, 0, 0.6);
                t[ImGui.Col.PopupBg] = m(0, 0, 0, 0.6);
                t[ImGui.Col.Border] = m(0, 0, 0, 0.6);
                t[ImGui.Col.BorderShadow] = m(0, 0, 0, 0);
                t[ImGui.Col.FrameBg] = m(0.09, 0.1, 0.1, 1);
                t[ImGui.Col.FrameBgHovered] = m(0, 0, 0, 1);
                t[ImGui.Col.FrameBgActive] = m(0.07, 0.08, 0.13, 0);
                t[ImGui.Col.TitleBg] = m(0, 0, 0, 0.6);
                t[ImGui.Col.TitleBgActive] = m(0, 0, 0, 0.8);
                t[ImGui.Col.TitleBgCollapsed] = m(0.14, 0.14, 0.14, 1);
                t[ImGui.Col.MenuBarBg] = m(0, 0, 0, 0.6);
                t[ImGui.Col.ScrollbarBg] = m(0, 0, 0, 0.6);
                t[ImGui.Col.ScrollbarGrab] = m(0.25, 0.25, 0.25, 1);
                t[ImGui.Col.ScrollbarGrabHovered] = m(0, 0, 0, 0.6);
                t[ImGui.Col.ScrollbarGrabActive] = m(0, 0, 0, 1);
                t[ImGui.Col.CheckMark] = m(0.9, 0.1, 0.1, 1);
                t[ImGui.Col.SliderGrab] = m(0.9, 0.1, 0.1, 1);
                t[ImGui.Col.SliderGrabActive] = m(0.9, 0.1, 0.1, 1);
                t[ImGui.Col.Button] = m(0, 0, 0, 0.8);
                t[ImGui.Col.ButtonHovered] = m(0, 0, 0, 1);
                t[ImGui.Col.ButtonActive] = m(0, 0, 0, 1);
                t[ImGui.Col.Header] = m(0, 0, 0.9, 1);
                t[ImGui.Col.HeaderHovered] = m(0.9, 0, 0, 0.6);
                t[ImGui.Col.HeaderActive] = m(0.9, 0, 0, 0.6);
                t[ImGui.Col.Separator] = m(0.9, 0, 0, 0.5);
                t[ImGui.Col.SeparatorHovered] = m(0.9, 0, 0, 0.5);
                t[ImGui.Col.SeparatorActive] = m(0.9, 0, 0, 0.5);
                t[ImGui.Col.ResizeGrip] = m(0.9, 0, 0, 0.25);
                t[ImGui.Col.ResizeGripHovered] = m(0.9, 0, 0, 0.67);
                t[ImGui.Col.ResizeGripActive] = m(0, 0, 0, 0.6);
                t[ImGui.Col.Tab] = m(0, 0, 0, 0);
                t[ImGui.Col.TabHovered] = m(0, 0, 0, 0);
                t[ImGui.Col.TabActive] = m(0.9, 0, 0, 1);
                t[ImGui.Col.TabUnfocused] = m(0.07, 0.1, 0.15, 0.97);
                t[ImGui.Col.TabUnfocusedActive] = m(0.14, 0.26, 0.42, 1);
                t[ImGui.Col.PlotLines] = m(0, 0, 0, 1);
                t[ImGui.Col.PlotLinesHovered] = m(1, 0.43, 0.35, 1);
                t[ImGui.Col.PlotHistogram] = m(0.9, 0.7, 0, 1);
                t[ImGui.Col.PlotHistogramHovered] = m(1, 0.6, 0, 1);
                t[ImGui.Col.TextSelectedBg] = m(0.9, 0.25, 0.25, 0.5);
                t[ImGui.Col.DragDropTarget] = m(9, 0, 0, 0.9);
                t[ImGui.Col.NavHighlight] = m(0.26, 0.59, 0.98, 1);
                t[ImGui.Col.NavWindowingHighlight] = m(1, 1, 1, 0.7);
                t[ImGui.Col.NavWindowingDimBg] = m(0.8, 0.8, 0.8, 0.2);
                t[ImGui.Col.ModalWindowDimBg] = m(0.9, 0, 0, 0.35);
            };
            const l = e => {
                ImGui.TextDisabled("(?)");
                if (ImGui.IsItemHovered()) {
                    ImGui.BeginTooltip();
                    ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35);
                    ImGui.TextUnformatted(e);
                    ImGui.PopTextWrapPos();
                    ImGui.EndTooltip();
                }
            };
            const d = (e, t) => new ImGui.Vec2(e, t);
            const m = (e, t, a, o = 1) => new ImGui.Vec4(e, t, a, o);
            const c = e => {
                let t = false;
                let a = ImGui.GetIO();
                ImGui.SetNextWindowSize(d(0, 0));
                ImGui.SetNextWindowPos(d(a.DisplaySize.x * 0.5, a.DisplaySize.y * 0.5), ImGui.Cond.Always, d(0.5, 0.5));
                ImGui.SetNextWindowFocus();
                ImGui.Begin("press the key", null, ImGui.WindowFlags.NoCollapse | ImGui.WindowFlags.NoResize);
                ImGui.Text(`Current bind: ${JSON.stringify(e)}`);
                ImGui.Text(`Pressed keys: ${JSON.stringify(o.kp.keyPresseds)}`);
                if (ImGui.Button("OK", d(ImGui.GetWindowSize().x * 0.3, 30))) {
                    t = JSON.parse(JSON.stringify(o.kp.keyPresseds));
                }
                ImGui.SameLine();
                if (ImGui.Button("Clear", d(ImGui.GetWindowSize().x * 0.3, 30))) {
                    o.kp.keyPresseds = [];
                }
                ImGui.SameLine();
                if (ImGui.Button("Cancel", d(ImGui.GetWindowSize().x * 0.3, 30))) {
                    t = true;
                }
                ImGui.End();
                return t;
            };
            const p = (e, t, a) => {
                if (ImGui.Button(e, t)) {
                    a.state = true;
                }
                if (a.state) {
                    let e = c(a.keys);
                    if (e !== false) {
                        if (e !== true) {
                            a.keys = e;
                        }
                        a.state = false;
                    }
                }
            };
        },
        680: (e, t, a) => {
            a.d(t, {
                kp: () => o
            });
            const o = window.kp = new class {
                keyPresseds = [];
                constructor() {
                    document.addEventListener("keydown", e => {
                        if (this.keyPresseds.includes(e.code) === false) {
                            this.keyPresseds.push(e.code);
                        }
                    });
                    document.addEventListener("keyup", e => {
                        if (this.keyPresseds.includes(e.code) === true) {
                            let t = this.keyPresseds.indexOf(e.code);
                            if (t > -1) {
                                this.keyPresseds.splice(t, 1);
                            }
                        }
                    });
                }
                isKeyPressed = e => this.keyPresseds.includes(e);
            }();
        },
        75: (e, t, a) => {
            a.d(t, {
                W: () => n,
                Z: () => r
            });
            var o = a(817);
            var i = a(680);
            const n = {
                None: 0,
                LessX: 1,
                GreaterX: 2,
                LessY: 4,
                GreaterY: 8,
                LessZ: 16,
                GreaterZ: 32
            };
            const s = {
                space: {
                    maxXY: 499,
                    maxZ: 3399,
                    minZ: 99
                },
                default: {
                    maxXY: 499,
                    maxZ: 1999,
                    minZ: 99
                }
            };
            class r {
                isArrayPressed = e => {
                    if (!this.isArrayValid(e)) {
                        return false;
                    }
                    for (let t of e) {
                        if (!this.getKeyState(t)) {
                            return false;
                        }
                    }
                    return true;
                };
                isBindPressed = e => {
                    if (o.GI.isOpen) {
                        return false;
                    }
                    let t = e.bind;
                    if ("pressed" in t) {
                        let e = this.isArrayPressed(t.keys);
                        if (t.pressed === false) {
                            if (e === true) {
                                t.pressed = true;
                                return true;
                            }
                        } else if (e !== true) {
                            t.pressed = false;
                            return false;
                        }
                        return false;
                    }
                    return this.isArrayPressed(t.keys);
                };
                getKeyState = e => i.kp.isKeyPressed(e) && !this.isChatOpen();
                isChatOpen = () => document.getElementsByTagName("input").length > 0;
                isArrayValid = e => e !== undefined && Array.isArray(e) && e.length > 0;
                getKillZone = e => {
                    if (!e) {
                        return;
                    }
                    let t = e[battleMapComponent.gravity] === 300 ? s.space : s.default;
                    return {
                        minX: e[battleMapComponent.bounds]?.[aabb.minX] - t.maxXY,
                        minY: e[battleMapComponent.bounds]?.[aabb.minY] - t.maxXY,
                        minZ: e[battleMapComponent.bounds]?.[aabb.minZ] - t.minZ,
                        maxX: e[battleMapComponent.bounds]?.[aabb.maxX] + t.maxXY,
                        maxY: e[battleMapComponent.bounds]?.[aabb.maxY] + t.maxXY,
                        // maxZ: e[battleMapComponent.bounds]?.[aabb.maxZ] + t.maxZ,
                        maxZ: e[battleMapComponent.bounds]?.[aabb.maxZ] + t.maxZ - 200, // changed
                        boundMaxZ: e[battleMapComponent.bounds]?.[aabb.maxZ]
                    };
                };
                isNotKillZone = e => {
                    let t = o.UJ.gameMode?.BattleMapComponent;
                    let a = n.None;
                    if (!t) {
                        return a;
                    }
                    let i = this.getKillZone(t);
                    if (e.x !== 0 && e.x >= i.maxX) {
                        a |= n.GreaterX;
                    }
                    if (e.x !== 0 && e.x <= i.minX) {
                        a |= n.LessX;
                    }
                    if (e.y !== 0 && e.y >= i.maxY) {
                        a |= n.GreaterY;
                    }
                    if (e.y !== 0 && e.y <= i.minY) {
                        a |= n.LessY;
                    }
                    if (e.z !== 0 && e.z >= i.maxZ) {
                        a |= n.GreaterZ;
                    }
                    if (e.z !== 0 && e.z <= i.minZ) {
                        a |= n.LessZ;
                    }
                    return a;
                };
                outKillZone = (e, t) => {
                    let a = o.UJ.gameMode?.BattleMapComponent;
                    if (!a) {
                        return;
                    }
                    let i = this.getKillZone(a);
                    if (t & n.GreaterX) {
                        e.x = i.maxX;
                    }
                    if (t & n.LessX) {
                        e.x = i.minX;
                    }
                    if (t & n.GreaterY) {
                        e.y = i.maxY;
                    }
                    if (t & n.LessY) {
                        e.y = i.minY;
                    }
                    if (t & n.GreaterZ) {
                        e.z = i.maxZ;
                    }
                    if (t & n.LessZ) {
                        e.z = i.minZ;
                    }
                };
                isTankEnemy = e => {
                    if (e === o.UJ.localTank) {
                        return false;
                    }
                    const t = o.UJ.localTank?.TankComponent?.[tankComponent.team][battleTeam.name];
                    return !t || t === "NONE" || t !== e?.TankComponent?.[tankComponent.team][battleTeam.name];
                };
                getTanks = (e = false) => {
                    const t = o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField]?.[tanksOnFieldRegistryImpl.getTanks]?.()[nativeList.array];
                    if (!this.isArrayValid(t)) {
                        return;
                    }
                    const a = [];
                    for (const i of t) {
                        const t = getComponentNames(i[battleEntity.components][nativeList.array]);
                        if (t.original.length !== o.UJ.localTank?.original.length) {
                            if (!(e && !this.isTankEnemy(t))) {
                                t.entity = i;
                                a.push(t);
                            }
                        }
                    }
                    return a;
                };
                getTankById = (e, t = false) => {
                    const a = o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField];
                    if (!a) {
                        return;
                    }
                    const i = a[tanksOnFieldRegistryImpl.getTankById]?.(e);
                    if (!i) {
                        return;
                    }
                    const n = getComponentNames(i[battleEntity.components][nativeList.array]);
                    n.entity = i;
                    if (n.original.length === o.UJ.localTank?.original.length || t && !this.isTankEnemy(n)) {
                        return undefined;
                    } else {
                        return n;
                    }
                };
                getRandomArbitrary = (e, t) => Math.floor(Math.random() * (t - e) + e);
            }
        },
        87: (e, t, a) => {
            a.d(t, {
                Z: () => i
            });
            var o = a(817);
            function i() {
                getName(battleChatComponent, "isInputActive", "battleChatComponent", o.UJ.gameMode?.BattleChatComponent, 2);
                getName(battleMapComponent, "gravity", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 5);
                getName(battleMapComponent, "bounds", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 8);
                getName(battleMapComponent, "gameMode", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 21);
                if (!(battleMapComponent.gameMode && battleChatComponent.bounds)) {
                    getName(battleMapComponent, "gameMode", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 19);
                    getName(battleMapComponent, "bounds", "battleMapComponent", o.UJ.gameMode?.BattleMapComponent, 6);
                }
                getName(gameMode, "tanksOnField", "gameMode", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode], 8);
                getName(tanksOnFieldRegistryImpl, "getTanks", "tanksOnFieldRegistryImpl", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField]?.__proto__, 3);
                getName(tanksOnFieldRegistryImpl, "getTankById", "tanksOnFieldRegistryImpl", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.gameMode]?.[gameMode.tanksOnField]?.__proto__, 2);
                getName(tankPhysicsComponent, "body", "tankPhysicsComponent", o.UJ.localTank?.TankPhysicsComponent, 17);
                getName(tankPhysicsComponent, "interpolatedPosition", "tankPhysicsComponent", o.UJ.localTank?.TankPhysicsComponent, 8);
                getName(strikerRocketFactory, "shellCache", "strikerRocketFactory", o.UJ.localTank?.StrikerRocketFactory, 5);
                getName(cacheImpl, "itemInUse", "cacheImpl", o.UJ.localTank?.StrikerRocketFactory?.[strikerRocketFactory.shellCache], 1);
                getName(followCamera, "currState", "followCamera", o.UJ.localTank?.FollowCamera, 19);
                getName(followCamera, "pathPosition", "followCamera", o.UJ.localTank?.FollowCamera, 9);
                getName(followCamera, "polarDistance", "followCamera", o.UJ.localTank?.FollowCamera, 22);
                getName(followCamera, "pitch", "followCamera", o.UJ.localTank?.FollowCamera, 23);
                getName(followCamera, "elevation", "followCamera", o.UJ.localTank?.FollowCamera, 21);
                getName(followCamera, "pathPointElevation", "followCamera", o.UJ.localTank?.FollowCamera, 14);
                getName(followCamera, "pathPositionOffset", "followCamera", o.UJ.localTank?.FollowCamera, 11);
                getName(followCamera, "updatePath", "followCamera", o.UJ.localTank?.FollowCamera?.__proto__, 6);
                getName(dampedSpring, "value", "dampedSpring", o.UJ.localTank?.FollowCamera?.[followCamera.pitch], 7);
                getName(dampedSpring, "update", "dampedSpring", o.UJ.localTank?.FollowCamera?.[followCamera.pitch]?.__proto__, 2);
                getName(followCameraState, "direction", "followCameraState", o.UJ.localTank?.FollowCamera?.[followCamera.currState], 1);
                getName(trackedChassis, "params", "trackedChassis", o.UJ.localTank?.TrackedChassis, 12);
                getName(suspensionParams, "maxRayLength", "suspensionParams", o.UJ.localTank?.TrackedChassis?.[trackedChassis.params], 0);
                getName(tankComponent, "team", "tankComponent", o.UJ.localTank?.TankComponent, 4);
                getName(battleTeam, "name", "battleTeam", o.UJ.localTank?.TankComponent?.[tankComponent.team], 0);
                getName(body, "state", "body", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body], 24);
                getName(body, "movable", "body", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body], 5);
                getName(supplies, "onUserActivatedSupply", "supplies", o.RB.getSupplyByName("MINE"), 0);
                getName(bodyState, "velocity", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 0);
                getName(bodyState, "orientation", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 1);
                getName(bodyState, "angularVelocity", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 2);
                getName(bodyState, "position", "bodyState", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state], 3);
                getName(vector3, "x", "vector3", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position], 0);
                getName(vector3, "y", "vector3", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position], 1);
                getName(vector3, "z", "vector3", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.position], 2);
                getName(quaternion, "w", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 0);
                getName(quaternion, "x", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 1);
                getName(quaternion, "y", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 2);
                getName(quaternion, "z", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation], 3);
                getName(quaternion, "fromEulerAngles", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation]?.__proto__, 15);
                getName(quaternion, "getYAxis", "quaternion", o.UJ.localTank?.TankPhysicsComponent?.[tankPhysicsComponent.body]?.[body.state]?.[bodyState.orientation]?.__proto__, 12);
                getName(aabb, "minX", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 0);
                getName(aabb, "minY", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 1);
                getName(aabb, "minZ", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 2);
                getName(aabb, "maxX", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 3);
                getName(aabb, "maxY", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 4);
                getName(aabb, "maxZ", "aabb", o.UJ.gameMode?.BattleMapComponent?.[battleMapComponent.bounds], 5);
                getName(followCameraHeightController, "getTickEnabled", "followCameraHeightController", o.UJ.localTank?.FollowCameraHeightController?.__proto__, 5);
                getName(localTankStateServerSenderComponent, "needImmediateUpdate", "localTankStateServerSenderComponent", o.UJ.localTank?.LocalTankStateServerSenderComponent, 5);
                getName(weaponTrigger, "pulled", "weaponTrigger", o.UJ.localTank?.WeaponTrigger, 5);
            }
            window.vector3 = {
                x: undefined,
                y: undefined,
                z: undefined
            };
            window.bodyState = {
                position: undefined,
                velocity: undefined,
                angularVelocity: undefined,
                orientation: undefined
            };
            window.quaternion = {
                w: undefined,
                x: undefined,
                y: undefined,
                z: undefined,
                fromEulerAngles: undefined,
                getYAxis: undefined
            };
            window.nativeList = {
                array: undefined
            };
            window.strikerRocketFactory = {
                shellCache: undefined
            };
            window.cacheImpl = {
                itemInUse: undefined
            };
            window.shellComponents = {
                strikerRocket: 1
            };
            window.strikerRocket = {
                direction: undefined,
                position: undefined
            };
            window.battleEntity = {
                components: undefined,
                callBacks: undefined
            };
            window.tankPhysicsComponent = {
                body: undefined,
                interpolatedPosition: undefined
            };
            window.body = {
                state: undefined,
                movable: undefined
            };
            window.targetingSectorsCalculator = {
                maxElevationAngle: undefined,
                minElevationAngle: undefined
            };
            window.followCamera = {
                currState: undefined,
                pathPosition: undefined,
                polarDistance: undefined,
                pitch: undefined,
                elevation: undefined,
                updatePath: undefined,
                pathPointElevation: undefined,
                pathPositionOffset: undefined
            };
            window.dampedSpring = {
                value: undefined,
                update: undefined
            };
            window.followCameraState = {
                direction: undefined
            };
            window.trackedChassis = {
                params: undefined
            };
            window.suspensionParams = {
                maxRayLength: undefined
            };
            window.battleMapComponent = {
                gravity: undefined,
                bounds: undefined,
                gameMode: undefined
            };
            window.aabb = {
                minX: undefined,
                minY: undefined,
                minZ: undefined,
                maxX: undefined,
                maxY: undefined,
                maxZ: undefined
            };
            window.battleChatComponent = {
                isInputActive: undefined
            };
            window.tankComponent = {
                team: undefined
            };
            window.battleTeam = {
                name: undefined
            };
            window.gameMode = {
                tanksOnField: undefined
            };
            window.tanksOnFieldRegistryImpl = {
                getTanks: undefined,
                getTankById: undefined
            };
            window.userTitleComponent = {
                currentAlpha: undefined,
                userTitleConfiguration: undefined,
                userNameBar: undefined
            };
            window.userNameBar = {
                renderStage: undefined
            };
            window.renderStage = {
                ordinal: undefined
            };
            window.userTitleConfiguration = {
                name: undefined
            };
            window.signal = {
                functions: undefined
            };
            window.signalBind = {
                callBack: undefined
            };
            window.action = {
                name: undefined,
                wasPressed: undefined,
                wasRelesed: undefined
            };
            window.supplies = {
                onUserActivatedSupply: undefined
            };
            window.rootComponent = {
                state: undefined
            };
            window.TOState = {
                shop: undefined
            };
            window.shop = {
                enabled: undefined
            };
            window.followCameraHeightController = {
                getTickEnabled: undefined
            };
            window.localTankStateServerSenderComponent = {
                needImmediateUpdate: undefined
            };
            window.weaponTrigger = {
                pulled: undefined
            };
            window.variables = {
                weaponTrigger: window.weaponTrigger,
                localTankStateServerSenderComponent: window.localTankStateServerSenderComponent,
                followCameraHeightController: window.followCameraHeightController,
                shop: window.shop,
                TOState: window.TOState,
                rootComponent: window.rootComponent,
                supplies: window.supplies,
                action: window.action,
                signalBind: window.signalBind,
                signal: window.signal,
                userTitleConfiguration: window.userTitleConfiguration,
                userTitleComponent: window.userTitleComponent,
                tanksOnFieldRegistryImpl: window.tanksOnFieldRegistryImpl,
                gameMode: window.gameMode,
                battleTeam: window.battleTeam,
                tankComponent: window.tankComponent,
                battleChatComponent: window.battleChatComponent,
                aabb: window.aabb,
                battleMapComponent: window.battleMapComponent,
                suspensionParams: window.suspensionParams,
                trackedChassis: window.trackedChassis,
                followCameraState: window.followCameraState,
                dampedSpring: window.dampedSpring,
                followCamera: window.followCamera,
                targetingSectorsCalculator: window.targetingSectorsCalculator,
                body: window.body,
                tankPhysicsComponent: window.tankPhysicsComponent,
                battleEntity: window.battleEntity,
                strikerRocket: window.strikerRocket,
                shellComponents: window.shellComponents,
                cacheImpl: window.cacheImpl,
                strikerRocketFactory: window.strikerRocketFactory,
                nativeList: window.nativeList,
                quaternion: window.quaternion,
                bodyState: window.bodyState,
                vector3: window.vector3,
                userNameBar: window.userNameBar,
                renderStage: renderStage
            };
            window.getName = function (e, t, a, o, i) {
                if (!e[t]) {
                    e[t] = getByIndex(o, i)?.[0];
                    if (e[t]) {
                        console.log(`[Jawon] ${a}.${t} Found: ${e[t]}`);
                    }
                }
            };
        },
        232: (e, t, a) => {
            a.d(t, {
                Z: () => s
            });
            let o = {};
            let i = window.WebSocket;
            class n {
                constructor(e) {
                    this.bubbles = e.bubbles || false;
                    this.cancelBubble = e.cancelBubble || false;
                    this.cancelable = e.cancelable || false;
                    this.currentTarget = e.currentTarget || null;
                    this.data = e.data || null;
                    this.defaultPrevented = e.defaultPrevented || false;
                    this.eventPhase = e.eventPhase || 0;
                    this.lastEventId = e.lastEventId || "";
                    this.origin = e.origin || "";
                    this.path = e.path || new Array(0);
                    this.ports = e.parts || new Array(0);
                    this.returnValue = e.returnValue || true;
                    this.source = e.source || null;
                    this.srcElement = e.srcElement || null;
                    this.target = e.target || null;
                    this.timeStamp = e.timeStamp || null;
                    this.type = e.type || "message";
                    this.__proto__ = e.__proto__ || MessageEvent.__proto__;
                }
            }
            window.WebSocket = function (e, t) {
                let a;
                this.url = e;
                this.protocols = t;
                a = this.protocols ? new i(e, t) : new i(e);
                var s = a.send;
                a.send = function (e) {
                    arguments[0] = o.before(e, a.url, a) || e;
                    s.apply(this, arguments);
                };
                a._addEventListener = a.addEventListener;
                a.addEventListener = function () {
                    let e = this;
                    var t;
                    if (arguments[0] === "message") {
                        arguments[1] = (t = arguments[1], function () {
                            arguments[0] = o.after(new n(arguments[0]), a.url, a);
                            if (arguments[0] !== null) {
                                t.apply(e, arguments);
                            }
                        });
                    }
                    return a._addEventListener.apply(this, arguments);
                };
                Object.defineProperty(a, "onmessage", {
                    set: function () {
                        let e = this;
                        let t = arguments[0];
                        a._addEventListener.apply(this, ["message", function () {
                            arguments[0] = o.after(new n(arguments[0]), a.url, a);
                            if (arguments[0] !== null) {
                                t.apply(e, arguments);
                            }
                        }, false]);
                    }
                });
                return a;
            };
            const s = o;
        },
        817: (e, t, a) => {
            a.d(t, {
                $l: () => N,
                Bs: () => f,
                GI: () => P,
                P6: () => b,
                RB: () => B,
                Ri: () => S,
                UJ: () => k,
                oQ: () => D,
                vR: () => G,
                vc: () => v
            });
            var o = a(75);
            var i = a(662);
            var n = a(580);
            var s = a(956);
            var r = a(462);
            var l = a(487);
            var d = a(600);
            var m = a(551);
            var c = a(24);
            var p = a(842);
            var u = a(105);
            var y = a(125);
            var h = a(87);
            var g = a(867);
            var C = a(38);
            const b = window.utils = new o.Z();
            const k = window.gameObjects = new i.Z();
            const v = window.config = new n.Z();
            const w = window.removeMines = new s.Z();
            const S = window.airBreak = new r.Z();
            const P = window.menu = new l.Z();
            const f = window.cImGui = d;
            const I = window.other = new m.Z();
            const B = window.clicker = new c.Z();
            const T = window.wallhack = new p.Z();
            const D = window.packetControl = new u.Z();
            const G = window.striker = new y.Z();
            const x = window.stick = new g.Z();
            const N = window.cameraHack = new C.Z();
            const M = () => {
                S.reset();
                w.reset();
                B.reset();
                G.reset();
                N.reset();
            };
            !function e() {
                requestAnimationFrame(e);
                const t = k.root;
                const a = k.localTank;
                const o = a?.TankPhysicsComponent;
                const i = a?.FollowCamera;
                const n = a?.TrackedChassis;
                const s = a?.StrikerRocketFactory;
                const r = a?.FollowCameraHeightController;
                const l = a?.LocalTankStateServerSenderComponent;
                const d = a?.WeaponTrigger;
                if (!t) {
                    return;
                }
                const m = k.root?.original?.[rootComponent.state]?.[TOState.shop];
                if (m?.[window.shop.enabled] === false) {
                    m[window.shop.enabled] = true;
                    console.log("[Jawon] Магазин открыт");
                }
                if (k.world?.original) {
                    (0, h.Z)();
                    w.process();
                    I.process(d);
                    T.process();
                    if (a && b.isArrayValid(a.original)) {
                        S.process(o, i, n, l);
                        x.process(o);
                        B.process();
                        G.process(s);
                        return void N.process(i, r);
                    } else {
                        return M();
                    }
                } else {
                    k.reset();
                    return M();
                }
            }();
        }
    };
    var t = {};
    function a(o) {
        var i = t[o];
        if (i !== undefined) {
            return i.exports;
        }
        var n = t[o] = {
            exports: {}
        };
        e[o](n, n.exports, a);
        return n.exports;
    }
    a.d = (e, t) => {
        for (var o in t) {
            if (a.o(t, o) && !a.o(e, o)) {
                Object.defineProperty(e, o, {
                    enumerable: true,
                    get: t[o]
                });
            }
        }
    };
    a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
    a.r = e => {
        if (typeof Symbol != "undefined" && Symbol.toStringTag) {
            Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            });
        }
        Object.defineProperty(e, "__esModule", {
            value: true
        });
    };
    a(817);
    a(662);
    a(487);
    a(580);
    a(600);
    a(680);
    a(75);
    a(87);
    a(232);
    a(105);
    a(422);
    a(229);
    a(500);
    a(462);
    a(38);
    a(24);
    a(551);
    a(956);
    a(867);
    a(125);
    a(842);

    // Addtions ----------------------------------
    (() => {
        // 第一次点击进入全屏
        if (autoFullScreem && JWUserData.Addtions) {
            function fullScreem() {
                var elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen(); /* Firefox */
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen(); /* Chrome, Safari & Opera */
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } /* IE/Edge */
            }

            function clickToFS() {
                fullScreem();
                document.removeEventListener("click", clickToFS);
            }
            ;
            function pressToFS() {
                fullScreem();
                document.removeEventListener("keydown", pressToFS);
            }
            ;
            document.addEventListener("click", clickToFS);
            document.addEventListener("keydown", pressToFS);
        }

        // 进入战斗时刷新页面
        if (autoRefresh && JWUserData.Addtions) {
            setTimeout(() => {
                setInterval(() => {
                    var startFlag = document.querySelector("#root > div.ApplicationLoaderComponentStyle-container.Common-flexCenterAlignCenterColumn > div.ApplicationLoaderComponentStyle-promptInformation");
                    if (startFlag != null) {
                        window.location.reload();
                    }
                }, 300);
            }, 50000);
        }

        // 修复游戏中 F5 刷新页面无效的问题
        if (fixF5Bug && JWUserData.Addtions) {
            document.addEventListener("keydown", event => {
                var key = event.key.toUpperCase();
                if (key === "F5") {
                    window.location.reload();
                }
            });
        }

        // 自动进入注册或登录页面
        var LoginBtnItv = 0;
        var autoStart = setInterval(() => {
            // 如果出现按任意键开始
            if (document.querySelector("#root > div > div.Common-entranceGradient > div > div.EntranceComponentStyle-ContainerForm.MainEntranceComponentStyle-mainContainer > form > div > div > span")) {
                var evt = new KeyboardEvent("keydown", {
                    key: "0"
                });
                document.dispatchEvent(evt);
                LoginBtnItv = setInterval(() => {
                    // 如果游戏账号按钮出现
                    var btn = document.querySelector("#root > div.Common-container > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm.MainEntranceComponentStyle-mainContainer > form > div.MainEntranceComponentStyle-container > div > div");
                    if (btn) {
                        btn.click();
                        clearInterval(LoginBtnItv);
                    }
                }, 200);
                clearInterval(autoStart);
            }
        }, 200);
        // 20秒后未进入则刷新页面
        setTimeout(() => {
            if (document.querySelector("#root > div > div.Common-entranceGradient > div > div.EntranceComponentStyle-ContainerForm.MainEntranceComponentStyle-mainContainer > form > div > img.StartScreenComponentStyle-logoTankOnline")) {
                window.location.reload();
            }
            clearInterval(autoStart);
            clearInterval(LoginBtnItv);
        }, 20000);

        // 自动注册
        if (autoRegister && JWUserData.Addtions) {
            var finishRegItv = 0;
            var registerItv = setInterval(() => {
                // 如果发现完成注册按钮
                var registerBtn = document.querySelector(".Common-alignCenter > span");
                if (registerBtn && registerBtn.innerText == "完成注册") {
                    // 自动填表，需要手动删除末尾-
                    function getRandomNum(min, max) {
                        const floatRandom = Math.random();
                        const difference = max - min;
                        const random = Math.round(difference * floatRandom);
                        const randomWithinRange = random + min;
                        return randomWithinRange;
                    }
                    // 生成随机 user_214 昵称
                    var randomName = "user_214" + getRandomNum(1000001, 9999999);
                    var inputs = document.querySelectorAll("input");
                    inputs.forEach(input => {
                        input.style.width = "500px";
                    });
                    if (inputs[0]) {
                        inputs[0].value = randomName + "]";
                    }
                    if (inputs[1]) {
                        inputs[1].value = "Aa12345678]";
                    }
                    if (inputs[2]) {
                        inputs[2].value = "Aa12345678]";
                    }
                    if (inputs[3]) {
                        inputs[3].value = "俞泽洋]";
                    }
                    if (inputs[4]) {
                        inputs[4].value = "430304197109123076]";
                    } // 等待 完成注册可点 和 接受 按钮
                    finishRegItv = setInterval(() => {
                        var finishRegBtn = document.querySelector("div.Common-flexCenterAlignCenter.EntranceComponentStyle-buttonActive.EntranceComponentStyle-styleButtons.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter");
                        // 如果完成注册可点
                        if (finishRegBtn) {
                            // 点击完成注册
                            setTimeout(() => {
                                finishRegBtn.click();
                                console.log("已点击完成注册");
                            }, 300);
                            // 点击接受
                            setTimeout(() => {
                                document.querySelector("#root > div.Common-container > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm.MainEntranceComponentStyle-mainContainer > form > div > div:nth-child(2) > div:nth-child(2)").click();
                            }, 800);
                            clearInterval(finishRegItv);
                        }
                    }, 300);
                    clearInterval(registerItv);
                }
            }, 200);
            // 60 秒后不再等待
            setTimeout(() => {
                clearInterval(registerItv);
                clearInterval(finishRegItv);
            }, 60000);
        }

        // 自动登录
        if (autoLogin && JWUserData.Addtions) {
            var startBtnItv = 0;
            var LoginItv = setInterval(() => {
                // 如果发现开始战斗按钮
                var loginBtn = document.querySelector(".Common-alignCenter > span");
                if (loginBtn && loginBtn.innerText == "开始战斗") {
                    // 自动填表，需要手动删除末尾-
                    var inputs = document.querySelectorAll("input");
                    inputs.forEach(input => {
                        input.style.width = "500px";
                    });
                    if (account) {
                        inputs[0].value = account + "]";
                    }
                    if (passWord) {
                        inputs[1].value = passWord + "]";
                    }
                    // 等待 开始战斗按钮 可点
                    startBtnItv = setInterval(() => {
                        var startBtn = document.querySelector("div.Common-flexCenterAlignCenter.EntranceComponentStyle-buttonActive.EntranceComponentStyle-styleButtons.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter");
                        // 如果开始战斗按钮可点
                        if (startBtn) {
                            // 点击开始战斗
                            setTimeout(() => {
                                startBtn.click();
                                console.log("已点击开始战斗");
                            }, 300);
                            clearInterval(startBtnItv);
                        }
                    }, 300);
                    clearInterval(LoginItv);
                }
            }, 200);
            // 60 秒后不再等待
            setTimeout(() => {
                clearInterval(LoginItv);
                clearInterval(startBtnItv);
            }, 60000);
        }

        // 防止超时被踢出战场(anti AFK)
        setInterval(() => {
            var autoPauseIcon = document.querySelector(".BattleAutoPauseComponentStyle-icon")
            if (autoPauseIcon) {
                var kikOutTip = document.querySelector("#modal-root > div");
                if (kikOutTip) {
                    kikOutTip.click();
                }
            }
        }, 100);

        // 自动点击一些按钮
        setInterval(() => {
            // 如果正在战斗,返回
            if (JWOBJ.isInMap || !JWUserData.Addtions || !autoClick) {
                return;
            }
            buttonCelectors.forEach(buttonCelector => {
                var strArr = buttonCelector.split("|");
                if (strArr.length > 1 && strArr[1]) {
                    let btns = document.querySelectorAll(strArr[0]);
                    if (btns.length > 0) {
                        btns.forEach(btn => {
                            if (btn && btn.innerText.includes(strArr[1])) {
                                btn.click();
                            }
                        });
                    }
                }
                else {
                    let btns = document.querySelectorAll(buttonCelector);
                    if (btns.length > 0) {
                        btns.forEach(btn => {
                            btn.click();
                        });
                    }
                }
            });
        }, 300);
    })();
    // Addtions end ------------------------------

    // 子弹写字所需的字母路径
    var letterPath = { A: [{ x: 2, y: 17 }, { x: 2, y: 18 }, { x: 2, y: 19 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 16 }, { x: 14, y: 17 }, { x: 14, y: 18 }, { x: 14, y: 19 }], B: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 18 }, { x: 2, y: 19 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }], C: [{ x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }, { x: 14, y: 17 }], D: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }], E: [{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 18 }, { x: 14, y: 19 }, { x: 15, y: 18 }, { x: 15, y: 19 }], F: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 14, y: 0 }, { x: 14, y: 1 }], G: [{ x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }, { x: 14, y: 17 }, { x: 14, y: 18 }, { x: 14, y: 19 }], H: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], I: [{ x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 9, y: 17 }, { x: 9, y: 18 }, { x: 9, y: 19 }], J: [{ x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }], K: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 0 }, { x: 14, y: 19 }], L: [{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 18 }, { x: 14, y: 19 }], M: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 9, y: 17 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }, { x: 14, y: 17 }, { x: 14, y: 18 }, { x: 14, y: 19 }], N: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], O: [{ x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }], P: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }], Q: [{ x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }, { x: 14, y: 18 }, { x: 14, y: 19 }, { x: 14, y: 20 }, { x: 15, y: 19 }, { x: 15, y: 20 }], R: [{ x: 0, y: 19 }, { x: 0, y: 20 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 18 }, { x: 14, y: 19 }], S: [{ x: 2, y: 14 }, { x: 2, y: 15 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }], T: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 13, y: 0 }, { x: 13, y: 1 }], U: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 14, y: 15 }, { x: 14, y: 16 }, { x: 14, y: 17 }], V: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 9, y: 17 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 15, y: 0 }, { x: 15, y: 1 }], W: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 4, y: 20 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 11, y: 20 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 }], X: [{ x: 2, y: 0 }, { x: 2, y: 19 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 0 }, { x: 14, y: 19 }], Y: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 13, y: 0 }, { x: 13, y: 1 }], Z: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 0 }, { x: 11, y: 1 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 14, y: 0 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 14, y: 18 }, { x: 14, y: 19 }], a: [{ x: 2, y: 15 }, { x: 2, y: 16 }, { x: 2, y: 17 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 11, y: 20 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 12, y: 20 }, { x: 13, y: 19 }, { x: 13, y: 20 }], b: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 2, y: 17 }, { x: 2, y: 18 }, { x: 2, y: 19 }, { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }], c: [{ x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }], d: [{ x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 0 }, { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], e: [{ x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 10, y: 20 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 16 }, { x: 14, y: 17 }], f: [{ x: 2, y: 7 }, { x: 2, y: 8 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 16 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 12, y: 7 }, { x: 12, y: 8 }], g: [{ x: 2, y: 21 }, { x: 2, y: 22 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 20 }, { x: 3, y: 21 }, { x: 3, y: 22 }, { x: 3, y: 23 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 4, y: 20 }, { x: 4, y: 22 }, { x: 4, y: 23 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 5, y: 23 }, { x: 5, y: 24 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 23 }, { x: 6, y: 24 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 23 }, { x: 7, y: 24 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 23 }, { x: 8, y: 24 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 23 }, { x: 9, y: 24 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 10, y: 23 }, { x: 10, y: 24 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 11, y: 23 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 12, y: 20 }, { x: 12, y: 21 }, { x: 12, y: 22 }, { x: 12, y: 23 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 19 }, { x: 13, y: 20 }, { x: 13, y: 21 }, { x: 13, y: 22 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 20 }, { x: 14, y: 21 }], h: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], i: [{ x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }], j: [{ x: 3, y: 22 }, { x: 3, y: 23 }, { x: 4, y: 22 }, { x: 4, y: 23 }, { x: 4, y: 24 }, { x: 5, y: 23 }, { x: 5, y: 24 }, { x: 6, y: 23 }, { x: 6, y: 24 }, { x: 7, y: 23 }, { x: 7, y: 24 }, { x: 8, y: 22 }, { x: 8, y: 23 }, { x: 8, y: 24 }, { x: 9, y: 0 }, { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 9, y: 17 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 9, y: 21 }, { x: 9, y: 22 }, { x: 9, y: 23 }, { x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 10, y: 20 }, { x: 10, y: 21 }, { x: 10, y: 22 }], k: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 7 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 19 }], l: [{ x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }], m: [{ x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 2, y: 17 }, { x: 2, y: 18 }, { x: 2, y: 19 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 10, y: 8 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], n: [{ x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 2, y: 17 }, { x: 2, y: 18 }, { x: 2, y: 19 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], o: [{ x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }], p: [{ x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 2, y: 17 }, { x: 2, y: 18 }, { x: 2, y: 19 }, { x: 2, y: 20 }, { x: 2, y: 21 }, { x: 2, y: 22 }, { x: 2, y: 23 }, { x: 2, y: 24 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 3, y: 20 }, { x: 3, y: 21 }, { x: 3, y: 22 }, { x: 3, y: 23 }, { x: 3, y: 24 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }], q: [{ x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 12, y: 20 }, { x: 12, y: 21 }, { x: 12, y: 22 }, { x: 12, y: 23 }, { x: 12, y: 24 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }, { x: 13, y: 20 }, { x: 13, y: 21 }, { x: 13, y: 22 }, { x: 13, y: 23 }, { x: 13, y: 24 }], r: [{ x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 12, y: 7 }, { x: 12, y: 8 }], s: [{ x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }], t: [{ x: 1, y: 7 }, { x: 1, y: 8 }, { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 16 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 19 }, { x: 10, y: 20 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 11, y: 20 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 18 }, { x: 12, y: 19 }], u: [{ x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 6, y: 20 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 9, y: 20 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 13, y: 15 }, { x: 13, y: 16 }, { x: 13, y: 17 }, { x: 13, y: 18 }, { x: 13, y: 19 }], v: [{ x: 2, y: 7 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 16 }, { x: 6, y: 17 }, { x: 7, y: 15 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 9, y: 17 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 14, y: 7 }], w: [{ x: 0, y: 7 }, { x: 1, y: 7 }, { x: 1, y: 8 }, { x: 1, y: 9 }, { x: 1, y: 10 }, { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, { x: 2, y: 15 }, { x: 3, y: 11 }, { x: 3, y: 12 }, { x: 3, y: 13 }, { x: 3, y: 14 }, { x: 3, y: 15 }, { x: 3, y: 16 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 15 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 4, y: 20 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 13 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 10, y: 20 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 11, y: 15 }, { x: 11, y: 16 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 14, y: 7 }], x: [{ x: 2, y: 7 }, { x: 2, y: 19 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 6, y: 10 }, { x: 6, y: 11 }, { x: 6, y: 12 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 16 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 15 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 17 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 7 }, { x: 13, y: 19 }], y: [{ x: 2, y: 7 }, { x: 2, y: 8 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 9 }, { x: 3, y: 10 }, { x: 3, y: 11 }, { x: 3, y: 24 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 }, { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 23 }, { x: 4, y: 24 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 22 }, { x: 5, y: 23 }, { x: 5, y: 24 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 16 }, { x: 6, y: 17 }, { x: 6, y: 18 }, { x: 6, y: 20 }, { x: 6, y: 21 }, { x: 6, y: 22 }, { x: 6, y: 23 }, { x: 6, y: 24 }, { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }, { x: 7, y: 21 }, { x: 7, y: 22 }, { x: 7, y: 23 }, { x: 8, y: 16 }, { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 }, { x: 8, y: 21 }, { x: 9, y: 14 }, { x: 9, y: 15 }, { x: 9, y: 16 }, { x: 9, y: 17 }, { x: 9, y: 18 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 11, y: 13 }, { x: 11, y: 14 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 13, y: 7 }, { x: 13, y: 8 }], z: [{ x: 3, y: 7 }, { x: 3, y: 8 }, { x: 3, y: 17 }, { x: 3, y: 18 }, { x: 3, y: 19 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 14 }, { x: 6, y: 15 }, { x: 6, y: 16 }, { x: 6, y: 18 }, { x: 6, y: 19 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 13 }, { x: 7, y: 14 }, { x: 7, y: 15 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 10 }, { x: 9, y: 11 }, { x: 9, y: 12 }, { x: 9, y: 13 }, { x: 9, y: 18 }, { x: 9, y: 19 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 18 }, { x: 13, y: 19 }], letterW: 15.23076923076923, letterH: 25 };

    // 坦克黑色主题 css
    var tankDarkThemeCSS = `.WelcomeMessage{position:absolute;left:50%;transform:translate(-50%,-50%);top:13%;transition:top 2s ease;background-color:rgb(0 0 0 /50%);border-radius:12px;color:white;padding:12px;z-index:9999}.DialogContainerComponentStyle-container{background:rgb(0 0 0/40%);border-radius:20px;border:2px solid rgba(255,255,255,0.19);opacity:0;animation:kss 0.7s forwards}@keyframes kss{0%{opacity:0}100%{opacity:1}}.LobbyLoaderComponentStyle-container{background:rgb(0 0 0/65%);backdrop-filter:blur(8px)}.Common-container{background:rgb(0 0 0/30%)}.ChatComponentStyle-chatWindow{background:rgb(12 12 12/50%);backdrop-filter:blur(5px);opacity:0;animation:zkZz 0.7s forwards}@keyframes zkZz{0%{opacity:0}100%{opacity:1}}.ContextMenuStyle-menu{background:rgb(0 0 0/37%);border:1px solid rgba(255,255,255,0.25);border-radius:15px}html{filter:saturate(130%) contrast(110%) brightness(96%) !important}.Common-changingBackground,.ApplicationLoaderComponentStyle.Common-background{filter:brightness(0.7)}.ModalStyle-rootHover{z-index:99999;background:rgb(0 0 0/29%);backdrop-filter:blur(5px)}.SettingsComponentStyle-scrollingMenu{opacity:0;animation:csttt 0.9s forwards}@keyframes csttt{0%{opacity:0}100%{opacity:1}}.InputRangeComponentStyle-range{background:rgb(0 0 0/60%);border-radius:10px;border:2px solid rgba(255,255,255,0.23)}.InputRangeComponentStyle-range::-webkit-slider-thumb{background:rgb(255 255 255/80%);border-radius:50px}.LobbyLoaderComponentStyle-logo{filter:brightness(0%);filter:hue-rotate(180deg)}.LobbyLoaderComponentStyle-logo{animation:ani 2s linear forwards;animation-iteration-count:2}@keyframes ani{0%{width:0}100%{width:100px}}.Common-menuItemActive{color:rgb(255,188,9)}.Common-flexStartAlignCenter.Common-flexWrapNowrap.modeLimitIcon{background:rgb(0 0 0/20%);backdrop-filter:blur(5px);border-radius:10px;border:1px solid rgba(255,255,255,0.3);transition:box-shadow 0.6s !important;box-shadow:unset !important;opacity:0;animation:stsa 0.7s forwards}@keyframes stsa{0%{opacity:0}100%{opacity:1}}.Common-flexStartAlignCenter.Common-flexWrapNowrap.modeLimitIcon:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.08em !important}.UsersTableStyle-cellName.UsersTableStyle-rowBattleEmpty.UsersTableStyle-centerCell.UsersTableStyle-fontCell{background-color:rgba(0,0,0,0.5);border:2px solid rgba(0,0,255,0.23);border-radius:12px;margin:2px}.BattleTabStatisticComponentStyle-selectedRowBackGround{background-color:transparent;transition:box-shadow 0.5s !important;box-shadow:unset !important}.BattleTabStatisticComponentStyle-selectedRowBackGround:hover{box-shadow:rgb(51,187,255) 0em 0em 0em 2px !important}.UsersTableStyle-cellName.UsersTableStyle-rowBattleEmpty.UsersTableStyle-centerCell.UsersTableStyle-fontCell{background:rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.23);border-radius:12px;margin:2px}.BattleTabStatisticComponentStyle-rowBackGround{background-color:rgb(0 0 255 / 0%);border-radius:10px;border:none}.UsersTableStyle-cellName.UsersTableStyle-centerCell.UsersTableStyle-fontCell.UsersTableStyle-rowBattle{background-color:rgba(0,0,0,0.1);border:2px solid rgba(255,255,255,0.2);border-radius:12px;margin:2px;backdrop-filter:blur(3px)}.UsersTableStyle-cellNameDM.UsersTableStyle-fontCell{background-color:rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.23);border-radius:12px;margin:2px}.UsersTableStyle-cellName.UsersTableStyle-centerCell.UsersTableStyle-fontCell.UsersTableStyle-rowBattle{background-color:rgba(0,0,0,0.1);border:2px solid rgba(255,255,255,0.23);border-radius:10px;margin:2px;backdrop-filter:blur(3px)}.BreadcrumbsComponentStyle-headerContainer{border-bottom-left-radius:30px;border-bottom-right-radius:30px;border:2px solid rgba(255,255,255,0.2)}.BattleTabStatisticComponentStyle-containerInsideTeams{background:rgb(0 0 0 / 20%);backdrop-filter:blur(15px);border:2px solid rgba(255,255,255,0.19);border-radius:15px}@keyframes zVzVv{0%{opacity:0}100%{opacity:1}}@keyframes fadeOut{0%{opacity:0}100%{opacity:1}}.BattleTabStatisticComponentStyle-containerInsideResults{background:rgb(0 0 0/33%);backdrop-filter:blur(4px);border:2px solid rgba(255,255,255,0.19);border-radius:15px}@keyframes zVzV{0%{opacity:0}100%{opacity:1}}.UsersTableStyle-row{background:transparent}.BattleTabStatisticComponentStyle-selectedRowBackGround{background:rgb(130 130 130 / 20%);border:1px solid rgba(255,255,255,0.3);border-radius:12px}.BattleTabStatisticComponentStyle-rowBackGround{background-color:rgb(0 0 0 / 20%);border:1px solid rgba(255,255,255,0.3);border-radius:12px}.BattlePassLobbyComponentStyle-menuBattlePass{background:rgb(0 0 0/17%);border:2px solid rgba(255,255,255,0.19);border-radius:10px;backdrop-filter:blur(5px);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px}.FooterComponentStyle-containerMenu{background:rgba(0,0,0,0.25);backdrop-filter:blur(5px);margin:4px;border-radius:35px;border:2px solid rgba(255,255,255,0.23)}.MainScreenComponentStyle-containerPanel{background:rgba(0,0,0,0.1);backdrop-filter:blur(5px);border-bottom-left-radius:30px;border-bottom-right-radius:30px;border:2px solid rgba(255,255,255,0.18)}.UserInfoContainerStyle-blockLeftPanel>div>div{background:rgba(0,0,0,0);border:0px solid rgba(255,255,255,0.17)}.Common-flexCenterAlignCenter{border:0px solid rgba(255,255,255,0.17)}.PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer{background:rgba(0,0,0,0.2);width:23em;margin:6px;backdrop-filter:blur(5px);border-radius:23px;left:-2em;top:2%;border:2px solid rgba(255,255,255,0.17)}.MainScreenComponentStyle-buttonPlay{background:rgba(0,0,0,0.3);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.21);border-radius:25px;left:-1em;width:27em}.MainScreenComponentStyle-playButtonContainer.MainScreenComponentStyle-buttonPlay.MainScreenComponentStyle-activeItem{background:rgba(0,0,0,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.21);border-radius:25px;left:-2em}.SettingsMenuComponentStyle-menuItemOptions{background:rgb(0 0 0/20%);border-radius:20px;margin:3px;border:2px solid rgba(255,255,255,0.22);height:11%}.LobbyLoaderComponentStyle-loaderContainer{visibility:hidden !important}.SettingsMenuComponentStyle-slideMenuOptions{visibility:hidden !important}.BattlePassLobbyComponentStyle-menuBattlePass{transition:box-shadow 0.75s !important;box-shadow:unset !important}.BattlePassLobbyComponentStyle-menuBattlePass:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.05em !important}.FooterComponentStyle-containerMenu{transition:box-shadow 0.7s !important;box-shadow:unset !important}.FooterComponentStyle-containerMenu:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MainScreenComponentStyle-buttonPlay{transition:box-shadow 0.6s !important;box-shadow:unset !important}.MainScreenComponentStyle-buttonPlay:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer{transition:box-shadow 0.3s !important;box-shadow:unset !important}.PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SettingsMenuComponentStyle-menuItemOptions{transition:box-shadow 0.6s !important;box-shadow:unset !important}.SettingsMenuComponentStyle-menuItemOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.08em !important}.SuppliesComponentStyle-cellAdd{background:rgb(0 0 0/20%);border-radius:12px;border:2px solid rgba(255,255,255,0.23)}.SuppliesComponentStyle-cellAdd{transition:box-shadow 0.7s !important;box-shadow:unset !important}.SuppliesComponentStyle-cellAdd:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SuppliesComponentStyle-decorLine{visibility:hidden !important}.SuppliesComponentStyle-screenShotButtonOpen{border:0px solid rgba(255,255,255,0.2)}.MountedItemsStyle-commonForCellResistenceName.Common-backgroundImage{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:18px}.MountedItemsStyle-commonForCellResistenceName.Common-backgroundImage{transition:box-shadow 0.7s !important;box-shadow:unset !important}.MountedItemsStyle-commonForCellResistenceName.Common-backgroundImage:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-freeSlot{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);border-radius:20px}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-freeSlot{transition:box-shadow 0.7s !important;box-shadow:unset !important}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-freeSlot:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.GarageProtectionsComponentStyle-mountedResistActive{background:rgb(66 150 66/30%);border-radius:19px;border:2px solid rgba(151,154,170,0.2)}.GarageProtectionsComponentStyle-mountedResistActive{transition:box-shadow 0.7s !important;box-shadow:unset !important}.GarageProtectionsComponentStyle-mountedResistActive:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(66 150 66/30%);border-radius:19px}.Common-itemStyle{background:rgb(0 0 0/20%);border:2px solid rgba(255,255,255,0.23);margin:2px;border-radius:13px}.Common-itemStyle{transition:box-shadow 0.7s !important;box-shadow:unset !important}.Common-itemStyle:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.TankParametersStyle-leftParamsContainer{background-color:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);border-radius:10px}.MountedItemsStyle-commonBlockDrone.Common-dropFilter{border-radius:13px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);margin-top:3px}.MountedItemsStyle-commonBlockDrone.Common-dropFilter{transition:box-shadow 0.5s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockDrone.Common-dropFilter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-commonBlockPaint.Common-dropFilter{border-radius:13px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);margin-top:3px}.MountedItemsStyle-commonBlockPaint.Common-dropFilter{transition:box-shadow 0.8s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockPaint.Common-dropFilter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsWeapon.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22)}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsWeapon.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{transition:box-shadow 0.7s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsWeapon.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22)}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls{transition:box-shadow 0.7s !important;box-shadow:unset !important}.MountedItemsStyle-commonBlockForTurretsHulls.Common-dropFilter.MountedItemsComponentStyleMobile-commonBlockForTurretsHulls:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MountedItemsStyle-improvementArrow{filter:brightness(0%);filter:hue-rotate(180deg)}.PrimaryMenuItemComponentStyle-notificationIconNewNews{filter:brightness(80%)}.GarageProtectionsComponentStyle-unequip{visibility:hidden !important}.BreadcrumbsComponentStyle-breadcrumbs>span{filter:brightness(0%);filter:hue-rotate(180deg)}.HotKey-commonBlockForHotKey{border-radius:50px;background:rgb(255 255 255/90%);margin-left:3px}.SmallShowcaseItemComponentStyle-container{border-radius:10px;outline:2px solid rgba(255,255,255,0.15);background:rgb(0 0 0/40%);transition:box-shadow 0.5s !important;box-shadow:unset !important}.ShowcaseItemComponentStyle-header{background:rgb(0 0 0/40%)}.SmallShowcaseItemComponentStyle-container:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;margin-bottom:0px}.shop-item-component{background:rgb(0 0 0/40%);border-radius:12px;border:2px solid rgba(255,255,255,0.15);transition:box-shadow 0.9s !important;box-shadow:unset !important}.shop-item-component:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/40%)}.ShopItemComponentStyle-headerContainer{border-bottom:0px solid rgba(255,255,255,0.15);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;background:rgb(0 0 0/40%);border-radius:10px;width:131.5px}.VerticalScrollStyle-outerContainerStyle.ShopCategoryOfferSectionStyle-outerContainer{background:rgb(0 0 0/60%)}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonChangesOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonChangesOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonChangesOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonChangesOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonConnectOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.AccountSettingsComponentStyle-buttonConnectOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonConnectOptions{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.AccountSettingsComponentStyle-buttonConnectOptions:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.SettingsButtonsComponentStyle-buttonsWidthBackReset{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.SettingsButtonsComponentStyle-buttonsWidthBackReset:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.GameSettingsStyle-button{background:rgb(0 0 0/10%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.GameSettingsStyle-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-keyButton{background:rgb(0 0 0/10%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-keyButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-enterButton{background:rgb(0 0 0/10%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-enterButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BasePaymentComponentStyle-container{background:rgb(0 0 0/60%);border:2px solid rgba(255,255,255,0.23);border-radius:12px;opacity:0;animation:vb 0.9s forwards}@keyframes vb{0%{opacity:0}100%{opacity:1}}.BasePaymentComponentStyle-buttonContainer>div{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.BasePaymentComponentStyle-buttonContainer>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BasePaymentComponentStyle-backButtonContainer>div{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.BasePaymentComponentStyle-backButtonContainer>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SuccessfulPurchaseComponentStyle-container{background:rgb(0 0 0/20%);border:2px solid rgba(255,255,255,0.17);border-radius:17px;backdrop-filter:blur(5px)}.SuccessfulPurchaseComponentStyle-content>div>.Common-flexCenterAlignCenter>div{background:rgb(0 0 0/0%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.SuccessfulPurchaseComponentStyle-content>div>.Common-flexCenterAlignCenter>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenterColumn.SkinCellStyle-widthHeight{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;margin:3px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenterColumn.SkinCellStyle-widthHeight:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.GarageCommonStyle-positionContentAlteration.GarageCommonStyle-subMenu{border:0px solid rgba(255,255,255,0.17)}.Common-flexSpaceBetweenAlignStartColumn{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.AlterationButtonStyle-buyButton.AlterationButtonStyle-commonButton.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.GarageTurretsAlterationsComponentStyle-containerButton.MountedItemsComponentStyleMobile-commonButtonUpdate{background:rgb(0 0 0/0%);border:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;top:5px}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.AlterationButtonStyle-buyButton.AlterationButtonStyle-commonButton.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.GarageTurretsAlterationsComponentStyle-containerButton.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.PrimaryMenuItemComponentStyle-discountNotification{border-radius:15px;filter:brightness(0%);filter:hue-rotate(180deg);margin-right:2em}.Common-discount{border-radius:15px;filter:brightness(0%);filter:hue-rotate(180deg)}.SuppliesComponentStyle-discountLabel{border-radius:15px;filter:brightness(0%);filter:hue-rotate(180deg)}.ClanInfoComponentStyle-messageClan{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);margin-bottom:2px}.ClanHeaderComponentStyle-blockInform{border-radius:15px;background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23)}.ClanCommonStyle-row{border-radius:12px;background:rgb(0 0 0/40%);margin:5px;border:2px solid rgba(255,255,255,0.23);transition:box-shadow 0.6s !important;box-shadow:unset !important}.ClanCommonStyle-row:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.TableComponentStyle-table thead tr{border-radius:12px;background:rgb(0 0 0/40%)}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonInvite.ClanProfileEditComponentStyle-buttonCancel{background:rgb(0 0 0/0%);border:2px solid rgba(255,255,255,0.23);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonInvite.ClanProfileEditComponentStyle-buttonCancel:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.FriendListComponentStyle-blockList.nickNameClass{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.23);border-radius:13px;margin-bottom:-5px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.FriendListComponentStyle-blockList.nickNameClass:hover{background:rgb(0 0 0/40%);box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.EventBattlePassLobbyComponentStyle-buttonEventBattlePass{background:rgb(0 0 0/17%);border-radius:13px;outline:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px}.EventBattlePassLobbyComponentStyle-buttonEventBattlePass{transition:box-shadow 0.5s !important;box-shadow:unset !important}.EventBattlePassLobbyComponentStyle-buttonEventBattlePass:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ChatComponentStyle-messageRow{background:rgb(0 0 0/17%);border-radius:13px}.GarageCommonStyle-garageContainer{background:rgb(0 0 0/45%);aspect-ratio:4 / 3}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonAddFriends.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.FriendListComponentStyle-buttonDisableAdd.FriendListComponentStyle-containerButtonFriends{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.FriendListComponentStyle-buttonDisableAdd.FriendListComponentStyle-containerButtonFriends:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonCloseAddFriends{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.FriendListComponentStyle-buttonCloseAddFriends:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.JoinToBattleComponentStyle-newButtonJoinA.JoinToBattleComponentStyle-buttonJoin{background:rgb(0 0 0/40%);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;outline:0px solid rgba(255,255,255,0.17)}.ClanInfoComponentStyle-clanForeignActions>div{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.ClanInfoComponentStyle-clanForeignActions>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ClanInfoComponentStyle-clanForeignActions>span{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);border-radius:15px;margin-right:3px}.MenuComponentStyle-mainMenuItem.Common-activeMenu{color:rgb(255,188,9)}.Common-flexCenterAlignCenter{outline:0px solid rgba(255,255,255,0.17);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.SearchInputComponentStyle-search>div>input{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px}.AccountSettingsComponentStyle-blockChangePassword>div>input{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px;margin-top:5px;margin:2px}.AccountSettingsComponentStyle-blockInputEmail>input{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px;margin-top:5px}.AccountSettingsComponentStyle-chargedWriting{margin-top:7px}.SuccessfulPurchaseComponentStyle-content>.Common-flexCenterAlignCenter>div{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.3s !important;box-shadow:unset !important}.SuccessfulPurchaseComponentStyle-content>.Common-flexCenterAlignCenter>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.NewsComponentStyle-newsWindow{background:rgb(0 0 0/35%);backdrop-filter:blur(7px);opacity:0;animation:sss 1s forwards}@keyframes sss{0%{opacity:0}100%{opacity:1}}.ClanInvitationsComponentStyle-invitationContent{background:rgb(12 12 12/37%);border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(6px);border-radius:15px}.BattleCreateComponentStyle-formNameBattle input[type="text"]{background:rgb(0 0 0/40%);border:2px solid rgba(255,255,255,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;border:2px solid rgba(255,255,255,0.2);border-radius:12px}.InputComponentStyle-defaultStyle{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px}.DropDownStyle-dropdownControl{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.25);box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important;border-radius:12px}.VerticalScrollStyle-outerContainerStyle.DropDownStyle-outerContainerStyle.DropDownStyle-dropdownMenu.Common-displayFlex>div>div{background:rgb(0 0 0/40%);border-radius:12px}.MainQuestComponentStyle-container{background:rgb(0 0 0/20%);border-radius:10px;border:2px solid rgba(255,255,255,0.2);margin:3px}.ScrollingCardsComponentStyle-scrollCard.cardImg{border-radius:13px;margin:5px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.5s !important;box-shadow:unset !important}.ScrollingCardsComponentStyle-scrollCard.cardImg:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard{border-radius:13px;background:rgb(0 0 0/20%);margin:5px;outline:1px solid rgba(255,255,255,0.25);transition:box-shadow 0.7s !important;box-shadow:unset !important}.Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.RewardItemComponentStyle-fastAppearance{background:rgb(0 0 0/30%);border-radius:10px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);transition:box-shadow 0.6s !important;box-shadow:unset !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents.BattlePickComponentStyle-styleIsEnableBlock{border-radius:25px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents.BattlePickComponentStyle-styleIsEnableBlock:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents{border-radius:25px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.BattlePickComponentStyle-commonStyleBlock.cardImgEvents:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BattlePickComponentStyle-modeCards{opacity:0;animation:yes 0.3s forwards}@keyframes yes{0%{opacity:0}100%{opacity:1}}.ProBattlesComponentStyle-mainContainer{opacity:0;animation:yess 0.9s forwards}@keyframes yess{0%{opacity:0}100%{opacity:1}}.BattleCreateComponentStyle-mainContainer{opacity:0;animation:st 0.9s forwards}@keyframes st{0%{opacity:0}100%{opacity:1}}.SettingsComponentStyle-blockContentOptions{opacity:0;animation:vs 0.7s forwards}@keyframes vs{0%{opacity:0}100%{opacity:1}}.FriendListComponentStyle-containerFriends{opacity:0;animation:vss 0.7s forwards}@keyframes vss{0%{opacity:0}100%{opacity:1}}.ContainersStyle-lootBoxContainers{opacity:0;animation:trs 0.9s forwards}@keyframes trs{0%{opacity:0}100%{opacity:1}}.BattleInfoComponentStyle-blockCard{border-radius:15px}.VerticalScrollStyle-outerContainerStyle.DropDownStyle-outerContainerStyle.DropDownStyle-dropdownMenu.Common-displayFlex>div>div>div{border-radius:12px;background:rgb(0 0 0/40%);backdrop-filter:blur(5px);margin:4px;outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.7s !important;box-shadow:unset !important}.VerticalScrollStyle-outerContainerStyle.DropDownStyle-outerContainerStyle.DropDownStyle-dropdownMenu.Common-displayFlex>div>div>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.KeyboardSettingsComponentStyle-keyInput{border-radius:8px;background:rgb(0 0 0/10%);outline:1px solid rgba(255,255,255,0.2)}.KeyMappingWithIconComponentStyle-commonBlockSupplies{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);border-radius:8px}.KeyMappingWithIconComponentStyle-overdrives{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);border-radius:50px}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-mountedResist{outline:2px solid rgba(255,255,255,0.2);border-radius:19px;background:rgb(0 0 0/40%);transition:box-shadow 0.7s !important;box-shadow:unset !important}.GarageProtectionsComponentStyle-equipmentResistance.GarageProtectionsComponentStyle-mountedResist:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}#root>div>div>div>div>div>div>form>div{background:rgb(0 0 0/40%);outline:1px solid rgba(255,255,255,0.2);border-radius:12px}.AccountSettingsComponentStyle-informationWriting{margin-top:6px}.AccountSettingsComponentStyle-labelInputEmail{margin-bottom:6px}.ClanCreateComponentStyle-blockCreatureClan{background:rgb(0 0 0/19%);backdrop-filter:blur(20px);opacity:0;animation:vsss 0.9s forwards}@keyframes vsss{0%{opacity:0}100%{opacity:1}}.Common-flexCenterAlignCenterColumn.blockCard{border-radius:12px;outline:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0/20%);transition:box-shadow 0.9s !important;box-shadow:unset !important}.Common-flexCenterAlignCenterColumn.blockCard:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexStartAlignCenterColumn{opacity:0;animation:vssss 0.9s forwards}@keyframes vssss{0%{opacity:0}100%{opacity:1}}.BattleModesComponentStyle-blockCenter{opacity:0;animation:sts 1.2s forwards}@keyframes sts{0%{opacity:0}100%{opacity:1}}.FormatsSectionComponentStyle-unSelectedCard{border-radius:15px;outline:2px solid rgba(255,255,255,0.2);margin:5px;transition:box-shadow 0.9s !important;box-shadow:unset !important}@keyframes cst{0%{opacity:0}100%{opacity:1}}.FormatsSectionComponentStyle-unSelectedCard:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.FormatsSectionComponentStyle-selectedCard.cardImg{border-radius:15px;outline:2px solid rgba(255,255,255,0.2);margin:5px;transition:box-shadow 0.9s !important;box-shadow:unset !important}@keyframes cst{0%{opacity:0}100%{opacity:1}}.FormatsSectionComponentStyle-SelectedCard.cardImg:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexStartAlignStretch.SettingsComponentStyle-scrollCreateBattle.Common-scrollBarHoverVisible{background:rgb(0 0 0/40%);opacity:0;animation:cstt 0.8s forwards}@keyframes cstt{0%{opacity:0}100%{opacity:1}}.BattleCreateComponentStyle-scrollBattlePick.BattleCreateComponentStyle-blockCard.Common-scrollBarVisible{opacity:0;animation:a 0.8s forwards}@keyframes a{0%{opacity:0}100%{opacity:1}}.ScrollingCardsComponentStyle-blockCenter{opacity:0;animation:aA 0.8s forwards}@keyframes aA{0%{opacity:0}100%{opacity:1}}.OpenContainerStyle-containerLootBoxes{opacity:0;animation:bB 0.9s forwards}@keyframes bB{0%{opacity:0}100%{opacity:1}}.NewShopCommonComponentStyle-marginButtonContainer{opacity:0;animation:zZ 0.9s forwards}@keyframes zZ{0%{opacity:0}100%{opacity:1}}.ShopCategoryComponentStyle-itemsContainer{opacity:0;animation:zZz 0.9s forwards}@keyframes zZz{0%{opacity:0}100%{opacity:1}}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ContainersStyle-openBuyButton{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.3s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ContainersStyle-openBuyButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.ContainersStyle-openBuyButton{background:rgb(0 0 0/20%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ContainersStyle-openBuyButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.PossibleRewardsStyle-buttonShowAll.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.ContainersStyleMobile-buttonShowAll{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.PossibleRewardsStyle-buttonShowAll.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.ContainersStyleMobile-buttonShowAll:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ContainerInfoComponentStyle-backButtonContainer{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.ContainerInfoComponentStyle-backButtonContainer:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;width:15em}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-backButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-backButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.17);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;width:16em}.Common-flexCenterAlignCenter.InvitationWindowsComponentStyle-inviteButton.Font-bold.Font-normal.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.5s !important;box-shadow:unset !important;top:5px}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.SquarePriceButtonComponentStyle-commonBlockButton SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate{background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.TanksPartBaseComponentStyle-marginTop.MountedItemsComponentStyleMobile-buttonEstablished.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.MountedItemsComponentStyleMobile-commonButtonUpdate{outline:2px solid rgba(255,255,255,0.22);border-radius:12px;transition:box-shadow 0.3s !important;box-shadow:unset !important}.SquarePriceButtonComponentStyle-commonBlockButton.SquarePriceButtonComponentStyle-buttonBase.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.MountedItemsComponentStyleMobile-commonButtonUpdate:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.BattleKillBoardComponentStyle-tableContainer table tbody #enemyCommand{background:rgb(69 0 0/30%);border-radius:12px;border:2px solid rgba(255,255,255,0.2);margin:2px;backdrop-filter:blur(5px)}.BattleKillBoardComponentStyle-tableContainer table tbody #selfUserBg{background:rgb(33 33 150/30%);margin:2px;border-radius:12px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(7px)}.BattleKillBoardComponentStyle-tableContainer table tbody #blueCommand{background:rgb(0 0 69/30%);border-radius:12px;border:2px solid rgba(255,255,255,0.2);margin:2px;backdrop-filter:blur(5px)}.SettingsComponentStyle-scrollingMenu{background:rgb(0 0 0/10%)}.ShopCategoryComponentStyle-header{color:rgb(255,188,9)}.PaymentInfoComponentStyle-header{color:rgb(255,188,9)}.CoinPaymentComponentStyle-header{color:rgb(255,188,9)}.Common-whiteSpaceNoWrap.ShopItemComponentStyle-headerContent{color:rgb(255,188,9)}.PaymentInfoItemComponentStyle-itemName{color:rgb(255,188,9)}.ClanCommonStyle-content{background:rgb(0 0 0/60%);opacity:0;animation:Gg 0.9s forwards}@keyframes Gg{0%{opacity:0}100%{opacity:1}}.ClanCommonStyle-rowEmpty{background:rgb(0 0 0/60%);border-radius:12px;border:2px solid rgba(255,255,255,0.2);margin:2px;backdrop-filter:blur(5px);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanCommonStyle-buttonSendRequest{background:rgb(0 0 0/60%);border-radius:12px;width:70px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanCommonStyle-buttonSendRequest:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonSendRequest{background:rgb(0 0 0/60%);border-radius:12px;width:70px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonSendRequest:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.CrystalPaymentComponentStyle-header{color:rgb(255,188,9)}.Common-flexSpaceBetweenAlignStretchColumn.Common-flexWrapNowrap.Common-overflowScrollFriends{background:rgb(0 0 0/60%);border-radius:12px;border:2px solid rgba(255,255,255,0.2)}.ChoosePaymentMethodComponentStyle-header{color:rgb(255,188,9)}.ShowcaseItemComponentStyle-headerContent{color:rgb(255,188,9)}.DialogContainerComponentStyle-header h1{color:rgb(255,188,9)}.ScrollingCardsComponentStyle-cardName h2{color:rgb(255,188,9)}.BattlePauseMenuComponentStyle-enabledButton{background:rgb(0 0 0/20%);backdrop-filter:blur(5px);border-radius:12px;border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.BattlePauseMenuComponentStyle-enabledButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.BattlePauseMenuComponentStyle-redMenuButton.BattlePauseMenuComponentStyle-enabledButton.BattlePauseMenuComponentStyle-selectedRedMenuButton>span{color:#ff0000}.BattlePauseMenuComponentStyle-dialogFooter{background:rgb(0 0 0/0%)}.ScrollingCardsComponentStyle-cardCount{background:rgb(255,188,9)}.MainQuestComponentStyle-description h3{color:rgb(255,188,9)}.MainQuestComponentStyle-progress{background-color:rgb(255,188,9)}.ClanInfoComponentStyle-header{color:rgb(255,188,9)}.TableComponentStyle-table thead tr th h2{color:rgb(255,188,9)}.PossibleRewardsStyle-commonBlockPossibleRewards h2{color:rgb(255,188,9)}.ContainersStyle-blockDescriptionContainers h1{color:rgb(255,188,9)}.Common-menuItemActive{color:rgb(255,188,9)}.MainQuestComponentStyle-buttonContainer{background:rgb(0 0 0/20%)}.MainQuestComponentStyle-container.MainQuestComponentStyle-rewardGivenBg{background-color:rgb(0 0 0 / 60%)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-receivedItem{border-radius:15px;border:1px solid rgba(255,255,255,0.15)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-receivedItemPremium{border-radius:15px;border:1px solid rgba(255,255,255,0.15)}.QuestsChallengesComponentStyle-blockGradient{background-image:radial-gradient(170.14% 100% at 50% 0%,rgb(0 0 0 / 75%) 0%,rgb(123 29 29 / 50%) 50%,rgba(255,51,51,0) 100%)}.QuestsChallengesComponentStyle-maxTierBlockFree{display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(170.14% 100% at 50% 100%,rgb(99 115 146 / 25%) 0%,rgba(191,212,255,0) 100%)}.QuestsChallengesComponentStyle-blockGradientEvent{background-image:radial-gradient(170.83% 50% at 0% 50%,rgb(0 0 0 / 75%) 0%,rgb(121 77 77 / 50%) 50%,rgb(0 0 0 / 0%) 100%)}.QuestsChallengesComponentStyle-eventTier{background-image:radial-gradient(170.83% 50% at 0% 50%,rgb(0 0 0 / 75%) 0%,rgb(121 77 77 / 50%) 50%,rgb(0 0 0 / 0%) 100%)}.BattlePauseMenuComponentStyle-menuButton.BattlePauseMenuComponentStyle-disabledButton{border-radius:12px}.BattleMessagesComponentStyle-messageRow{position:absolute;top:29%;left:1em}.BattleMessagesComponentStyle-message{background:rgb(0 0 0 /27%);border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(7px);border-radius:10px}.BreadcrumbsComponentStyle-backButton h3{border-radius:50px}.TableComponentStyle-row{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);margin-top:6px}.FriendRequestComponentStyle-buttonAccept{background:rgb(0 0 0/0%);backdrop-filter:blur(5px);border-radius:12px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.FriendRequestComponentStyle-buttonAccept:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.FriendRequestComponentStyle-buttonDecline{background:rgb(0 0 0/0%);backdrop-filter:blur(5px);border-radius:12px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.FriendRequestComponentStyle-buttonDecline:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.FriendRequestComponentStyle-buttonDeclineAll{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.FriendRequestComponentStyle-buttonDeclineAll:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/0%)}.FriendRequestComponentStyle-buttonDeclineAllInvisible{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2)}.ProBattlesComponentStyle-mainContainer>div>.Common-flexStartAlignCenterColumn>div>.Common-flexCenterAlignCenter>span{color:rgb(255,188,9)}.BattlePassLobbyComponentStyle-blockBattlePass{border-radius:12px}.ListItemsComponentStyle-itemsListContainer{background:rgb(0 0 0/10%)}.ItemDescriptionComponentStyle-captionDevice.Common-flexSpaceAroundAlignStretchColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignStretch{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.ItemDescriptionComponentStyle-captionDevice.Common-flexSpaceAroundAlignStretchColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignStretch:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ItemDescriptionComponentStyle-commonBlockModal{background:rgb(0 0 0/5%);backdrop-filter:blur(4px)}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton.ItemDescriptionComponentStyle-blockButtons{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton.ItemDescriptionComponentStyle-blockButtons:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.TutorialModalComponentStyle-contentWrapper{background:rgb(0 0 0/5%);backdrop-filter:blur(4px)}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton{border-radius:12px;background:rgb(0 0 0/40%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.TutorialModalComponentStyle-navigationButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.TutorialModalComponentStyle-navigationButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.FriendListComponentStyle-containerMember{opacity:0;animation:zZzz 0.7s forwards}@keyframes zZzz{0%{opacity:0}100%{opacity:1}}.TooltipStyle-tooltip{background:rgb(0 0 0/17%);backdrop-filter:blur(7px);border-radius:15px;outline:2px solid rgba(255,255,255,0.15);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanInvitationsComponentStyle-sendButton{border-radius:12px;background:rgb(0 0 0/0%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important;width:150px;margin-left:20px}.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled.ClanInvitationsComponentStyle-sendButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0em !important}.Common-flexCenterAlignCenter.ClanInvitationsComponentStyle-sendButton{border-radius:12px;background:rgb(0 0 0/0%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important;width:170px;margin-left:20px}.Common-flexCenterAlignCenter.ClanInvitationsComponentStyle-sendButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ClanSelfRequestsItemComponentStyle-creationDateCell>div{border-radius:12px;background:rgb(0 0 0/0%);transition:box-shadow 0.8s !important;box-shadow:unset !important}.ClanSelfRequestsItemComponentStyle-creationDateCell>div:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.ProBattlesComponentStyle-createBattleButton{background:rgb(0 0 0/0%)}.Common-flexCenterAlignCenter.SecuritySettingsComponentStyle-button{border-radius:12px;background:rgb(0 0 0/0%);outline:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.SecuritySettingsComponentStyle-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.RankupComponentStyle-wrapper{width:100%;min-width:71.25em;min-height:31.25em;display:flex;flex-flow:column wrap;justify-content:center;align-items:center;position:relative;z-index:20;height:31.25em;-webkit-box-pack:center;-webkit-box-align:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;background:rgb(0 0 0/0%);opacity:0;animation:zkkk 0.7s forwards}@keyframes zkkk{0%{opacity:0}100%{opacity:1}}.ScrollBarStyle-itemsContainer{background:rgb(0 0 0/0%);border-radius:15px}.RankupComponentStyle-title{color:rgb(255,188,9)}.RankupUnlockedItemsComponentStyle-unlockedItemsText{font-family:RubikMedium;font-style:normal;font-weight:500;text-transform:uppercase;font-size:1.375em;color:rgb(255,188,9)}.RankupUnlockedItemsComponentStyle-contentWrapper{background:radial-gradient(50% 100% at 50% 100%,rgb(0 0 0 / 30%) 100%,rgb(0 0 0 / 30%) 100%);backdrop-filter:blur(5px);opacity:0;animation:zkk 0.7s forwards}@keyframes zkk{0%{opacity:0}100%{opacity:1}}.BattleChatComponentStyle-inputContainerAll{background:rgb(0 0 0/35%);border-radius:12px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;opacity:0;animation:vzvz 0.7s forwards}@keyframes vzvz{0%{opacity:0}100%{opacity:1}}.BattleChatComponentStyle-btnToggleTeamAllies{background:rgb(0 0 0/0%)}.BattleChatComponentStyle-inputContainerAllies{background:rgb(0 0 0/35%);border-radius:12px;backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.2);box-shadow:rgba(255,255,255,0) 0px 0px 0px 0px,rgba(255,255,255,0) 0px 0px 0px 0px;opacity:0;animation:zk 0.7s forwards}@keyframes zk{0%{opacity:0}100%{opacity:1}}.BattleChatComponentStyle-btnToggleTeamAll{background:rgb(0 0 0/0%)}.Common-flexStartAlignCenter.Common-whiteSpaceNoWrap.nickNameClass{background-color:rgb(0 0 0/15%);backdrop-filter:blur(5px);border-radius:12px;margin:4px;border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexStartAlignCenter.Common-whiteSpaceNoWrap.nickNameClass:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.InvitationWindowsComponentStyle-usersScroll{opacity:0;animation:zkZ 0.7s forwards}@keyframes zkZ{0%{opacity:0}100%{opacity:1}}.GarageProtectionsComponentStyle-freeSlotActive{border:2px solid rgba(255,255,255,0.17);border-radius:19px}.Common-flexCenterAlignCenter.Common-alignSelfFlexEnd{background:rgb(0 0 0/35%);border-radius:12px;border:2px solid rgba(255,255,255,0.22);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.Common-alignSelfFlexEnd:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-disabledButton.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/10%);border-radius:12px;border:2px solid rgba(255,255,255,0.16);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-disabledButton.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-buttonNextWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/10%);border-radius:12px;border:2px solid rgba(255,255,255,0.16);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-buttonNextWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.UidInputComponentStyle-dropDownItem{font-family:RubikRegular;font-style:normal;font-weight:normal;font-size:1em;line-height:normal;color:rgb(227 227 227)}.shop-item-component:hover .ShopItemComponentStyle-headerContainer{background:rgba(0,0,0,0.4);transition:background 1s ease 0s}.BattleResultQuestProgressComponentStyle-container{border-radius:12px;background:rgb(0 0 0/100%);margin:5px;transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexStartAlignCenterColumn.QuestsComponentStyle-scrollBlock>div>div>div{background:rgb(0 0 0/100%);border:2px solid rgba(255,255,255,0.2);border-radius:15px;transition:box-shadow 0.8s !important;box-shadow:unset !important;margin:5px}.BattleResultQuestProgressComponentStyle-container:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter{background:rgb(0 0 0/90%);border-radius:12px;border:2px solid rgba(255,255,255,0.16);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-button.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.MenuComponentStyle-blockRequests{color:rgb(255 206 76)}.ClanCommonStyle-onlineNickName{color:rgb(255,188,9)}.Need2FaDialogComponentStyle-container{background:rgb(12 12 12/16%);backdrop-filter:blur(5px);border:2px solid rgba(255,255,255,0.2);border-radius:12px}.MainScreenComponentStyle-playButtonContainer span{color:rgb(255,188,9)}.BattlePassLobbyComponentStyle-descriptionMenuPass>div>span{color:rgb(255,188,9)}.Common-flexCenterAlignCenter.ClanCommonStyle-buttonInvite.ClanProfileEditComponentStyle-buttonCancel>span{color:rgb(255,188,9)}.FriendListComponentStyle-containerButtonFriends>div>img{filter:sepia(700%) saturate(200%)}.Common-flexCenterAlignCenter.DialogContainerComponentStyle-enterButton>span{color:rgb(255,188,9)}.BasePaymentComponentStyle-buttonContainer>div>span{color:rgb(255,188,9)}.BattlePickComponentStyle-descriptionBattle h2{color:rgb(255,188,9)}.ContainersStyle-centerColumn>div>div>span{color:rgb(255,188,9)}.Common-flexCenterAlignCenter.PossibleRewardsStyle-buttonShowAll.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter.ContainersStyleMobile-buttonShowAll>span{color:rgb(255,188,9)}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>.Common-flexCenterAlignCenter{border-radius:15px;border:2px solid rgba(255,255,255,0.22);transition:box-shadow 0.8s !important;box-shadow:unset !important}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>div>div>.Common-flexCenterAlignCenter{border-radius:15px;border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>div>div>.Common-flexCenterAlignCenter:hover{box-shadow:rgb(255,188,9) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/100%)}.TanksPartBaseComponentStyle-tankPartContainer>div>.TanksPartComponentStyle-descriptionContainer>div>div>.Common-flexCenterAlignCenter:hover{box-shadow:rgb(255,188,9) 0em 0em 0em 0.09em !important;background:rgb(0 0 0/100%)}.DeviceButtonComponentStyle-blockAlterations h2{color:rgb(255,188,9)}.ItemDescriptionComponentStyle-linkToFullDescription{color:rgb(255,188,9)}.TanksPartComponentStyle-blockDescriptionComponent>span{color:rgb(255,188,9)}TutorialModalComponentStyle-contentWrapper>div>div>h1{color:rgb(255,188,9)}.Common-menuItemActive{position:absolute;bottom:0px;background-color:rgb(255 255 255)}.ContextMenuStyle-menuItemRank{background:rgb(255 255 255 / 10%);height:2.663em;border-radius:10px}.ContextMenuStyle-menuItemRank:hover{background:rgb(0 0 0 / 10%);height:2.663em;border-radius:10px}.navbar{background:rgb(0 0 0 / 40%);backdrop-filter:blur(5px);border-bottom-left-radius:30px;border-bottom-right-radius:30px;border:2px solid rgba(255,255,255,0.2)}.generic-box{background:rgb(0 0 0 / 30%);border-radius:15px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(5px)}.search-panel__input-wrapper>input{background:rgb(0 0 0 / 30%);border-radius:11px;border:2px solid rgba(255,255,255,0.2)}.my-favorites__itself{border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 30%)}.generic-button{border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 30%)}.generic-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.progress-bar{border-radius:12px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 30%)}.generic-selector__itself{border-radius:10px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 0%)}.progress-bar__bar{background:rgb(115 81 132 / 30%);border:2px solid rgba(255,255,255,0.2);border-radius:10px}.ClanStatisticsComponentStyle-marginLeftAreCommon{background:rgb(0 0 0 / 60%);border:2px solid rgba(255,255,255,0.22);border-radius:10px}.NotificationViewStyle-commonBlockNotification{background:rgb(0 0 0 / 20%) !important;border-bottom-left-radius:15px;border-top-left-radius:15px;backdrop-filter:blur(5px)}#invite{border-radius:12px;border:2px solid rgba(255,255,255,0.2);background:rgb(0 0 0 / 10%)}.client-button{background:rgb(0 0 0 / 10%);border:2px solid rgba(255,255,255,0.2);border-radius:12px}.client-button:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important;background:rgb(0 0 0 / 10%);border:0px solid rgba(255,255,255,0);margin:0px}.ClanStatisticsComponentStyle-areCommon{background:rgb(0 0 0 / 60%);border:2px solid rgba(255,255,255,0.2);border-radius:10px}.Common-backgroundImageCover.modeLimitIcon{transition:box-shadow 0.8s !important;box-shadow:unset !important;border:2px solid rgba(255,255,255,0.2);border-radius:10px}.Common-backgroundImageCover.modeLimitIcon:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-flexCenterAlignCenter.UserTitleComponentStyle-premiumButton{border-radius:12px;background:rgb(0 0 0 / 10%);border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.Common-flexCenterAlignCenter.UserTitleComponentStyle-premiumButton:hover{box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.PopupMessageComponentStyle-buttonsContainer>.Common-flexCenterAlignCenter>div{border-radius:12px;background:rgb(0 0 0 / 10%);border:2px solid rgba(255,255,255,0.2);transition:box-shadow 0.8s !important;box-shadow:unset !important}.PopupMessageComponentStyle-buttonsContainer>.Common-flexCenterAlignCenter>div:hover{background:rgb(0 0 0 / 10%);box-shadow:rgb(255,255,255) 0em 0em 0em 0.09em !important}.Common-container.Common-flexStartAlignStartColumn,.BattleComponentStyle-canvasContainer>.Common-container{background:rgb(0,0,0,0.4)}.TableComponentStyle-tBody{backdrop-filter:blur(0px)}.ChallengeTimerComponentStyle-textTime{border-radius:25px;border:2px solid rgba(255,255,255,0.2);color:rgb(255 255 255/100%);background-color:rgb(0 0 0/0%)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-getItemNow{background:rgba(0,128,0,0.3);border-radius:15px;border:2px solid rgba(255,255,255,0.2)}.TierItemComponentStyle-tierCommon{background:rgb(0 0 69/20%);border-radius:15px;border:2px solid rgba(255,255,255,0.2)}.Common-flexCenterAlignCenterColumn.TierItemComponentStyle-tierPremium{background:rgb(0 0 0/20%);border-radius:15px;border:2px solid rgba(255,255,255,0.2)}`;
})();