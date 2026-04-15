
return {
    beforePreProcess: function (content, url) {
        //beforePreProcess 页面初始化之前，可在此进行模版修改 or 定义新的参数
        UOrderApp.pages.OrdersListController.prototype.getOrderbtnByStatus = function(orderType, orderInfo) {
            var buttons = new Array;
            switch (orderType) {
                case "salesOrder":
                    "CONFIRMORDER" == orderInfo.cNextStatus  && ("FINISHPAYMENT" != orderInfo.cPayStatusCode && cb.rest.appContext.autData.agentOrderModify && cb.rest.isNonfreezeAccount() && buttons.push({
                        class: "",
                        type: "edit",
                        name: "编辑"
                    }),
                        cb.rest.appContext.autData.agentOrderDel) && buttons.push({
                        class: "",
                        type: "del",
                        name: "删除"
                    }),
                    "SUBMITORDER" == orderInfo.cNextStatus && "FINISHPAYMENT" != orderInfo.cPayStatusCode &&(cb.rest.appContext.autData.agentOrderModify && cb.rest.isNonfreezeAccount() && buttons.push({
                        class: "",
                        type: "edit",
                        name: "编辑"
                    }),
                        cb.rest.appContext.autData.agentOrderSubmit) && cb.rest.isNonfreezeAccount() && buttons.push({
                        class: "submitfor-btn",
                        type: "submitfor",
                        name: "提交"
                    }),
                    (this.isCorpUser ? cb.rest.appContext.isRelationOrder || !cb.rest.appContext.corpAutData.orderPay : !cb.rest.appContext.autData.agentOrderPay) || !orderInfo.isShowPayBtn || this.isHidePrice || "FINISHPAYMENT" == orderInfo.cPayStatusCode || "CONFIRMPAYMENT_ALL" == orderInfo.cPayStatusCode || cb.bizFunctionOptions[orderInfo.bizId] && cb.bizFunctionOptions[orderInfo.bizId].ORDERPAYFORCONFIRM && ("CONFIRMORDER" == orderInfo.cNextStatus || "SUBMITORDER" == orderInfo.cNextStatus) || buttons.push({
                        class: "btn-payfor",
                        type: "payfor",
                        name: "去付款"
                    }),
                    ("TAKEDELIVERY" == orderInfo.cNextStatus || "DELIVERY_TAKE_PART" == orderInfo.cNextStatus || orderInfo.isDeliverying) && (orderInfo.isShowSaleReturnBtn && cb.rest.appContext.autData.agentOrderReturns && buttons.push({
                        class: "btn-red",
                        type: "SaleReturn",
                        name: "退货"
                    }),
                        orderInfo.isShowTakeDeliveryBtn) && "u8c" === cb.rest.runtime.env && cb.rest.appContext.autData.orderConfirmDelivery && buttons.push({
                        class: "btn-red",
                        type: "TakeDelivery",
                        name: "确认收货"
                    }),
                    "ENDORDER" == orderInfo.cNextStatus && !this.isCorpUser && orderInfo.isShowSaleReturnBtn && cb.rest.appContext.autData.agentOrderReturns && buttons.push({
                        class: "btn-red",
                        type: "SaleReturn",
                        name: "退货"
                    });
                    break;
                case "expenseOrders":
                    var auths = cb.rest.appContext[this.isCorpUser ? "corpAutData" : "autData"];
                    cb.rest.appContext.isAgentOrder || this.isCorpUser;
                    break;
                case "saleReturnOrder":
                    auths = cb.rest.appContext[this.isCorpUser ? "corpAutData" : "autData"];
                    if (!cb.rest.appContext.isAgentOrder && !this.isCorpUser)
                        switch (orderInfo.cSaleReturnStatus) {
                            case "SUBMITSALERETURN":
                                buttons.push({
                                    type: "edit",
                                    btnText: "编辑",
                                    auth: auths.agentOrderReturnEdit
                                }),
                                    buttons.push({
                                        type: "delete",
                                        btnText: "删除",
                                        auth: auths.agentOrderReturnDel
                                    });
                                break;
                            case "CONFIRMSALERETURNORDER":
                                buttons.push({
                                    type: "return",
                                    btnText: "退货",
                                    auth: auths.agentOrderReturns
                                })
                        }
            }
            return buttons
        }

    },
    beforePageInit: function (page) {
    },
    afterPageInit: function (page) {
        // 该事件时  Dom已ready 但已执行当前页面固有逻辑
    },
    beforePageBack: function (page) {
        // 页面回退之前
    },
    afterPageBack: function (page) {
        // 页面回退之后
    }
};