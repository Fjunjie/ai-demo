/*! u-order-mobile 2024-01-13 */
UOrderApp.ns("UOrderApp.pages"),
UOrderApp.pages.RebateSelectController = function() {
    this.rebateItemFunc = Template7.compile($$("#rebateItemTplSelect").html()),
    this.tplRebateSelectToolbar = Template7.compile($$("#tpl-rebateSelect-toolbar").html()),
    this.tplRebateSelectProductItem = Template7.compile($$("#tpl-rebateSelect-productItem").html()),
    this.productRebateFunc = Template7.compile($$("#productRebateTplSelect").html()),
    this.tplRebateSelectProductItemYs = Template7.compile($$("#tpl-rebateSelect-productItem_ys").html())
}
,
UOrderApp.pages.RebateSelectController.prototype.preprocess = function(content, url, next) {
    console.log('preprocess')
    this.isCorpUser = cb.rest.appContext.corpUser,
    this.paramsContent = {
        rebateType: "money",
        serverUrl: cb.router.HTTP_REBATE_GETUSABLEREBATES,
        params: {
            pageIndex: 1,
            pageSize: cb.rest.runtime.pageConfig && cb.rest.runtime.pageConfig.rebateSelect && cb.rest.runtime.pageConfig.rebateSelect.pageSize || 10
        },
        isAutoFill: !1
    },
    this.context = {
        isU8C: "u8c" == cb.rest.runtime.env
    },
    next(Template7.compile(content)(this.context))
}
,
UOrderApp.pages.RebateSelectController.prototype.pageInit = function(page) {
    console.log('pageInit')
    var self = this;
    this.container = page.container,
    this.temp = {
        fPayMoney: cb.utils.FloatCalc.add(page.query.orderInfo.fPayMoney, page.query.orderInfo.fRebateMoney),
        fMaxRebateRuleMoney: page.query.orderInfo.fMaxRebateRuleMoney,
        fMaxRebateMoney: page.query.orderInfo.fMaxRebateMoney,
        dataCollection: [],
        selectItems: page.query.selectItems,
        orderInfo: page.query.orderInfo,
        rebateControl: page.query.rebateControl,
        index: page.query.index
    },
    this.paramsContent.params.order = this.temp.orderInfo,
    $$(page.container).find(".page-content.infinite-scroll").on("infinite", function() {
        $$(page.container).find(".rebateListPage-container .tab.active dl").length;
        var lastIndex = parseInt($$(page.container).find(".rebateListPage-container .tab.active dl").length / self.paramsContent.params.pageSize) + 1;
        self.paramsContent.params.pageIndex < lastIndex ? (self.paramsContent.params.pageIndex = lastIndex,
        self.paramsContent.serverUrl = "money" != self.paramsContent.rebateType ? "u8c" != cb.rest.runtime.env ? cb.router.HTTP_REBATE_GETUSABLEREBATESRETURNPRODUCT : cb.router.HTTP_REBATE_GETUSABLEREBATESRETURNPRODUCT_YS : cb.router.HTTP_REBATE_GETUSABLEREBATES,
        self.paramsContent.params.order.oRebates && (self.paramsContent.params.order.oRebates = self.paramsContent.params.order.oRebates.filter(function(item) {
            return "NUMBERPRODUCT" != item.cUseWayCode && "AMOUNTPRODUCT" != item.cUseWayCode
        })),
        cb.rest.postData({
            url: self.paramsContent.serverUrl.format(self.paramsContent.params.pageSize, self.paramsContent.params.pageIndex),
            params: "u8c" != cb.rest.runtime.env && "money" != self.paramsContent.rebateType ? self.paramsContent.params : self.paramsContent.params.order,
            success: function(data) {
                console.log('返利数据返回',data)
                var data = "u8c" != cb.rest.runtime.env && "money" != self.paramsContent.rebateType ? data.data.data : data.data.content
                  , resultHtml = (self.tool.setSelected.call(self, data = data || []),
                $$.isArray(data) && self.temp.dataCollection.push.apply(self.temp.dataCollection, data),
                self.load.defaluts.call(self),
                "")
                  , resultHtml = "u8c" != cb.rest.runtime.env || "money" == self.paramsContent.rebateType ? self.rebateItemFunc({
                    rebateList: self.tool.format.call(self, data),
                    index: 1 === self.paramsContent.params.pageIndex,
                    isU8C: "u8c" == cb.rest.runtime.env
                }) : self.productRebateFunc({
                    rebateList: self.tool.format.call(self, data),
                    index: 1 === self.paramsContent.params.pageIndex,
                    isU8C: "u8c" == cb.rest.runtime.env
                });
                $$(page.container).find(".rebateListPage-container").find(".tab.active").append(resultHtml),
                self.tool.renderFooter.call(self)
            }
        })) : $$(page.container).find(".infinite-scroll-preloader").remove()
    }),
    $$(page.container).find(".page-content.pull-to-refresh-content").on("refresh", function(e) {
        self.paramsContent.params.pageIndex = 1,
        self.load.rebates.call(self, function() {
            myApp.pullToRefreshDone()
        })
    }),
    this.load.rebates.call(this),
    this.tool.renderFooter.call(this),
    this.once()
}
,
UOrderApp.pages.RebateSelectController.prototype.load = {
    rebates: function(callback) {
        var self = this;
        self.paramsContent.serverUrl = "money" != self.paramsContent.rebateType ? "u8c" != cb.rest.runtime.env ? cb.router.HTTP_REBATE_GETUSABLEREBATESRETURNPRODUCT : cb.router.HTTP_REBATE_GETUSABLEREBATESRETURNPRODUCT_YS : cb.router.HTTP_REBATE_GETUSABLEREBATES,
        self.paramsContent.params.order.oRebates && (self.paramsContent.params.order.oRebates = self.paramsContent.params.order.oRebates.filter(function(item) {
            return "NUMBERPRODUCT" != item.cUseWayCode
        })),
        cb.rest.postData({
            showPreloader: !0,
            url: self.paramsContent.serverUrl.format(self.paramsContent.params.pageSize, self.paramsContent.params.pageIndex),
            params: "u8c" != cb.rest.runtime.env && "money" != self.paramsContent.rebateType ? self.paramsContent.params : self.paramsContent.params.order,
            success: function(data) {
                console.log('rebates',data)
                var data = "u8c" != cb.rest.runtime.env && "money" != self.paramsContent.rebateType ? data.data.data || [] : data.data.content || []
                  , inner = (self.temp.dataCollection = data,
                self.temp.selectItems && $$.isArray(self.temp.selectItems.resultArray) && self.temp.selectItems.resultArray.length ? self.tool.setSelected.call(self, data) : self.load.defaluts.call(self),
                "")
                  , inner = "u8c" != cb.rest.runtime.env || "money" == self.paramsContent.rebateType ? self.rebateItemFunc({
                    rebateList: self.tool.format.call(self, data),
                    isU8C: "u8c" == cb.rest.runtime.env
                }) : self.productRebateFunc({
                    rebateList: self.tool.format.call(self, data),
                    isU8C: "u8c" == cb.rest.runtime.env
                });
                $$(self.container).find(".rebateListPage-container").find(".tab.active").html(inner),
                self.tool.renderFooter.call(self),
                callback && callback.call(self)
            }
        })
    },
    defaluts: function() {
        var self, params;
        this.paramsContent.isAutoFill && (params = {
            maxRebateMoney: (self = this).temp.fMaxRebateMoney,
            maxRebateRuleMoney: this.temp.fMaxRebateRuleMoney,
            orderMaxRebateMoney: this.temp.rebateControl.orderMaxRebateMoney,
            orderCashMaxRebateMoney: this.temp.rebateControl.orderCashMaxRebateMoney,
            rebateIds: [],
            usedRebates: [],
            orderNo: this.temp.orderInfo.cOrderNo || null
        },
        self.temp.dataCollection.map(function(item) {
            "NUMBERPRODUCT" != item.cUseWayCode && params.rebateIds.indexOf(item.id) < 0 && params.rebateIds.push(item.id)
        }) ,
        $$(this.container).find(".rebate.rebateListPage-container .tab.active").children(".available.selected").each(function() {
            var ds = $$(this).dataset()
              , val = $$(this).find("input").val()
              , currentRebate = self.temp.dataCollection.find(function(item) {
                return item.cRebateNo == ds.rebateno
            });
            parseFloat(val) && currentRebate && "NUMBERPRODUCT" != currentRebate.cUseWayCode && (currentRebate.fOrderRebateMoney = parseFloat(val),
            params.usedRebates.push(currentRebate))
        }) && console.log("defaluts",params),
        cb.rest.postData({
            url: cb.router.HTTP_REBATE_REBATEAUTOUSED,
            params: {
                rebateAutoUsedVo: params
            },
            success: function(data) {
                200 == data.code && $$.isArray(data.data) && (data.data.map(function(rebate) {
                    var currentRebate = self.temp.dataCollection.find(function(item) {
                        return item.id == rebate.rebateId
                    });
                    currentRebate && $$(self.container).find(".rebate.rebateListPage-container .tab.active").children(".available").each(function() {
                        $$(this).dataset().rebateno == currentRebate.cRebateNo && ($$(this).addClass("selected"),
                        $$(this).find("input").val(rebate.orderRebateMoney))
                    })
                }),
                self.tool.renderFooter.call(self))
            },
            error: function(error) {
                myApp.toast(error.message, "error").show(!0)
            }
        }))
    }
},
UOrderApp.pages.RebateSelectController.prototype.once = function() {
    var self = this;
    "u8c" === cb.rest.runtime.env && (self.isCheck = !1),
    $$(this.container).find(".navbar .right").on("click", function() {
        console.log("点击自动填充")
        $$(this).children().hasClass("hiding") || (self.paramsContent.isAutoFill = !0,
        self.load.defaluts.call(self))
    }),
    $$(this.container).find(".toolbar .rebateSelectedSaveBtn").on("click", function() {
        var pageVewList, data = self.tool.validata.call(self);
        "u8c" === cb.rest.runtime.env && 0 !== data.resultArray.length && (self.isCheck = !0),
        data.isPass && ((pageVewList = $$(myApp.mainView.pagesContainer).find(".page"))[pageVewList.length - 1].f7PageData.query = {
            rebateData: {
                rebateAmount: data.allRebateMoney,
                resultArray: data.resultArray
            }
        },
        myApp.mainView.router.back({
            query: "u8c" === cb.rest.runtime.env ? {
                rebateData: {
                    rebateAmount: data.allRebateMoney,
                    resultArray: data.resultArray,
                    index: self.temp.index
                },
                isCheck: self.isCheck,
                isAutoUseRebate: !1
            } : {
                rebateData: {
                    rebateAmount: data.allRebateMoney,
                    resultArray: data.resultArray,
                    index: self.temp.index
                }
            }
        }))
    }),
    $$(this.container).find(".rebateListPage-container").on("click", ".js-choose-product", function() {
        var obj, ds = $$(this).parents(".available").dataset(), target = $$(this), rebateOrder = self.temp.dataCollection.find(function(item) {
            return item.cRebateNo == ds.rebateno && Array.isArray(item.lsRebateReturnProducts) && item.lsRebateReturnProducts.map(function(lsRebateReturnProduct) {
                Array.isArray(lsRebateReturnProduct.lsSkusList) && lsRebateReturnProduct.lsSkusList.map(function(sku) {
                    sku.idkey = sku.idkey || cb.utils.getGUID()
                })
            }),
            item.cRebateNo == ds.rebateno
        });
        "u8c" != cb.rest.runtime.env ? myApp.mainView.router.loadPage({
            url: "pages/rebateSelectProduct.html?",
            query: {
                rebateOrder: rebateOrder
            }
        }) : "u8c" == cb.rest.runtime.env && $$(this).data("skuid") ? cb.rest.getJSON({
            url: cb.router.HTTP_PRODUCT_GETPOPPRODUCT,
            params: {
                id: $$(this).data("productid"),
                bizProductId: $$(this).data("bizproductid")
            },
            success: function(data) {
                var lsRebateReturn;
                200 == data.code && ((lsRebateReturn = rebateOrder.lsRebateReturnProducts.find(function(v) {
                    return v.id == target.data("returnid")
                })).cUnitType = lsRebateReturn.unitCategory,
                lsRebateReturn.lsSkusList[0].oProduct = data.data,
                lsRebateReturn.oProduct = data.data,
                myApp.mainView.router.loadPage({
                    url: "pages/rebateSelectProduct.html?",
                    query: {
                        rebateOrder: rebateOrder,
                        cUseWayCode: target.data("cusewaycode"),
                        iSurplusAmount: Number(target.data("maxmoney"))
                    }
                }))
            },
            error: function(err) {
                myApp.toast(err.message, "error").show(!0)
            }
        }) : (target = $$(this),
        obj = null,
        self.temp.dataCollection.forEach(function(v) {
            v.lsRebateReturnProducts && v.lsRebateReturnProducts.forEach(function(k) {
                k.id == Number(target.data("returnid")) && (obj = k)
            })
        }),
        myApp.mainView.router.loadPage({
            url: "pages/rebateProductsList.html?",
            query: {
                productLineId: Number(target.data("productlineid")),
                productId: Number(target.data("productid")),
                bizProductId: Number(target.data("bizproductid")),
                brandId: Number(target.data("brandid")),
                classId: Number(target.data("productclassid")),
                skuId: Number(target.data("skuid")),
                bizId: self.paramsContent.params.order.bizId,
                salesOrgId: self.paramsContent.params.order.salesOrgId,
                isShowAllProduct: !0,
                returnId: Number(target.data("returnid")),
                rebateNo: $$(this).parents(".available").attr("data-rebateno"),
                cUseWayCode: target.data("cusewaycode"),
                iSurplusQuantity: Number(target.data("maxquantity")),
                iSurplusAmount: Number(target.data("maxmoney")),
                lsRebateReturnProduct: obj,
                iAgentId: self.temp.orderInfo.iAgentId,
                selectedArr: self.tool.getSelected.call(self, $$(this).parents(".available").attr("data-rebateno"), Number(target.data("returnid")))
            }
        }))
    }),
    $$(this.container).find(".rebateListPage-container").on("click", "p.rebate-choose", function() {
        var inner, classStr, rebateNo = $$(this).parents(".available").attr("data-rebateno"), returnId = $$(this).data("returnid"), rebateNo = self.tool.getSelected.call(self, rebateNo, returnId);
        console.log(rebateNo),
        rebateNo.length ? ($$(this).children("i").toggleClass("rotate180"),
        inner = "u8c" == cb.rest.runtime.env ? self.tplRebateSelectProductItemYs({
            list: rebateNo
        }) : self.tplRebateSelectProductItem({
            list: rebateNo
        }),
        classStr = "selectProductContainer-" + returnId,
        "u8c" == cb.rest.runtime.env ? $$(this).parents(".available").find(".selectProductContainer").each(function() {
            $$(this).hasClass(classStr) && $$(this).toggleClass("hide").html(inner)
        }) : $$(this).parents(".available").find(".selectProductContainer").toggleClass("hide").html(inner)) : myApp.toast("请先选择商品！", "tips").show(!0)
    }),
    $$(this.container).find(".subnavbar a").on("click", function(e) {
        var ds = $$(this).dataset();
        self.paramsContent.rebateType != ds.filter && ($$(this).parent().children("a").removeClass("active"),
        $$(this).addClass("active"),
        self.paramsContent.rebateType = ds.filter,
        self.paramsContent.params.pageIndex = 1,
        "money" != self.paramsContent.rebateType ? $$(self.container).find(".navbar .right a").addClass("hiding") : $$(self.container).find(".navbar .right a").removeClass("hiding"),
        self.load.rebates.call(self))
    }),
    $$(this.container).find(".rebateListPage-container").on("click", 'input[type="number"]', function(e) {
        self.temp.mykeypad = myApp.keypad({
            input: this,
            toolbarCloseText: "完成",
            decimalLength: 2,
            onChange: function(p, val) {
                var curRebate, ds = p.input.parents("dl.available").dataset(), maxValue = parseFloat($$(p.input).attr("data-fsurplusmoney"));
                val = val ? parseFloat(val) : 0,
                (maxValue = (curRebate = self.temp.orderInfo && Array.isArray(self.temp.orderInfo.oRebates) ? self.temp.orderInfo.oRebates.find(function(item) {
                    return item.cRebateNo == ds.rebateno
                }) : curRebate) ? cb.utils.FloatCalc.add(maxValue, curRebate.originFOrderRebateMoney || 0) : maxValue) < val && (myApp.toast("最多可使用" + maxValue + "元", "tips").show(!0),
                val = maxValue),
                setTimeout(function() {
                    p.input.val(val)
                }, 0),
                "u8c" === cb.rest.runtime.env && 0 < val && (self.isCheck = !0)
            },
            onClose: function(p) {
                var val = parseInt(p.input.val())
                  , ds = p.input.parents("dl.available").dataset();
                val ? p.input.parents("dl.available").addClass("selected") : (p.input.parents("dl.available").removeClass("selected"),
                self.temp.orderInfo && Array.isArray(self.temp.orderInfo.oRebates) && (self.temp.orderInfo.oRebates = self.temp.orderInfo.oRebates.filter(function(item) {
                    return item.cRebateNo != ds.rebateno
                }))),
                self.tool.renderFooter.call(self),
                p.destroy()
            }
        }),
        self.temp.mykeypad.open()
    })
}
,
UOrderApp.pages.RebateSelectController.prototype.afterFromPageBack = function(page) {
    switch (page.fromPage.name) {
    case "rebateSelectProduct":
        page.query.selected && (this.tool.merge.call(this, page.query.selected),
        this.tool.renderFooter.call(this));
        break;
    case "rebateProductsList":
        page.query.selected && (this.tool.mergeReturnProducts.call(this, page.query.selected),
        this.tool.renderFooter.call(this))
    }
}
,
UOrderApp.pages.RebateSelectController.prototype.tool = {
    format: function(list) {
        if ($$.isArray(list))
            for (var i = 0; i < list.length; i++) {
                var dValidStartDate, dValidEndDate, curr = list[i];
                curr.isShowRebateSourceName = cb.FunctionOptions.STARTREBATESOURCE && (curr.cRebateSourceName || curr.rebateSourceName) && "u8c" !== cb.rest.runtime.env,
                curr.dValidEndDate && (dValidStartDate = new Date(Date.parse(curr.dValidStartDate.replace(/-/g, "/"))),
                dValidEndDate = new Date(Date.parse(curr.dValidEndDate.replace(/-/g, "/"))),
                curr.dValidStartDateStr = dValidStartDate.format("yyyy/MM/dd"),
                curr.dValidEndDateStr = dValidEndDate.format("yyyy/MM/dd")),
                "NUMBERPRODUCT" == curr.cUseWayCode ? (curr.totalIQuantity = 0,
                curr.usableIQuantity = 0,
                $$.isArray(curr.lsRebateReturnProducts) && curr.lsRebateReturnProducts.forEach(function(item) {
                    item.cUseWayCode = curr.cUseWayCode,
                    curr.totalIQuantity = cb.utils.FloatCalc.add(curr.totalIQuantity, item.iQuantity),
                    curr.usableIQuantity = cb.utils.FloatCalc.add(curr.usableIQuantity, item.iSurplusQuantity),
                    item.iSkuId && (item.bizProductId = item.lsSkusList[0].bizProductId)
                })) : "AMOUNTPRODUCT" == curr.cUseWayCode && (curr.totalAmount = 0,
                curr.usableAmount = 0,
                $$.isArray(curr.lsRebateReturnProducts)) && curr.lsRebateReturnProducts.forEach(function(item) {
                    item.cUseWayCode = curr.cUseWayCode,
                    curr.totalAmount = cb.utils.FloatCalc.add(curr.totalAmount, item.iAmount),
                    curr.usableAmount = cb.utils.FloatCalc.add(curr.usableAmount, item.iSurplusAmount),
                    item.iSkuId && (item.bizProductId = item.lsSkusList[0].bizProductId)
                })
            }
        return list
    },
    getRender: function() {
        var self = this
          , data = {
            count: 0,
            totalPrice: 0,
            totalProductType: 0,
            totalProductNum: 0,
            isMoneyRebate: "money" == this.paramsContent.rebateType
        };
        return $$(this.container).find(".rebate.rebateListPage-container .tab.active").children(".available").each(function() {
            var selected, number, ds = $$(this).dataset();
            "NUMBERPRODUCT" != ds.cusewaycode && "AMOUNTPRODUCT" != ds.cusewaycode ? $$(this).hasClass("selected") && (data.count += 1,
            number = $$(this).find("input").val()) && (data.totalPrice = cb.utils.FloatCalc.add(number, data.totalPrice)) : ds.rebateno && (selected = self.tool.getSelected.call(self, ds.rebateno),
            "u8c" === cb.rest.runtime.env ? $$(this).find(".selectProductContainer").each(function() {
                var returnId, innerArr;
                $$(this).hasClass("hide") || -1 < $$(this)[0].className.indexOf("-") && (returnId = $$(this)[0].className.split("-")[1],
                innerArr = selected.filter(function(v) {
                    return v.id == returnId
                }),
                innerArr = self.tplRebateSelectProductItemYs({
                    list: innerArr
                }),
                $$(this).html(innerArr))
            }) : $$(this).find(".selectProductContainer").hasClass("hide") || (number = self.tplRebateSelectProductItem({
                list: selected
            }),
            $$(this).find(".selectProductContainer").html(number)),
            data.totalProductType += selected.length,
            selected.forEach(function(item) {
                $$.isArray(item.lsSkusList) && item.lsSkusList.forEach(function(skuItem) {
                    skuItem.input_num && (data.count += 1,
                    data.totalProductNum = cb.utils.FloatCalc.add(skuItem.input_num, data.totalProductNum))
                })
            }))
        }),
        data
    },
    validata: function() {
        var moneyA, self = this, total = {
            TOPRODUCT: 0,
            TOORDER: 0,
            TOCASH: 0,
            allRebateMoney: 0,
            isPass: !0,
            resultArray: []
        };
        return $$(this.container).find(".rebate.rebateListPage-container .tab.active").children(".available").each(function() {
            var cRebateNo = $$(this).data("rebateno")
              , cUseWayCode = $$(this).attr("data-cusewaycode")
              , currentRebate = self.temp.dataCollection.find(function(item) {
                return item.cRebateNo == cRebateNo
            });
            if (currentRebate)
                if (delete currentRebate.dValidStartDate,
                delete currentRebate.dValidEndDate,
                "NUMBERPRODUCT" != cUseWayCode && "AMOUNTPRODUCT" != cUseWayCode) {
                    if ($$(this).hasClass("selected")) {
                        console.log("input",$$(this).find("input"))
                        var fOrderRebateMoney = $$(this).find("input").val();
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
                } else {
                    var currentRebate = self.tool.getSelected.call(self, cRebateNo)
                      , list = new Array;
                    currentRebate.forEach(function(lsRebateReturnProduct) {
                        lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                            var o = {
                                iRebateReturnProductId: lsRebateReturnProduct.id,
                                cUnitType: lsRebateReturnProduct.cUnitType,
                                iProductId: lsRebateReturnProduct.iProductId || skuItem.iProductId,
                                cRebateNo: lsRebateReturnProduct.cRebateNo,
                                iSKUId: skuItem.id,
                                bizSkuId: skuItem.bizSkuId,
                                bizId: skuItem.bizId,
                                bizProductId: skuItem.bizProductId,
                                iQuantity: skuItem.iQuantity,
                                saleOrgId: skuItem.saleOrgId,
                                salesOrgId: skuItem.saleOrgId,
                                orgId: skuItem.orgId,
                                cProductImgUrl: lsRebateReturnProduct.oProduct && lsRebateReturnProduct.oProduct.imgUrl,
                                sku: skuItem,
                                oProduct: lsRebateReturnProduct.oProduct
                            };
                            skuItem.iAuxUnitQuantity && (o.iAuxUnitQuantity = skuItem.iAuxUnitQuantity),
                            list.push(o)
                        })
                    }),
                    list.length && total.resultArray.push({
                        cRebateNo: cRebateNo,
                        cUseWayCode: cUseWayCode,
                        detail: list
                    })
                }
        }),
        this.temp.fMaxRebateMoney < total.TOPRODUCT ? (myApp.toast("分摊返利金额已超过订单最大可分摊返利金额" + this.temp.fMaxRebateMoney + "元，请重新填写!", "tips").show(!0),
        total.isPass = !1) : this.temp.fMaxRebateRuleMoney < total.allRebateMoney ? (myApp.toast("返利金额已超出可用返利金额" + this.temp.fMaxRebateRuleMoney + "元，请重新填写!", "tips").show(!0),
        total.isPass = !1) : (moneyA = parseFloat(cb.utils.FloatCalc.sub(this.temp.fPayMoney, cb.utils.FloatCalc.add(total.TOPRODUCT, total.TOORDER))),
        parseFloat(cb.utils.FloatCalc.sub(moneyA, cb.utils.FloatCalc.add(total.TOCASH, self.temp.orderInfo.fReight))) < 0 ? (myApp.toast("返利金额大于订单金额，请重新选择", "tips").show(!0),
        total.isPass = !1) : total)
    },
    merge: function(data) {
        var attr, self = this;
        for (attr in data) {
            var attrValue = data[attr];
            $$.isArray(attrValue) && this.temp.dataCollection.forEach(function(item) {
                item.cRebateNo == attr && item.lsRebateReturnProducts && item.lsRebateReturnProducts.forEach(function(lsRebateReturnProduct) {
                    $$.isArray(lsRebateReturnProduct.lsSkusList) && lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                        var selected;
                        attrValue.length ? (selected = attrValue.find(function(valueItem) {
                            return valueItem.idkey == skuItem.idkey
                        })) ? (skuItem.input_num = selected.input_num,
                        selected.iQuantity && (skuItem.iQuantity = selected.iQuantity),
                        selected.iAuxUnitQuantity && (skuItem.iAuxUnitQuantity = selected.iAuxUnitQuantity),
                        skuItem.fSalePrice = selected.price || skuItem.fSalePrice) : (self.temp.orderInfo.oOrderDetails = self.temp.orderInfo.oOrderDetails.filter(function(detail) {
                            return "REBATE" != detail.cOrderProductType || detail.iSKUId != skuItem.id
                        }),
                        delete skuItem.input_num) : (self.temp.orderInfo.oOrderDetails = self.temp.orderInfo.oOrderDetails.filter(function(detail) {
                            return "REBATE" != detail.cOrderProductType || detail.iSKUId != skuItem.id
                        }),
                        delete skuItem.input_num)
                    })
                })
            })
        }
    },
    mergeReturnProducts: function(data) {
        var attr, self = this;
        for (attr in data) {
            var attrValue = data[attr];
            this.temp.dataCollection.forEach(function(item) {
                if (item.cRebateNo == attr)
                    for (var returnId in attrValue) {
                        var arr = [];
                        item.lsRebateReturnProducts && item.lsRebateReturnProducts.forEach(function(lsRebateReturnProduct) {
                            var list;
                            lsRebateReturnProduct.id == returnId && (list = attrValue[returnId],
                            $$.isArray(lsRebateReturnProduct.lsSkusList) ? lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                                var selected;
                                list.length ? (selected = list.find(function(valueItem) {
                                    return valueItem.iSkuId == skuItem.id
                                })) ? (skuItem.input_num = selected.input_num,
                                selected.iQuantity && (skuItem.iQuantity = selected.iQuantity),
                                selected.iAuxUnitQuantity && (skuItem.iAuxUnitQuantity = selected.iAuxUnitQuantity),
                                skuItem.fSalePrice = selected.price || skuItem.fSalePrice) : (self.temp.orderInfo.oOrderDetails = self.temp.orderInfo.oOrderDetails.filter(function(detail) {
                                    return "REBATE" != detail.cOrderProductType || detail.iSKUId != skuItem.id
                                }),
                                delete skuItem.input_num) : (self.temp.orderInfo.oOrderDetails = self.temp.orderInfo.oOrderDetails.filter(function(detail) {
                                    return "REBATE" != detail.cOrderProductType || detail.iSKUId != skuItem.id
                                }),
                                delete skuItem.input_num)
                            }) : list.length && list.forEach(function(v) {
                                var skuobj = null
                                  , productObj = (item.lsRebateReturnProducts.forEach(function(s) {
                                    s.id == returnId && (s.oProduct && s.oProduct.id) == v.product.id && s.lsSkusList && (skuobj = s.lsSkusList.find(function(j) {
                                        return j.id == v.sku.id
                                    }))
                                }),
                                arr.find(function(s) {
                                    return s.id == returnId && (s.oProduct && s.oProduct.id) == v.product.id
                                }));
                                skuobj ? (v.iQuantity && (skuobj.iQuantity = v.iQuantity),
                                v.iAuxUnitQuantity && (skuobj.iAuxUnitQuantity = v.iAuxUnitQuantity)) : productObj ? (productObj.lsSkusList || (productObj.lsSkusList = []),
                                productObj.lsSkusList.push(v.sku)) : ((productObj = cb.utils.extend(!0, {}, lsRebateReturnProduct)).oProduct = v.product,
                                productObj.cUnitType = v.product.isAuxUnitOrder,
                                v.iQuantity && (v.sku.iQuantity = v.iQuantity),
                                v.iAuxUnitQuantity && (v.sku.iAuxUnitQuantity = v.iAuxUnitQuantity),
                                productObj.lsSkusList || (productObj.lsSkusList = []),
                                productObj.lsSkusList.find(function(k) {
                                    return k.id == v.sku.id
                                }) || productObj.lsSkusList.push(v.sku),
                                arr.push(productObj))
                            }))
                        }),
                        item.lsRebateReturnProducts = item.lsRebateReturnProducts.concat(arr)
                    }
            })
        }
    },
    getSelected: function(key, returnId) {
        var selected = new Array;
        return this.temp.dataCollection.forEach(function(item) {
            item.cRebateNo == key && $$.isArray(item.lsRebateReturnProducts) && item.lsRebateReturnProducts.forEach(function(lsRebateReturnProduct) {
                var selectedSkus, cloneItem;
                "u8c" == cb.rest.runtime.env && returnId ? lsRebateReturnProduct.id == returnId && $$.isArray(lsRebateReturnProduct.lsSkusList) && (selectedSkus = new Array,
                lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                    var number;
                    skuItem.input_num && (number = skuItem.input_num,
                    "UNIT" != lsRebateReturnProduct.cUnitType && (number = cb.utils.FloatCalc.mult(number, skuItem.oProductAuxUnit.iConversionRate)),
                    skuItem.partPrice = cb.utils.FloatCalc.mult(number, skuItem.fSalePrice).toFixed(2),
                    selectedSkus.push(skuItem))
                }),
                selectedSkus.length) && ((cloneItem = cb.utils.extend(!0, {}, lsRebateReturnProduct)).lsSkusList = selectedSkus,
                lsRebateReturnProduct.oProduct && (cloneItem.unitName = lsRebateReturnProduct.oProduct.oUnit.cName || lsRebateReturnProduct.oProduct.unitName,
                cloneItem.isMainUnit = "UNIT" == lsRebateReturnProduct.cUnitType,
                cb.FunctionOptions.OPENAUXUNIT) && lsRebateReturnProduct.oProduct.oProductAuxUnit && (cloneItem.auxUnitName = lsRebateReturnProduct.oProduct.oProductAuxUnit.oUnit.cName),
                selected.push(cloneItem)) : $$.isArray(lsRebateReturnProduct.lsSkusList) && (selectedSkus = new Array,
                lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                    var number;
                    skuItem.input_num && (number = skuItem.input_num,
                    "UNIT" != lsRebateReturnProduct.cUnitType && (number = cb.utils.FloatCalc.mult(number, skuItem.oProductAuxUnit.iConversionRate)),
                    skuItem.partPrice = cb.utils.FloatCalc.mult(number, skuItem.fSalePrice).toFixed(2),
                    selectedSkus.push(skuItem))
                }),
                selectedSkus.length) && ((cloneItem = cb.utils.extend(!0, {}, lsRebateReturnProduct)).lsSkusList = selectedSkus,
                lsRebateReturnProduct.oProduct && (cloneItem.unitName = lsRebateReturnProduct.oProduct.oUnit.cName,
                cloneItem.isMainUnit = "UNIT" == lsRebateReturnProduct.cUnitType,
                cb.FunctionOptions.OPENAUXUNIT) && lsRebateReturnProduct.oProduct.oProductAuxUnit && (cloneItem.auxUnitName = lsRebateReturnProduct.oProduct.oProductAuxUnit.oUnit.cName),
                selected.push(cloneItem))
            })
        }),
        selected
    },
    setSelected: function(data) {
        var resultArray;
        $$.isArray(data) && this.temp.selectItems && this.temp.selectItems.resultArray && (resultArray = this.temp.selectItems.resultArray,
        data.forEach(function(rebateItem) {
            resultArray.forEach(function(item) {
                item.cRebateNo ? item.cRebateNo == rebateItem.cRebateNo && ("NUMBERPRODUCT" != item.cUseWayCode && "AMOUNTPRODUCT" != item.cUseWayCode ? rebateItem.input_num = item.fOrderRebateMoney : $$.isArray(rebateItem.lsRebateReturnProducts) && $$.isArray(item.detail) && rebateItem.lsRebateReturnProducts.forEach(function(lsRebateReturnProduct) {
                    "u8c" === cb.rest.runtime.env && item.detail.forEach(function(detail) {
                        detail.iRebateReturnProductId == lsRebateReturnProduct.id && (lsRebateReturnProduct.oProduct || (lsRebateReturnProduct.oProduct = detail.oProduct),
                        lsRebateReturnProduct.lsSkusList || (lsRebateReturnProduct.lsSkusList = []),
                        lsRebateReturnProduct.lsSkusList.push(detail.sku))
                    }),
                    $$.isArray(lsRebateReturnProduct.lsSkusList) && lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                        var selectSku = item.detail.find(function(detail) {
                            return detail.iSKUId == skuItem.id && detail.iProductId == skuItem.iProductId && detail.iRebateReturnProductId == lsRebateReturnProduct.id
                        });
                        1 == lsRebateReturnProduct.lsSkusList.length && (skuItem.iUsedQuantity = lsRebateReturnProduct.iUsedQuantity),
                        selectSku && (skuItem.isMainUnit = "UNIT" == lsRebateReturnProduct.cUnitType,
                        skuItem.unitName = lsRebateReturnProduct.oProduct.oUnit.cName,
                        skuItem.iQuantity = selectSku.iQuantity,
                        skuItem.input_num = "UNIT" == lsRebateReturnProduct.cUnitType ? selectSku.iQuantity : selectSku.iAuxUnitQuantity,
                        selectSku.iAuxUnitQuantity) && (skuItem.iAuxUnitQuantity = selectSku.iAuxUnitQuantity,
                        skuItem.auxUnitName = skuItem.oProductAuxUnit ? skuItem.oProductAuxUnit.oUnit.cName : "")
                    })
                })) : "REBATE" == item.cOrderProductType && $$.isArray(rebateItem.lsRebateReturnProducts) && rebateItem.lsRebateReturnProducts.forEach(function(lsRebateReturnProduct) {
                    var isExist;
                    item.iRebateReturnProductId == lsRebateReturnProduct.id && "u8c" === cb.rest.runtime.env && (lsRebateReturnProduct.lsSkusList || (lsRebateReturnProduct.lsSkusList = []),
                    lsRebateReturnProduct.lsSkusList.length ? item.sku.iProductId == lsRebateReturnProduct.lsSkusList[0].iProductId ? (isExist = lsRebateReturnProduct.lsSkusList.find(function(v) {
                        return v.fSalePrice = item.sku.fSalePrice,
                        v.id == item.sku.id
                    }),
                    lsRebateReturnProduct.oProduct = item.sku && item.sku.oProduct,
                    isExist || lsRebateReturnProduct.lsSkusList.push(item.sku)) : ((isExist = cb.utils.extend(!0, {}, lsRebateReturnProduct)).oProduct || (isExist.oProduct = item.sku && item.sku.oProduct),
                    isExist.lsSkusList.push(item.sku),
                    rebateItem.lsRebateReturnProducts.push(isExist)) : (lsRebateReturnProduct.oProduct || (lsRebateReturnProduct.oProduct = item.sku && item.sku.oProduct),
                    lsRebateReturnProduct.lsSkusList.push(item.sku))),
                    $$.isArray(lsRebateReturnProduct.lsSkusList) && lsRebateReturnProduct.lsSkusList.forEach(function(skuItem) {
                        skuItem.isMainUnit = "UNIT" == lsRebateReturnProduct.cUnitType,
                        skuItem.unit = skuItem.unitName = lsRebateReturnProduct.oProduct && lsRebateReturnProduct.oProduct.oUnit && lsRebateReturnProduct.oProduct.oUnit.cName,
                        1 == lsRebateReturnProduct.lsSkusList.length && (skuItem.iUsedQuantity = lsRebateReturnProduct.iUsedQuantity),
                        item.iRebateReturnProductId == lsRebateReturnProduct.id && skuItem.id == item.iSKUId && (skuItem.iQuantity = item.iQuantity,
                        "u8c" === cb.rest.runtime.env ? skuItem.input_num = "UNIT" == lsRebateReturnProduct.unitCategory || skuItem.oProduct && "UNIT" == skuItem.oProduct.isAuxUnitOrder ? item.iQuantity : item.iAuxUnitQuantity : skuItem.input_num = "UNIT" == lsRebateReturnProduct.cUnitType ? item.iQuantity : item.iAuxUnitQuantity,
                        item.iAuxUnitQuantity) && (skuItem.iAuxUnitQuantity = item.iAuxUnitQuantity,
                        skuItem.auxUnit = skuItem.auxUnitName = skuItem.oProductAuxUnit ? skuItem.oProductAuxUnit.oUnit.cName : "")
                    })
                })
            })
        }))
    },
    renderFooter: function() {
        var data = this.tool.getRender.call(this)
          , data = this.tplRebateSelectToolbar(data);
        $$(this.container).find(".toolbar .rebateSelectContainer").html(data)
    }
};
