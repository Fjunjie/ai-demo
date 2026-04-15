
return {
    beforePreProcess: function (content, url) {
        //beforePreProcess
        UOrderApp.pages.EditOrderDetailController.prototype.rebateAuto = function (orderInfo) {
            var self = this
                , fSalePayMoney = 0
                , params = (self.newOrder.oOrderDetails && self.newOrder.oOrderDetails.forEach(function (v) {
                "SALE" != v.cOrderProductType && "GIFT" != v.cOrderProductType || (fSalePayMoney += v.fOrderRealMoney)
            }),
                fSalePayMoney += orderInfo.fRebateMoney,
                {
                    fPayMoney: orderInfo.fPayMoney,
                    fMaxRebateMoney: orderInfo.fMaxRebateMoney,
                    bizId: orderInfo.bizId,
                    fRebateMoney: orderInfo.fRebateMoney,
                    fRebateCashMoney: orderInfo.fRebateCashMoney,
                    maxRebateRuleMoney: orderInfo.fMaxRebateRuleMoney,
                    fMaxRebateMoney: orderInfo.fMaxRebateMoney,
                    reight: orderInfo.fReight,
                    fSalePayMoney: fSalePayMoney
                });
            orderInfo.cOrderNo && (params.cOrderNo = orderInfo.cOrderNo),
            self.temp.isCorpUser && (params.iAgentId = self.newOrder.iAgentId),
                cb.rest.getJSON({
                    url: cb.router.HTTP_REBATE_GETUSABLEPRICE,
                    params: params,
                    success: function (updata) {
                        var tipstxt;
                        200 == updata.code && updata.data && (self.orderMaxRebateMoney = updata.data.orderMaxRebateMoney,
                            orderInfo.isCanUsedRebate)
                        // && (updata.data.displayAvailableRebateTips ? self.selectors.rebateContainer.find(".rabate-tip").addClass("hide").text("") : (tipstxt = "",
                        //     tipstxt = orderInfo.isCanUsedRebate ? "该订单可用的最大折扣为" + updata.data.surplusMaxRebateMoney + "元,最大抵现为" + updata.data.surplusCashMaxRebateMoney + "元" : "该订单金额未达到" + orderInfo.fMiniRebateRuleMoney + "元，不能使用返利！",
                        //     self.selectors.rebateContainer.find(".rabate-tip").removeClass("hide").text(tipstxt)),
                        //     self.selectors.rebateContainer.find("#spanUseableM").parent().html('本次使用 <span id="spanUseableM" class="active-state">' + updata.data.totalRebateMoney + "</span> 元返利"),
                        //     self.selectors.rebateContainer.find("#spanUseableM").on("click", function () {
                        //         var rebateAmount = cb.cache.get("rebateAmount") || {
                        //             resultArray: self.tool.initOrderRebate(orderInfo)
                        //         };
                        //         myApp.mainView.router.loadPage({
                        //             url: "pages/rebateSelect.html",
                        //             query: {
                        //                 type: "select",
                        //                 selectItems: rebateAmount,
                        //                 orderInfo: self.newOrder,
                        //                 rebateControl: {
                        //                     orderMaxRebateMoney: updata.data.orderMaxRebateMoney,
                        //                     orderCashMaxRebateMoney: updata.data.orderCashMaxRebateMoney,
                        //                     fPayMoney: cb.utils.FloatCalc.sub(orderInfo.fPayMoney, orderInfo.fReight)
                        //                 }
                        //             }
                        //         })
                        //     }));
                        // 自动跳转页面支付
                        // 1.1 查询返利信息
                        cb.rest.postData({
                            showPreloader: !0,
                            url: cb.router.HTTP_REBATE_GETUSABLEREBATES.format(cb.rest.runtime.pageConfig && cb.rest.runtime.pageConfig.rebateSelect && cb.rest.runtime.pageConfig.rebateSelect.pageSize || 10, 1),
                            params: self.newOrder,
                            success: function (data) {
                                var dataContent = data.data.content
                                // 组装params
                                var params = {
                                    maxRebateMoney: self.newOrder.fMaxRebateMoney,
                                    maxRebateRuleMoney: self.newOrder.fMaxRebateRuleMoney,
                                    orderMaxRebateMoney: updata.data.orderMaxRebateMoney,
                                    orderCashMaxRebateMoney: updata.data.orderCashMaxRebateMoney,
                                    rebateIds: [],
                                    usedRebates: [],
                                    orderNo: self.newOrder.cOrderNo || null
                                }
                                // 处理参数
                                dataContent.map(function (item) {
                                    "NUMBERPRODUCT" != item.cUseWayCode && params.rebateIds.indexOf(item.id) < 0 && params.rebateIds.push(item.id)
                                })
                                // 1.2 自动计算返利金额
                                cb.rest.postData({
                                    url: cb.router.HTTP_REBATE_REBATEAUTOUSED,
                                    params: {
                                        rebateAutoUsedVo: params
                                    },
                                    success: function (data) {
                                        var total = {
                                            TOPRODUCT: 0,
                                            TOORDER: 0,
                                            TOCASH: 0,
                                            allRebateMoney: 0,
                                            isPass: !0,
                                            resultArray: []
                                        };
                                        200 == data.code && $$.isArray(data.data) && (data.data.map(function (rebate) {
                                            var currentRebate = dataContent.find(item => item.id == rebate.rebateId)
                                            if (currentRebate) {
                                                var fOrderRebateMoney = rebate.orderRebateMoney,
                                                    cUseWayCode = currentRebate.cUseWayCode;
                                                if (currentRebate.fOrderRebateMoney = parseFloat(fOrderRebateMoney) || 0,
                                                    fOrderRebateMoney) {
                                                    switch (total.allRebateMoney = cb.utils.FloatCalc.add(fOrderRebateMoney, total.allRebateMoney),
                                                        cUseWayCode) {
                                                        case "TOPRODUCT":
                                                            total.TOPRODUCT = cb.utils.FloatCalc.add(fOrderRebateMoney, total.TOPRODUCT);
                                                            break;
                                                        case "TOORDER":
                                                            total.TOORDER = cb.utils.FloatCalc.add(fOrderRebateMoney, total.TOORDER);
                                                            break;
                                                        case "TOCASH":
                                                            total.TOCASH = cb.utils.FloatCalc.add(fOrderRebateMoney, total.TOCASH)
                                                    }
                                                    total.resultArray.push(currentRebate)
                                                }
                                            }
                                        }));
                                        // 1.3 填入返利信息
                                        var rebateAmount = {
                                            rebateData: {
                                                rebateAmount: total.allRebateMoney,
                                                resultArray: total.resultArray,
                                            }
                                        }
                                        cb.cache.set("rebateAmount", rebateAmount);
                                        var param = {
                                            order: self.temp.isHidePrice ? self.cloneOrder : self.newOrder
                                        };
                                        if (cb.cache.get("order") && (param.order = cb.cache.get("order")),
                                            $$.isArray(rebateAmount.rebateData.resultArray)) {
                                            if (self.tool.mergeOrderRebate.call(self, param.order, rebateAmount.rebateData.resultArray),
                                                param.order.fRebateMoney = 0,
                                                param.order.fRebateCashMoney = 0,
                                                param.order.oRebates)
                                                for (i = 0; i < param.order.oRebates.length; i++)
                                                    "NUMBERPRODUCT" != (attrValue = param.order.oRebates[i]).cUseWayCode && "AMOUNTPRODUCT" != attrValue.cUseWayCode && ("TOCASH" != attrValue.cUseWayCode ? param.order.fRebateMoney = cb.utils.FloatCalc.add(param.order.fRebateMoney, attrValue.fOrderRebateMoney) : param.order.fRebateCashMoney = cb.utils.FloatCalc.add(param.order.fRebateCashMoney, attrValue.fOrderRebateMoney));
                                            param.order.oOrderDetails.forEach(function (detail) {
                                                detail.idKey || (detail.idKey = cb.utils.getGUID()),
                                                "REBATE" == detail.cOrderProductType && (param.order.fRebateMoney = cb.utils.FloatCalc.add(param.order.fRebateMoney, detail.fSaleCost))
                                            })
                                        }
                                        self.selectors.rebateContainer.find("#spanUseableM").text(cb.utils.FloatCalc.add(param.order.fRebateMoney, param.order.fRebateCashMoney)),
                                            param.order = self.tool.fillDefines(param.order),
                                            self.load.calcOrderRebate.call(self, {
                                                loadRebate: !0,
                                                order: param.order
                                            })

                                    },
                                    error: function (error) {
                                        myApp.toast(error.message, "error").show(!0)
                                    }
                                });
                            }
                        })
                    }
                });
        }
        this.load.orderDetail = function () {
            var self = this
                , params = {}
                , url = this.context.cOrderNo ? cb.router.HTTP_ORDER_GETORDERDETAIL : cb.router.HTTP_ORDER_GETNEWORDER;
            this.context.cOrderNo && (params.cOrderNo = this.context.cOrderNo),
            "add" == this.context.type && (params.source = "copyOrder"),
                cb.rest.getJSON({
                    url: url,
                    params: params,
                    success: function (data) {
                        200 == data.code && data.data && (self.newOrder = data.data,
                        self.context.cOrderNo && self.newOrder.oRebates && self.newOrder.oRebates.forEach(function (item) {
                            item.originFOrderRebateMoney = item.fOrderRebateMoney
                        }),
                            self.tool.formatSuitGroup.call(self, data.data),
                            cb.rest.postData({
                                url: cb.router.HTTP_PRODUCT_ISHAVEPROMOTION,
                                params: [{
                                    bizId: data.data.bizId,
                                    salesOrgId: data.data.salesOrgId
                                }],
                                success: function (res) {
                                    200 == res.code && (cb.rest.appContext.isHavePromotion = !!res.data[0].isHavePromotion,
                                    self.temp.currTypeSign && (self.newOrder.currTypeSign = self.temp.currTypeSign),
                                        self.newOrder.oOrderMemos = self.newOrder.oOrderMemos || [],
                                        self.newOrder.oAttachments = self.newOrder.oAttachments || [],
                                    self.temp.isHidePrice && (self.cloneOrder = data.oldData && data.oldData.data || {},
                                        self.cloneOrder.oAttachments = self.cloneOrder.oAttachments || []),
                                    self.newOrder.cReceiveContacterPhone && 0 < self.newOrder.cReceiveContacterPhone.indexOf(" ") && (self.newOrder.cReceiveContacterCountryCode = self.newOrder.cReceiveContacterPhone.split(" ")[0],
                                        self.newOrder.cReceiveContacterPhone = self.newOrder.cReceiveContacterPhone.split(" ")[1],
                                        self.temp.isHidePrice) && (self.cloneOrder.cReceiveContacterCountryCode = self.newOrder.cReceiveContacterPhone.split(" ")[0],
                                        self.cloneOrder.cReceiveContacterPhone = self.newOrder.cReceiveContacterPhone.split(" ")[0]),
                                        cb.cache.get("order") ? self.newOrder = self.temp.isHidePrice ? data.data : cb.cache.get("order") : cb.cache.set("order", self.temp.isHidePrice ? self.cloneOrder : self.newOrder),
                                        self.newOrder.oOrderDetails.forEach(function (detail, index) {
                                            detail.idKey || (detail.idKey = cb.utils.getGUID()),
                                            self.cloneOrder && self.newOrder.oOrderDetails && (self.cloneOrder.oOrderDetails[index].idKey = detail.idKey)
                                        }),
                                    (0 != cb.rest.appContext.context.userType || self.newOrder.cStatusCode && "SAVEORDER" != self.newOrder.cStatusCode) && self.dataPage.find(".button.confirmOrderSaveBtn").addClass("hide"),
                                        res = self.tool.format.call(self, "address"),
                                    cb.cache.get("address") || cb.cache.set("address", res),
                                    "u8c" === cb.rest.runtime.env && self.newOrder.hasOwnProperty("receiveStoreName") && (res = self.tool.format.call(self, "storeAddress"),
                                    cb.cache.get("storeAddress") || cb.cache.set("storeAddress", res)),
                                        res = self.tool.format.call(self, "baseInfo"),
                                    cb.cache.get("baseInfo") || cb.cache.set("baseInfo", res),
                                        res = self.tool.format.call(self, "invoice"),
                                    cb.cache.get("invoice") || cb.cache.set("invoice", res),
                                        res = self.tool.format.call(self, "paywayandshipping"),
                                    cb.cache.get("paywayandshipping") || cb.cache.set("paywayandshipping", res),
                                    self.newOrder.oRebates && (res = {
                                        rebateAmount: (self.temp.isHidePrice ? self.cloneOrder : self.newOrder).oRebates,
                                        resultArray: self.tool.initOrderRebate(self.temp.isHidePrice ? self.cloneOrder : self.newOrder)
                                    },
                                        cb.cache.set("rebateAmount", res)),
                                    cb.FunctionOptions.OPENCOUPONS && cb.FunctionOptions.AGENTSYNCUHY && self.load.coupons.call(self),
                                        self.load.defines.call(self, function () {
                                            self.tool.initDefines.call(self),
                                                self.selectors.toolBarButtons.removeClass("hide"),
                                                self.tool.defineButtons.call(self);
                                            var productList = {
                                                isPreSaleOrder: !!self.newOrder.presaleId || "GROUPBUY" == self.newOrder.promotionType || "SECKILL" == self.newOrder.promotionType,
                                                isNewOrder: !self.newOrder.cOrderNo,
                                                isHideMondiyDetail: self.newOrder.cSeparatePromotionType && "old" == self.newOrder.cSeparatePromotionType,
                                                detailData: self.FormatDetailDataFunc(self.newOrder.oOrderDetails, self.newOrder.oOrderDetailGroups),
                                                isNotCorp: !self.temp.isCorpUser || cb.rest.appContext.isAgentOrder,
                                                isHidePrice: self.temp.isHidePrice,
                                                hideOrderPromotion: cb.FunctionOptions.HIDEPORDERROMOTION,
                                                orderAgentModifyPrice: self.temp.isCorpUser ? !cb.rest.appContext.isAgentOrder && !cb.bizFunctionOptions[cb.rest.appContext.context.bizId].FORBIDCORPMODIFYORDERPRICE : cb.FunctionOptions.ORDERAGENTMODIFYPRICE,
                                                isYs: "u8c" === cb.rest.runtime.env,
                                                isAbled: cb.FunctionOptions.ALLOWCHOOSETERMINALSTORE
                                            };
                                            "GROUPBUY" != self.newOrder.promotionType && "SECKILL" != self.newOrder.promotionType || self.selectors.manualChooseGift.addClass("hide"),
                                            productList.isHideMondiyDetail && (productList.orderAgentModifyPrice = !1,
                                                self.selectors.manualChooseGift.addClass("hide")),
                                                self.selectors.productDetailContainer.html(self.productDetailFunc(productList)),
                                                self.render(),
                                                self.IsShowChangeGift(data),
                                                cb.rest.getJSON({
                                                    url: cb.router.HTTP_AGENT_DIRECTRELATIONEXIST.format(self.newOrder.iAgentId),
                                                    success: function (re) {
                                                        200 == re.code && (self.context.isShowPoints = re.data ? "BOTH" == cb.FunctionOptions.OPENDIRECTRELATIONMEMBER || "USEORDER" == cb.FunctionOptions.OPENDIRECTRELATIONMEMBER : cb.FunctionOptions.OPENINDIRECTRELATIONMEMBER,
                                                            self.IsShowUsePoint(self.newOrder))
                                                    },
                                                    error: function (e) {
                                                        myApp.toast(e.message, "error").show(!0),
                                                            $$(self.temp.page.container).find(".integration-box").addClass("hide")
                                                    }
                                                }),
                                            self.temp.isHidePrice || self.newOrder.bBizs || (self.load.rebate.call(self, self.newOrder),
                                                self.newOrder.fRebateTotalMoney = cb.utils.FloatCalc.add(self.newOrder.fRebateMoney, self.newOrder.fRebateCashMoney),
                                                self.selectors.rebateContainer.find("#spanUseableM").text(self.newOrder.fRebateTotalMoney)),
                                                self.newOrder.isHidePrice = self.temp.isHidePrice,
                                                self.newOrder.isHideMondiyDetail = self.newOrder.cSeparatePromotionType && "old" == self.newOrder.cSeparatePromotionType,
                                                self.newOrder = self.tool.choosePromotions.call(self, self.newOrder),
                                                self.newOrder.isShowRebate = "u8c" != cb.rest.runtime.env,
                                                self.newOrder.isYs = "u8c" === cb.rest.runtime.env,
                                                self.selectors.rebateContainer.html(self.productPartInfoFunc(self.newOrder)),
                                            self.page && self.page.query && self.page.query.isCheck && "u8c" == cb.rest.runtime.env && (self.selectors.rebateContainer.find(".rebateClass")[0].checked = !0),
                                                setTimeout(function () {
                                                    myApp.initImagesLazyLoad(self.dataPage)
                                                }, 100)
                                        }))
                                    self.rebateAuto.call(self,self.newOrder)
                                }
                            }))
                    },
                    error: function (err) {
                        myApp.toast(err.message, "error").show(!0)
                    }
                })
        }
        this.load.computePromotion = function (options) {
            var arr, self = this, needAddCartProds = (options = options || {},
                new Array), param = (self.newOrder.oOrderDetailGroups && self.newOrder.oOrderDetailGroups.length && (arr = self.newOrder.oOrderDetailGroups.filter(function (v) {
                return !v.suiteGroup
            }),
                self.newOrder.oOrderDetailGroups = arr),
                {
                    order: this.temp.isHidePrice ? this.cloneOrder : self.newOrder
                }), isHasNomalProduct = !1, isDelete = !1;
            if (this.selectors.productDetailContainer.find('li.productItemContent input[type="checkbox"]:checked').each(function (item) {
                for (var pid = $$(this).attr("data-productid"), skuid = $$(this).attr("data-skuid"), gid = $$(this).data("gid"), idKey = $$(this).attr("data-idkey"), i = param.order.oOrderDetails.length - 1; 0 <= i; i--) {
                    var delProd, detail = param.order.oOrderDetails[i];
                    $$(this).hasClass("com-cbox") ? "suit" == $$(this).attr("data-type") ? detail.suiteGroup == gid && ("SALE" == param.order.oOrderDetails[i].cOrderProductType && (isHasNomalProduct = !0),
                        isDelete = !0,
                        delProd = param.order.oOrderDetails.splice(i, 1),
                        options.isAddCart) && needAddCartProds.push.apply(needAddCartProds, delProd) : $$(this).attr("data-index") == detail.iGroupIndex && ("SALE" == param.order.oOrderDetails[i].cOrderProductType && (isHasNomalProduct = !0),
                        isDelete = !0,
                        delProd = param.order.oOrderDetails.splice(i, 1),
                        options.isAddCart) && needAddCartProds.push.apply(needAddCartProds, delProd) : (idKey ? detail.idKey != idKey : detail.iProductId != pid || gid && gid != detail.iGroupIndex) || ($$(this).hasClass("pro-cbox") && ("SALE" == param.order.oOrderDetails[i].cOrderProductType && (isHasNomalProduct = !0),
                        isDelete = !0,
                        delProd = param.order.oOrderDetails.splice(i, 1),
                        options.isAddCart) && needAddCartProds.push.apply(needAddCartProds, delProd),
                    $$(this).hasClass("sku-cbox") && detail.iSKUId == skuid && ("SALE" == param.order.oOrderDetails[i].cOrderProductType && (isHasNomalProduct = !0),
                        isDelete = !0,
                        delProd = param.order.oOrderDetails.splice(i, 1),
                        options.isAddCart) && needAddCartProds.push.apply(needAddCartProds, delProd))
                }
            }),
                isHasNomalProduct ? param.order.isOnlyEditUserAddGiveaway = !1 : isDelete && (param.order.isOnlyEditUserAddGiveaway = !0),
                param.order = self.tool.fillDefines(param.order),
                param.order = self.tool.dealRebate.call(self, param.order),
                param.order.oOrderDetails = param.order.oOrderDetails.filter(function (detail) {
                    return 0 < parseFloat(detail.iQuantity)
                }),
                param.order.isCalcPromotionBtn = self.data.isCalcPromotionBtn,
                myApp.showPreloader(),
                cb.rest.postData({
                    url: options.isChangeTax ? cb.router.HTTP_ORDER_DEALORDERTAX : cb.router.HTTP_ORDER_COMPUTEPROMOTION,
                    showPreloader: !0,
                    params: options.isChangeTax ? param : param.order,
                    success: function (data) {
                        myApp.hidePreloader(),
                        200 == data.code && (self.tool.formatSuitGroup.call(self, data.data),
                            self.temp.isHidePrice ? (self.cloneOrder = cb.utils.extend(!0, {}, data.data),
                                self.newOrder = cb.dataLoop(data.data)) : self.newOrder = data.data,
                        options.callback && options.callback.call(self),
                            cb.cache.set("order", self.temp.isHidePrice ? self.cloneOrder : self.newOrder),
                            self.newOrder.oOrderDetails.forEach(function (detail, index) {
                                detail.idKey || (detail.idKey = cb.utils.getGUID(),
                                self.cloneOrder && self.cloneOrder.oOrderDetails && (self.cloneOrder.oOrderDetails[index].idKey = detail.idKey))
                            }),
                            self.IsShowChangeGift(data),
                            cb.cache.del("orderDefines"),
                            cb.cache.del("useDefines"),
                            self.load.defines.call(self, function () {
                                self.tool.initDefines.call(self),
                                cb.cache.get("orderDefines") && (orderDefines = cb.cache.get("orderDefines") || {},
                                $$.isArray(orderDefines.header) && (orderDefines.header.forEach(function (header) {
                                    var value = self.newOrder.oOrderDefine && self.newOrder.oOrderDefine[header.name];
                                    value && (header.value = value)
                                }),
                                    self.selectors.headerDefine.html(self.headerUseDefines({
                                        defines: orderDefines.header
                                    }))),
                                    self.newOrder.oOrderDetails.forEach(function (detail, index) {
                                        var headTransaction, attr, attrValue, value, body = orderDefines.body.find(function (item) {
                                            return item.idKey == detail.idKey
                                        });
                                        if (body)
                                            for (attr in !body.iTransactionTypeId && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && self.temp.isCorpUser && orderDefines.header && (headTransaction = orderDefines.header.find(function (item) {
                                                return "iTransactionTypeId" == item.name
                                            })) && (body.iTransactionTypeId = headTransaction.value,
                                                body.transaction = headTransaction.transaction),
                                                detail.detailDefine = "",
                                                body)
                                                "iSKUId" != attr && "iTransactionTypeId" != attr && "id" != attr && "idKey" != attr && (attrValue = body[attr],
                                                "dSendDate" == attr && (detail.detailDefine += attrValue),
                                                (value = detail.oOrderDetailDefine && detail.oOrderDetailDefine[attr]) && (body[attr] = attrValue = value),
                                                attrValue && (0 == attr.indexOf("define") && (detail.detailDefine += self.tool.getDefineTitle.call(self, attr) + ":" + attrValue + ";"),
                                                "object" == typeof attrValue) && attrValue.name) && (detail.detailDefine += attrValue.name + ";")
                                    })),
                                    self.newOrder.oOrderDetails.length ? self.dataPage.find(".all-message.add-remarks-btn").parent().removeClass("hide") : self.dataPage.find(".all-message.add-remarks-btn").parent().addClass("hide");
                                var orderDefines, rebateData, productList = {
                                    isPreSaleOrder: !!data.data.presaleId || "GROUPBUY" == self.newOrder.promotionType || "SECKILL" == self.newOrder.promotionType,
                                    isNewOrder: !data.data.cOrderNo,
                                    isHideMondiyDetail: data.data.cSeparatePromotionType && "old" == data.data.cSeparatePromotionType,
                                    detailData: self.FormatDetailDataFunc(data.data.oOrderDetails, data.data.oOrderDetailGroups),
                                    isNotCorp: !self.temp.isCorpUser || cb.rest.appContext.isAgentOrder,
                                    isHidePrice: self.temp.isHidePrice,
                                    hideOrderPromotion: cb.FunctionOptions.HIDEPORDERROMOTION,
                                    orderAgentModifyPrice: self.temp.isCorpUser ? !cb.rest.appContext.isAgentOrder && !cb.bizFunctionOptions[cb.rest.appContext.context.bizId].FORBIDCORPMODIFYORDERPRICE : cb.FunctionOptions.ORDERAGENTMODIFYPRICE,
                                    isYs: "u8c" === cb.rest.runtime.env,
                                    isAbled: cb.FunctionOptions.ALLOWCHOOSETERMINALSTORE
                                };
                                productList.isHideMondiyDetail && (productList.orderAgentModifyPrice = !1),
                                self.temp.isHidePrice || options.unLoadRebates || (self.load.rebate.call(self, self.newOrder),
                                cb.FunctionOptions.OPENCOUPONS && cb.FunctionOptions.AGENTSYNCUHY && self.load.coupons.call(self)),
                                    self.newOrder.oRebates ? (rebateData = {
                                        rebateAmount: (self.temp.isHidePrice ? self.cloneOrder : self.newOrder).oRebates,
                                        resultArray: self.tool.initOrderRebate(self.temp.isHidePrice ? self.cloneOrder : self.newOrder)
                                    },
                                        cb.cache.set("rebateAmount", rebateData)) : cb.cache.del("rebateAmount"),
                                    self.selectors.productDetailContainer.html(self.productDetailFunc(productList)),
                                    self.render(),
                                    self.isKeyPadOpen = !1,
                                    self.newOrder.isHidePrice = self.temp.isHidePrice,
                                    self.newOrder.isHideMondiyDetail = self.newOrder.cSeparatePromotionType && "old" == self.newOrder.cSeparatePromotionType,
                                    self.newOrder.fRebateTotalMoney = cb.utils.FloatCalc.add(self.newOrder.fRebateMoney, self.newOrder.fRebateCashMoney),
                                    self.newOrder.isShowRebate = "u8c" != cb.rest.runtime.env,
                                    self.newOrder.isYs = "u8c" === cb.rest.runtime.env,
                                    self.newOrder = self.tool.choosePromotions.call(self, self.newOrder),
                                    self.newOrder.isYs = "u8c" === cb.rest.runtime.env,
                                    self.selectors.rebateContainer.html(self.productPartInfoFunc(self.newOrder)),
                                    self.IsShowUsePoint(self.newOrder),
                                    setTimeout(function () {
                                        myApp.initImagesLazyLoad(self.temp.page.container)
                                    }, 10)
                                self.rebateAuto.call(self,self.newOrder)
                            }))
                    },
                    error: function (err) {
                        self.isKeyPadOpen = !1,
                            myApp.hidePreloader(),
                            myApp.toast(err.message, "error").show(!0)
                    }
                }),
                options.isAddCart) {
                for (var skuList = new Array, i = 0; i < needAddCartProds.length; i++) {
                    var curr = needAddCartProds[i];
                    curr.cOrderProductType && "SALE" == curr.cOrderProductType && skuList.push({
                        iSKUId: curr.iSKUId,
                        iQuantity: curr.iQuantity,
                        iAuxUnitQuantity: curr.iAuxUnitQuantity || null,
                        bizId: curr.bizId,
                        bizProductId: curr.bizProductId,
                        iProductId: curr.iProductId,
                        salesOrgId: curr.salesOrgId,
                        saleOrgId: curr.salesOrgId
                    })
                }
                cb.rest.postData({
                    url: cb.router.HTTP_SHOPPINGCART_ADD,
                    showPreloader: !0,
                    params: {
                        items: skuList
                    },
                    success: function (data) {
                        200 == data.code && myApp.toast("移入购物车成功", "success").show(!0)
                    },
                    error: function (err) {
                        myApp.toast(err.message, "tips").show(!0)
                    }
                })
            }
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