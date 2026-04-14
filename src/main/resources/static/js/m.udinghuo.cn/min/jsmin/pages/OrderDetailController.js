/*! u-order-mobile 2024-01-13 */
UOrderApp.ns("UOrderApp.pages"),
UOrderApp.pages.OrderInfoController = function() {
    this.tplOrderDetailLogistics = Template7.compile($$("#tpl_order_detail_logistics").html()),
    this.tplOrderDetailRelation = Template7.compile($$("#tpl_order_detail_relation").html())
}
,
UOrderApp.pages.OrderInfoController.prototype.preprocess = function(content, url, next) {
    var self = this;
    this.context = $$.parseUrlQuery(url) || {},
    this.context.isCorpUser = cb.rest.appContext.corpUser,
    this.context.isAgentOrder = cb.rest.appContext.isAgentOrder,
    this.context.noToolbar = "true" === this.context.nobutton,
    this.context.isShowSkuPic = cb.FunctionOptions.SHOWPRODUCTSKUIMAGE,
    this.context.isHidePrice = $$.isArray(cb.rest.appContext.hidePrice) && 0 < cb.rest.appContext.hidePrice.length,
    this.context.isMultBiz = 2 == cb.rest.appContext.context.bizMode || 4 == cb.rest.appContext.context.bizMode,
    this.context.isNativePrint = cb.rest.runtime.isShowPrint && this.context.isCorpUser && window.plus && cb.native.localPrint && cb.native.isAndroid(),
    this.context.isStandardMode = !cb.FunctionOptions.MOBILEORDERSIMPLEOPERATION,
    this.context.isShowBatchDelivery = cb.FunctionOptions.BATCHDELIVERY,
    this.context.data = {},
    this.context.printData = {},
    this.event.loadBizs.call(this),
    cb.rest.getJSON({
        url: cb.router.HTTP_ORDER_GETDETAILFLOW,
        params: {
            cOrderNo: self.context.oid
        },
        success: function(data) {
            200 == data.code && (self.context.data.order = data.data,
            self.context.data.cloneOrder = cb.utils.extend(!0, {}, (data.oldData || data).data),
            self.context.isStandardMode = !(cb.bizFunctionOptions[self.context.data.order.bizId] && cb.bizFunctionOptions[self.context.data.order.bizId].MOBILEORDERSIMPLEOPERATION),
            "u8c" === cb.rest.runtime.env && data.data.orderDetailGroupSuiteVos && 0 < data.data.orderDetailGroupSuiteVos.length && (data.data.orderDetailGroupSuiteVos.map(function(item) {
                item.bizId || Object.assign(item, {
                    bizId: data.data.bizId
                })
            }),
            data.data.oOrderDetailGroups = data.data.oOrderDetailGroups.concat(data.data.orderDetailGroupSuiteVos)),
            cb.rest.getJSON({
                url: cb.router.HTTP_ORDER_GETORDERDEFINES,
                params: {
                    bizId: self.context.data.order.bizId
                },
                success: function(definesData) {
                    200 == definesData.code && (self.context.data.useDefines = definesData.data || {},
                    self.tool.initDefines.call(self),
                    self.tool.format.call(self),
                    definesData = Template7.compile(content)(self.context.data.renderData),
                    next(definesData))
                },
                error: function(err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            }))
        }
    })
}
,
UOrderApp.pages.OrderInfoController.prototype.pageInit = function(page) {
    $$.parseUrlQuery(location.href).fromShare && myApp.hideToolbar(".toolbar.homeNavBar"),
    this.pageContainer = page.container,
    this.load.deliverys.call(this),
    this.load.orderPayDetail.call(this),
    this.tool.toolbar.call(this),
    this.context.isNativePrint && this.load.getDeliveryPrint.call(this),
    this.on()
}
,
UOrderApp.pages.OrderInfoController.prototype.load = {
    deliverys: function(callback) {
        var self = this;
        this.context.isCorpUser && !cb.rest.appContext.corpAutData.deliveryOrderList || cb.rest.getJSON({
            url: cb.router.HTTP_DELIVERY_GETDELIVERYLISTBYORDER,
            params: {
                cOrderNo: self.context.oid
            },
            success: function(data) {
                data.data && (self.context.data.deliverys = data.data.data || [],
                1 < self.context.data.deliverys.length ? (self.tool.getDelivery.call(self),
                self.render.delivery.call(self)) : 1 === self.context.data.deliverys.length && self.load.deliveryButtons.call(self, function() {
                    self.tool.getDelivery.call(self),
                    self.render.delivery.call(self)
                }),
                self.context.isCorpUser && !self.context.isAgentOrder && self.load.getPayListByOrder.call(self),
                callback) && callback.call(self)
            }
        })
    },
    messages: function() {
        var self = this;
        cb.rest.getJSON({
            url: cb.router.HTTP_ORDER_FINDORDERMEMOS,
            params: {
                pageSize: 999,
                cOrderNo: self.context.oid
            },
            success: function(data) {
                data.data.length ? ($$(self.pageContainer).find("#remark-number").html("留言(" + data.data.length + ")"),
                $$(self.pageContainer).find("#remark-content").html(data.data[0].cRemark),
                $$(self.pageContainer).find("#remark-name").html(data.data[0].oUser ? data.data[0].oUser.cFullName : ""),
                $$(self.pageContainer).find("#remark-imgurl").parent().show(),
                data = data.data[0].oUser && data.data[0].oUser.userAvatar ? data.data[0].oUser.userAvatar : "./img/icon/default-avatar.png",
                $$(self.pageContainer).find("#remark-imgurl").attr("src", data)) : $$(self.pageContainer).find("#remark-imgurl").parent().hide()
            }
        })
    },
    order: function() {
        var self = this;
        cb.rest.getJSON({
            url: cb.router.HTTP_ORDER_GETDETAILFLOW,
            params: {
                cOrderNo: self.context.oid
            },
            success: function(data) {
                200 == data.code && (self.context.data.order = data.data,
                self.tool.toolbar.call(self),
                self.load.orderPayDetail.call(self))
            }
        })
    },
    orderPayDetail: function() {
        var self = this;
        this.context.data.order.presaleId && this.context.data.order.presale && cb.rest.getJSON({
            url: cb.router.HTTP_ORDER_GETORDERPAYDETAIL,
            params: {
                cOrderNos: self.context.data.order.cOrderNo
            },
            success: function(data) {
                if (self.context.data.order.presale.depositRule && 2 == self.context.data.order.presale.depositRule && self.context.data.order.presale.depositConfirmRange && 2 == self.context.data.order.presale.depositConfirmRange && self.context.data.order.presale.depositPercent && 0 < data.fPayMoney && data.paidMoney / data.fPayMoney * 100 < self.context.data.order.presale.depositPercent && window.moment) {
                    var endTime = "";
                    switch (self.context.data.order.presale.depositDealUnit) {
                    case 1:
                        endTime = window.moment(self.context.data.order.dOrderDate).subtract(self.context.data.order.presale.depositEndDate, "d").format("YYYY-MM-DD hh:mm:ss");
                        break;
                    case 2:
                        endTime = window.moment(self.context.data.order.dOrderDate).subtract(self.context.data.order.presale.depositEndDate, "H").format("YYYY-MM-DD hh:mm:ss");
                        break;
                    case 3:
                        endTime = window.moment(self.context.data.order.dOrderDate).subtract(self.context.data.order.presale.depositEndDate, "m").format("YYYY-MM-DD hh:mm:ss");
                        break;
                    case 4:
                        endTime = window.moment(self.context.data.order.dOrderDate).subtract(self.context.data.order.presale.depositEndDate, "s").format("YYYY-MM-DD hh:mm:ss")
                    }
                    $$(self.pageContainer).find(".notice-bar").removeClass("hide").html("请在{0}前支付订单金额的{1}%，超时支付将自动取消订单".format(endTime, self.context.data.order.presale.depositPercent))
                }
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    },
    getPayListByOrder: function() {
        var self = this;
        cb.rest.getJSON({
            url: cb.router.HTTP_ORDER_GETPAYLISTBYORDER,
            params: {
                pageIndex: 1,
                pageSize: 5,
                cVoucherNo: this.context.data.order.cOrderNo
            },
            success: function(data) {
                200 === data.code && data.data && (self.context.data.payments = data.data.list || [],
                1 == self.context.data.payments.length ? self.load.paymentButtons.call(self, function() {
                    self.render.payment.call(self)
                }) : self.render.payment.call(self),
                self.context.data.payments.length) && self.tool.toolbar.call(self)
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    },
    getDeliveryPrint: function() {
        var self = this;
        cb.rest.getJSON({
            url: cb.router.HTTP_DELIVERY_DELIVERYPRINTHEADER,
            success: function(data) {
                200 == data.code && (self.context.printTpls = data.data || [])
            },
            error: function(err) {
                myApp.toast(err.message, "error").show(!0)
            }
        })
    },
    getDeliveryPrintData: function() {
        var self = this
          , params = {
            ids: []
        };
        Array.isArray(this.context.data.deliverys) && (this.context.data.deliverys.map(function(item) {
            params.ids.push(item.cDeliveryNo)
        }),
        cb.rest.postData({
            url: cb.router.HTTP_DELIVERY_GETPRINTDATA,
            params: params,
            success: function(data) {
                data.data && (self.context.printData = data.data || {},
                self.load.nativePrint.call(self))
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        }))
    },
    nativePrint: function() {
        var currentCode, currentTpl, deliverys;
        this.context.printTpls && this.context.printTpls.length ? (currentTpl = (currentCode = window.plus ? plus.storage.getItem("currentTpl") : null) && this.context.printTpls.find(function(curr) {
            return curr.templatecode == currentCode
        }) || this.context.printTpls.find(function(curr) {
            return curr.isAppDefault
        })) ? (deliverys = [],
        this.context.data.deliverys.map(function(item) {
            deliverys.push(item.cDeliveryNo)
        }),
        cb.rest.postData({
            url: cb.router.HTTP_DELIVERY_PRINTRECORD,
            params: deliverys,
            success: function(data) {
                200 == data.code && console.log("打印成功")
            }
        }),
        this.load.getPrintTplData.call(this, currentTpl)) : myApp.toast("请先设置默认小票打印模版", "tips").show(!0) : myApp.toast("请先设置小票打印模版", "tips").show(!0)
    },
    getPrintTplData: function(tpl) {
        var self = this;
        cb.rest.postData({
            url: cb.router.HTTP_DELIVERY_GETPRINTMETA,
            params: {
                tplPk: tpl.pk_print_template,
                modelPk: tpl.pk_bo
            },
            success: function(data) {
                200 === data.code && data.data && (window.plus && window.plus.nativeUI.toast("开始打印小票~~~"),
                Array.isArray(self.context.printData.deliveryPrintHeader)) && (self.context.printData.deliveryPrintHeader.map(function(item) {
                    var body = self.context.printData.deliveryPrintBody && self.context.printData.deliveryPrintBody.filter(function(citem) {
                        return item.iDeliveryId === citem.iDeliveryId
                    });
                    body && body.length && cb.native.localPrint && cb.native.localPrint({
                        billingcopiesofprintcopies: 1,
                        tempJson: data.data.tplMeta,
                        data: JSON.stringify({
                            deliveryPrintBody: body,
                            deliveryPrintHeader: [item]
                        }),
                        dataSource: data.data.tplDataSource
                    })
                }),
                setTimeout(function() {
                    myApp.mainView.router.back()
                }, 2e3))
            },
            error: function(err) {
                myApp.toast(err.message, "error").show(!0)
            }
        })
    },
    paymentButtons: function(callback) {
        var self = this
          , autData = cb.rest.appContext[this.context.isCorpUser ? "corpAutData" : "autData"]
          , params = {
            paymentIds: []
        };
        this.context.data.payments.map(function(item) {
            params.paymentIds.push(item.iPaymentId)
        }),
        cb.rest.postData({
            url: cb.router.HTTP_PAYMENT_GETPAYMENTLISTBTN,
            params: params,
            success: function(data) {
                200 == data.code && data.data && self.context.data.payments.map(function(order) {
                    var item = data.data.find(function(citem) {
                        return citem.id == order.iPaymentId
                    });
                    item && autData.receivablesConfrim && (order.isShowConfirmBtn = !!item.isShowConfirmBtn)
                }),
                callback && callback.call(self)
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    },
    deliveryButtons: function(callback) {
        var self = this
          , ids = [];
        this.context.data.deliverys.map(function(item) {
            ids.push(item.id)
        }),
        cb.rest.postData({
            url: cb.router.HTTP_DELIVERY_GETSHOWBTNLIST,
            params: ids,
            success: function(data) {
                $$.isArray(data.data) && data.data.length && (self.context.data.deliverys.map(function(citem) {
                    var buttons = data.data.find(function(o) {
                        return o.id === citem.id
                    });
                    buttons && (citem.isShowConfirmBtn = buttons.isShowConfirmBtn && cb.rest.appContext[self.context.isCorpUser ? "corpAutData" : "autData"].deliveryAuditing,
                    citem.isShowUnConfirmBtn = buttons.isShowUnConfirmBtn && cb.rest.appContext[self.context.isCorpUser ? "corpAutData" : "autData"].deliveryBackConfirm)
                }),
                callback) && callback.call(self)
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    }
},
UOrderApp.pages.OrderInfoController.prototype.render = {
    delivery: function() {
        var inner;
        "u8c" != cb.rest.runtime.env && (inner = this.tplOrderDetailLogistics({
            deliverys: this.context.data.deliverys
        }),
        $$(this.pageContainer).find("ul.moreDeliverysBox").html(inner))
    },
    payment: function() {
        var inner = this.tplOrderDetailRelation({
            hasDeliverys: !!this.context.data.deliverys.length,
            hasPayments: this.context.data.payments && this.context.data.payments.length,
            payments: this.context.data.payments || [],
            deliverys: this.context.data.deliverys
        });
        $$(this.pageContainer).find(".list-block.relation-content").html(inner)
    }
},
UOrderApp.pages.OrderInfoController.prototype.on = function() {
    var self = this;
    $$(this.pageContainer).find(".orderstatu-title .title").on("click", function() {
        upcommon.getQRImage(self.context.oid)
    }),
    $$(this.pageContainer).find(".icon.icon-mode-switch").on("click", function() {
        myApp.modal({
            title: '<div class="common-tips-title warning-tips mode-switch-content"><i class="icon icon-warning"></i><span  class="font-23">确定切换到' + (self.context.isStandardMode ? "精简" : "标准") + "模式吗？</span></div>",
            text: '<div class="common-tips-content mode-switch-content"><div class="tips-info"><div class="tips-warin">温馨提示：该操作只针对本订单</div><ul><li><div class="item-title">精简模式' + (self.context.isStandardMode ? "" : "<span>当前</span>") + '</div><div class="item-content">适用于订单一次收款/一次发货情况下的快捷操作，支持无界面一键收款确认、一键发货（创建发货单、审核并打印发货单）</div></li><li><div class="item-title">标准模式' + (self.context.isStandardMode ? "<span>当前</span>" : "") + '</div><div class="item-content">适用于需要进入收款/发货详情查看或调整、以及订单多次收款/多次发货的情况，切换后将进入发货单详情创建【发货】</div></li></ul></div></div>',
            buttons: [{
                text: "取消",
                onClick: function() {}
            }, {
                text: "确定",
                onClick: function() {
                    self.context.isStandardMode = !self.context.isStandardMode,
                    self.tool.toolbar.call(self)
                }
            }]
        })
    }),
    $$(this.pageContainer).find(".moreDeliverysBox .btn-isShowMore").on("click", function() {
        "展开更多" == $$(this).html() ? ($$(self.pageContainer).find(".moreDeliverysBox > li.DeliverysLi").removeClass("hide"),
        $$(this).html("收起更多")) : ($$(self.pageContainer).find(".moreDeliverysBox > li.DeliverysLi").each(function(i, item) {
            0 < i && $$(this).addClass("hide")
        }),
        $$(this).html("展开更多"))
    }),
    $$(this.pageContainer).find("ul > .btn-isShowMore").on("click", function() {
        "展开更多" == $$(this).html() ? ($$(this).parent().children().removeClass("hide"),
        $$(this).html("收起更多")) : ($$(this).parent().children().addClass("hide"),
        $$(this).parent().children().eq(0).removeClass("hide"),
        $$(this).removeClass("hide"),
        $$(this).html("展开更多"))
    }),
    setTimeout(function() {
        900 < window.screen.height && $$(self.pageContainer).find("ul > .btn-isShowMore").trigger("click")
    }, 100),
    $$(this.pageContainer).find(".productDetailContainer .discountDescContainer").on("click", function(e) {
        e.stopPropagation();
        var e = $$(this)
          , pid = $$(this).attr("data-productid")
          , ds = $$(this).dataset();
        upcommon.showGiftInfo(e, pid, ds.unitname)
    }),
    $$(this.pageContainer).find(".toReamrk").on("click", function() {
        myApp.mainView.router.load({
            url: "pages/viewRemarks.html",
            query: {
                cOrderNo: self.context.data.order.cOrderNo
            }
        })
    }),
    $$(this.pageContainer).find(".toAllMessage").on("click", function() {
        myApp.mainView.router.load({
            url: "pages/allMessage.html",
            query: {
                cOrderNo: self.context.data.order.cOrderNo
            }
        })
    }),
    $$(this.pageContainer).find(".toAddMessage").on("click", function() {
        myApp.mainView.router.load({
            url: "pages/addMessage.html",
            query: {
                cOrderNo: self.context.data.order.cOrderNo,
                type: "add"
            }
        })
    }),
    $$(this.pageContainer).find(".align-top.dealProcessLink").on("click", function() {
        self.context.data.order.oStatusRecord && 1 < self.context.data.order.oStatusRecord.length && myApp.mainView.router.load({
            url: "pages/processInfo.html",
            query: {
                oStatusRecord: self.context.data.order.oStatusRecord
            }
        })
    }),
    $$(this.pageContainer).find(".toFileList").on("click", function() {
        "u8c" === cb.rest.runtime.env ? myApp.mainView.router.load({
            url: "pages/ucEclosureListModify.html",
            query: {
                orderId: self.context.data.order.id,
                orderType: "detail"
            }
        }) : myApp.mainView.router.load({
            url: "pages/enclosureList.html",
            query: {
                files: self.context.data.order.oAttachments
            }
        })
    }),
    $$(this.pageContainer).find(".orderstatu-title .time .icon-edit").on("click", function() {
        var target = $$(this);
        window.setTimeout(function() {
            target.parent().find("input").click()
        }, 100)
    }),
    $$(this.pageContainer).find(".productsList.title-border-bottom").on("click", function() {
        $$(this).find("i").hasClass("icon-arrow-down") ? $$(this).find("i").removeClass("icon-arrow-down").addClass("icon-arrow-up") : $$(this).find("i").removeClass("icon-arrow-up").addClass("icon-arrow-down"),
        $$(this).nextAll().toggleClass("hide"),
        $$(self.pageContainer).find(".order-btn.message-btn").toggleClass("hide")
    }),
    $$(this.pageContainer).find(".list-block.relation-content").on("click", "a.orderListToolbutton", function(e) {
        e.stopPropagation();
        var ds = $$(this).dataset();
        switch (ds.type) {
        case "revice":
            self.event.confirmPayment.call(self, ds.id);
            break;
        case "deliveryConfirm":
            self.event.deliveryConfirm.call(self);
            break;
        case "deliveryUnConfirm":
            self.event.deliveryUnConfirm.call(self)
        }
    }),
    myApp.calendar({
        input: $$(self.pageContainer).find(".orderstatu-title .time input"),
        closeOnSelect: !0,
        minDate: new Date((new Date).getTime() - 864e5),
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dateFormat: "yyyy-mm-dd",
        onClose: function(p) {
            p = {
                cOrderNo: self.context.data.order.cOrderNo,
                dSendDate: p.input.val()
            };
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_MODIFYSENDDATE,
                params: p,
                success: function(data) {
                    200 == data.code && myApp.toast("更改成功", "tips").show(!0)
                }
            })
        }
    });
    $$(this.pageContainer).find(".toolbar").on("click", ".order-btn a", function(e) {
        var btnType = $$(this).attr("data-btnType")
          , orderNo = $$(this).parent().data("orderno")
          , $this = $$(this);
        if (orderNo)
            switch (btnType) {
            case "createDelivery":
                self.context.isStandardMode ? myApp.mainView.router.loadPage({
                    url: "corpPages/newDeliverOrder.html?orderNo=" + orderNo
                }) : self.event.batchDelivery.call(self, $this);
                break;
            case "edit":
                myApp.mainView.router.loadPage({
                    url: "pages/editOrderDetail.html?cOrderNo=" + orderNo,
                    reload: !0
                });
                break;
            case "payfor":
                myApp.mainView.router.loadPage({
                    url: "pages/newpaybill.html?orderNo={0}&orgId={1}&bizId={2}".format(orderNo, self.context.data.order.salesOrgId || "", self.context.data.order.bizId || ""),
                    query: {
                        agent: {
                            id: self.context.data.order.oAgent.agentId,
                            cName: self.context.data.order.oAgent.cName,
                            bizId: self.context.data.order.oAgent.bizId
                        }
                    }
                });
                break;
            case "SaleReturn":
                myApp.mainView.router.loadPage({
                    url: "pages/newReturnOrder.html?type=add&oid=" + orderNo + "&bizId=" + self.context.data.order.bizId
                });
                break;
            case "toShare":
                cb.rest.getJSON({
                    url: cb.router.HTTP_ORDER_DOSHARE.format(orderNo),
                    success: function(data) {
                        data.data && (console.log("分享链接：" + data.data.mobileUrl + "&fromShare=true&pcUrl=" + encodeURIComponent(data.data.pageUrl) + "&redirectUrl=pages_orderDetail&redirectUrlparam=oid~" + orderNo + "   验证码：" + data.data.validCode),
                        cb.native.share("text", {
                            content: "分享链接：" + data.data.mobileUrl + "&fromShare=true&pcUrl=" + encodeURIComponent(data.data.pageUrl) + "&redirectUrl=pages_orderDetail&redirectUrlparam=oid~" + orderNo + "   验证码：" + data.data.validCode,
                            callback: function() {
                                myApp.mainView.router.back()
                            }
                        }))
                    },
                    error: function(err) {
                        myApp.toast(err.message, "error").show(!0)
                    }
                });
                break;
            case "received":
                myApp.mainView.router.loadPage({
                    url: "pages/deliveryList.html?cOrderNo=" + orderNo,
                    query: {
                        cOrderNo: orderNo
                    }
                });
                break;
            case "evaluation":
                myApp.mainView.router.loadPage({
                    url: "pages/goodEvaluation.html",
                    query: {
                        products: self.context.data.order.oOrderDetails
                    }
                });
                break;
            case "confor":
                self.event.submit.getExceedInventoryOrder.call(self, $this);
                break;
            case "submitfor":
                self.event.agentSubmit.call(self, orderNo);
                break;
            case "toShoppingCart":
                myApp.mainView.router.loadPage({
                    url: "pages/editOrderDetail.html?type=add&cOrderNo=" + orderNo,
                    reload: !0
                });
                break;
            case "del":
                self.event.delEvent.call(self, orderNo);
                break;
            case "reject":
                self.event.opposeEvent.call(self, orderNo);
                break;
            case "confirmBack":
                self.event.confirmBack.call(self, orderNo);
                break;
            case "cancel":
                self.event.cancelEvent.call(self, orderNo);
                break;
            case "more":
                self.event.moreEvent.call(self, this);
                break;
            case "close":
                self.event.closeEvent.call(self, orderNo);
                break;
            case "open":
                self.event.openEvent.call(self, orderNo);
                break;
            case "confirmPayments":
                self.event.batchPayments.call(self);
                break;
            default:
                btnType.startWith("define") && self.event.defineEvent.call(self, $this)
            }
        else
            myApp.toast("单据编号不存在", "error").show(!0),
            myApp.mainView.router.back()
    }),
    $$(this.pageContainer).find(".productDetailContainer .swipeout-actions-right").on("click", "a", function(e) {
        var $this = $$(this)
          , detailId = $$(this).attr("data-detailid")
          , cOrderNo = $$(this).parent().attr("data-oid");
        switch ($$(this).attr("data-type")) {
        case "open":
            self.event.openEvent.call(self, cOrderNo, detailId, function() {
                $this.attr("data-type", "close").text("关闭"),
                myApp.swipeoutClose($this.parents(".no-border.swipeout")[0])
            });
            break;
        case "close":
            self.event.closeEvent.call(self, cOrderNo, detailId, function() {
                $this.attr("data-type", "open").text("打开"),
                myApp.swipeoutClose($this.parents(".no-border.swipeout")[0])
            })
        }
    }),
    $$(this.pageContainer).on("click", ".productDetailContainer .body-define", function() {
        var ds = $$(this).dataset()
          , detail = self.context.data.cloneOrder.oOrderDetails.find(function(item) {
            return item.idKey == ds.idkey
        })
          , query = {
            container: $$(this),
            useDefines: detail.oOrderDetailDefine || {}
        };
        detail.iStockId && (query.useDefines.iStockId = detail.oStock.cName),
        detail.dSendDate && (query.useDefines.dSendDate = detail.dSendDate),
        detail.iTransactionTypeId && self.context.isCorpUser && (query.useDefines.iTransactionTypeId = detail.iTransactionTypeId,
        query.useDefines.transaction = {
            id: detail.oTransactionType.id,
            name: detail.oTransactionType.cName
        }),
        "NONE" != cb.FunctionOptions.SHOWAGENTORG && detail.iSaleOrgId && (query.useDefines.simpleOrg = {
            iSaleOrgId: detail.iSaleOrgId,
            cSaleOrgName: detail.cSaleOrgName
        }),
        myApp.mainView.router.loadPage({
            url: "pages/useDefines.html?orderType=order&archiveType=2&readOnly=true&bizId=" + detail.bizId,
            query: query
        })
    }),
    this.context.data.order.oOrderMemos.length || ($$(this.pageContainer).find(".input-orderMsg-container").on("input", function(e) {
        var val = $$(this).val()
          , length = val ? val.length : 0;
        255 < length && $$(this).val(val.substr(0, 255)),
        $$(this).parent().find("span").html(255 - length)
    }),
    $$(this.pageContainer).find(".page-content").on("click", ".confirmList-rabeta .btn", function() {
        var cOrderNo = self.context.data.order.cOrderNo
          , dataType = $$(this).attr("data-type");
        dataType && cOrderNo && "saveMessage" === dataType && ((dataType = $$(self.pageContainer).find(".page-content .confirmList-rabeta .input-orderMsg-container").val()) && dataType.length ? (dataType = dataType && dataType.replace(upcommon.regs.emoji, ""),
        cb.rest.postData({
            url: cb.router.HTTP_ORDER_ADDORDERMEMO,
            params: {
                cRemark: dataType,
                cOrderNo: cOrderNo
            },
            success: function(data) {
                200 == data.code && ($$(self.pageContainer).find(".page-content .confirmList-rabeta").children("ul").children("li").each(function() {
                    var type = $$(this).attr("data-type");
                    type && ("hasMemo" == type && $$(this).removeClass("hide"),
                    "noMemo" == type) && $$(this).addClass("hide")
                }),
                self.load.messages.call(self))
            },
            error: function(err) {
                myApp.toast(err.message, "error").show(!0)
            }
        })) : myApp.toast("您好像没输入留言信息～", "tips").show(!0))
    })),
    $$(this.pageContainer).find("ul.moreDeliverysBox").on("click", "li", function() {
        var ds = $$(this).dataset()
          , delivery = self.context.data.deliverys.find(function(item) {
            return item.cDeliveryNo == ds.delivery
        })
          , delivery = {
            billNo: delivery.cLogisticsBillNo,
            logisticName: delivery.oCorpLogistics ? delivery.oCorpLogistics.cFullName : "",
            wayId: delivery.iLogisticWayId,
            phone: delivery.cLogisticsUserPhone || "",
            name: delivery.cLogisticsUserName || "",
            cartNum: delivery.cLogisticsCarNum || "",
            tickTime: delivery.tackTime
        };
        delivery.billNo && delivery.wayId && myApp.mainView.router.load({
            url: "pages/logisticsInfo.html?" + $$.serializeObject(delivery)
        })
    }),
    $$(this.pageContainer).find("ul > .btn-isShowMore").prev().on("click", "span", function() {
        var txt = $$(this).text();
        self.tool.defineLink.call(self, txt)
    }),
    $$(this.pageContainer).find(".statistic").on("click", "dl dd", function() {
        var txt = $$(this).text();
        self.tool.defineLink.call(self, txt)
    }),
    $$(this.pageContainer).find(".relation-content").on("click", "a", function(e) {
        switch ($$(this).dataset().type) {
        case "deliverys":
            myApp.mainView.router.loadPage({
                url: "pages/deliveryList.html?cOrderNo=" + self.context.data.order.cOrderNo,
                query: {
                    cOrderNo: self.context.data.order.cOrderNo
                }
            });
            break;
        case "payments":
            myApp.mainView.router.loadPage({
                url: "pages/paymentList.html",
                query: {
                    order: self.context.data.order
                }
            })
        }
    }),
    $$(this.pageContainer).find(".productDetailContainer .sku-media-content").on("click", ".item-media img", function() {
        var src = $$(this).attr("src");
        (src.indexOf("!") && src.startWith("http://") || src.startWith("https://")) && (src = src.substr(0, src.indexOf("!")) + "!PL",
        cb.photoBrowser = myApp.photoBrowser({
            zoom: !0,
            photos: [src],
            initialSlide: 0,
            theme: "dark",
            navbar: !1,
            lazyLoading: !1,
            lazyLoadingInPrevNext: !0,
            swipeToClose: !1,
            onClose: function(photobrowser) {
                console.log("执行了关闭"),
                cb.photoBrowser = null
            },
            onClick: function(swiper) {
                setTimeout(function() {
                    cb.photoBrowser && cb.photoBrowser.opened && cb.photoBrowser.close()
                }, 500)
            }
        }),
        cb.photoBrowser.open())
    })
}
,
UOrderApp.pages.OrderInfoController.prototype.afterFromPageBack = function(page) {
    switch (page.fromPage.name) {
    case "addMessage":
    case "allMessage":
        this.load.messages.call(this);
        break;
    case "NewPaybill":
    case "newReturnOrder":
    case "Bill":
        this.context.data.cloneOrder.cOrderNo && (this.load.order.call(this),
        this.context.isCorpUser) && !this.context.isAgentOrder && this.load.getPayListByOrder.call(this);
        break;
    case "newDeliverOrder":
        cb.cache.del("orderDefines");
        break;
    case "OrderStatusPay":
        this.context.isCorpUser && !this.context.isAgentOrder && this.load.getPayListByOrder.call(this)
    }
}
,
UOrderApp.pages.OrderInfoController.prototype.tool = {
    format: function() {
        var self = this
          , header = {
            cOrderNo: this.context.data.order.cOrderNo,
            iAgentId: this.context.data.order.iAgentId,
            isAgentSubmit: this.context.data.order.isAgentSubmit,
            dOrderDate: this.context.data.order.dOrderDate,
            dSendDate: this.context.data.order.dSendDate,
            editSendDate: "CONFIRMORDER" === this.context.data.order.cNextStatus && "true" != this.context.isChannel && cb.rest.appContext.corpUser && cb.rest.appContext.corpAutData && cb.rest.appContext.corpAutData.orderModify,
            isAgentShowSendDate: "DELIVERGOODS" === this.context.data.order.cNextStatus || "TAKEDELIVERY" === this.context.data.order.cNextStatus || "ENDORDER" === this.context.data.order.cNextStatus || "OPPOSE" === this.context.data.order.cNextStatus,
            dDeliveryDate: "TAKEDELIVERY" === this.context.data.order.cStatusCode ? this.context.data.order.dDeliveryDate : "",
            cStatusCode: this.context.data.order.cStatusCode,
            cNextStatusName: this.context.data.order.cNextStatusName,
            cSource: 1 == this.context.data.order.cSource,
            isEnableAgent: this.context.data.order.oAgent && !this.context.data.order.oAgent.isEnableAgent
        }
          , receiver = {
            cReceiver: this.context.data.order.cReceiver,
            cReceiveMobile: this.context.data.order.cReceiveMobile,
            cReceiveAddress: this.context.data.order.cReceiveAddress,
            receiveStoreName: this.context.data.order.receiveStoreName || ""
        }
          , agent = {
            agentName: this.context.data.order.oAgent ? this.context.data.order.oAgent.cName : "",
            cReceiveContacter: this.context.data.order.cReceiveContacter,
            cReceiveContacterPhone: this.context.data.order.cReceiveContacterPhone,
            isShowHopeReceiveDate: this.context.data.order.isShowHopeReceiveDate,
            dHopeReceiveDate: this.context.data.order.dHopeReceiveDate,
            cCorpContactUserName: this.context.isCorpUser ? this.context.data.order.cCorpContactUserName : ""
        }
          , org = {
            isShowOrgs: cb.rest.appContext.context.isShowOrgs && (this.context.data.order.stockOrgId || this.context.data.order.salesOrgId || this.context.data.order.settlementOrgId),
            stockOrgIdName: this.context.data.order.stockOrgIdName,
            salesOrgName: this.context.data.order.salesOrgName,
            settlementOrgName: this.context.data.order.settlementOrgName
        }
          , deal = (cb.rest.runtime.pageConfig && cb.rest.runtime.pageConfig.orderDetail && 0 <= ["CONFIRMORDER", "SUBMITORDER"].indexOf(this.context.data.order.cNextStatus) && (header.isShowOrderTips = this.context.data.order.isShowOrderTips || self.context.bizs && self.context.bizs.find(function(biz) {
            return biz.id == self.context.data.order.bizId && 1 === biz.bizType
        }),
        header.isShowOrderTips) && (header.isShowOrderTips = !this.context.isCorpUser || this.context.isAgentOrder ? cb.rest.runtime.pageConfig.orderDetail.agentTips : cb.rest.runtime.pageConfig.orderDetail.corpTips),
        {
            oStatusRecord: this.context.data.order.oStatusRecord || []
        })
          , invoice = (deal.oStatusRecord.length && (deal.lastStatusRecord = deal.oStatusRecord[0]),
        {
            cInvoiceType: this.context.data.order.cInvoiceType,
            cInvoiceTitle: this.context.data.order.cInvoiceTitle,
            cInvoiceContent: this.context.data.order.cInvoiceContent
        })
          , payment = {
            payWayName: this.context.data.order.oPayWayCode ? this.context.data.order.oPayWayCode.cName : "",
            settlementWayName: this.context.data.order.oSettlementWay ? this.context.data.order.oSettlementWay.cName : "",
            shippingChoiceName: this.context.data.order.oShippingChoice ? this.context.data.order.oShippingChoice.cName : ""
        }
          , defines = {
            headerDefines: [],
            footerDefines: []
        }
          , statistic = ($$.isArray(this.context.data.useDefines.header) && this.context.data.order.oOrderDefine && this.context.data.useDefines.header.forEach(function(item) {
            var value = self.context.data.order.oOrderDefine[item.name];
            switch (void 0 === value && (value = item.defaultValue),
            item.enableType) {
            case 1:
            case 3:
                defines.headerDefines.push({
                    name: item.name,
                    title: item.showCaption,
                    value: value ? "<span>" + value + "</span>" : ""
                }),
                item.isFoot && defines.footerDefines.push({
                    title: item.showCaption,
                    value: value || ""
                });
                break;
            case 2:
                cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && (defines.headerDefines.push({
                    title: item.showCaption,
                    value: value ? "<span>" + value + "</span>" : ""
                }),
                item.isFoot) && defines.footerDefines.push({
                    title: item.showCaption,
                    value: value || ""
                })
            }
        }),
        this.context.isCorpUser && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && (transactionName = this.context.data.order.iTransactionTypeId && this.context.data.order.oTransactionType ? this.context.data.order.oTransactionType.cName : "",
        defines.headerDefines.push({
            title: "交易类型",
            value: transactionName
        })),
        {
            hideOrderPromotion: cb.FunctionOptions.HIDEPORDERROMOTION,
            fPromotionMoney: this.context.data.order.fPromotionMoney,
            fRebateMoney: this.context.data.order.fRebateMoney,
            fRebateCashMoney: this.context.data.order.fRebateCashMoney,
            fTotalMoney: this.context.data.order.fTotalMoney,
            hasfReight: cb.bizFunctionOptions[this.context.data.order.bizId] && cb.bizFunctionOptions[this.context.data.order.bizId].OPENFREIGHT,
            fReight: this.context.data.order.fReight,
            isShowPoints: cb.FunctionOptions.AGENTSYNCUHY,
            fPointsMoney: this.context.data.order.fPointsMoney,
            fParticularlyMoney: this.context.data.order.fParticularlyMoney,
            fPayMoney: this.context.data.order.fPayMoney,
            fCouponsMoney: this.context.data.order.fCouponsMoney,
            isPreSaleOrder: cb.FunctionOptions.OPENPRESALE && this.context.data.order.presaleId,
            isShowRebate: "u8c" != cb.rest.runtime.env
        })
          , groupPromotion = this.context.data.order.oOrderDetailGroups.find(function(item) {
            return 0 === item.index
        })
          , transactionName = (groupPromotion && (statistic.lsGiveawayPromotionName = groupPromotion.lsGiveawayPromotions && groupPromotion.lsGiveawayPromotions.length && (0 === groupPromotion.iEntityGiveawayPreId ? {
            pName: "不使用"
        } : groupPromotion.lsGiveawayPromotions.find(function(item) {
            return item.id == groupPromotion.iEntityGiveawayPreId
        })),
        statistic.lsMoneyPromotionName = groupPromotion.lsMoneyPromotions && groupPromotion.lsMoneyPromotions.length && (0 === groupPromotion.iEntityMoneyPreId ? {
            pName: "不使用"
        } : groupPromotion.lsMoneyPromotions.find(function(item) {
            return item.id == groupPromotion.iEntityMoneyPreId
        }))),
        cb.FunctionOptions.DISPLAYPRICE && !this.context.isCorpUser && (statistic.fPromotionMoney = statistic.fPromotionMoney && "***",
        statistic.fRebateMoney = statistic.fRebateMoney && "***",
        statistic.fTotalMoney = statistic.fTotalMoney && "***",
        statistic.fParticularlyMoney = statistic.fParticularlyMoney && "***"),
        $$.isArray(this.context.data.order.orderCoupons) && cb.FunctionOptions.OPENCOUPONS && this.context.data.order.orderCoupons.map(function(item) {
            switch (item.type) {
            case 1:
                statistic.couponName = item.title + "(代金券)";
                break;
            case 2:
                statistic.couponName = item.title + "(折扣券)";
                break;
            case 5:
                statistic.couponName = item.title + "(计次卡)";
                break;
            case 6:
                statistic.couponName = item.title + "(兑换)"
            }
        }),
        {
            attachments: this.context.data.order.oAttachments || [],
            orderMemos: this.context.data.order.oOrderMemos || []
        });
        this.context.data.renderData = {
            isStandardMode: this.context.isStandardMode,
            isCorpUser: this.context.isCorpUser,
            header: header,
            receiver: receiver,
            agent: agent,
            org: org,
            deal: deal,
            invoice: invoice,
            payment: payment,
            defines: defines,
            statistic: statistic,
            other: transactionName,
            details: this.tool.formatRows.call(this),
            isYs: "u8c" === cb.rest.runtime.env
        },
        upcommon.setCurrTypeSign(this.context.data.order),
        this.context.data.order.currTypeSign && (this.context.data.renderData.currTypeSign = this.context.data.order.currTypeSign)
    },
    formatRows: function() {
        var productList = new Array
          , productGift = new Array
          , productType = {}
          , data = {
            groups: [],
            products: [],
            totalCount: 0,
            totalAuxUnit: 0,
            isU8c: "u8c" == cb.rest.runtime.env
        }
          , autData = cb.rest.appContext[this.context.isCorpUser ? "corpAutData" : "autData"]
          , val = this.context.data.order.oOrderDetails
          , orderDetailGroups = this.context.data.order.oOrderDetailGroups;
        if (0 < val.length)
            for (var index = 0; index < val.length; index++) {
                function splitAttr(str) {
                    var arr = new Array;
                    if (str)
                        for (var strList = str.split(";"), i = 0; i < strList.length; i++)
                            0 < strList[i].indexOf(":") && arr.push({
                                cName: strList[i].split(":")[0],
                                cSpecItemName: strList[i].split(":")[1]
                            });
                    return arr
                }
                var item = val[index]
                  , iProductId = item.iProductId
                  , o = {
                    cName: item.cProductName,
                    cProductUnitName: item.cProductUnitName,
                    cProductCode: item.cProductCode,
                    iProductId: iProductId,
                    cImgUrl: item.oSKU && item.oSKU.oProduct && item.oSKU.oProduct.imgUrl || "img/nopic.jpg",
                    oOrderProductApportions: new Array,
                    isHidePrice: this.context.isHidePrice,
                    iGroupIndex: item.iGroupIndex,
                    suiteGroup: item.suiteGroup,
                    cOrderProductType: item.cOrderProductType,
                    iAgentId: item.iAgentId,
                    bizId: item.bizId,
                    bizProductId: item.bizProductId,
                    isHideProm: !!this.context.isCorpUser && !cb.rest.appContext.isAgentOrder,
                    showImage: cb.rest.appContext.showImage,
                    isMultBiz: this.context.isMultBiz
                };
                cb.FunctionOptions.OPENPRESALE && this.context.data.order.presaleId && (o.isHideProm = !0),
                this.context.isMultBiz && this.context.isCorpUser && !cb.rest.appContext.isAgentOrder && (o.createBizName = item.oSKU && item.oSKU.oProduct && item.oSKU.oProduct.createBizName),
                0 < o.cName.indexOf("®") && (o.cName = o.cName.replace("®", "<sup>®</sup>")),
                item.iQuantity ? (data.totalCount = upcommon.addByMaxPrecise(data.totalCount, item.iQuantity),
                data.totalAuxUnit = upcommon.addByMaxPrecise(data.totalAuxUnit, item.iAuxUnitQuantity)) : $$.isArray(item.SkuSpecItems) && item.SkuSpecItems.forEach(function(SkuSpecItem) {
                    data.totalCount = upcommon.addByMaxPrecise(data.totalCount, SkuSpecItem.iQuantity),
                    data.totalAuxUnit = upcommon.addByMaxPrecise(data.totalAuxUnit, SkuSpecItem.iAuxUnitQuantity)
                });
                if (!item.cOrderProductType || "GIFT" != item.cOrderProductType && "REBATE" != item.cOrderProductType) {
                    if (o.fParticularlyMoney = item.fParticularlyMoney,
                    o.fSalePrice = item.fSalePrice,
                    item.suiteGroup) {
                        if (productType[iProductId + "-" + item.suiteGroup])
                            continue
                    } else if (productType[iProductId + "-" + item.iGroupIndex])
                        continue;
                    function totalfApportionMoney(itemArr, type) {
                        for (var totalApportion = 0, k = 0; k < itemArr.length; k++)
                            (!type || itemArr[k].cApportionType == type) && (totalApportion += itemArr[k].fApportionMoney);
                        return totalApportion
                    }
                    var arraySku = val.filter(function(itemObj) {
                        return item.suiteGroup ? itemObj.iProductId === iProductId && itemObj.suiteGroup === item.suiteGroup : itemObj.iProductId === iProductId && itemObj.iGroupIndex === item.iGroupIndex
                    });
                    if (item.suiteGroup ? productType[iProductId + "-" + item.suiteGroup] = !0 : productType[iProductId + "-" + item.iGroupIndex] = !0,
                    0 < arraySku.length) {
                        for (var attr, attrArray = new Array, j = 0; j < arraySku.length; j++)
                            "SALE" == arraySku[j].cOrderProductType && (attr = {
                                id: item.id,
                                iSKUId: arraySku[j].iSKUId,
                                iQuantity: arraySku[j].iQuantity,
                                cProductUnitName: o.cProductUnitName,
                                fSalePrice: arraySku[j].fSalePrice,
                                fSalePayMoney: arraySku[j].fSalePayMoney,
                                fTransactionPrice: arraySku[j].fTransactionPrice,
                                fParticularlyMoney: arraySku[j].oOrderProductApportions ? totalfApportionMoney(arraySku[j].oOrderProductApportions, "PARTICULARLY") : 0,
                                fPromotionMoney: arraySku[j].fPromotionMoney,
                                fRebateMoney: arraySku[j].oOrderProductApportions ? totalfApportionMoney(arraySku[j].oOrderProductApportions, "REBATE") : 0,
                                lsSkuSpecItems: splitAttr(arraySku[j].cSpecDescription),
                                isHidePrice: this.context.isHidePrice,
                                isShowClosedDetail: arraySku[j].isShowClosedDetail && autData.closedOrderDetail,
                                isShowOpenDetail: arraySku[j].isShowOpenDetail && autData.openOrderDetail,
                                definesData: arraySku[j].definesData,
                                cOrderProductType: "SALE",
                                iProductId: arraySku[j].iProductId,
                                idKey: arraySku[j].idKey,
                                hideOrderPromotion: cb.FunctionOptions.HIDEPORDERROMOTION,
                                bizProductId: arraySku[j].bizProductId,
                                bizId: arraySku[j].bizId,
                                salesOrgId: arraySku[j].salesOrgId,
                                fPointsMoney: arraySku[j].fPointsMoney,
                                isShowSkuPic: this.context.isShowSkuPic,
                                imgUrl: arraySku[j].oSKU.imgUrl,
                                cusDiscountRate: arraySku[j].cusDiscountRate,
                                cusDiscountMoney: arraySku[j].cusDiscountMoney
                            },
                            cb.FunctionOptions.OPENAUXUNIT && (attr.iAuxUnitQuantity = arraySku[j].iAuxUnitQuantity,
                            attr.cProductAuxUnitName = arraySku[j].cProductAuxUnitName),
                            arraySku[j].iComPreGroupId && (attr.iComPreGroupId = arraySku[j].iComPreGroupId),
                            attr.hasSwipeout = attr.isShowClosedDetail || attr.isShowOpenDetail,
                            !this.context.isHidePrice && cb.FunctionOptions.SHOWDISCOUNT && attr.fSalePrice && (attr.showDiscount = (attr.fTransactionPrice / attr.fSalePrice * 100).toFixed(2) + "%"),
                            cb.FunctionOptions.DISPLAYPRICE && !this.context.isCorpUser && (attr.fSalePayMoney = "***",
                            attr.fTransactionPrice = "***",
                            attr.fPromotionMoney = attr.fPromotionMoney && "***",
                            attr.fParticularlyMoney = attr.fParticularlyMoney && "***",
                            attr.fRebateMoney = attr.fRebateMoney && "***",
                            attr.fParticularlyMoney = attr.fParticularlyMoney && "***"),
                            attrArray.push(attr));
                        o.SkuSpecItems = attrArray
                    }
                    o.orderTotalNum = arraySku.length,
                    o.hasPromotions = !o.isHideProm && (!cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder) && item.lsPromotionFlags && 0 < item.lsPromotionFlags.length,
                    o.hasPromotions && (o.hasPType1 = 0 <= item.lsPromotionFlags.indexOf(1),
                    o.hasPType2 = 0 <= item.lsPromotionFlags.indexOf(2),
                    o.hasPType3 = 0 <= item.lsPromotionFlags.indexOf(3)),
                    productList.push(o)
                } else
                    o.id = item.id,
                    o.idKey = item.idKey,
                    o.cOrderProductType = item.cOrderProductType,
                    o.bUserAddGiveaway = item.bUserAddGiveaway,
                    o.iSKUId = item.iSKUId,
                    o.iQuantity = item.iQuantity,
                    o.fSalePrice = item.fSalePrice,
                    o.SkuSpecItems = splitAttr(item.cSpecDescription),
                    o.fPromotionMoney = item.fPromotionMoney,
                    o.fSalePayMoney = item.fSalePayMoney,
                    o.fTransactionPrice = item.fTransactionPrice,
                    o.cProductUnitName = item.cProductUnitName,
                    o.definesData = item.definesData,
                    o.fPointsMoney = item.fPointsMoney,
                    o.oOrderProductApportions = item.oOrderProductApportions,
                    o.isShowClosedDetail = item.isShowClosedDetail && autData.closedOrderDetail,
                    o.isShowOpenDetail = item.isShowOpenDetail && autData.openOrderDetail,
                    o.hasSwipeout = item.isShowClosedDetail && autData.closedOrderDetail || item.isShowOpenDetail && autData.openOrderDetail,
                    cb.FunctionOptions.OPENAUXUNIT && (o.iAuxUnitQuantity = item.iAuxUnitQuantity,
                    o.cProductAuxUnitName = item.cProductAuxUnitName),
                    o.hideOrderPromotion = cb.FunctionOptions.HIDEPORDERROMOTION,
                    o.isShowSkuPic = this.context.isShowSkuPic,
                    o.imgUrl = item.oSKU.imgUrl,
                    productGift.push(o)
            }
        return productList = productList.concat(productGift),
        data.length = productList.length,
        productList.forEach(function(item) {
            if (item.iGroupIndex || item.suiteGroup) {
                for (var detailGroup = null, i = 0; i < data.groups.length; i++)
                    item.suiteGroup ? item.suiteGroup === data.groups[i].suiteGroup && (detailGroup = data.groups[i]).products.push(item) : item.iGroupIndex === data.groups[i].index && (detailGroup = data.groups[i]).products.push(item);
                if (!detailGroup)
                    if ((detailGroup = (detailGroup = orderDetailGroups.filter(function(itemm) {
                        return item.suiteGroup ? itemm.suiteGroup && itemm.suiteGroup === item.suiteGroup : itemm.index && itemm.index === item.iGroupIndex
                    }))[0]) && detailGroup.iComPromotionGroupId) {
                        switch (detailGroup.iPreType) {
                        case 1:
                            detailGroup.promotionName = "折";
                            break;
                        case 2:
                            detailGroup.promotionName = "促";
                            break;
                        case 3:
                            detailGroup.promotionName = "赠";
                            break;
                        case 4:
                            detailGroup.promotionName = "一口价";
                            break;
                        default:
                            detailGroup.promotionName = ""
                        }
                        detailGroup.products = [],
                        detailGroup.products.push(item),
                        data.groups.push(detailGroup)
                    } else
                        item.suiteGroup ? (detailGroup.products = [],
                        detailGroup.products.push(item),
                        detailGroup.hasSpecs = !1,
                        data.groups.push(detailGroup)) : data.products.push(item)
            } else
                data.products.push(item)
        }),
        data
    },
    getDelivery: function() {
        $$.isArray(this.context.data.deliverys) && this.context.data.deliverys.forEach(function(item) {
            item.oDeliveryStatuse && (!item.oCorpLogistics || "DELIVERING" !== item.oDeliveryStatuse.cCode && "DELIVERED" !== item.oDeliveryStatuse.cCode ? (item.state = item.oDeliveryStatuse.cCode,
            item.tackTime = item.oDeliveryStatuse.cName + "[" + item.oDeliveryStatuse.dCreated + "]",
            item.cFullName = !1) : (item.state = item.oDeliveryStatuse.cCode,
            item.tackTime = item.oDeliveryStatuse.cName + "[" + item.oDeliveryStatuse.dCreated + "]",
            item.cFullName = item.oCorpLogistics ? item.oCorpLogistics.cFullName : ""))
        })
    },
    toolbar: function() {
        var query, self = this, autData = cb.rest.appContext[this.context.isCorpUser ? "corpAutData" : "autData"], buttons = new Array, order = this.context.data.order;
        if (this.context.isCorpUser ? ((!order.presaleId && autData.orderConfirm || order.presaleId && autData.presellOrderConfirm) && order.isShowConfirmBtn && buttons.push({
            class: "btn-confor",
            type: "confor",
            name: "确认订单"
        }),
        (!order.presaleId && autData.orderReject || order.presaleId && autData.presellOrderReject) && order.isShowOpposeBtn && buttons.push({
            class: "btn-confor",
            type: "reject",
            name: "驳回"
        }),
        autData.agentOrderDel && order.isShowDelBtn && cb.rest.appContext.isAgentOrder && buttons.push({
            class: "",
            type: "del",
            name: "删除"
        }),
        "CONFIRMORDER" == order.cNextStatus && "FINISHPAYMENT" != order.cPayStatusCode && (!order.presaleId && autData.orderModify || order.presaleId && autData.presellOrderEdit) && buttons.push({
            class: "",
            type: "edit",
            name: "编辑"
        }),
        (!order.presaleId && autData.orderReturn || order.presaleId && autData.presellOrderReturn) && order.isShowOrderRollBack && !cb.rest.appContext.isAgentOrder && buttons.push({
            class: "",
            type: "confirmBack",
            name: "回退"
        }),
        order.isShowClosedDetail && (!order.presaleId && autData.closedOrderDetail || order.presaleId && autData.presellOrderDetailClose) && !cb.rest.appContext.isAgentOrder && buttons.push({
            class: "",
            type: "close",
            name: "关闭"
        }),
        order.isShowOpenDetail && (!order.presaleId && autData.openOrderDetail || order.presaleId && autData.presellOrderDetailOpen) && !cb.rest.appContext.isAgentOrder && buttons.push({
            class: "",
            type: "open",
            name: "打开"
        }),
        order.isShowCreateDeliveryBtn && (!order.presaleId && autData.createDeliveryOrder || order.presaleId && autData.presellOrderCreateDelivery) && !cb.rest.appContext.isAgentOrder && buttons.push({
            class: "",
            type: "createDelivery",
            name: this.context.isStandardMode ? "发货" : "一键发货"
        }),
        !self.context.isStandardMode && autData.receivablesConfrim && !cb.rest.appContext.isAgentOrder && this.context.data.payments && this.context.data.payments.find(function(item) {
            return 4 == item.statusCode
        }) && buttons.push({
            class: "btn-confor",
            type: "confirmPayments",
            name: "一键收款"
        }),
        query = $$.parseUrlQuery(location.href),
        cb.native.isApp() && cb.FunctionOptions.AGENTSHAREORDER && !query.fromShare && cb.rest.appContext.isAgentOrder && buttons.push({
            class: "",
            type: "toShare",
            name: "分享"
        }),
        !cb.rest.appContext.isRelationOrder && order.isShowPayBtn && (!order.presaleId && autData.orderPay || order.presaleId && autData.presellOrderPay) && !this.context.isHidePrice && buttons.push({
            class: "payfor-btn",
            type: "payfor",
            name: "去付款"
        }),
        cb.rest.appContext.isAgentOrder && (autData.agentBuyProduct && buttons.push({
            class: "btn-red",
            type: "toShoppingCart",
            name: "再次购买"
        }),
        order.isShowSaleReturnBtn) && autData.agentOrderReturns && buttons.push({
            class: "btn-red",
            type: "SaleReturn",
            name: "退货"
        })) : (autData.agentBuyProduct && cb.rest.isNonfreezeAccount() && buttons.push({
            class: "btn-red",
            type: "toShoppingCart",
            name: "再次购买"
        }),
        autData.agentOrderSubmit && order.isShowAgentUserSubmitBtn && cb.rest.isNonfreezeAccount() && buttons.push({
            class: "submitfor-btn",
            type: "submitfor",
            name: "提交"
        }),
        "CONFIRMORDER" != order.cNextStatus && "SUBMITORDER" != order.cNextStatus && "FINISHPAYMENT" != order.cPayStatusCode || ("FINISHPAYMENT" != order.cPayStatusCode && autData.agentOrderModify) && cb.rest.isNonfreezeAccount() && buttons.push({
            class: "",
            type: "edit",
            name: "编辑"
        }),
        order.isShowDelBtn && autData.agentOrderDel && buttons.push({
            class: "",
            type: "del",
            name: "删除"
        }),
        order.isShowSaleReturnBtn && autData.agentOrderReturns && buttons.push({
            class: "btn-red",
            type: "SaleReturn",
            name: "退货"
        }),
        "TAKEDELIVERY" !== order.cNextStatus && "DELIVERY_TAKE_PART" !== order.cNextStatus || !autData.agentDeliveryList || buttons.push({
            class: "btn-red",
            type: "received",
            name: "查看收货单"
        }),
        query = $$.parseUrlQuery(location.href),
        autData.agentOrderShare && cb.native.isApp() && cb.FunctionOptions.AGENTSHAREORDER && !query.fromShare && buttons.push({
            class: "",
            type: "toShare",
            name: "分享"
        }),
        query = $$.parseUrlQuery(location.href),
        order.isShowPayBtn && (autData.agentOrderPay || query.fromShare) && !this.context.isHidePrice && buttons.push({
            class: "payfor-btn",
            type: "payfor",
            name: "去付款"
        })),
        this.context.data.useDefines.header && this.context.data.useDefines.header.forEach(function(item) {
            15 == item.fieldType && (self.context.isCorpUser ? 2 != item.enableType && 1 != item.enableType || buttons.push({
                class: "",
                type: item.name,
                name: item.showCaption
            }) : 3 != item.enableType && 1 != item.enableType || buttons.push({
                class: "",
                type: item.name,
                name: item.showCaption
            }))
        }),
        buttons.length && !this.context.noToolbar) {
            for (var outHtml = [], i = 0; i < buttons.length; i++) {
                var item = buttons[i];
                4 < buttons.length && 2 < i && (item.class += " hide"),
                outHtml.push('<a href="#" class="btn ' + item.class + '" data-btntype="' + item.type + '">' + item.name + "</a>")
            }
            $$(this.pageContainer).find(".orderInfoToolbarContainer").html(outHtml.join("")).parent().removeClass("hide"),
            4 < buttons.length && $$(this.pageContainer).find(".orderInfoToolbarContainer").append('<a href="#" class="btn" data-btntype="more">更多</a>')
        } else
            $$(this.pageContainer).find(".orderInfoToolbarContainer").parent().addClass("hide")
    },
    initDefines: function() {
        var transactionName, self = this, headerDefines = [], footerDefines = [], order = this.context.data.order, definesData = this.context.data.useDefines;
        return order.oOrderDefine && ($$.isArray(definesData.header) && definesData.header.forEach(function(header) {
            var attrValue = order.oOrderDefine[header.name];
            switch (void 0 === attrValue && (attrValue = header.defaultValue),
            header.enableType) {
            case 1:
            case 3:
                headerDefines.push({
                    title: header.showCaption,
                    value: attrValue || ""
                }),
                header.isFoot && footerDefines.push({
                    title: header.showCaption,
                    value: attrValue || ""
                });
                break;
            case 2:
                cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && (headerDefines.push({
                    title: header.showCaption,
                    value: attrValue || ""
                }),
                header.isFoot) && footerDefines.push({
                    title: header.showCaption,
                    value: attrValue || ""
                })
            }
        }),
        headerDefines.length && (order.headerDefines = headerDefines),
        order.footerDefines = footerDefines),
        this.context.isCorpUser && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && (transactionName = order.iTransactionTypeId && order.oTransactionType ? order.oTransactionType.cName : "",
        $$.isArray(order.headerDefines) ? order.headerDefines.push({
            title: "交易类型",
            value: transactionName
        }) : order.headerDefines = [{
            title: "交易类型",
            value: transactionName
        }]),
        $$.isArray(order.oOrderDetails) && order.oOrderDetails.forEach(function(item) {
            var lineDefine = [];
            cb.FunctionOptions.OPENSTOCK && item.oStock && (cb.rest.appContext.corpUser || cb.FunctionOptions.USERSELECTSTOCK) && lineDefine.push("仓库:" + item.oStock.cName),
            self.context.isCorpUser && item.oTransactionType && lineDefine.push("交易类型:" + item.oTransactionType.cName),
            item.dSendDate && (cb.rest.appContext.corpUser || 0 <= ["DELIVERGOODS", "TAKEDELIVERY", "ENDORDER", "OPPOSE"].indexOf(order.cNextStatus)) && lineDefine.push("预计发货日期:" + item.dSendDate),
            $$.isArray(definesData.body) && definesData.body.forEach(function(body) {
                var attrValue = null;
                switch (item.oOrderDetailDefine && (attrValue = item.oOrderDetailDefine[body.name],
                item.oOrderDetailDefine.hasOwnProperty(body.name)) || (attrValue = body.defaultValue),
                body.enableType) {
                case 1:
                case 3:
                    attrValue && lineDefine.push(body.showCaption + ":" + attrValue);
                    break;
                case 2:
                    cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && attrValue && lineDefine.push(body.showCaption + ":" + attrValue)
                }
            }),
            "NONE" != cb.FunctionOptions.SHOWAGENTORG && item.iSaleOrgId && lineDefine.push("组织名称:" + item.cSaleOrgName),
            lineDefine.length && (item.definesData = lineDefine.join(";"))
        }),
        order
    },
    testIsNowPage: function(page, callback) {
        var nowView;
        setTimeout(function() {
            (nowView = $$(".view.active")).find(".pages > .page").each(function() {
                $$(this).hasClass("page-on-center") && (nowView = $$(this))
            }),
            page == nowView.data("page") && callback()
        }, 500)
    },
    defineLink: function(url) {
        url && upcommon.regs.url.test(url) && cb.confirm("确定要打开这个外部链接吗？", "提示信息", function() {
            cb.native.frames({
                url: url,
                isFullScreen: !0
            })
        }, function() {}, "尝试打开", "返回")
    }
},
UOrderApp.pages.OrderInfoController.prototype.event = {
    agentSubmit: function(orderNo) {
        cb.rest.postData({
            url: cb.router.HTTP_ORDER_AGENTSUBMITORDERFORSECONDUSER,
            params: {
                cOrderNo: orderNo
            },
            success: function(data) {
                200 == data.code && (myApp.toast("提交订单成功", "success").show(!0),
                myApp.mainView.router.back())
            },
            error: function(data) {
                myApp.toast(data.message, "error").show(!0)
            }
        })
    },
    openEvent: function(orderNo, detailId, callback) {
        cb.confirm("是否确定要打开此条订单行？", "提示信息", function() {
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_OPEN,
                params: {
                    cOrderNo: orderNo,
                    iOrderDetailId: detailId
                },
                success: function(data) {
                    200 == data.code && (myApp.toast("订单行打开成功", "success").show(!0),
                    detailId && callback ? callback() : myApp.mainView.router.back())
                },
                error: function(data) {
                    myApp.toast(data.message, "error").show(!0)
                }
            })
        })
    },
    moreEvent: function($this) {
        var self = this
          , popoverHTML = '<div class="popover pop-choose-buttons"><div class="popover-inner"><div class="list-block"><ul>';
        $$(this.pageContainer).find(".orderInfoToolbarContainer").children("a.hide").each(function() {
            var button = $$(this);
            popoverHTML += '<li><a href="#" class="item-link list-button close-popover" data-btntype="' + button.attr("data-btntype") + '">' + button.text() + "</li>"
        }),
        popoverHTML += "</ul></div></div></div>",
        myApp.popover(popoverHTML, $this),
        $$(".popover.pop-choose-buttons .item-link").on("click", function(e) {
            var btntype = $$(this).attr("data-btntype");
            setTimeout(function() {
                $$(self.pageContainer).find(".orderInfoToolbarContainer").children("a[data-btntype=" + btntype + "]").trigger("click")
            }, 100)
        })
    },
    closeEvent: function(orderNo, detailId, callback) {
        myApp.popup('<div class="popup popup-cancel" style="height:45%"><div class="header"><a href="#" class="close-popup"><i class="icon icon-left-close"></i></a>关闭原因</div><div class="content"><textarea rows="12" cols="20" placeholder="请输入关闭原因"></textarea></div><div class="footer" style="position:absolute;bottom:0;"><a href="#" class="button submit">确定</a></div></div>'),
        $$(".popup-cancel").once("opened", function() {
            function submitClick() {
                var cMemo = $$(".popup-cancel").find("textarea").val();
                cMemo ? cb.rest.postData({
                    url: cb.router.HTTP_ORDER_CLOSE,
                    params: {
                        cOrderNo: orderNo,
                        iOrderDetailId: detailId,
                        cMemo: cMemo
                    },
                    success: function(data) {
                        200 == data.code && (myApp.toast("订单关闭成功", "success").show(!0),
                        $$(".popup-cancel").find("textarea").val(""),
                        myApp.closeModal(".popup-cancel"),
                        detailId && callback ? callback() : myApp.mainView.router.back())
                    },
                    error: function(err) {
                        myApp.toast(err.message, "error").show(!0)
                    }
                }) : myApp.toast("请输入关闭原因", "tips").show(!0)
            }
            var self = this;
            $$(".popup-cancel").find(".button.submit").off("click", submitClick),
            $$(".popup-cancel").find(".button.submit").on("click", submitClick),
            $$(".popup-cancel").find("textarea").on("click", function() {
                myApp.device.android && 0 === upcommon.winResizeHandlers.length && upcommon.winResizeHandlers.push(function() {
                    !function() {
                        $$(".popup-cancel .button.submit").addClass("hidden"),
                        window.setTimeout(function() {
                            upcommon.winResizeHandlers.push(function() {
                                $$(".popup-cancel .button.submit").removeClass("hidden")
                            })
                        }, 500)
                    }
                    .apply(self)
                })
            })
        })
    },
    cancelEvent: function(orderNo) {
        myApp.popup('<div class="popup popup-cancel" style="height:45%"><div class="header"><a href="#" class="close-popup"><i class="icon icon-left-close"></i></a>取消原因</div><div class="content"><textarea rows="12" cols="20" placeholder="请输入取消原因"></textarea></div><div class="footer" style="position:absolute;bottom:0;"><a href="#" class="button submit">确定</a></div></div>'),
        $$(".popup-cancel").once("opened", function() {
            function submitClick() {
                var cMemo = $$(".popup-cancel").find("textarea").val()
                  , params = {
                    cOrderNo: orderNo,
                    iOrderDetailId: detailId,
                    cMemo: cMemo
                };
                cMemo ? cb.rest.postData({
                    url: cb.router.HTTP_ORDER_CLOSE,
                    params: params,
                    success: function(data) {
                        200 == data.code && (myApp.toast("订单关闭成功", "success").show(!0),
                        $$(".popup-cancel").find("textarea").val(""),
                        myApp.closeModal(".popup-cancel"),
                        detailId && callback ? callback() : myApp.mainView.router.back())
                    },
                    error: function(err) {
                        myApp.toast(err.message, "error").show(!0)
                    }
                }) : myApp.toast("请输入关闭原因", "tips").show(!0)
            }
            var self = this;
            $$(".popup-cancel").find(".button.submit").off("click", submitClick),
            $$(".popup-cancel").find(".button.submit").on("click", submitClick),
            $$(".popup-cancel").find("textarea").on("click", function() {
                myApp.device.android && 0 === upcommon.winResizeHandlers.length && upcommon.winResizeHandlers.push(function() {
                    !function() {
                        $$(".popup-cancel .button.submit").addClass("hidden"),
                        window.setTimeout(function() {
                            upcommon.winResizeHandlers.push(function() {
                                $$(".popup-cancel .button.submit").removeClass("hidden")
                            })
                        }, 500)
                    }
                    .apply(self)
                })
            })
        })
    },
    delEvent: function(orderNo) {
        var self = this;
        cb.confirm("是否确定要删除此条订单信息？", "提示信息", function() {
            var param;
            "u8c" === cb.rest.runtime.env ? (self.context.data.order.code = orderNo,
            param = {
                billnum: "voucher_order",
                data: self.context.data.order
            },
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_DEL_YS,
                showPreloader: !0,
                params: param,
                success: function(data) {
                    200 == data.code && (myApp.toast("删除订单成功", "success").show(!0),
                    myApp.mainView.router.back())
                },
                error: function(data) {
                    myApp.toast(data.message, "error").show(!0)
                }
            })) : (param = {
                cOrderNo: orderNo
            },
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_DEL,
                params: param,
                success: function(data) {
                    200 == data.code && (myApp.toast("删除订单成功", "success").show(!0),
                    myApp.mainView.router.back())
                },
                error: function(data) {
                    myApp.toast(data.message, "error").show(!0)
                }
            }))
        })
    },
    opposeEvent: function(orderNo) {
        myApp.popup('<div class="popup popup-oppose"><div class="header"><a href="#" class="close-popup"><i class="icon icon-left-close"></i></a>驳回理由</div><div class="content"><textarea rows="12" cols="20" placeholder="请输入驳回理由"></textarea></div><div class="footer" style="position:absolute;bottom:0;"><a href="#" class="button submit">确定</a></div></div>'),
        $$(".popup-oppose").once("opened", function() {
            function submitClick() {
                var cMemo = $$(".popup-oppose").find("textarea").val();
                cMemo ? cb.rest.postData({
                    url: cb.router.HTTP_ORDER_OPPOSE,
                    params: {
                        cOrderNo: orderNo,
                        opposeMemo: cMemo
                    },
                    success: function(data) {
                        200 == data.code && (myApp.toast("驳回成功", "success").show(!0),
                        $$(".popup-oppose").find("textarea").val(""),
                        myApp.closeModal(".popup-oppose"),
                        myApp.mainView.router.back())
                    },
                    error: function(err) {
                        myApp.toast(err.message, "error").show(!0)
                    }
                }) : myApp.toast("请输入驳回理由", "tips").show(!0)
            }
            $$(".popup-oppose").find("textarea").focus(function() {
                window.plus && $$(this).parents(".popup-oppose").addClass("active")
            }),
            $$(".popup-oppose").find(".button.submit").off("click", submitClick),
            $$(".popup-oppose").find(".button.submit").on("click", submitClick)
        })
    },
    confirmBack: function(orderNo) {
        var param = {
            cOrderNo: orderNo
        };
        cb.rest.postData({
            url: cb.router.HTTP_ORDER_CONFIRMBACK.format(orderNo),
            params: param,
            success: function(data) {
                myApp.toast("回退订单成功", "success").show(!0),
                myApp.mainView.router.back()
            },
            error: function(data) {
                myApp.toast(data.message, "error").show(!0)
            }
        })
    },
    addCart: function() {
        var postData = []
          , groups = this.context.data.renderData.details.groups
          , products = this.context.data.renderData.details.products;
        groups.forEach(function(item) {
            for (var i = 0; i < item.products.length; i++) {
                var curr = item.products[i];
                if ("SALE" == curr.cOrderProductType)
                    for (var j = 0; j < curr.SkuSpecItems.length; j++) {
                        var currSku = curr.SkuSpecItems[j];
                        postData.push({
                            iSKUId: currSku.iSKUId,
                            iComPreGroupId: item.iComPromotionGroupId,
                            iQuantity: currSku.iQuantity,
                            iAuxUnitQuantity: currSku.iAuxUnitQuantity || null,
                            bizId: currSku.bizId,
                            bizProductId: currSku.bizProductId,
                            iProductId: currSku.iProductId,
                            salesOrgId: currSku.salesOrgId
                        })
                    }
            }
        });
        for (var i = 0; i < products.length; i++) {
            var curr = products[i];
            if ("SALE" == curr.cOrderProductType)
                for (var j = 0; j < curr.SkuSpecItems.length; j++) {
                    var currSku = curr.SkuSpecItems[j];
                    postData.push({
                        iSKUId: currSku.iSKUId,
                        iQuantity: currSku.iQuantity,
                        iAuxUnitQuantity: currSku.iAuxUnitQuantity || null,
                        bizId: currSku.bizId,
                        bizProductId: currSku.bizProductId,
                        iProductId: currSku.iProductId,
                        salesOrgId: currSku.salesOrgId,
                        saleOrgId: currSku.salesOrgId
                    })
                }
        }
        var autData = cb.rest.appContext[this.context.isCorpUser ? "corpAutData" : "autData"];
        cb.rest.postData({
            url: cb.router.HTTP_SHOPPINGCART_ADD,
            params: {
                items: postData
            },
            success: function(data) {
                200 == data.code && (autData.agentProductMenu ? (cb.rest.reloadShoppingCartCount(),
                cb.confirm("您要立即查看吗?", "已移入购物车", function() {
                    $$("#homeNavBar").find("a.tab-link").removeClass("active"),
                    window.setTimeout(function() {
                        $$("#homeNavBar").find('a[href="#view-4"]').click(),
                        $$("#homeNavBar").removeClass("toolbar-hidden")
                    }, 100)
                })) : myApp.toast("已加入购物车!", "success").show(!0))
            },
            error: function(data) {
                myApp.toast(data.message, "error").show(!0)
            }
        })
    },
    defineEvent: function($this) {
        var params, name = $this.data("btntype"), $this = this.context.data.useDefines.header && this.context.data.useDefines.header.find(function(header) {
            return header.name == name
        });
        $this && $this.outerDataUrl && (params = {
            data: {
                model: this.context.data.cloneOrder,
                context: {
                    clientType: 2,
                    user: cb.rest.appContext.context
                }
            }
        },
        cb.rest.postData({
            url: cb.router.HTTP_COMMON_DEFINEBUTTONLINK.format($this.id),
            params: params,
            success: function(data) {
                "string" == typeof (data = JSON.parse(data)) && (data = JSON.parse(data)),
                myApp.toast(data.data || data.message, "tips").show(!0)
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        }))
    },
    submit: {
        getExceedInventoryOrder: function($this) {
            var self = this
              , queryParam = ($this.addClass("hide"),
            {
                cOrderNo: this.context.data.order.cOrderNo,
                cAction: "CONFIRM",
                salesOrgId: this.context.data.order.salesOrgId,
                skuArray: []
            });
            this.context.data.order.oOrderDetails.map(function(item) {
                queryParam.skuArray.push({
                    iProductId: item.iProductId,
                    iSKUId: item.iSKUId,
                    iQuantity: item.iQuantity,
                    bizId: item.bizId,
                    iStockId: item.iStockId || null,
                    stockOrgId: item.stockOrgId,
                    salesOrgId: item.salesOrgId
                })
            }),
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_GETEXCEEDINVENTORYORDER.format(queryParam.cAction, queryParam.cOrderNo, !!self.context.data.order.presaleId),
                params: {
                    productJson: queryParam.skuArray
                },
                success: function(data) {
                    "true" === data.data.isControl || !0 === data.data.isControl ? data.data.isExceed ? (data.data.message && 80 < data.data.message.length && (data.data.message = data.data.message.substring(0, 80) + "..."),
                    myApp.toast(data.data.message, "tips").show(!0),
                    $this.removeClass("hide")) : self.event.submit.checkCareditWorth.call(self, $this) : "false" === data.data.isControl || !1 === data.data.isControl ? data.data.isExceed ? cb.confirm(data.data.message, "提示信息", function() {
                        self.event.submit.checkCareditWorth.call(self, $this)
                    }, function() {
                        $this.removeClass("hide")
                    }) : self.event.submit.checkCareditWorth.call(self, $this) : "none" === data.data.isControl && self.event.submit.checkCareditWorth.call(self, $this)
                }
            })
        },
        checkCareditWorth: function($this) {
            var self = this
              , creditworthCode = cb.bizFunctionOptions[this.context.data.order.bizId] && cb.bizFunctionOptions[this.context.data.order.bizId].CREDITWORTHREMIND
              , careditWorth = (!1 === (creditworthCode = !0 === creditworthCode ? "true" : creditworthCode) && (creditworthCode = "false"),
            this.context.data.order.oAgent.iCusCreLine || 0)
              , reditworthiness = this.context.data.order.oAgent.iCreditValue || 0
              , params = {
                bizId: this.context.data.order.bizId
            };
            this.context.data.order.salesOrgId && (params.orgId = this.context.data.order.salesOrgId),
            self.context.isCorpUser && (params.iAgentId = this.context.data.order.oAgent.id),
            cb.rest.getJSON({
                url: cb.router.HTTP_AGENT_CREDITCTRLUSE.format(params.iAgentId, params.bizId),
                params: params,
                success: function(data) {
                    var msg;
                    data.data && 200 == data.code && (data.data.oAgent && null !== data.data.oAgent.iCreditValue && (reditworthiness = data.data.oAgent.iCreditValue),
                    !(data.data.creditCtrl && reditworthiness < self.context.data.cloneOrder.fPayMoney && "false" != creditworthCode && "DELIVERYCONTROL" != creditworthCode) ? self.event.submit.submitOrderFunc.call(self, $this) : "true" == creditworthCode ? (msg = "您的信用额度为：" + careditWorth + "，当前余额是：" + reditworthiness + "，该订单提交会超出信用额度，是否确认提交该订单？",
                    setTimeout(function() {
                        cb.confirm(msg, "提示信息", function() {
                            self.event.submit.submitOrderFunc.call(self, $this)
                        }, function() {
                            $this.removeClass("hide")
                        })
                    }, 200)) : "ALLCONTROL" == creditworthCode || "ORDERCONTROL" == creditworthCode ? (msg = "您的信用额度是:" + careditWorth + ",当前余额是:" + reditworthiness + ",该订单提交会超出信用余额，不能提交该订单!",
                    myApp.modal({
                        title: '<div class="common-tips-title"><i class="icon icon-warning"></i><span>提示信息</span></div>',
                        text: '<div class="common-tips-content"><div class="tips-info">' + msg + '</div><div class="tips-manage"><span>您还可以</span></div></div>',
                        buttons: [{
                            text: "我知道了",
                            onClick: function() {
                                myApp.closeModal(),
                                $this.removeClass("hide")
                            }
                        }]
                    })) : myApp.toast("获取业务选项失败", "tips").show(!0))
                },
                error: function(err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            })
        },
        submitOrderFunc: function($this) {
            var self = this
              , query = {
                orderNos: [this.context.data.order.cOrderNo],
                isVerify: !0,
                showPreloader: !0
            };
            cb.FunctionOptions.ORDERPRICECHECK ? cb.rest.postData({
                url: cb.router.HTTP_ORDER_ORDERBATCHCONFIRM.format(query.isVerify),
                params: query,
                showPreloader: !0,
                success: function(data) {
                    myApp.toast("确认订单成功!", "success").show(!0),
                    myApp.mainView.router.back()
                },
                error: function(e) {
                    987 == e.code ? cb.confirm(e.message + "，是否继续确认订单？", "提示信息", function() {
                        cb.rest.postData({
                            url: cb.router.HTTP_ORDER_ORDERBATCHCONFIRM.format(!query.isVerify),
                            params: {
                                orderNos: [self.context.data.order.cOrderNo],
                                isVerify: !1
                            },
                            showPreloader: !0,
                            success: function(data) {
                                myApp.toast("确认订单成功!", "success").show(!0),
                                myApp.mainView.router.back()
                            },
                            error: function(err) {
                                myApp.toast(err.message, "tips").show(!0)
                            }
                        })
                    }, function() {
                        $this.removeClass("hide")
                    }, "确认订单", "取消") : ($this.removeClass("hide"),
                    myApp.toast(e.message, "tips").show(!0))
                }
            }) : cb.rest.postData({
                url: cb.router.HTTP_ORDER_ORDERBATCHCONFIRM.format(query.isVerify),
                params: query,
                showPreloader: !0,
                success: function(data) {
                    myApp.toast("确认订单成功!", "success").show(!0),
                    myApp.mainView.router.back()
                }
            })
        }
    },
    batchDelivery: function(target) {
        var self = this;
        cb.rest.postData({
            url: cb.router.HTTP_DELIVERY_BATCHDELIVERY,
            params: {
                orderNos: [self.context.data.order.cOrderNo]
            },
            success: function(data) {
                data.data && (data.data.success && (self.load.order.call(self),
                target.remove(),
                setTimeout(function() {
                    self.load.deliverys.call(self, function() {
                        this.context.isNativePrint && this.load.getDeliveryPrintData.call(this)
                    })
                }, 2e3)),
                data.data.error) && myApp.toast(data.data.responseWrappers[0].message, "tips").show(!0)
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    },
    batchPayments: function() {
        var self = this;
        cb.rest.postData({
            url: cb.router.HTTP_PAYMENT_ONEKEYPAYMENT,
            params: {
                voucherNos: [self.context.data.order.cOrderNo]
            },
            success: function(data) {
                200 === data.code && (myApp.toast("收款成功", "success").show(!0),
                self.load.getPayListByOrder.call(self),
                self.load.order.call(self))
            },
            error: function(e) {
                myApp.toast(e.message, "error").show(!0)
            }
        })
    },
    confirmPayment: function(id) {
        var self = this;
        cb.rest.postData({
            url: cb.router.HTTP_PAYMENT_CONFIRM,
            showPreloader: !0,
            params: {
                paymentId: id
            },
            success: function(data) {
                200 == data.code && (myApp.toast("确认成功!", "success").show(!0),
                self.load.getPayListByOrder.call(self),
                self.load.order.call(self))
            },
            error: function(data) {
                myApp.toast(data.message, "error").show(!0)
            }
        })
    },
    deliveryConfirm: function() {
        var self = this;
        cb.confirm("是否确认发货？", "提示信息", function() {
            cb.rest.postData({
                url: cb.router.HTTP_DELIVERY_CONFIRM,
                showPreloader: !0,
                params: {
                    cDeliveryNos: [self.context.data.deliverys[0].cDeliveryNo]
                },
                success: function(data) {
                    myApp.toast("审核发货单成功", "success").show(!0),
                    myApp.mainView.router.back()
                },
                error: function(data) {
                    myApp.toast(data.message, "error").show(!0)
                }
            })
        })
    },
    deliveryUnConfirm: function() {
        var self = this;
        cb.confirm("是否确认弃审？", "提示信息", function() {
            cb.rest.postData({
                url: cb.router.HTTP_DELIVERY_BACK,
                showPreloader: !0,
                params: {
                    cDeliveryNo: self.context.data.deliverys[0].cDeliveryNo
                },
                success: function(data) {
                    myApp.toast("弃审发货单成功", "success").show(!0),
                    myApp.mainView.router.back()
                },
                error: function(data) {
                    myApp.toast(data.message, "error").show(!0)
                }
            })
        })
    },
    loadBizs: function() {
        var self = this;
        cb.rest.getJSON({
            url: cb.router.HTTP_ORGINAZATION_GETLIST,
            success: function(data) {
                data.data && (self.context.bizs = data.data || [])
            },
            error: function(e) {
                myApp.toast(e.massage, "error").show(!0)
            }
        })
    }
};
