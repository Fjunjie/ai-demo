
return {
    beforePreProcess: function (content, url) {
        //beforePreProcess 页面初始化之前，可在此进行模版修改 or 定义新的参数
        this.tool .toolbar = function() {
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
        };
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