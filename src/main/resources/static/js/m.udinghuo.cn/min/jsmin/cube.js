/*! u-order-mobile 2024-01-13 */
var esStr, esArr, esobj, yht_access_tokenForWxMiniProgram, langForWxMiniProgram, upcommonNode = document.createElement("script"), query = (cb.utils = {},
    cb.temp = {
        isEsn: -1 < window.location.pathname.indexOf("esnlogin"),
        backBtnCount: 0,
        toolMenusDom: Dom7("#dynamicMenus").html()
    },
    Dom7.parseUrlQuery(window.location.href));
cb.temp.isEsn && query.code && cb.rest.appContext.clear(),
    cb.rest.status = {
        notData: 404,
        ajaxErrorCode: 100
    },
    cb.rest.isType = function(obj, type) {
        obj = Object.prototype.toString.call(obj);
        return type ? obj === "[object " + type + "]" : obj.split(" ")[1].split("]")[0]
    }
    ,
    cb.rest.appContext.lang = cb.native.localStorage.get("langCode") || (cb.rest.runtime.isOpenMultilingual && "u8c" != cb.rest.runtime.env ? "en-us" : "zh-cn"),
    cb.rest.initToolbars = function(callback) {
        var menus, toolMenusTpl, selectCustomer;
        (!cb.rest.appContext.agentContentHtml || !cb.rest.appContext.corpContentHtml) && ((menus = cb.rest.appContext.viewMenus = {
            agentMenus: [{
                viewId: "view-1",
                url: "pages/home.html",
                code: "home",
                pagesClass: "navbar-fixed tabbar-labels-fixed fixed-through",
                pageContentClass: "p-t-0",
                icon: "footer-icon-1",
                name: "首页",
                isMainView: !0
            }, {
                viewId: "view-2",
                url: "pages/category.html",
                code: "category",
                pagesClass: "tabbar-labels-fixed",
                icon: "footer-icon-2",
                name: "分类"
            }, {
                viewId: "view-3",
                url: "pages/quickOrder.html",
                code: "order",
                icon: "footer-icon-5",
                name: "闪订"
            }, {
                viewId: "view-4",
                url: "pages/scart.html?ref=index",
                code: "cart",
                pagesClass: "tabbar-labels-fixed",
                icon: "footer-icon-3 upShoppingCount",
                name: "购物车"
            }, {
                viewId: "view-5",
                url: "pages/user.html",
                code: "user",
                icon: "footer-icon-4",
                name: "我的"
            }],
            corpMenus: [{
                viewId: "view-1",
                url: "corpPages/indexManage.html",
                code: "indexManage",
                pagesClass: "toolbar-through",
                pageContentClass: "p-t-0",
                icon: "footer-icon-1",
                name: "首页",
                isMainView: !0,
                auth: "orderDetail"
            }, {
                viewId: "view-2",
                url: "corpPages/orderListManage.html",
                code: "orderListManage",
                icon: "footer-icon-2",
                name: "订单",
                auth: "orderList|expenseOrderList|returnedPurchaseList"
            }, {
                viewId: "view-5",
                url: "corpPages/receipt.html",
                code: "receipt",
                pagesClass: "toolbar-through",
                icon: "footer-icon-9",
                name: "收款",
                auth: "receivablesDetail",
                isHide: cb.rest.appContext.context && (2 == cb.rest.appContext.context.bizMode || 4 == cb.rest.appContext.context.bizMode) && (1 == cb.rest.appContext.context.userType || 3 == cb.rest.appContext.context.userType)
            }, {
                viewId: "view-3",
                url: "corpPages/customer.html",
                code: "customer",
                pagesClass: "toolbar-through",
                icon: "footer-icon-7",
                name: "客户",
                auth: "agentList"
            }, {
                viewId: "view-4",
                url: "corpPages/productManage.html",
                code: "productManage",
                pagesClass: "toolbar-through",
                icon: "footer-icon-8",
                name: "商品",
                auth: "commodityList"
            }, {
                viewId: "view-6",
                url: "corpPages/channelIndex.html",
                code: "channelIndex",
                icon: "footer-icon-channel",
                name: "渠道",
                isHide: !(cb.rest.appContext.context && (2 == cb.rest.appContext.context.bizMode || 4 == cb.rest.appContext.context.bizMode) && (1 == cb.rest.appContext.context.userType || 3 == cb.rest.appContext.context.userType))
            }]
        }).corpMenus = menus.corpMenus.filter(function(item) {
            return !item.isHide
        }),
            toolMenusTpl = Template7.compile(cb.temp.toolMenusDom),
            cb.rest.appContext.agentContentHtml = toolMenusTpl({
                menus: menus.agentMenus,
                isAgent: !0
            }),
        2 != cb.utils.getUrlParam("functionType") && 3 != cb.utils.getUrlParam("functionType") && 4 != cb.utils.getUrlParam("functionType") || (selectCustomer = !0),
            cb.rest.appContext.corpContentHtml = toolMenusTpl({
                menus: menus.corpMenus,
                isAgent: !1,
                isYs: "u8c" === cb.rest.runtime.env,
                selectCustomer: selectCustomer
            }),
            cb.utils.getUrlParam("redirectUrl")) && cb.native.localStorage.get("insteadAgent") ? cb.rest.appContext.initApp(!1) : cb.rest.appContext.initApp(!!cb.rest.appContext.corpUser),
        callback && callback()
    }
    ,
    cb.rest.appContext.initApp = function(isCorp) {
        document.querySelector("#upContentViews").innerHTML = isCorp ? cb.rest.appContext.corpContentHtml : cb.rest.appContext.agentContentHtml,
            cb.rest.setJSUrl(isCorp);
        function showCallBack(e) {
            var ds = $$(this).dataset();
            if (ds.url) {
                if (cb.rest.defineRouters && cb.rest.defineRouters.pages && !cb.newRedirect) {
                    var current = cb.rest.defineRouters.pages.find(function(item) {
                        return item.router && item.path == ds.url
                    });
                    if (current)
                        return void (window.location.href = upcommon.format.url(current.router))
                }
                current = e.target.id;
                cb.temp.addView(current)
            }
        }
        $$("#upContentViews div.view.tab").off("show", showCallBack).on("show", showCallBack)
    }
    ,
    cb.rest.setJSUrl = function(isCorp) {
        var jsPath = "/js/pages/"
            , jsMinPath = "/min/jsmin/pages/";
        isCorp && (jsPath = "/js/corpPages/",
            jsMinPath = "/min/jsmin/corpPages/"),
            cb.rest.jsPath = cb.rest.isMin ? jsMinPath : jsPath,
            cb.rest.jsBasePath = cb.rest.isMin ? "/min/jsmin/" : "/js/"
    }
    ,
    cb.rest.setJSUrl(),
    upcommonNode.src = cb.rest.appContext.serviceUrl + cb.rest.jsBasePath + "upcommon.js",
    document.head.appendChild(upcommonNode),
    cb.rest.checkLoginStatus = function() {
        var status = !1;
        return status = void 0 !== cb.rest.appContext.corpUser && null !== cb.rest.appContext.corpUser ? !0 : status
    }
    ,
    cb.rest.checkDemoLogin = function() {
        return "1" === cb.native.localStorage.get("isDemoLogin")
    }
    ,
    cb.rest.getPrivacy = function(privacyPolicy, localPageAddress) {
        let privacyPolicyAddress = "";
        return privacyPolicyAddress = privacyPolicy ? privacyPolicy.endsWith(".html") ? privacyPolicy + "?date=" + (new Date).getTime() : privacyPolicy : localPageAddress
    }
    ,
    cb.rest.appContext.doLogin = function() {
        if ("block" == $$(".popup.popup-login").css("display") && (cb.native.isWxMiniProgram() || cb.native.isApiCloudApp())) {
            let appVersionStr = ""
                , agreeAppVersion = ""
                , agreeTerminal = "";
            cb.native.isWxMiniProgram() ? (appVersionStr = "WX udh 2.0.4",
                agreeAppVersion = "2.0.4",
                agreeTerminal = "WX") : cb.native.isApiCloudApp() && (appVersionStr = "IOS udh 3.0.6",
                agreeAppVersion = "3.0.6",
                agreeTerminal = "IOS"),
                0;
            var user = cb.rest.appContext.corpUser ? cb.rest.appContext.context.bizName : cb.rest.appContext.context.agentName
                , user = {
                userId: user || "",
                agreedVersionId: cb.native.localStorage.get("udhPrivacyId"),
                appVersion: appVersionStr,
                operation: cb.temp.privacy.operation,
                agreeApp: "udh",
                agreeAppVersion: agreeAppVersion,
                agreeTerminal: agreeTerminal,
                ytenantid: cb.rest.appContext.context.userId
            };
            cb.rest.privacyPolicyAgree(user)
        }
        function showHomePage() {
            myApp.closeModal(".login-screen.modal-in"),
                myApp.closeModal(".popup.popup-login"),
            "u8c" === cb.rest.runtime.env && cb.rest.appContext.context.isAgent && (time = window.__config__.heartbeatTime ? 60 * window.__config__.heartbeatTime * 1e3 : 3e5,
                cb.rest.appContext.hearBeat = setInterval(function() {
                    return cb.rest.getJSON({
                        url: cb.router.HTTP_AGENT_HEARTBEAT + "&date=" + (new Date).getTime(),
                        success: function(res) {
                            "EXCEEDED" !== res.data.status && "EXPIRED" !== res.data.status || myApp.toast(res.data.message, "error").show(!0)
                        },
                        error: function(e) {
                            myApp.toast(e.message, "error").show(!0)
                        }
                    })
                }, time));
            var cloneRedirectUrl, isFind, time, loadChackTimeMark, defaultOptions, redirectUrl = cb.utils.getUrlParam("redirectUrl");
            redirectUrl ? (cloneRedirectUrl = redirectUrl = redirectUrl.replace(/_/g, "/") + ".html",
                myApp.showIndicator(),
            window.__config__.productLine && "u8c" == window.__config__.productLine && cb.rest.checkAgentHome(),
                cb.rest.appContext.isAutoRedirect = !0,
            cb.rest.appContext.insteadAgent && cb.rest.appContext.initApp(!1),
                isFind = !1,
                $$("#upContentViews .view").each(function() {
                    var $this = $$(this);
                    0 <= $this.data("url").indexOf(redirectUrl) && ($$("#" + $this.attr("id")).trigger("show"),
                        isFind = !0)
                }),
            (time = cb.native.localStorage.get("insteadAgent")) && cb.utils.isJson(time) && void 0 === cb.rest.appContext.isAgentOrder && (cb.rest.appContext.isAgentOrder = !0,
                cb.rest.appContext.insteadAgent = JSON.parse(time),
                cb.rest.appContext.iAgentId = cb.rest.appContext.insteadAgent.agentId),
                isFind ? myApp.hideIndicator() : (redirectUrl && $$(".switch.allWhitebg").removeClass("hide"),
                    cb.newRedirect = !0,
                    $$("#view-1").trigger("show"),
                    loadChackTimeMark = setInterval(function() {
                        $$(myApp.mainView.selector).data("page") && (clearInterval(loadChackTimeMark),
                            setTimeout(function() {
                                var param = cb.utils.getUrlParam("redirectUrlparam");
                                if (param) {
                                    redirectUrl += "?";
                                    for (var paramKV = param.split("*"), i = 0; i < paramKV.length; i++)
                                        redirectUrl += paramKV[i].replace("~", "=") + "&";
                                    redirectUrl = redirectUrl.substr(0, redirectUrl.length - 1),
                                        redirectUrl += "&noback=true"
                                } else
                                    redirectUrl += "?noback=true";
                                var param = cb.utils.getUrlParam("reload", redirectUrl)
                                    , timer = (myApp.mainView.router.loadPage({
                                    url: redirectUrl,
                                    reload: !param || "true" == param
                                }),
                                    setInterval(function() {
                                        myApp.mainView.activePage && -1 < myApp.mainView.activePage.url.indexOf(cloneRedirectUrl) && (clearInterval(timer),
                                            myApp.hideIndicator(),
                                            $$(".switch.allWhitebg").addClass("hide"),
                                            cb.rest.defineRouters) && myApp.mainView.history.splice(0, 0, "pages/home.html")
                                    }, 300))
                            }, 500))
                    }, 100))) : (cb.rest.appContext.isAutoRedirect = !1,
                cb.rest.runtime.env && "u8c" == cb.rest.runtime.env ? 2 == cb.utils.getUrlParam("functionType") || 4 == cb.utils.getUrlParam("functionType") ? (defaultOptions = {
                    preprocess: function(content, url, next) {
                        return cb.preprocess(content, url, next)
                    }
                },
                    $$("#view-1").addClass("active"),
                    myApp.addView(".view-main", defaultOptions).router.loadPage({
                        url: "corpPages/generationOfOrder.html"
                    })) : 3 == cb.utils.getUrlParam("functionType") ? (defaultOptions = {
                    preprocess: function(content, url, next) {
                        return cb.preprocess(content, url, next)
                    }
                },
                    $$("#view-1").addClass("active"),
                    myApp.addView(".view-main", defaultOptions).router.loadPage({
                        url: "corpPages/generationOfOrderForChannel.html"
                    })) : cb.rest.checkAgentHome(function(tokenData) {
                    var arr;
                    tokenData.data && window.__config__.newHome ? (arr = (arr = cb.rest.appContext.lang && cb.rest.appContext.lang.split("-"))[0] + "_" + arr[1].toUpperCase(),
                        tokenData = Object.assign({}, $$.parseUrlQuery(window.location.search) || {}, {
                            corpid: cb.rest.appContext.context.corpId,
                            yxyToken: tokenData.data,
                            locale: arr
                        }),
                        window.location.href = "/designerPage?" + $$.serializeObject(tokenData)) : ($$("#view-1").trigger("show"),
                        myApp.showToolbar(".toolbar.homeNavBar"),
                        myApp.closePanel())
                }) : ($$("#view-1").trigger("show"),
                    myApp.showToolbar(".toolbar.homeNavBar"),
                    myApp.closePanel()),
            cb.native.isWeiXin() && cb.rest.execWxTask())
        }
        user = cb.native.localStorage.get("showImage");
        user ? cb.rest.appContext.showImage = "true" == user : (cb.native.localStorage.set("showImage", "true"),
            cb.rest.appContext.showImage = !0),
            cb.rest.loadDefineMenus(),
            cb.rest.loadFunctionOptions(),
            cb.rest.loadBizsFunctionOptions(),
            cb.mult.loadMultResource(),
            cb.rest.yiguanAnalysis(),
        cb.native.isWeiXin() && (cb.rest.initWxConfig(),
            setTimeout(function() {
                var wid = $$.parseUrlQuery(location.search).wid || cb.native.localStorage.get("wid");
                cb.rest.runtime.bindWxUser && wid && cb.rest.getJSON({
                    url: cb.router.HTTP_COMMON_WXUSERSTATUS,
                    params: {
                        weId: wid,
                        userId: cb.rest.appContext.context.userId
                    },
                    success: function(data) {
                        $$.isArray(data.data) && data.data.length || cb.rest.wxBindUser(cb.rest.appContext.context)
                    },
                    error: function(e) {
                        myApp.toast(e.message, "error").show(!0)
                    }
                })
            }, 3500)),
        cb.rest.appContext.corpUser && cb.rest.loadAuths(function() {
            $$(".homeNavBarCorp#homeNavBar a").each(function() {
                var autDefault;
                $$(this).data("aut") && !(autDefault = upcommon.testCorpAut($$(this).data("aut"))).state && (autDefault.handle ? autDefault.handle() : ($$(this).attr("href", "#"),
                    $$(this).on("click", function() {
                        myApp.toast(autDefault.errMessage, "tips").show(!0)
                    })))
            })
        });
        cb.rest.getJSON({
            url: cb.router.HTTP_AGENT_GETUSESETTINGFORHIDEPRICE,
            success: function(data) {
                data.data && 0 != data.data.length ? (data.data.forEach(function(item) {
                    "fPromotionMoney" !== item.fieldsCode && "fParticularlyMoney" !== item.fieldsCode && "fRebateMoney" !== item.fieldsCode || (item.checkZero = !0)
                }),
                    cb.rest.appContext.hidePrice = data.data) : cb.rest.appContext.hidePrice = cb.rest.status.notData
            },
            error: function() {
                cb.rest.appContext.hidePrice = cb.rest.status.ajaxErrorCode
            }
        }),
            cb.native.localStorage.get("insteadAgent") || 0 == cb.rest.appContext.corpUser || !cb.rest.appContext.corpUser ? ((user = cb.native.localStorage.get("insteadAgent")) && cb.utils.isJson(user) && 0 < window.location.href.indexOf("defineRouter") && (cb.rest.appContext.insteadAgent = JSON.parse(user),
                cb.rest.appContext.isAgentOrder = !0,
                cb.rest.appContext.iAgentId = cb.rest.appContext.insteadAgent.agentId),
                upmodels.queryAuths(cb.rest.appContext.insteadAgent && cb.rest.appContext.insteadAgent.agentId || cb.rest.appContext.context.agentId, function() {
                    cb.rest.initToolbars(function() {
                        showHomePage()
                    })
                })) : (cb.rest.appContext.isAgentOrder = cb.rest.appContext.isRelationOrder = !1,
                cb.native.localStorage.remove("insteadAgent"),
                cb.rest.initToolbars(function() {
                    showHomePage()
                })),
        cb.rest.checkDemoLogin() || $$(".experience-envir2").addClass("hide")
    }
    ,
    cb.rest.wxBindUser = function(loginInfo, callback) {
        var params, wid, query;
        cb.native.isWeiXin() && (query = $$.parseUrlQuery(location.search),
            params = [],
            wid = query.wid || cb.native.localStorage.get("wid"),
            query = query.OpenID || cb.native.localStorage.getCookie("OpenID"),
            wid) && query && (params.push({
            userId: loginInfo.userId,
            openId: query,
            weId: wid
        }),
            cb.confirm("是否与公众号建立绑定，以便获得单据消息推送？", "提示信息", function() {
                cb.rest.postData({
                    url: cb.router.HTTP_COMMON_BINDUSER,
                    params: params,
                    success: function(data) {
                        callback && 200 == data.code && callback()
                    },
                    error: function(err) {
                        myApp.toast(err.message, "tips").show(!0)
                    }
                })
            }, null, "立即绑定", "下次再说"))
    }
    ,
    cb.rest.bindUserOpenId = function() {
        var OpenID = $$.parseUrlQuery(location.search).OpenID || cb.native.localStorage.getCookie("OpenID");
        cb.native.isWeiXin() && cb.rest.appContext.context.isAgent && OpenID && cb.rest.postData({
            url: cb.router.HTTP_AGENT_BINDAGENTUSEROPENID,
            params: {
                open_id: OpenID
            },
            success: function(data) {
                data.code && console.log("openId bind sucess!!")
            },
            error: function(e) {
                console.log(e.message)
            }
        })
    }
    ,
    cb.rest.yiguanAnalysis = function() {
        cb.rest.getJSON({
            url: cb.router.HTTP_AGENT_YIGUANANS.format(cb.rest.appContext.context.userId),
            success: function(data) {
                data.data && window.AnalysysAgent && (window.AnalysysAgent.alias(cb.rest.appContext.context.userId.toString()),
                    data = {
                        tenant_id: data.data.tenantId,
                        company: data.data.corpInfo && data.data.corpInfo.name,
                        user_id: cb.rest.appContext.context.userId.toString(),
                        user_name: data.data.userInfo && data.data.userInfo.userName,
                        product_id: "Uorder",
                        product_name: "U订货",
                        terminal: cb.rest.appContext.context.isAgent ? "orderAPP_0" : "manageAPP_1"
                    },
                    window.AnalysysAgent.profileSet(data),
                    window.AnalysysAgent.registerSuperProperties(data),
                    window.AnalysysAgent.track("login_in"))
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    }
    ,
    cb.rest.loadExtendScript = function(params, callback) {
        console.log('本地js导入')
        var query = $$.parseUrlQuery(location.href)
            , param = {
            rotues: params.router
        };
        console.log(param)
        param.rotues = null;
        console.log(param)
        param.rotues && 0 < param.rotues.indexOf("?") && (param.rotues = param.rotues.substr(0, param.rotues.indexOf("?"))),
        (query.comKey || query.alias) && (param.alias = query.comKey || query.alias),
            !cb.rest.appContext.token && param.alias ? cb.rest.getJSON({
                url: cb.router.HTTP_JOIN_GETTOKENBYALIAS.format(param.alias),
                success: function(data) {
                    cb.rest.appContext.token = data.data,
                        cb.rest.getJSON({
                            url: cb.router.HTTP_BASE_EXTAPIREGISTER,
                            params: param,
                            success: function(data) {
                                data.data = [];
                                Array.isArray(data.data) && data.data.length ? upcommon.regs.url.test(data.data[0].extApiUrl) ? $$.ajax({
                                    url: cb.rest.getUrl(cb.router.HTTP_DEFINES_GETEXTENDJS),
                                    method: "POST",
                                    timeout: 3e4,
                                    data: JSON.stringify({
                                        url: data.data[0].extApiUrl
                                    }),
                                    contentType: "application/json",
                                    success: function(extendData) {
                                        console.log(extendData)
                                        if (extendData && "string" == typeof extendData)
                                            try {
                                                var events = new Function(extendData)();
                                                if (events && "object" == typeof events)
                                                    for (var attr in events)
                                                        UOrderApp.pages[params.controllerName].prototype[attr] = events[attr]
                                            } catch (e) {
                                                console.error("扩展脚本异常：url: [{0}] control:[{1}]".format(data.data[0].extApiUrl, params.controllerName)),
                                                    console.error("error maeesage: " + e.message.toString())
                                            }
                                        callback && callback()
                                    },
                                    error: function(xhr, status) {
                                        console.error("扩展脚本加载失败:" + status),
                                        callback && callback()
                                    }
                                }) : callback && callback() : callback && callback.call(this)
                            },
                            error: function(e) {
                                myApp.toast(e.message, "error").show(!0),
                                callback && callback.call(this)
                            }
                        })
                },
                error: function(err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            }) : cb.rest.getJSON({
                url: cb.router.HTTP_BASE_EXTAPIREGISTER,
                params: param,
                success: function(data) {
                    Array.isArray(data.data) && data.data.length ? upcommon.regs.url.test(data.data[0].extApiUrl) ? $$.ajax({
                        url: cb.rest.getUrl(cb.router.HTTP_DEFINES_GETEXTENDJS),
                        method: "POST",
                        timeout: 3e4,
                        data: JSON.stringify({
                            url: data.data[0].extApiUrl
                        }),
                        contentType: "application/json",
                        success: function(extendData) {
                            // console.log("extendData",extendData)
                            if (extendData && "string" == typeof extendData)
                                try {
                                    var events = new Function(extendData)();
                                    if (events && "object" == typeof events)
                                        for (var attr in events)
                                            UOrderApp.pages[params.controllerName].prototype[attr] = events[attr]
                                } catch (e) {
                                    console.error("扩展脚本异常：url: [{0}] control:[{1}]".format(data.data[0].extApiUrl, params.controllerName)),
                                        console.error("error maeesage: " + e.message.toString())
                                }
                            callback && callback()
                        },
                        error: function(xhr, status) {
                            console.error("扩展脚本加载失败:" + status),
                            callback && callback()
                        }
                    }) : callback && callback() : callback && callback.call(this)
                },
                error: function(e) {
                    myApp.toast(e.message, "error").show(!0),
                    callback && callback.call(this)
                }
            })
    }
    ,
    cb.rest.execWxTask = function() {
        var task, userId, callback;
        cb.native.wxTask && cb.native.wxTask.length && (task = cb.native.wxTask.pop(),
            userId = cb.native.localStorage.get("userId"),
            callback = function() {
                cb.rest.wxSetInterval = setInterval(function() {
                    var url = "";
                    if (myApp.mainView && myApp.mainView.allowPageChange) {
                        switch (clearInterval(cb.rest.wxSetInterval),
                            task.orderType) {
                            case "ORDER":
                                url = "pages/orderDetail.html?oid=" + task.no;
                                break;
                            case "PAYMENT":
                            case "REFUND":
                                url = "pages/orderStatus-pay.html?cPayNo=" + task.no;
                                break;
                            case "NOTICE":
                            case "REBATE":
                                url = "pages/noticeDetail.html?id=" + task.no;
                                break;
                            case "SALERETURN":
                                url = "pages/orderCancelInfo.html?oid=" + task.no;
                                break;
                            default:
                                myApp.toast("暂不支持该类型消息查看,未来版本会支持", "tips").show(!0)
                        }
                        setTimeout(function() {
                            myApp.mainView.router.loadPage({
                                url: url
                            })
                        }, 400)
                    }
                }, 100)
            }
            ,
            task.userId == userId ? callback() : cb.rest.switchAccent(userId, callback))
    }
    ,
    cb.rest.openLink = function(menu) {
        cb.rest.getJSON({
            url: cb.router.HTTP_AGENT_INITTHIRDURL.format(1),
            success: function(data) {
                var cloneMenu, cLinkToken;
                200 == data.code && menu.url && ((cloneMenu = cb.utils.extend(!0, {}, menu)).url += 0 < cloneMenu.url.indexOf("?") ? data.data.replace("?", "&") : data.data,
                    cloneMenu.isNativeShow = 3 == cloneMenu.openType,
                    menu.url.startWith("pages/") ? myApp.mainView.router.load({
                        url: menu.url
                    }) : window.plus && cloneMenu.isNativeShow ? cb.native.openNewView(cloneMenu) : 0 == cloneMenu.openType ? (cb.native.isWeiXin() && (0 < window.location.href.indexOf("wid") ? (data = cb.utils.getUrlParam("OpenID") || cb.native.localStorage.getCookie("OpenID") || "",
                        cLinkToken = cb.utils.getUrlParam("cLinkToken") || cb.native.localStorage.getCookie("cLinkToken") || "",
                        cloneMenu.url += "&wid={0}&oid={1}&cLinkToken={2}".format(cb.utils.getUrlParam("wid"), data, cLinkToken)) : cloneMenu.url += "&env=weixin"),
                        window.location.href = cloneMenu.url) : (cloneMenu.data = {},
                        cb.native.frames(cloneMenu)))
            }
        })
    }
    ,
    cb.rest.switchAccent = function(userId, callback) {
        cb.rest.getJSON({
            url: cb.router.HTTP_AGENT_SWITCHLOGININFO.format(userId),
            success: function(data) {
                var loginUser;
                200 == data.code && data.data && (loginUser = data.data.detail[0],
                $$.isArray(data.data.relations) && data.data.relations.length && (loginUser.relations = data.data.relations,
                    cb.rest.appContext.context.currentRelationId = loginUser.relations[0].id,
                    cb.native.localStorage.set("relationId", cb.rest.appContext.context.currentRelationId)),
                    cb.rest.appContext.token = data.data.token,
                    cb.rest.appContext.context = loginUser,
                    cb.rest.appContext.context.isShowOrgs = (3 == loginUser.bizMode || 4 == loginUser.bizMode) && 9 != loginUser.userType && 10 != loginUser.userType,
                    cb.rest.appContext.context.isMultBizs = 2 == loginUser.bizMode || 4 == loginUser.bizMode,
                    cb.rest.appContext.userId = loginUser.userId,
                    cb.rest.appContext.corpUser = !loginUser.isAgent,
                    cb.rest.appContext.context.isOpenYht = !!data.data.isOpenYht,
                    cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                    cb.native.localStorage.set("cUserName", loginUser.cUserName),
                    cb.native.localStorage.set("userId", loginUser.userId),
                    cb.native.localStorage.set("loginContext", JSON.stringify(cb.rest.appContext.context)),
                    cb.native.localStorage.set("corpUser", cb.rest.appContext.corpUser),
                    cb.rest.clearUrlCache(),
                    cb.rest.appContext.doLogin(),
                    callback) && callback()
            },
            error: function(err) {
                myApp.toast(err.message, "error").show(!0)
            }
        })
    }
    ,
    cb.rest.outLogin = function() {
        "u8c" === cb.rest.runtime.env && cb.rest.appContext.context.isAgent && clearInterval(cb.rest.appContext.hearBeat);
        function loginOutFunc() {
            cb.rest.getJSON({
                url: cb.router.HTTP_AGENT_MLOGOUT,
                success: function(data) {
                    200 == data.code && cb.rest.appContext.clear(function() {
                        cb.rest.clearUrlCache(),
                            cb.rest.defineRouters && cb.rest.defineRouters.login ? window.location.href = cb.rest.defineRouters.login : (myApp.loginScreen(),
                                myApp.popup(".popup.popup-login"),
                                cb.cache.showLogin(),
                            !$$("#mylogin").find(".verification").hasClass("hide") && $$("#mylogin").find(".input-two").val() && ($$("#mylogin").find(".input-two").val(""),
                                $$("#mylogin").find(".verification").addClass("hide")),
                                $$(".bottom-bar.row").hide(),
                                $$(".icon-count.order").hide(),
                            cb.rest.checkDemoLogin() && $$(".experience-envir2").addClass("hide"))
                    })
                }
            })
        }
        var cDeviceId;
        window.plus ? (cDeviceId = plus.push.getClientInfo().clientid) && cb.rest.postData({
            url: cb.router.HTTP_AGENT_DELMOBILEDEVICE,
            params: {
                clientId: cDeviceId
            },
            success: function(data) {
                loginOutFunc()
            },
            error: function(data) {
                myApp.toast(data.message, "error").show(!0)
            }
        }) : loginOutFunc()
    }
    ,
    cb.rest.isfreezeAccount = function(bizId) {
        var __user = cb.rest.appContext.context;
        if (!__user.corpUser) {
            if (1 === __user.bizMode)
                return !!(relation = __user.relations[0]) && relation.freezeAccountFlag;
            if (bizId)
                return bizId = Number(bizId),
                    (relation = __user.relations.find(function(relation) {
                        return relation.bizId === bizId
                    })) ? relation.freezeAccountFlag : (console.error("has not relations for biz" + bizId),
                        !1);
            var ORDERSHOWWAY = cb.FunctionOptions.ORDERSHOWWAY;
            if (!0 !== ORDERSHOWWAY) {
                var relation, relationId = __user.currentRelationId || cb.native.localStorage.get("relationId"), relationId = Number(relationId);
                if (relation = __user.relations.find(function(relation) {
                    return relation.id === relationId
                }))
                    return relation.freezeAccountFlag;
                console.error("has not relation for" + relationId)
            }
        }
        return !1
    }
    ,
    cb.rest.isNonfreezeAccount = function(bizId) {
        return !cb.rest.isfreezeAccount(bizId)
    }
    ,
    cb.cache = {
        get: function(cacheName) {
            return this[cacheName]
        },
        set: function(cacheName, value) {
            this[cacheName] = value
        },
        del: function(cacheName) {
            if (0 < cacheName.indexOf(",")) {
                var attr, cacheNameList = cacheName.split(",");
                for (attr in cacheNameList)
                    delete this[cacheNameList[attr]]
            } else
                delete this[cacheName]
        },
        clear: function() {
            for (var attr in this)
                "get" != attr && "set" != attr && "del" != attr && "clear" != attr && "showLogin" != attr && delete this[attr]
        },
        showLogin: function() {
            (cb.native.isWxMiniProgram() || cb.native.isApiCloudApp()) && cb.rest.getPrivacyPolicyLastversion();
            var timer = setInterval(function() {
                "none" == $$(".popup.popup-login").css("display") && (clearInterval(timer),
                    $$(".popup.popup-login").css("display", "block"))
            }, 30);
            setTimeout(function() {
                clearInterval(timer)
            }, 2e3)
        }
    },
    cb.rest.appContext.clear = function(callback) {
        cb.native.localStorage.remove("corpUser"),
            cb.native.localStorage.remove("userId"),
            cb.native.localStorage.remove("userId"),
            cb.native.localStorage.remove("cUserName"),
            cb.native.localStorage.remove("isDemoLogin"),
            cb.native.localStorage.remove("loginContext"),
            cb.native.localStorage.remove("relationId"),
            cb.native.localStorage.remove("insteadAgent"),
            cb.native.localStorage.remove("currentOnlinePayType"),
            cb.rest.appContext.userId = null,
            cb.rest.appContext.corpUser = null,
            cb.native.localStorage.remove("uptoken"),
            delete cb.rest.appContext.context,
            delete cb.rest.appContext.insteadAgent,
            cb.rest.appContext.isAgentOrder = cb.rest.appContext.isRelationOrder = cb.temp.closePopNotices = !1,
            cb.rest.appContext.token = null,
            cb.rest.appContext.autData = null,
            cb.rest.appContext.hidePrice = null,
            cb.rest.appContext.orderDetailAut = null,
            cb.rest.appContext.agentContentHtml = cb.rest.appContext.corpContentHtml = null,
            cb.cache.clear(),
        window.applicationCache && window.applicationCache.status == window.applicationCache.UPDATEREAD && window.applicationCache.update(),
            cb.native.isWxMiniProgram() && cb.utils.getUrlParam("useWxStore") ? wx.miniProgram.redirectTo({
                url: "/pages/logs/logs"
            }) : setTimeout(function() {
                callback && "function" == typeof callback && callback()
            }, 100)
    }
    ,
    cb.utils.upFormatDate = function(strDateTime, intType) {
        var days, hours, minutes, seconds, arrDate = new Array, arrTime = new Array;
        if (null != strDateTime && "" != strDateTime) {
            var item, newDate, years = (newDate = strDateTime instanceof Date ? strDateTime : (-1 != strDateTime.indexOf("-") ? (arrDate = (item = strDateTime.split(" "))[0].toString().split("-"),
                arrTime = item[1].toString().split(":")) : -1 != strDateTime.indexOf("/") && (arrDate = (item = strDateTime.split(" "))[0].toString().split("/"),
                arrTime = item[1].toString().split(":")),
                new Date(parseInt(arrDate[0]),parseInt(cb.utils.FloatCalc.sub(arrDate[1], 1)),parseInt(arrDate[2]),parseInt(arrTime[0]),parseInt(arrTime[1]),parseInt(arrTime[2])))).getFullYear(), month = newDate.getMonth();
            switch (month += 1,
            Number(month) < 10 && (month = "0" + month),
                days = newDate.getDate(),
            Number(days) < 10 && (days = "0" + days),
                hours = newDate.getHours(),
            Number(hours) < 10 && (hours = "0" + hours),
                minutes = newDate.getMinutes(),
            Number(minutes) < 10 && (minutes = "0" + minutes),
                seconds = newDate.getSeconds(),
            Number(seconds) < 10 && (seconds = "0" + seconds),
                intType) {
                case "yyyy-MM-dd":
                    newDate = years + "-" + month + "-" + days;
                    break;
                case "MM-dd HH:mm":
                    newDate = month + "-" + days + " " + hours + ":" + minutes;
                    break;
                case "HH:mm:ss":
                    newDate = hours + ":" + minutes + ":" + seconds;
                    break;
                case "HH:mm":
                    newDate = hours + ":" + minutes;
                    break;
                case "yyyy-MM-dd HH:mm":
                    newDate = years + "-" + month + "-" + days + " " + hours + ":" + minutes;
                    break;
                case "yyyy/MM/dd":
                    newDate = years + "/" + month + "/" + days;
                    break;
                case "MM/dd HH:mm":
                    newDate = month + "/" + days + " " + hours + ":" + minutes;
                    break;
                case "yyyy/MM/dd HH:mm":
                    newDate = years + "/" + month + "/" + days + " " + hours + ":" + minutes;
                    break;
                case "yy-MM-dd":
                    newDate = (years = years.toString().substr(2, 2)) + "-" + month + "-" + days;
                    break;
                case "yy/MM/dd":
                    newDate = (years = years.toString().substr(2, 2)) + "/" + month + "/" + days;
                    break;
                case "yyyy年MM月dd hh时mm分":
                    newDate = years + "年" + month + "月" + days + " " + hours + "时" + minutes + "分";
                    break;
                case "yyyy-MM-dd HH:mm:ss":
                    newDate = years + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds
            }
        }
        return newDate
    }
    ,
    cb.utils.getUrlParam = function(key, url) {
        for (var url = url || window.location.href.toString(), intPos = url.indexOf("?"), arrTmp = url.substr(intPos + 1).split("&"), i = 0; i < arrTmp.length; i++) {
            var dIntPos = arrTmp[i].indexOf("=")
                , paraName = arrTmp[i].substr(0, dIntPos)
                , dIntPos = arrTmp[i].substr(dIntPos + 1);
            if (paraName.toUpperCase() == key.toUpperCase())
                return dIntPos
        }
        return ""
    }
    ,
    cb.utils.jsLoaded = function(url, callback) {
        !function(callback) {
            var script = document.createElement("script");
            script.type = "text/javascript",
                script.src = url,
                document.head.appendChild(script),
                document.all ? script.onreadystatechange = function() {
                        "loaded" != script.readyState && "complete" != script.readyState || callback()
                    }
                    : script.onload = function() {
                        callback()
                    }
        }(callback)
    }
    ,
    cb.utils.CookieParser = {
        setCookie: function(name, value, expireDays) {
            null == expireDays && (expireDays = 30);
            var exp = new Date;
            exp.setTime(exp.getTime() + 24 * expireDays * 60 * 60 * 1e3),
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
        },
        getCookie: function(name) {
            var name = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
            return (name = document.cookie.match(name)) ? unescape(name[2]) : null
        },
        delCookie: function(name) {
            var exp = new Date
                , val = (exp.setTime(exp.getTime() - 1),
                this.getCookie(name));
            null != val && (document.cookie = name + "=" + val + ";expires=" + exp.toGMTString())
        }
    },
    cb.confirm = function(msg, title, callbackOk, callbackCancel, okButtonText, calcelButtonText) {
        2 === arguments.length && "function" == typeof msg && (callbackCancel = callbackOk = msg,
            msg = null),
        1 === arguments.length && "function" == typeof msg && (callbackOk = msg,
            msg = "确定要删除么？"),
            myApp.modal({
                title: '<div class="common-tips-title warning-tips"><i class="icon icon-warning"></i><span  class="font-23">' + title + "</span></div>",
                text: '<div class="common-tips-content"><div class="tips-info">' + msg + "</div></div>",
                buttons: [{
                    text: calcelButtonText || "取消",
                    onClick: function() {
                        callbackCancel && callbackCancel()
                    }
                }, {
                    text: okButtonText || "确定",
                    onClick: function() {
                        callbackOk && callbackOk()
                    }
                }]
            })
    }
    ,
    cb.rest.uploadPaper = function(url, file, successCallBack, errorCallBack) {
        cb.rest.isUploadFile = !0,
            url = cb.rest.getUrl(url, {
                token: cb.rest.appContext.token
            }),
            console.log(url);
        var fileName = $$(file).val().split("\\")
            , fileName = (fileName = (fileName = fileName[fileName.length - 1]).split("."))[fileName.length - 1];
        if (!/^(PDF|pdf|docx|DOCX|doc|DOC|zip|ZIP|rar|RAR|xls|XLS|xlsx|XLSX|txt|TXT|jpg|JPG|png|PNG|bmp|BMP|jpeg|JPEG|gif|GIF)$/g.test(fileName))
            return cb.rest.isUploadFile = !1,
                errorCallBack("不支持此类型的文件!"),
                file.value = "",
                !1;
        var myIframe = document.createElement("iframe")
            , fileName = document.createElement("form")
            , url = (fileName.style.display = "none",
            document.body.appendChild(fileName),
            myIframe.style.display = "none",
            myIframe.id = "uploadIframe",
            document.body.appendChild(myIframe),
            upLoad = myIframe.contentWindow.document.body,
            fileName.action = url,
            fileName.method = "post",
            fileName.enctype = "multipart/form-data",
            fileName.appendChild(file),
            document.createElement("input"))
            , file = (url.setAttribute("type", "text"),
            url.value = cb.rest.appContext.token,
            url.name = "token",
            fileName.appendChild(url),
            document.createElement("input"))
            , timer = (file.setAttribute("type", "text"),
            file.value = "orderattm",
            file.name = "folderName",
            fileName.appendChild(file),
            upLoad.appendChild(fileName),
            $$(fileName).submit(),
            setInterval(function() {
                var iframeInner = myIframe.contentWindow.document.body;
                $$(iframeInner).find("pre").length && (clearInterval(timer),
                    clearInterval(timeout),
                    setTimeout(function() {
                        cb.rest.isUploadFile = !1;
                        try {
                            var data = JSON.parse($$(iframeInner).find("pre").html());
                            successCallBack(data)
                        } catch (e) {
                            console.log(e),
                                errorCallBack("文件上传失败!")
                        }
                    }, 30))
            }, 100))
            , timeout = setTimeout(function() {
            myApp.hideIndicator(),
                myApp.toast("上传文件超时,请检查网络环境", "error").show(!0),
                $$("#uploadIframe").remove(),
                clearInterval(timer),
                cb.rest.backStatus = !0
        }, 3e5)
    }
    ,
    cb.rest.getUrl = function(url, params) {
        if (!url)
            return url;
        var attr, serviceUrl = this.appContext.serviceUrl, commonParams = (!cb.native.isWeiXin() && !cb.native.isApp() && serviceUrl.indexOf(location.host) < 0 && (serviceUrl = serviceUrl.indexOf("?") < 0 ? location.href.substr(0, location.href.length - 1) : location.href + "?" + serviceUrl.split("?")[1]),
        params || {}), params = (url.indexOf("http://") < 0 && url.indexOf("https://") < 0 && (url = serviceUrl + "/" + url),
        cb.rest.appContext.userId && (commonParams.userId = cb.rest.appContext.userId),
        cb.rest.appContext.iCorpId && (commonParams.corpId = cb.rest.appContext.iCorpId),
        cb.rest.appContext.context && cb.rest.appContext.context.isOpenYht && (commonParams.isOpenYht = cb.rest.appContext.context.isOpenYht),
        cb.rest.appContext.isAgentOrder && cb.rest.appContext.iAgentId && (commonParams.iAgentId = commonParams.agentId = cb.rest.appContext.iAgentId),
        cb.rest.appContext.context && cb.rest.appContext.context.isAgent && cb.rest.appContext.context.agentId && (commonParams.agentId = cb.rest.appContext.context.agentId),
            cb.rest.setHttpHeader(url)), signIn = JSON.parse(params.SignIn);
        for (attr in signIn) {
            var attrValue = signIn[attr];
            "" !== attrValue && "parameter" != attr && "fullName" != attr && (commonParams[attr] = attrValue)
        }
        return url + (0 <= url.indexOf("?") ? "&" : "?") + $$.serializeObject(commonParams)
    }
    ,
    cb.rest.execLogin = function(account, postUrl, callback) {
        cb.rest.switchAccountLogin && (delete account.captcha,
            delete account.deviceId),
            cb.rest.clearUrlCache(),
            $$(".popup-trade").removeClass("bounceInRight").hide(),
        "u8c" === cb.rest.runtime.env && (account.functionType = cb.utils.getUrlParam("functionType"));
        var overstep = localStorage.getItem("overstep");
        "udinghuo" === (account.overstep = overstep) ? account.password = account.password : account.userId || (account.password = cb.utils.encrypt(account.password)),
            cb.rest.postData({
                url: postUrl || cb.router.HTTP_AGENT_LOGIN,
                params: account,
                showPreloader: !0,
                success: function(dataObj) {
                    if (dataObj.data && dataObj.data.needNextLogin)
                        return accentItem = Template7.compile($$("#tpl-select-accounts").html())({
                            accounts: dataObj.data.detail
                        }),
                            $$(".switch-account.js-switch-account").removeClass("hide"),
                            $$(".switch.pop_bg").removeClass("hide"),
                            $$(".switch-account.js-switch-account").find("ul").html(accentItem),
                            $$(".switch-account.js-switch-account").find(".btn-close").on("click", function() {
                                $$(this).parents(".switch-account.js-switch-account").addClass("hide"),
                                    $$(".switch.pop_bg").addClass("hide")
                            }),
                            $$(".switch-account.js-switch-account").find("li").on("change", function() {
                                $$(this).parent().find("input").prop("checked", !1),
                                    $$(this).find("input").prop("checked", !0);
                                var query, userId = $$(this).attr("data-id");
                                userId && ($$(this).parents(".switch-account.js-switch-account").addClass("hide"),
                                    $$(".switch.pop_bg").addClass("hide"),
                                    cb.rest.switchAccountLogin = !0,
                                    account.userId = userId,
                                dataObj.data.randomCode && (account.randomCode = dataObj.data.randomCode),
                                    cb.rest.appContext.isTplogin ? (query = $$.parseUrlQuery(location.search),
                                        cb.rest.execLogin(account, cb.router.HTTP_AGENT_TPLOGIN.format(query.appkey, query.sign, query.userKey || query.userkey) + "&userId=" + userId + (query.format ? "&format=" + query.format : ""))) : cb.rest.execLogin(account))
                            }),
                        $$(".popup.popup-login").hasClass("modal-in") || myApp.popup(".popup.popup-login"),
                            !1;
                    if (dataObj.data.needNextLogin)
                        myApp.toast("登录未返回有效数据", "tips").show(!0);
                    else {
                        cb.rest.switchAccountLogin = !1;
                        var accountStr, accentItem = dataObj.data.detail[0];
                        if (dataObj.data.relations && (accentItem.relations = dataObj.data.relations),
                            cb.rest.appContext.token = dataObj.data.token,
                            cb.rest.appContext.context = accentItem,
                        dataObj.data.parameter && (cb.rest.appContext.context.parameter = dataObj.data.parameter),
                            cb.rest.appContext.context.isShowOrgs = (3 == accentItem.bizMode || 4 == accentItem.bizMode) && 9 != accentItem.userType && 10 != accentItem.userType,
                            cb.rest.appContext.context.isMultBizs = 2 == accentItem.bizMode || 4 == accentItem.bizMode,
                            cb.rest.appContext.context.isOpenYht = !!dataObj.data.isOpenYht,
                            cb.native.localStorage.set("yhtRefreshTime", new Date),
                            cb.native.localStorage.set("loginContext", JSON.stringify(accentItem)),
                        $$.isArray(accentItem.relations) && accentItem.relations.length && (cb.rest.appContext.context.currentRelationId = accentItem.relations[0].id,
                            cb.rest.appContext.context.currentOrgId = accentItem.relations[0].orgId,
                            cb.rest.appContext.context.currentBizId = accentItem.relations[0].bizId,
                        "u8c" === cb.rest.runtime.env && cb.native.localStorage.set("currencyId", accentItem.relations[0].currencyId),
                            cb.native.localStorage.set("relationId", cb.rest.appContext.context.currentRelationId),
                            cb.native.localStorage.set("currentOrgId", cb.rest.appContext.context.currentOrgId),
                            cb.native.localStorage.set("currentBizId", cb.rest.appContext.context.currentBizId)),
                            cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                            cb.native.localStorage.set("cUserName", accentItem.cUserName),
                            cb.native.localStorage.set("userId", accentItem.userId),
                            cb.native.localStorage.get("accountList") ? ((accountStr = cb.native.localStorage.get("accountList")).indexOf(account.key) < 0 && (accountStr += "|" + account.key),
                                cb.native.localStorage.set("accountList", accountStr)) : cb.native.localStorage.set("accountList", account.key),
                            cb.native.localStorage.set("corpUser", (!accentItem.isAgent).toString()),
                            cb.rest.appContext.userId = cb.native.localStorage.get("userId"),
                            cb.rest.appContext.corpUser = !accentItem.isAgent,
                            cb.rest.appContext.isTourist = 6 == accentItem.userType,
                            $$("#mylogin input[name=validCode]").val(""),
                            accentItem.hasAuthentication ? cb.rest.dualAuthentication(accentItem) : (2 != cb.utils.getUrlParam("functionType") && 3 != cb.utils.getUrlParam("functionType") && cb.rest.appContext.doLogin(),
                                cb.rest.bindUserOpenId(),
                            window.plus && ((accountStr = plus.push.getClientInfo().clientid) ? (cb.rest.appContext.cDeviceId = accountStr,
                                cb.rest.postData({
                                    url: cb.router.HTTP_AGENT_SAVEMOBILEDEVICE.format(accountStr, plus.os.name.toUpperCase()),
                                    success: function(data) {},
                                    error: function(data) {
                                        myApp.toast(data.message, "error").show(!0)
                                    }
                                })) : plus.nativeUI.toast("未获得推送权限!"))),
                        !0 !== cb.rest.appContext.corpUser && $$("#loginState").val(""),
                        !cb.native.isWxMiniProgram() || !cb.utils.getUrlParam("useWxStore"))
                            return !1;
                        wx.miniProgram.redirectTo({
                            url: "/pages/logs/logs?wxUdhToken=" + cb.rest.appContext.token
                        })
                    }
                },
                error: function(data) {
                    myApp.toast(data.message, "error").show(!0),
                        cb.rest.appContext.clear(),
                        cb.rest.clearUrlCache(),
                        myApp.loginScreen(),
                        myApp.popup(".popup.popup-login"),
                        cb.cache.showLogin(),
                        $$(".bottom-bar.row").hide(),
                        $$(".icon-count.order").hide(),
                        setTimeout(function() {
                            myApp.closeModal(".modal.modal-preloader")
                        }, 10),
                    944 !== data.code && 996 !== data.code || callback && callback()
                },
                netError: function(url) {
                    myApp.modal({
                        title: '<div class="common-tips-title error-tips"><i class="icon icon-failure"></i><span class="font-23">发生网络错误！</span></div>',
                        text: '<div class="common-tips-content" style="padding:10px 0;"><div>错误URL：' + url + "</div>",
                        buttons: [{
                            text: "知道了"
                        }]
                    })
                }
            })
    }
    ,
    cb.rest.touristLogin = function(comkey, callback) {
        comkey = "mailiantest" == comkey ? "mailian" : comkey,
            cb.rest.postData({
                url: cb.router.HTTP_AGENT_TOURISTLOGIN,
                params: {
                    data: comkey
                },
                success: function(dataObj) {
                    callback ? callback(dataObj.data) : (cb.rest.appContext.token = dataObj.data.token,
                        cb.rest.appContext.context = dataObj.data.detail[0],
                    dataObj.data.relations && (cb.rest.appContext.context.relations = dataObj.data.relations),
                        cb.rest.appContext.context.isShowOrgs = (3 == cb.rest.appContext.context.bizMode || 4 == cb.rest.appContext.context.bizMode) && 9 != cb.rest.appContext.context.userType && 10 != cb.rest.appContext.context.userType,
                        cb.rest.appContext.context.isMultBizs = 2 == cb.rest.appContext.context.bizMode || 4 == cb.rest.appContext.context.bizMode,
                        cb.rest.appContext.isTourist = 6 == cb.rest.appContext.context.userType,
                        cb.rest.appContext.userId = cb.rest.appContext.context.userId,
                        cb.rest.appContext.corpUser = !cb.rest.appContext.context.isAgent,
                        cb.rest.appContext.context.isOpenYht = !!dataObj.data.isOpenYht,
                        cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                        cb.native.localStorage.set("loginContext", JSON.stringify(cb.rest.appContext.context)),
                        cb.native.localStorage.set("userId", cb.rest.appContext.context.userId),
                        cb.native.localStorage.set("corpUser", cb.rest.appContext.corpUser),
                        cb.rest.appContext.doLogin())
                },
                error: function(err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            })
    }
    ,
    cb.rest.demoLogin = function(userkey) {
        cb.rest.postData({
            url: cb.router.HTTP_AGENT_DEMOLOGIN.format(userkey),
            success: function(dataObj) {
                var loginUser = dataObj.data.detail[0];
                cb.rest.appContext.token = dataObj.data.token,
                    cb.rest.appContext.context = loginUser,
                    cb.rest.appContext.userId = loginUser.userId,
                    cb.rest.appContext.context.isOpenYht = !!dataObj.data.isOpenYht,
                    cb.native.localStorage.set("loginContext", JSON.stringify(loginUser)),
                    cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                    cb.native.localStorage.set("cUserName", loginUser.userName),
                    cb.native.localStorage.set("userId", loginUser.userId),
                    cb.native.localStorage.set("corpUser", loginUser.isAgent),
                    cb.rest.appContext.corpUser = !loginUser.isAgent,
                    cb.native.localStorage.set("isDemoLogin", "1"),
                    cb.rest.appContext.doLogin()
            }
        })
    }
    ,
    cb.rest.memberLogin = function(params, callback) {
        params.source && params.yxyToken ? (cb.native.localStorage.set("systemUsed", !0),
            cb.rest.appContext.yxyToken = cb.rest.appContext.yxyToken || params.yxyToken,
            cb.rest.appContext.clear(),
            cb.rest.postData({
                url: cb.router.HTTP_AGENT_MEMBERJOIN,
                params: {
                    bizId: params.bizId || null,
                    mid: params.mid || null,
                    mobile: params.mobile || null
                },
                success: function(data) {
                    var loginUser;
                    data.data && (data.data.needJoin ? cb.native.initMainView((cb.rest.isDefineJoin ? "pages/defineJoin.html?" : "pages/join.html?") + "alias={0}&bizId={1}".format(data.data.alias, params.bizId || ""), {
                        noback: !0,
                        reload: !0,
                        data: data.data.potentialAgent
                    }) : (data.data.context && (loginUser = data.data.context.detail[0],
                    data.data.context.relations && (loginUser.relations = data.data.context.relations),
                        cb.rest.appContext.token = data.data.context.token,
                        cb.rest.appContext.context = loginUser,
                        cb.rest.appContext.context.isShowOrgs = (3 == loginUser.bizMode || 4 == loginUser.bizMode) && 9 != loginUser.userType && 10 != loginUser.userType,
                        cb.rest.appContext.context.isMultBizs = 2 == loginUser.bizMode || 4 == loginUser.bizMode,
                        cb.rest.appContext.context.isOpenYht = !!data.data.isOpenYht,
                        cb.native.localStorage.set("loginContext", JSON.stringify(loginUser)),
                        cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                        cb.native.localStorage.set("cUserName", loginUser.cUserName),
                        cb.native.localStorage.set("userId", loginUser.userId)),
                    callback && callback()))
                },
                error: function(e) {
                    myApp.toast(e.message, "error").show(!0)
                }
            })) : callback()
    }
    ,
    cb.rest.checkTourist = function(cancelEvent) {
        var isTourist = !1;
        return cb.rest.appContext.isTourist && (myApp.modal({
            cssClass: "tourist-content-modal",
            title: '<div class="common-tips-title warning-tips"><i class="icon icon-warning"></i><span  class="font-23">提示信息</span></div>',
            text: '<div class="common-tips-content"><div class="tips-info">游客账户不能发生交易，是否立即申请注册为该企业经销商？</div><div class="tips-info-sub">(已有账户请直接登录)</div></div>',
            buttons: [{
                text: '<i class="icon icon-close-white"></i>',
                onClick: function() {
                    cancelEvent && cancelEvent()
                }
            }, {
                text: "立即登录",
                onClick: function() {
                    cb.rest.appContext.clear(function() {
                        cb.rest.clearUrlCache(),
                            cb.rest.defineRouters && cb.rest.defineRouters.login ? window.location.href = cb.rest.defineRouters.login : (myApp.loginScreen(),
                                myApp.popup(".popup.popup-login"),
                                cb.cache.showLogin())
                    })
                }
            }, {
                text: "申请加盟",
                onClick: function() {
                    var query = $$.parseUrlQuery(location.href);
                    myApp.mainView.router.loadPage({
                        url: "pages/join.html?alias=" + (query.comKey || query.alias)
                    })
                }
            }]
        }),
            isTourist = !0),
            isTourist
    }
    ,
    cb.rest.checkWXLogin = function() {
        var wxToken = cb.utils.getUrlParam("token")
            , wxSiteheader = cb.utils.getUrlParam("siteheader")
            , code = cb.utils.getUrlParam("code")
            , corp = cb.utils.getUrlParam("corp")
            , type = cb.utils.getUrlParam("type")
            , voucherno = cb.utils.getUrlParam("voucherno")
            , tpLogin = -1 < window.location.pathname.indexOf("tplogin")
            , userkey = cb.utils.getUrlParam("userKey") || cb.utils.getUrlParam("userkey")
            , appkey = cb.utils.getUrlParam("appkey")
            , sign = cb.utils.getUrlParam("sign")
            , format = cb.utils.getUrlParam("format")
            , touristLogin = "true" === cb.utils.getUrlParam("touristLogin")
            , alias = cb.utils.getUrlParam("comkey") || cb.utils.getUrlParam("alias")
            , yxyToken = cb.utils.getUrlParam("yxyToken")
            , source = cb.utils.getUrlParam("source")
            , urlShowImage = cb.utils.getUrlParam("showImage");
        urlShowImage && cb.native.localStorage.set("showImage", urlShowImage),
            cb.temp.isEsn && code ? cb.rest.postData({
                url: cb.router.HTTP_AGENT_MESNLOGIN,
                params: {
                    code: code,
                    corp: corp,
                    type: type,
                    voucherno: voucherno
                },
                success: function(data) {
                    data.data ? (cb.rest.appContext.token = data.data.token,
                        cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                        cb.rest.appContext.doLogin()) : this.error(data)
                },
                error: function(e) {
                    myApp.hidePreloader(),
                        myApp.loginScreen(),
                        myApp.popup(".popup.popup-login"),
                        cb.cache.showLogin()
                }
            }) : wxToken && wxSiteheader ? cb.rest.postData({
                url: cb.router.HTTP_AGENT_WXLOGIN,
                params: {
                    token: wxToken,
                    siteheader: wxSiteheader
                },
                success: function(data) {
                    data.data ? (cb.rest.appContext.token = data.data.token,
                        cb.native.localStorage.set("uptoken", cb.rest.appContext.token),
                        cb.rest.appContext.doLogin()) : this.error(data)
                },
                error: function(e) {
                    myApp.hidePreloader(),
                        myApp.loginScreen(),
                        myApp.popup(".popup.popup-login"),
                        cb.cache.showLogin()
                }
            }) : tpLogin && userkey && appkey && sign ? (cb.rest.appContext.clear(),
                cb.rest.appContext.isTplogin = !0,
                cb.rest.execLogin({}, cb.router.HTTP_AGENT_TPLOGIN.format(appkey, sign, userkey) + (format ? "&format=" + format : ""))) : touristLogin && alias ? cb.rest.touristLogin(alias) : yxyToken && !source ? cb.rest.execLogin({}, cb.router.HTTP_AGENT_YXYLOGIN.format(yxyToken)) : (myApp.hidePreloader(),
                myApp.loginScreen(),
                myApp.popup(".popup.popup-login"),
                cb.cache.showLogin())
    }
    ,
    cb.rest.forgetPwdFunc = function(data) {
        var defaultOptions = {
            preprocess: function(content, url, next) {
                return cb.preprocess(content, url, next)
            }
        };
        $$("#view-1").addClass("active"),
            myApp.addView(".view-main", defaultOptions).router.loadPage({
                url: "pages/forgetPwd.html",
                query: data
            }),
            myApp.closeModal(".login-screen.modal-in"),
            myApp.closeModal(".popup.popup-login")
    }
    ,
    cb.rest.resultFactory = function(data, successCallBack, errorCallBack, options) {
        switch (("string" == typeof data ? JSON.parse(data) : data).code) {
            case 200:
            case 201:
                successCallBack(data);
                break;
            case 901:
                myApp.toast(data.message, "error").show(!0);
                break;
            case 900:
            case 909:
                cb.rest.appContext.clear(),
                    cb.rest.checkWXLogin();
                break;
            case 944:
                errorCallBack ? errorCallBack(data) : myApp.toast("非法的请求（禁止访问)", "error").show(!0);
                break;
            case 996:
                errorCallBack ? errorCallBack(data) : myApp.toast(data.message || "无效的数据", "error").show(!0);
                break;
            case 998:
                errorCallBack ? errorCallBack(data) : myApp.toast("数据不合法！", "error").show(!0);
                break;
            case 987:
                errorCallBack(data);
                break;
            case 989:
                myApp.modal({
                    cssClass: "permit-modal",
                    title: '<div class="common-tips-title success-tips permit-tips"><i class="icon icon-clock"></i></div>',
                    text: '<div class="common-tips-content permit-content"><div class="tips-content"><div class="permit-title">贵公司的租约已过期啦！</div><div class="permit-content">如需继续使用，请火速和您的客户经理联系续约事项</div></div></div>',
                    buttons: [{
                        text: '<i class="icon icon-close-white"></i>',
                        onClick: function() {}
                    }]
                });
                break;
            case 997:
                cb.confirm("账户不安全或密码为默认密码,请修改密码!", "提示信息", function() {
                    $$('#mylogin input[name="key"]').val();
                    cb.rest.forgetPwdFunc(data.data)
                });
                break;
            case 993:
                cb.confirm(data.message, "提示信息", function() {
                    cb.rest.forgetPwdFunc({
                        user: data.data && $$.isArray(data.data.detail) ? data.data.detail[0] : null
                    })
                });
                break;
            case 999:
                data.message || (data.message = "服务响应数据异常：未返回错误消息！[" + options.url + "]"),
                    errorCallBack ? errorCallBack(data) : myApp.toast(data.message, "error").show(!0);
                break;
            case 404:
                (cb.rest.runtime.isDev ? myApp.toast(data.message, "error") : myApp.toast(cb.rest.runtime.noport, "tips")).show(!0);
                break;
            case 991:
                myApp.modal({
                    cssClass: "lose-modal",
                    title: '<div class="common-tips-title success-tips permit-tips"><i class="icon icon-clock"></i></div>',
                    text: '<div class="common-tips-content permit-content"><div class="tips-content"><div class="permit-title">密码长期未更新，已失效，请重新设置密码！</div></div></div>',
                    buttons: [{
                        text: "确定",
                        onClick: function() {
                            cb.rest.forgetPwdFunc({
                                user: data.data && $$.isArray(data.data.detail) ? data.data.detail[0] : null
                            })
                        }
                    }]
                });
                break;
            default:
                errorCallBack ? cb.rest.runtime.isDev ? errorCallBack(data) : errorCallBack({
                    message: cb.rest.runtime.errorTips
                }) : (cb.rest.runtime.isDev ? myApp.toast(data.message, "error") : myApp.toast(cb.rest.runtime.errorTips, "tips")).show(!0)
        }
    }
    ,
    cb.rest.backStatus = !0,
    cb.rest.urlCache = [{
        url: cb.router.HTTP_AGENT_GETCORPADIMAGES,
        timeLength: 600,
        time: null,
        data: null
    }, {
        url: cb.router.HTTP_PRODUCT_GETHOTPRODUCTCLASS,
        timeLength: 600
    }, {
        url: cb.router.HTTP_PRODUCT_GETMUPPRODUCTS,
        timeLength: 600
    }, {
        url: cb.router.HTTP_PRODUCT_GETRECOMMENDEDPRODUCTS,
        timeLength: 600
    }, {
        url: cb.router.HTTP_AGENT_GETAGENTNOTICES,
        timeLength: 600
    }, {
        url: cb.router.HTTP_PRODUCT_GETCLASSES,
        timeLength: 600
    }, {
        url: cb.router.HTTP_ORDER_GETORDERSTATUSCOUNTS,
        timeLength: 120
    }, {
        url: cb.router.HTTP_AGENT_GETCORPRATION,
        timeLength: 60
    }, {
        url: cb.router.HTTP_PAYMENT_GETAGENTFUND,
        timeLength: 180
    }, {
        url: cb.router.HTTP_PRODUCT_ADVERTISEMENTIMAGELIST,
        timeLength: 300
    }],
    cb.rest.clearUrlCache = function() {
        for (var i = 0; i < cb.rest.urlCache.length; i++)
            cb.rest.urlCache[i].time = null,
                cb.rest.urlCache[i].data = null
    }
    ,
    cb.rest.setHttpHeader = function(url) {
        var header = {
            SignIn: {
                language: cb.rest.appContext.lang,
                terminal: 2,
                clientType: 2,
                deviceId: cb.rest.appContext.deviceCode
            }
        };
        return cb.rest.appContext.context = cb.rest.appContext.context || cb.native.localStorage.get("loginContext") && JSON.parse(cb.native.localStorage.get("loginContext")),
        cb.rest.appContext.yxyToken && (header.authorization = "YHT " + cb.rest.appContext.yxyToken),
        cb.utils.getUrlParam("functionType") && (header.SignIn.functionType = cb.utils.getUrlParam("functionType")),
        cb.rest.appContext.token && (cb.rest.appContext.context && cb.rest.appContext.context.isOpenYht || "true" == cb.utils.getUrlParam("isOpenYht") ? header.yht_access_token = cb.rest.appContext.token : header.authorization = (cb.rest.appContext.yht_token || "u8c" == cb.rest.runtime.env ? "YHT " : "Bearer ") + cb.rest.appContext.token,
            header.SignIn.terminal = cb.utils.getUrlParam("terminal") || (!cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder ? 0 : 1),
            header.SignIn.fullName = cb.rest.appContext.context ? encodeURIComponent(cb.rest.appContext.context.fullName) : "",
            header.SignIn.representAgent = !!cb.rest.appContext.isAgentOrder,
        cb.rest.appContext.isAgentOrder && (header.SignIn.representId = cb.rest.appContext.insteadAgent.agentId,
            header.SignIn.relationId = cb.rest.appContext.insteadAgent.agentRelationId),
        !cb.FunctionOptions || cb.FunctionOptions.ORDERSHOWWAY || cb.rest.appContext.corpUser || (header.SignIn.relationId = cb.rest.appContext.context && cb.rest.appContext.context.currentRelationId || cb.native.localStorage.get("relationId"),
            header.SignIn.relationId) || delete header.SignIn.relationId,
        url && -1 < url.indexOf("archives/option/keyvalues/bizs") && header.SignIn.relationId && delete header.SignIn.relationId,
            cb.rest.appContext.context) && cb.rest.appContext.context.parameter && (cb.rest.appContext.context.parameter.data && cb.rest.appContext.context.parameter.data.forEach(function(item) {
            null != item.value.match(/[\u4E00-\u9FA5]/g) && (item.value = encodeURIComponent(item.value))
        }),
            header.SignIn.parameter = cb.rest.appContext.context.parameter),
            header.SignIn = JSON.stringify(header.SignIn),
            header
    }
    ,
    cb.rest.getJSON = function(paramObj) {
        if (paramObj.url) {
            if (cb.rest.loading || (cb.rest.loading = !0),
            paramObj.params && paramObj.params.useCache) {
                var configUrlObj = cb.rest.urlCache.find(function(item) {
                    return item.url == paramObj.url.split("?")[0]
                });
                if (configUrlObj && configUrlObj.time && !(new Date - configUrlObj.time > 1e3 * configUrlObj.timeLength))
                    return cb.rest.resultFactory(configUrlObj.data, paramObj.success, paramObj.error, paramObj),
                        cb.rest.loading = !1
            }
            var header = cb.rest.setHttpHeader(paramObj.url)
                , async = (paramObj.params && paramObj.params._method && (header._method = paramObj.params._method,
                delete paramObj.params._method),
                !0)
                , dominUrl = (paramObj.params && "undefined" != paramObj.params.async && 0 == paramObj.params.async && (async = !1),
                this.getUrl(paramObj.url, paramObj.params));
            cb.dataLoop = function(data) {
                for (var key in data)
                    if ("object" == typeof data[key] && "oldData" != key)
                        cb.dataLoop(data[key]),
                            state = !1;
                    else
                        for (var o in cb.rest.appContext.hidePrice)
                            "HIDPRICE" == cb.rest.appContext.hidePrice[o].settingCode && key === cb.rest.appContext.hidePrice[o].fieldsCode && (!cb.rest.appContext.hidePrice[o].checkZero || cb.rest.appContext.hidePrice[o].checkZero && 0 != data[key]) && (data[key] = cb.rest.appContext.hidePrice[o].replaceValue);
                return data
            }
                ,
                $$.ajax({
                    async: async,
                    useCache: paramObj.params && paramObj.params.useCache,
                    url: dominUrl,
                    oldUrl: paramObj.url,
                    method: "GET",
                    dataType: "json",
                    headers: header,
                    success: function(data) {
                        data.isEncrypt && data.data && (data.data = cb.utils.decrypt(data.data));
                        function getData(data) {
                            var useCache = _this.useCache;
                            try {
                                if (useCache) {
                                    configUrlObj = null;
                                    for (var i = 0; i < cb.rest.urlCache.length; i++) {
                                        var curr = cb.rest.urlCache[i];
                                        if (_this.oldUrl.endsWith(curr.url)) {
                                            configUrlObj = curr;
                                            break
                                        }
                                    }
                                    configUrlObj && 200 == data.code && (configUrlObj.data = data,
                                        configUrlObj.time = new Date)
                                }
                                cb.rest.resultFactory(data, paramObj.success, paramObj.error, paramObj)
                            } catch (e) {
                                useCache = e.message;
                                (cb.rest.runtime.isDev ? myApp.toast(useCache, "error") : myApp.toast("好像出了点小问题,请稍后再试", "tips")).show(!0)
                            }
                        }
                        var _this = this;
                        cb.rest.loading = !1;
                        this.oldUrl != cb.router.HTTP_AGENT_GETUSESETTINGFORHIDEPRICE && cb.rest.appContext.hidePrice != cb.rest.status.ajaxErrorCode && cb.rest.appContext.hidePrice != cb.rest.status.notData ? (data.oldData = cb.utils.extend(!0, {}, data),
                            getData(cb.dataLoop(data))) : getData(data)
                    },
                    error: function(xhr, status) {
                        cb.rest.loading = !1,
                            paramObj.isList ? myApp.hideIndicator() : myApp.hidePreloader(".modal.modal-preloader"),
                        paramObj.netError && "function" == typeof paramObj.netError && (cb.rest.runtime.isDev ? paramObj.netError(xhr, status) : myApp.modal({
                            title: '<div class="common-tips-title error-tips"><i class="icon icon-failure"></i><span>提示信息</span><i class="icon icon-colse"></i></div>',
                            text: '<div class="common-tips-content"><div class="tips-info">' + cb.rest.runtime.netError + '</div><div class="tips-manage"><span>您还可以</span></div></div>',
                            buttons: [{
                                text: "知道了",
                                onClick: function() {
                                    myApp.closeModal()
                                }
                            }]
                        })),
                            console.error(paramObj.url + "发生http错误!")
                    }
                })
        }
    }
    ,
    cb.getajaxCount = 0,
    cb.rest.postData = function(options) {
        var url, header, postDataStr;
        options.url && (url = this.getUrl(options.url),
            header = cb.rest.setHttpHeader(),
        !window.__config__.isEncrypt || -1 < options.url.indexOf("passport/login") || (options.params = cb.utils.cryptoJsEncrypt(options.params)),
            postDataStr = options.params ? JSON.stringify(options.params) : "",
            postDataStr = cb.rest.xssFilter(postDataStr),
        options.showPreloader && !cb.rest.loading && (cb.rest.loading = !0,
            myApp.showPreloader()),
            $$.ajax({
                url: url,
                method: "POST",
                data: postDataStr,
                headers: header,
                contentType: "application/json",
                success: function(data) {
                    cb.rest.loading = !1,
                    options.showPreloader && myApp.hidePreloader();
                    try {
                        (data = JSON.parse(data)).isEncrypt && data.data && (data.data = cb.utils.decrypt(data.data)),
                            cb.rest.resultFactory(data, options.success, options.error, options)
                    } catch (e) {
                        myApp.toast(e.message + "url:" + this.url, "error").show(!0)
                    }
                },
                error: function(xhr, status) {
                    cb.rest.loading = !1,
                    options.showPreloader && myApp.hidePreloader(),
                    options.netError && "function" == typeof options.netError && options.netError(url),
                        myApp.modal({
                            title: '<div class="common-tips-title error-tips"><i class="icon icon-failure"></i><span>提示信息</span></div>',
                            text: '<div class="common-tips-content"><div class="tips-info">' + (cb.rest.runtime.isDev ? url + "发生网络错误!" + this.data : "你的网络信号好像飞走了...") + '</div><div class="tips-manage"><span>您还可以</span></div></div>',
                            buttons: [{
                                text: "稍后再试",
                                onClick: function() {
                                    myApp.closeModal()
                                }
                            }]
                        })
                }
            }))
    }
    ,
    cb.rest.xssFilter = function(str) {
        return str.replace(/&/g, "").replace(/</g, "").replace(/>/g, "").replace(/=/g, "")
    }
    ,
    cb.rest.postCross = function(options) {
        var postData;
        options.url && (postData = {
            url: options.url,
            data: options.params,
            type: options.type
        },
            postData = (postData = JSON.stringify(postData)).replace(/&/g, "").replace(/</g, "").replace(/>/g, ""),
        options.showPreloader && !cb.rest.loading && (cb.rest.loading = !0,
            myApp.showPreloader()),
            $$.ajax({
                url: cb.rest.getUrl(cb.router.HTTP_DEFINES_POSTEXTENDCROSS),
                method: "POST",
                async: void 0 === options.async || options.async,
                data: postData,
                contentType: "application/json",
                success: function(data) {
                    200 == (data = "string" == typeof data ? JSON.parse(data) : data).code ? options.success(data) : options.error(data)
                },
                error: function(xhr, status) {
                    console.error("接口请求失败:" + status)
                }
            }))
    }
    ,
    cb.loader = {},
    cb.loader.hasScript = function(src) {
        if (!src || !src.trim())
            return !0;
        for (var scriptNode = document.createElement("script"), loadedScripts = (scriptNode.src = src,
            document.getElementsByTagName("script")), i = 0; i < loadedScripts.length; i++)
            if (loadedScripts[i].src.trim().toLocaleLowerCase() == scriptNode.src.trim().toLocaleLowerCase())
                return !0
    }
    ,
    cb.loader.hasStyle = function(href) {
        if (!href || !href.trim())
            return !0;
        for (var linkNode = document.createElement("link"), loadedStyles = (linkNode.href = href,
            linkNode.rel = "stylesheet",
            document.getElementsByTagName("link")), i = 0; i < loadedStyles.length; i++)
            if (loadedStyles[i].href.trim().toLocaleLowerCase() == linkNode.href.trim().toLocaleLowerCase())
                return !0
    }
    ,
    cb.loader.getNode = function(content) {
        var node;
        if (content)
            return (node = document.createElement("div")).innerHTML = content,
                node
    }
    ,
    cb.loader.processNode = function(node, callback) {
        if (node) {
            for (var head = document.head || document.getElementsByTagName("head")[0], scripts = node.getElementsByTagName("script"), scriptUrls = [], scriptText = [], i = 0; i < scripts.length; i++) {
                var potArr, urlArr, splitUrl, script = scripts[i];
                if ("text/html" === script.type || "text/template7" === script.type) {
                    var scriptNode = script.cloneNode();
                    scriptNode.innerHTML = script.innerHTML,
                        head.appendChild(scriptNode)
                } else {
                    try {
                        0 <= script.src.indexOf("file:///") ? (urlArr = (potArr = script.src.split("www/") || script.src.split("HBuilder/"))[1].split("/"),
                            splitUrl = cb.rest.jsPath,
                        2 == urlArr.length && (splitUrl = cb.rest.jsBasePath + urlArr[0] + "/")) : (urlArr = (potArr = script.src.split("//"))[1].split("/"),
                            splitUrl = cb.rest.jsPath,
                        2 < urlArr.length && (splitUrl = cb.rest.jsBasePath + urlArr.slice(urlArr.length - (urlArr.length - 1), urlArr.length - 1).join("/") + "/")),
                            0 <= potArr[0].indexOf("file:///") ? (potArr[0] = cb.rest.appContext.serviceUrl,
                                script.src = potArr[0] + "//" + splitUrl + urlArr[urlArr.length - 1]) : script.src = potArr[0] + "//" + urlArr[0] + splitUrl + urlArr[urlArr.length - 1]
                    } catch (e) {
                        console.log(e),
                            console.log(script.src)
                    }
                    if (script.src && !this.hasScript(script.src)) {
                        var repeatSrc = !1;
                        script.src = cb.loader.changeSrc(script.src);
                        for (var j = 0; j < scriptUrls.length; j++)
                            scriptUrls[j] == script.src && (repeatSrc = !0);
                        repeatSrc || scriptUrls.push(script.src)
                    } else
                        script.text && scriptText.push(script.text)
                }
            }
            for (i = scripts.length - 1; 0 <= i; i--)
                scripts[i].parentNode.removeChild(scripts[i]);
            for (var links = node.getElementsByTagName("link"), i = 0; i < links.length; i++)
                this.hasStyle(links[i].href) || head.appendChild(links[i].cloneNode());
            for (i = links.length - 1; 0 <= i; i--)
                links[i].parentNode.removeChild(links[i]);
            this.executeScript(scriptUrls, scriptText, callback)
        }
    }
    ,
    cb.loader.executeScript = function(scriptUrls, scriptText, callback) {
        var cacheId = "ScriptsLoaded_none";
        scriptUrls && scriptUrls.length && (cacheId = this.loadScripts(scriptUrls)),
            this.executeScriptText(scriptText, cacheId, callback)
    }
    ,
    cb.loader.loadScripts = function(scripts) {
        var cacheId = "ScriptsLoaded_" + Math.random();
        cb.cache.set(cacheId, new Array(scripts.length));
        for (var i = 0; i < scripts.length; i++)
            this.loadScript(scripts[i], function(i, cacheId) {
                return function() {
                    cb.cache.get(cacheId)[i] = !0
                }
            }(i, cacheId), "script");
        return cacheId
    }
    ,
    cb.loader.loadScript = function(url, callback) {
        var script = document.createElement("script");
        script.scriptCharset && (script.charset = script.scriptCharset || "utf-8"),
            script.async = !1,
            script.src = url,
            script.type = "text/javascript",
            script.onload = script.onreadystatechange = function() {
                script.readyState && !/complete|loaded/.test(script.readyState) || (script.onload = script.onreadystatechange = null,
                callback && callback(),
                    script = void 0)
            }
            ,
            script.onabort = function() {
                script && (callback && callback(),
                    script = void 0)
            }
            ,
            script.onerror = function() {
                script && (callback && callback(),
                    script = void 0)
            }
            ,
            (document.head || document.getElementsByTagName("head")[0]).appendChild(script)
    }
    ,
    cb.loader.loadPageContent = function(url, callback) {
        var script = document.createElement("script");
        script.src = cb.utils.toAbsURL(url),
            script.type = "text/javascript",
            $$.ajax({
                async: !1,
                url: script.src,
                method: "GET",
                dataType: "text",
                success: function(data) {
                    callback && callback(data)
                },
                error: function(xhr, status) {
                    callback && callback()
                }
            })
    }
    ,
    cb.loader.executeScriptText = function(scriptText, cacheId, callback) {
        for (var isAllScriptLoadCompleted = !0, scriptsLoad = cb.cache.get(cacheId) || [], length = scriptsLoad.length, i = 0; i < length; i++)
            isAllScriptLoadCompleted = isAllScriptLoadCompleted && scriptsLoad[i];
        isAllScriptLoadCompleted ? (cb.cache.set(cacheId, null),
        scriptText && scriptText.length && (scriptText.join("\r\n"),
            cb.executeScript()),
        callback && callback()) : setTimeout(cb.loader.executeScriptText, 100, scriptText, cacheId, callback)
    }
    ,
    cb.loader.changeSrc = function(val) {
        var IsDebugStr, indexCoprUrl, index;
        return 0 <= val.indexOf("file:///") ? (index = val.indexOf("/js/pages/"),
            indexCoprUrl = val.indexOf("/js/corpPages/"),
            0 < index ? val = cb.rest.appContext.serviceUrl + val.substr(index) : 0 < indexCoprUrl && (val = cb.rest.appContext.serviceUrl + val.substr(indexCoprUrl))) : 0 <= val.indexOf("file:///storage/") && (indexCoprUrl = "Android/data/com.yonyou.Uorder/apps/wxe0ec2b64632588cb",
            index = -1,
        0 < val.indexOf(IsDebugStr = "Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder") && (index = val.indexOf(IsDebugStr),
            val = cb.rest.appContext.serviceUrl + val.substr(index + IsDebugStr.length)),
        0 < val.indexOf(indexCoprUrl)) && (index = val.indexOf(indexCoprUrl),
            val = cb.rest.appContext.serviceUrl + val.substr(index + indexCoprUrl.length)),
            val
    }
    ,
    cb.utils.isArray = function(arr) {
        return "function" == typeof Array.isArray ? Array.isArray(arr) : "[object Array]" === Object.prototype.toString.call(arr)
    }
    ,
    cb.utils.toAbsURL = function(url) {
        var a;
        return cb.native.isApp() ? ((url = url.startWith("./") ? url.substr(1) : url).startWith("/") || (url = "/" + url),
        cb.rest.appContext.serviceUrl + url) : ((a = document.createElement("a")).href = url,
            a.href)
    }
    ,
    cb.utils.isPlainObject = function(obj) {
        if (!obj || "[object Object]" !== Object.prototype.toString.call(obj))
            return !1;
        var key, hasOwnConstructor = Object.prototype.hasOwnProperty.call(obj, "constructor"), hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf");
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf)
            return !1;
        for (key in obj)
            ;
        return void 0 === key || Object.prototype.hasOwnProperty.call(obj, key)
    }
    ,
    cb.utils.extend = function() {
        var options, name, copy, copyIsArray, src, target = arguments[0], i = 1, length = arguments.length, deep = !1;
        for ("boolean" == typeof target ? (deep = target,
            target = arguments[1] || {},
            i = 2) : ("object" != typeof target && "function" != typeof target || null == target) && (target = {}); i < length; ++i)
            if (null != (options = arguments[i]))
                for (name in options)
                    src = target[name],
                    target !== (copy = options[name]) && (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy))) ? (src = copyIsArray ? (copyIsArray = !1,
                        src && this.isArray(src) ? src : []) : src && this.isPlainObject(src) ? src : {},
                        target[name] = this.extend(deep, src, copy)) : void 0 !== copy && (target[name] = copy));
        return target
    }
    ,
    cb.utils.nativeAjax = function(options) {
        var xhr;
        (options = options || {}).type = (options.type || "GET").toUpperCase(),
            options.dataType = options.dataType || "json",
            options.data = options.data || null,
            (xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")).onreadystatechange = function() {
                var status;
                4 == xhr.readyState && (200 <= (status = xhr.status) && status < 300 ? options.success && options.success(xhr.responseText, xhr.responseXML) : options.fail && options.fail(status))
            }
            ,
            xhr.open(options.type, options.url, !0),
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8"),
            xhr.send(options.data)
    }
    ,
    cb.utils.styleOnload = function(node, callback) {
        function poll(node, callback) {
            if (!callback.isCalled) {
                var isLoaded = !1;
                if (/webkit/i.test(navigator.userAgent))
                    node.sheet && (isLoaded = !0);
                else if (node.sheet)
                    try {
                        node.sheet.cssRules && (isLoaded = !0)
                    } catch (ex) {
                        1e3 === ex.code && (isLoaded = !0)
                    }
                isLoaded ? setTimeout(function() {
                    callback()
                }, 1) : setTimeout(function() {
                    poll(node, callback)
                }, 1)
            }
        }
        node.attachEvent ? node.attachEvent("onload", callback) : setTimeout(function() {
            poll(node, callback)
        }, 0)
    }
    ,
    cb.utils.removeLinkNode = function(filename, filetype) {
        for (var targetattr = "js" == filetype ? "src" : "css" == filetype ? "href" : "none", allsuspects = document.getElementsByTagName("js" == filetype ? "script" : "css" == filetype ? "link" : "none"), i = allsuspects.length; 0 <= i; i--)
            allsuspects[i] && null != allsuspects[i].getAttribute(targetattr) && -1 != allsuspects[i].getAttribute(targetattr).indexOf(filename) && allsuspects[i].parentNode.removeChild(allsuspects[i])
    }
    ,
    cb.utils.FormatHidePrice = function(data) {
        for (var key in data)
            if ("object" == typeof data[key] && "oldData" != key)
                cb.utils.FormatHidePrice(data[key]);
            else
                for (var o in cb.rest.appContext.hidePrice)
                    "HIDPRICE" == cb.rest.appContext.hidePrice[o].settingCode && key === cb.rest.appContext.hidePrice[o].fieldsCode && (data[key] = cb.rest.appContext.hidePrice[o].replaceValue);
        return data
    }
    ,
    cb.utils.removeScriptNode = function(content, filterType) {
        if (!content)
            return "";
        for (var content = cb.loader.getNode(content), scripts = content.getElementsByTagName("script"), i = scripts.length - 1; 0 <= i; i--)
            (!filterType || scripts[i].type === filterType) && scripts[i].parentNode.removeChild(scripts[i]);
        return content.innerHTML
    }
    ,
    cb.utils.getGUID = function(len, radix) {
        len = len || 8;
        var i, r, chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), uuid = [];
        if (radix = radix || chars.length,
            len)
            for (i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        else
            for (uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-",
                     uuid[14] = "4",
                     i = 0; i < 36; i++)
                uuid[i] || (r = 0 | 16 * Math.random(),
                    uuid[i] = chars[19 === i ? 3 & r | 8 : r]);
        return "mb-" + uuid.join("")
    }
    ,
    cb.utils.isJson = function(str) {
        if ("string" == typeof str)
            try {
                var obj = JSON.parse(str);
                return !("object" != typeof obj || !obj)
            } catch (e) {
                return console.log("error：" + str + "!!!" + e),
                    !1
            }
        console.log("It is not a string!")
    }
    ,
    cb.utils.FloatCalc = {
        add: function(arg1, arg2) {
            var r2, r1;
            arg1 = arg1 || 0,
                arg2 = arg2 || 0;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            return r1 = Math.pow(10, Math.max(r1, r2)),
            (this.mult(arg1, r1) + this.mult(arg2, r1)) / r1
        },
        sub: function(arg1, arg2) {
            var r2, m, r1;
            arg1 = arg1 || 0,
                arg2 = arg2 || 0;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            return m = Math.pow(10, Math.max(r1, r2)),
                r1 = r2 <= r1 ? r1 : r2,
                ((this.mult(arg1, m) - this.mult(arg2, m)) / m).toFixed(r1)
        },
        mult: function(arg1, arg2) {
            arg2 = arg2 || 0;
            var m = 0
                , arg1 = (arg1 = arg1 || 0).toString()
                , arg2 = arg2.toString();
            try {
                m += arg1.split(".")[1].length
            } catch (e) {}
            try {
                m += arg2.split(".")[1].length
            } catch (e) {}
            return Number(arg1.replace(".", "")) * Number(arg2.replace(".", "")) / Math.pow(10, m)
        },
        divide: function(arg1, arg2) {
            arg1 = arg1 || 0,
                arg2 = arg2 || 0;
            var t1 = 0
                , t2 = 0;
            try {
                t1 = arg1.toString().split(".")[1].length
            } catch (e) {}
            try {
                t2 = arg2.toString().split(".")[1].length
            } catch (e) {}
            return Number(arg1.toString().replace(".", "")) / Number(arg2.toString().replace(".", "")) * Math.pow(10, t2 - t1)
        },
        compareDate: function(arg1, arg2) {
            var t1 = new Date(Date.parse(arg1.replace(/-/g, "/")));
            return new Date(Date.parse(arg2.replace(/-/g, "/"))) < t1 ? arg1 : arg2
        }
    },
    cb.utils.validMobile = function(mobile) {
        var current, result = {
            value: !0,
            message: null
        };
        return mobile ? (current = cb.rest.appContext.countryCodes.find(function(item) {
            return item.isDefault
        })) && current.pattern && (new RegExp(current.pattern).test(mobile) || (result.value = !1,
            result.message = "请输入正确的电话号码")) : (result.value = !1,
            result.message = "请输入手机号码"),
            result
    }
    ,
    cb.utils.encrypt = function(txt) {
        var encryptor, publicKey = window.__config__.publicKey;
        return publicKey ? ((encryptor = new JSEncrypt).setPublicKey(publicKey),
            encryptor.encrypt(txt)) : txt
    }
    ,
    cb.utils.decrypt = function(data) {
        if (data)
            return data = CryptoJS.AES.decrypt(data, "udinghuomobileclientfebmhzjlyhlhyyx"),
                JSON.parse(data.toString(CryptoJS.enc.Utf8))
    }
    ,
    cb.utils.cryptoJsEncrypt = function(data) {
        if (Array.isArray(data))
            return data;
        var encryptData = {
            isEncrypt: !localStorage.getItem("isTry")
        };
        if (!encryptData.isEncrypt)
            return data;
        for (const key in data)
            data.hasOwnProperty(key) && (encryptData[key] = CryptoJS.AES.encrypt(JSON.stringify(data[key]), "udinghuomobileclientfebmhzjlyhlhyyx").toString());
        return encryptData
    }
    ,
    cb.rest.loadAuths = function(callback, params) {
        cb.rest.getJSON({
            url: cb.router.HTTP_COMMON_QUERYAUTHS,
            params: params || {},
            success: function(data) {
                cb.rest.appContext[cb.rest.appContext.corpUser ? "corpAutData" : "autData"] = new Object,
                Array.isArray(data.data) && data.data.map(function(item) {
                    cb.rest.appContext[cb.rest.appContext.corpUser ? "corpAutData" : "autData"][item.name] = !0
                }),
                cb.rest.appContext.corpUser && (cb.rest.appContext.corpAutData.commodityList = cb.rest.appContext.corpAutData.commodityList || cb.rest.appContext.context.isProductCenterEnv),
                callback && "function" == typeof callback && callback(data)
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0),
                    cb.rest.appContext[cb.rest.appContext.corpUser ? "corpAutData" : "autData"] = cb.rest.status.ajaxErrorCode
            }
        })
    }
    ,
    cb.rest.loadFunctionOptions = function() {
        cb.FunctionOptions = {},
            cb.rest.getJSON({
                url: cb.router.HTTP_COMMON_GETFUNCTIONOPTIONSBYCODES,
                success: function(data) {
                    var relationId, relation;
                    200 == data.code && data.data && ($$.isArray(data.data) && data.data.forEach(function(item) {
                        var attrValue = item.value;
                        "string" == typeof attrValue && ("true" === attrValue ? attrValue = !0 : "false" === attrValue && (attrValue = !1)),
                            cb.FunctionOptions[item.code] = attrValue
                    }),
                    "u8c" === cb.rest.runtime.env) && cb.rest.appContext.context.isAgent && (data = JSON.parse(localStorage.getItem("loginContext")),
                        relationId = localStorage.relationId,
                        relation = (relation = data.relations.find(function(v) {
                            return v.id + "" === relationId
                        })) || data.relations[0],
                        cb.rest.getJSON({
                            url: cb.router.HTTP_COMMON_SPECIALOPTIONS,
                            params: {
                                salesOrgId: relation.orgId,
                                bizId: relation.bizId
                            },
                            success: function(res) {
                                cb.FunctionOptions.SHOWSALERETURNNONESOURCE = res.data
                            }
                        }))
                },
                error: function(err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            })
    }
    ,
    cb.rest.loadBizsFunctionOptions = function() {
        cb.bizFunctionOptions = new Object,
            cb.rest.getJSON({
                url: cb.router.HTTP_COMMON_LOADBIZSOPTIONS,
                success: function(data) {
                    200 == data.code && $$.isArray(data.data) && data.data.forEach(function(item) {
                        cb.bizFunctionOptions[item.bizId] = {},
                        1 == cb.rest.appContext.context.bizMode && (cb.rest.appContext.context.bizId = item.bizId),
                        $$.isArray(item.optionKeyValues) && item.optionKeyValues.forEach(function(citem) {
                            "string" == typeof citem.value && ("true" === citem.value ? citem.value = !0 : "false" === citem.value && (citem.value = !1)),
                                cb.bizFunctionOptions[item.bizId][citem.code] = citem.value
                        })
                    })
                },
                error: function(err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            })
    }
    ,
    cb.rest.loadDefineMenus = function(callback) {
        cb.rest.appContext.context.defineMenus = [],
            cb.rest.getJSON({
                url: cb.router.HTTP_DEFINES_GETMENUS,
                params: {
                    iCorpId: cb.rest.appContext.context.corpId
                },
                success: function(data) {
                    var targetData;
                    cb.native.isEsnApp() && cb.rest.appContext.insteadAgent && (targetData = data.data.find(function(item) {
                        return "mobileNavigation" == item.code
                    })) && targetData.children.forEach(function(item, index) {
                        "myOrder" == item.code && targetData.children.splice(index, 1)
                    }),
                        cb.rest.appContext.context.defineMenus = data.data || [],
                    callback && callback()
                },
                error: function() {
                    cb.rest.appContext.context.defineMenus = [],
                    callback && callback()
                }
            })
    }
    ,
    cb.rest.reloadShoppingCartCount = function(callback) {
        cb.rest.getJSON({
            url: cb.router.HTTP_SHOPPINGCART_COUNT,
            success: function(data) {
                var span = '<span class="badge bg-red">' + data.data + "</span>";
                0 == data.data && (span = ""),
                    $$(".upShoppingCount").each(function() {
                        $$(this).parent().children(".badge.bg-red").length ? ($$(this).parent().children(".badge.bg-red").text(data.data),
                        0 == data.data && $$(this).parent().children(".badge.bg-red").remove()) : $$(span).insertBefore(".upShoppingCount")
                    }),
                callback && "function" == typeof callback && callback(data.data)
            }
        })
    }
    ,
    cb.rest.loadPopNotices = function() {
        cb.temp.closePopNotices || cb.rest.getJSON({
            url: cb.router.HTTP_AGENT_GETAGENTPOPNOTICES,
            success: function(data) {
                var swipers, modal;
                Array.isArray(data.data) && data.data.length && (swipers = new Array,
                    data.data.forEach(function(item) {
                        item.preId = item.demensions && item.demensions[0] && item.demensions[0].referId,
                            swipers.push('<div class="swiper-slide">'),
                            swipers.push('<div class="swiper-notice-title"><div class="item-text">' + item.title + "</div></div>"),
                            swipers.push('<div class="swiper-notice-content">' + (item.noticeDetail ? item.noticeDetail.content : "") + "</div>"),
                            7 != item.demensionType && 8 != item.demensionType && 9 != item.demensionType || "u8c" !== cb.rest.runtime.env ? swipers.push('<div class="swiper-notice-footer"><a href="#" class="define-modal-button btn-read" data-id="' + item.id + '">标为已读</a></div>') : swipers.push('<div class="swiper-notice-footer"><a href="#" class="define-modal-button btn-show-promotion" data-demensiontype="' + item.demensionType + '" data-preid="' + item.preId + '">查看促销商品</a><a href="#" class="define-modal-button btn-read" data-id="' + item.id + '">标为已读</a></div>'),
                            swipers.push("</div>")
                    }),
                    modal = myApp.modal({
                        afterText: '<div class="swiper-after"><a href="pages/noticeList.html?notips=true" class="white-button ' + (1 == swipers.length ? "hide" : "") + '">查看全部</a></div><div class="swiper-pagination"></div><div class="swiper-container"><div class="swiper-wrapper">' + swipers.join("") + "</div></div>",
                        buttons: [{
                            text: '<a href="#" class="define-modal-button btn-close"></a>',
                            onClick: function() {
                                cb.temp.closePopNotices = !0
                            }
                        }]
                    }),
                    myApp.swiper($$(modal).addClass("popup-notices").find(".swiper-container"), {
                        pagination: ".swiper-pagination"
                    }),
                    $$(modal).find(".swiper-notice-footer .btn-read").on("click", function() {
                        var ds, $this = $$(this);
                        $this.hasClass("readed") || (ds = $this.dataset(),
                            cb.rest.postData({
                                url: cb.router.HTTP_AGENT_AGENTPOPNOTICECONFIRM.format(ds.id),
                                params: {},
                                success: function(data) {
                                    200 == data.code && $this.addClass("readed").text("已读")
                                },
                                error: function(e) {
                                    myApp.toast(e.message, "error").show(!0)
                                }
                            }))
                    }),
                    $$(modal).find(".swiper-notice-footer .btn-show-promotion").on("click", function() {
                        var ds = $$(this).dataset()
                            , url = "";
                        7 == ds.demensiontype ? url = cb.router.HTTP_PROMOTION_PRODUCTPROMOTIONDETAIL : 8 == ds.demensiontype ? url = cb.router.HTTP_PROMOTION_SINGLEDISCOUNTDETAIL : 9 == ds.demensiontype && (url = cb.router.HTTP_PROMOTION_COMBINATIONDETAIL);
                        cb.rest.getJSON({
                            url: url.format(ds.preid),
                            success: function(data) {
                                var d1, d2, curDate;
                                200 == data.code && data.data && ((data.data.isValid || data.data.pValid) && (d1 = data.data.startDate || data.data.pStartDate,
                                    d2 = data.data.endDate || data.data.pEndDate,
                                    curDate = new Date,
                                    d1 = new Date(d1),
                                    d2 = new Date(d2),
                                d1 <= curDate) && curDate <= d2 ? (d1 = "pages/promotionDetail.html?promotionId=" + ds.preid + "&promotionName=" + data.data.name + "&isFromNotice=true",
                                8 == ds.demensiontype && (d1 += "&isEntire=true"),
                                9 == ds.demensiontype && (d1 += "&isCombine=true"),
                                    myApp.mainView.router.loadPage({
                                        url: d1
                                    }),
                                    myApp.closeModal(modal)) : myApp.toast("促销活动已经结束！", "error").show(!0))
                            },
                            error: function(err) {
                                console.error(err)
                            }
                        })
                    }),
                    $$(modal).find(".white-button").on("click", function() {
                        myApp.closeModal(modal)
                    }))
            }
        })
    }
    ,
    cb.rest.myBraodCast = setInterval(function() {
        cb.rest.getJSON({
            url: cb.router.HTTP_BROADCAST_GETBROADCAST,
            success: function(data) {
                var broadCast;
                200 == data.code && data.data && (broadCast = data.data.broadCast,
                !myApp.mainView || $$(".modal .broadCast-tips").length || window.plus && plus.storage.getItem("broadId") == broadCast.id || cb.rest.appContext.broadId == broadCast.id || (myApp.modal({
                    title: '<div class="common-tips-title success-tips broadCast-tips"><i class="icon icon-no-message"></i><span  class="font-23">' + broadCast.title + "</span></div>",
                    text: '<div class="common-tips-content"><div class="tips-info">' + broadCast.content + "</div>" + (broadCast.outhref ? '<div class="tips-info" data-url="' + broadCast.outhref + '">请访问：' + broadCast.outhref + "</div>" : "") + "</div>",
                    buttons: [{
                        text: "我知道了",
                        onClick: function() {
                            window.clearInterval(cb.rest.myBraodCast),
                                window.plus ? plus.storage.setItem("broadId", broadCast.id) : cb.rest.appContext.broadId = broadCast.id
                        }
                    }]
                }),
                    $$(".common-tips-title.broadCast-tips").parents(".modal.modal-in").on("click", ".tips-info", function(e) {
                        var url;
                        $$(this).attr("data-url") && (url = $$(this).attr("data-url"),
                            myApp.closeModal(),
                            cb.native.openWebView(url, !0))
                    })))
            },
            error: function(err) {
                console.error(err)
            }
        })
    }, 1e6),
    cb.rest.initWxConfig = function() {
        var query, url, params;
        cb.native.isWeiXin() && !cb.rest.initWxJSSDK && (query = Dom7.parseUrlQuery(window.location.href),
            params = {
                pageUrl: url = encodeURIComponent(location.href.split("#")[0])
            },
        cb.rest.appContext.context && cb.rest.appContext.context.currentOrg && (params.orgId = cb.rest.appContext.context.currentOrg.id),
            cb.rest.getJSON({
                url: cb.native.isWxMiniProgram() ? cb.router.HTTP_COMMON_WXMINIPROGRAMGETJSAPITICKET : cb.router.HTTP_COMMON_GETJSAPITICKET,
                params: cb.native.isWxMiniProgram() ? {
                    pageUrl: url
                } : params,
                success: function(data) {
                    200 == data.code && data.data && (cb.rest.initWxJSSDK = !0,
                        wx) && (wx.config({
                        debug: query.wxdebug,
                        appId: data.data.appId,
                        timestamp: data.data.timestamp,
                        nonceStr: data.data.nonceStr,
                        signature: data.data.signature,
                        jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem"]
                    }),
                        wx.error(function(res) {
                            query.wxdebug && myApp.toast(JSON.stringify(res), "error").show(!0)
                        }))
                },
                error: function(err) {
                    query.wxdebug && myApp.toast(err.message, "error").show(!0),
                        cb.rest.initWxJSSDK = !1
                }
            }))
    }
    ,
    cb.rest.loadMobileCountry = function(callback) {
        cb.rest.getJSON({
            url: cb.router.HTTP_BASE_GETMOBILECOUNTRY,
            success: function(data) {
                200 == data.code && (cb.rest.appContext.countryCodes = data.data || [],
                    callback) && callback.call()
            },
            error: function(e) {
                myApp.toast(e.message, "tips").show(!0)
            }
        })
    }
    ,
    cb.rest.agentInfoAuths = function(resolvedCallback, rejectedCallback, queryString) {
        var queryParams = "";
        cb.rest.appContext.isAgentOrder && cb.rest.appContext.iAgentId && (queryParams = "&agentId=" + cb.rest.appContext.iAgentId),
        queryString && (queryParams += queryString),
            cb.rest.postData({
                url: cb.router.HTTP_AGENT_AGENTADAPTABLE + queryParams,
                params: [],
                success: function(data) {
                    200 == data.code && resolvedCallback && resolvedCallback(data.data)
                },
                error: function(e) {
                    myApp.toast(e.message, "tips").show(!0),
                    rejectedCallback && rejectedCallback(e)
                }
            })
    }
    ,
    cb.rest.getYxyToken = function(callback) {
        cb.rest.getJSON({
            url: cb.router.HTTP_COMMON_YXYTOKEN,
            success: function(data) {
                cb.rest.appContext.yxyToken = data.data,
                data.data && console.log("yxyToken:" + data.data),
                callback && callback(data)
            },
            error: function(e) {
                myApp.toast(e.message, "tips").show(!0),
                callback && callback({
                    code: 999
                })
            }
        })
    }
    ,
    cb.rest.checkAgentHome = function(callback) {
        cb.rest.getJSON({
            url: cb.router.HTTP_COMMON_SHOPCONFIG,
            success: function(data) {
                data.data ? cb.rest.getYxyToken(function(tokenData) {
                    var query = Object.assign({}, $$.parseUrlQuery(window.location.search) || {}, {
                        corpid: cb.rest.appContext.context.corpId,
                        yxyToken: tokenData.data
                    });
                    cb.rest.defineRouters || (cb.rest.defineRouters = new Object),
                    Array.isArray(cb.rest.defineRouters.pages) || (cb.rest.defineRouters.pages = new Array),
                        cb.rest.defineRouters.pages.push({
                            path: "pages/home.html",
                            router: "/designerPage?" + $$.serializeObject(query)
                        }),
                    callback && callback(tokenData)
                }) : callback && callback(data)
            },
            error: function(e) {
                myApp.toast(e.message, "tips").show(!0),
                callback && callback({
                    code: 999
                })
            }
        })
    }
    ,
    cb.rest.dualAuthentication = function(params, callback) {
        var modal, self = this;
        params && (modal = myApp.modal({
            title: '<div class="common-tips-title auth-message">短信验证</div>',
            text: '<div class="common-tips-content auth-message"><div class="input-field flex"><div class="item-title label">手机号码</div><div class="detail-content">' + (params.mobile && params.mobile.replace(/(\d{3})\d*(\d{4})/, "$1****$2")) + '</div></div><div class="input-field flex"><input type="number" class="modal-text-input"><a href="#" class="button get-auth-DynamicCode">获取验证码</a></div></div>',
            buttons: [{
                text: "取消",
                onClick: function() {
                    cb.rest.appContext.clear()
                }
            }, {
                text: "确定",
                onClick: function() {
                    var dynamicCode = $$(modal).find(".modal-text-input").val();
                    dynamicCode ? cb.rest.appContext.clear(function() {
                        cb.rest.execLogin({
                            userId: params.userId,
                            key: params.mobile,
                            validCode: dynamicCode,
                            clientType: 2,
                            countryCode: params.countryCode,
                            deviceId: cb.rest.appContext.deviceCode || cb.native.getUDID()
                        })
                    }) : myApp.toast("请输入验证码", "tips").show(!0)
                }
            }]
        }),
            $$(modal).find(".get-auth-DynamicCode").on("click", function() {
                var $this = $$(this);
                cb.rest.postData({
                    url: cb.router.HTTP_AGENT_LOGINSENDMSGCODE.format(params.mobile, "login", params.countryCode),
                    success: function(data) {
                        $this.attr("disabled", "disabled"),
                            myApp.toast("发送成功!", "success").show(!0);
                        var index = 75;
                        self.setInter = window.setInterval(function() {
                            index <= 0 ? ($this.removeAttr("disabled").text("获取验证码"),
                                clearInterval(self.setInter)) : ($this.text(index + "秒后获取"),
                                index--)
                        }, 1e3)
                    },
                    error: function(data) {
                        myApp.toast(data.message, "error").show(!0)
                    }
                })
            }))
    }
    ,
    cb.rest.getPrivacyPolicyLastversion = function() {
        cb.rest.getJSON({
            url: cb.router.HTTP_COMMON_GETPRIVACYPOLICYLASTVERSION,
            success: function(data) {
                var {id: data, version, needPopWindow} = data.data;
                let operation = "";
                var sotrePrivacyVersion = cb.native.localStorage.get("udhPrivacyVersion");
                operation = !sotrePrivacyVersion || 1 == needPopWindow && sotrePrivacyVersion && sotrePrivacyVersion !== version ? (document.getElementById("privacyPolicyUpdateContent").innerText = window.__config__.privacyPolicyUpdateContent || "为了加强对您个人信息的保护，根据最新法律法规要求，我们更新了隐私政策，我们将严格按照政策内容使用保护您的个人信息，为您提供更好的服务，感谢您的信任。",
                    document.getElementById("ios-wrap").style.display = "block",
                    "签署") : "登录",
                    cb.temp.privacy = {
                        id: data,
                        version: version,
                        operation: operation
                    }
            },
            error: function(e) {
                myApp.toast(e.message, "tips").show(!0)
            }
        })
    }
    ,
    cb.rest.privacyPolicyAgree = function(param) {
        cb.rest.postData({
            url: cb.router.HTTP_COMMON_PRIVACYPOLICYAGREE,
            params: param,
            success: function() {},
            error: function(e) {
                myApp.toast(e.message, "tips").show(!0)
            }
        })
    }
    ,
cb.native.isEsnApp() && (esArr = (esStr = navigator.userAgent).split(" "),
    esobj = {},
    esArr.forEach(function(v) {
        -1 < v.indexOf("=") && (v = v.split("="),
            esobj[v[0]] = v[1])
    }),
    "zh" == esobj.youZoneLanguage ? cb.rest.appContext.lang = "zh-cn" : "tw" == esobj.youZoneLanguage ? cb.rest.appContext.lang = "zh-tw" : "en" == esobj.youZoneLanguage && (cb.rest.appContext.lang = "en-us"),
"wx" == cb.utils.getUrlParam("platform") && (yht_access_tokenForWxMiniProgram = cb.utils.getUrlParam("yx_tk"),
    "zh-CN" == (langForWxMiniProgram = cb.utils.getUrlParam("lang")) ? cb.rest.appContext.lang = "zh-cn" : "zh-TW" == langForWxMiniProgram ? cb.rest.appContext.lang = "zh-tw" : "zh-en" == langForWxMiniProgram && (cb.rest.appContext.lang = "en-us")),
    cb.rest.appContext.youZoneToken = esobj.yht_access_token,
yht_access_tokenForWxMiniProgram && (cb.rest.appContext.youZoneToken = yht_access_tokenForWxMiniProgram,
    esobj.yht_access_token = yht_access_tokenForWxMiniProgram),
cb.rest.appContext.lang == cb.native.localStorage.get("langCode") && cb.rest.appContext.lang == cb.utils.CookieParser.getCookie("langCode") || (cb.native.localStorage.set("langCode", cb.rest.appContext.lang),
    cb.utils.CookieParser.setCookie("langCode", cb.rest.appContext.lang),
    setTimeout(function() {
        window.location.reload()
    }, 100))),
    setInterval(function() {
        var space;
        cb.rest.appContext.token && (cb.rest.loadFunctionOptions(),
            cb.rest.loadBizsFunctionOptions(),
        "u8c" == cb.rest.runtime.env) && cb.native.localStorage.get("yhtRefreshTime") && (space = (new Date - new Date(cb.native.localStorage.get("yhtRefreshTime"))) / 1e3 / 60 / 60) && 24 <= space && cb.rest.postData({
            url: cb.router.HTTP_COMMON_TOKENALIVE,
            params: {},
            success: function(data) {
                200 == data.code && data.data && (cb.native.localStorage.set("yhtRefreshTime", new Date),
                    console.log("token alive success"))
            },
            error: function(data) {
                console.log(data.message)
            }
        })
    }, 6e5),
    window.UOrderApp = {
        ns: function() {
            for (var j, d, a = arguments, o = null, i = 0; i < a.length; i += 1)
                for (d = ("" + a[i]).split("."),
                         o = UOrderApp,
                         j = "UOrderApp" == d[0] ? 1 : 0; j < d.length; j += 1)
                    o[d[j]] = o[d[j]] || {},
                        o = o[d[j]];
            return o
        }
    };
