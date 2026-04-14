/*! u-order-mobile 2024-01-13 */
UOrderApp.ns("UOrderApp.pages"),
    UOrderApp.pages.EditOrderDetailController = function () {
        Template7.registerPartial("detailTitle", $$("#tpl_new_order_title_content").html()),
            this.addrListFunc = Template7.compile($$("#eo-AddressTpl").html()),
            this.storeAddressListFunc = Template7.compile($$("#eo-StoreAddressList").html()),
            this.baseInfoFunc = Template7.compile($$("#eo-baseInfoTpl").html()),
            this.invoiceFunc = Template7.compile($$("#eo-invoiceTpl").html()),
            this.paywayandshippingFunc = Template7.compile($$("#eo-paywayandshippingTpl").html()),
            this.productDetailFunc = Template7.compile($$("#eo-productDetailTpl").html()),
            this.productPartInfoFunc = Template7.compile($$("#eo-partOrderInfoTpl").html()),
            this.headerUseDefines = Template7.compile($$("#eo-headerUseDefines").html()),
            this.tplEditOrderTotal = Template7.compile($$("#tpl-editOrder-total").html()),
            this.tplEditOrderToolbartotal = Template7.compile($$("#tpl-editOrder-toolbartotal").html())
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.preprocess = function (content, url, next) {
        this.context = $$.parseUrlQuery(url) || {},
            this.context.title = this.context.cOrderNo && "add" != this.context.type ? "订单修改" : "新增订单",
            this.context.isShowSkuPic = cb.FunctionOptions.SHOWPRODUCTSKUIMAGE,
            this.temp = {
                isHidePrice: $$.isArray(cb.rest.appContext.hidePrice) && 0 < cb.rest.appContext.hidePrice.length,
                isCorpUser: !!cb.rest.appContext.corpUser,
                papers: new Array,
                isShowOrgs: cb.rest.appContext.context.isShowOrgs,
                isMultBiz: 2 == cb.rest.appContext.context.bizMode || 4 == cb.rest.appContext.context.bizMode
            },
            !cb.FunctionOptions.ORDERSHOWWAY && cb.rest.appContext.context.currency && (this.temp.currTypeSign = cb.rest.appContext.context.currency.currTypeSign),
            this.temp.isCorpUser && (cb.rest.appContext.autData = cb.rest.appContext.corpAutData),
            this.data = {},
            this.context.isShowChooseGift = cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && cb.FunctionOptions.USERSELECTGIVEAWAY,
            this.context.isShowSubmit = cb.rest.appContext.autData.agentOrderSubmit && cb.rest.appContext.autData.agentBuyProduct,
            this.context.isShowSave = !(cb.rest.appContext.corpUser || 2 == cb.rest.appContext.context.userType || !cb.rest.appContext.autData.agentBuyProduct || "u8c" == cb.rest.runtime.env && 0 == cb.rest.appContext.context.userType),
            this.context.isShowAddress = "u8c" === cb.rest.runtime.env && cb.FunctionOptions.ALLOWCHOOSETERMINALSTORE,
            this.load.loadBizs.call(this, function () {
                var resultContent = Template7.compile(content)(this.context);
                next(resultContent)
            })
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.pageInit = function (page) {
        this.init(page),
            this.temp.page = page,
            this.load.orderDetail.call(this),
            this.once(page)
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.init = function (page) {
        this.isCommit = !1,
            this.isPost = !1,
            this.isKeyPadOpen = !1,
            this.dataPage = $$(page.container),
            this.selectors = {
                btnAddRemark: this.dataPage.find(".all-message.add-remarks-btn"),
                headLiItem: this.dataPage.find(".editOrderDetailContent li"),
                productDetailContainer: this.dataPage.find(".productDetailContainer"),
                rebateContainer: this.dataPage.find(".page-content .confirmList-rabeta"),
                manualChooseGift: this.dataPage.find(".page-content .js-eo-chooseGift"),
                headerDefine: this.dataPage.find(".align-top.userDefines"),
                toolBarButtons: this.dataPage.find(".toolbar.editOrderToolbuttons"),
                statisticContainer: this.dataPage.find(".page-content-inner > .statistic"),
                addressContainer: this.dataPage.find(".editOrderDetailContent .addressContent"),
                storeContainer: this.dataPage.find(".editOrderDetailContent .storeContent"),
                baseInfoContainer: this.dataPage.find(".editOrderDetailContent .baseInfoContent"),
                invoiceContainer: this.dataPage.find(".editOrderDetailContent .invoiceContent"),
                paywayandshippingContainer: this.dataPage.find(".editOrderDetailContent .paywayandshippingContent"),
                toolbarContainer: this.dataPage.find(".toolbar .pay-info"),
                noticeBar: this.dataPage.find(".page-content .notice-bar")
            },
            this.selectors.toolBarButtons.addClass("hide")
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.once = function (page) {
        var self = this;
        cb.native.autoKeyboard(page.container, ".input-orderMsg-container"),
            this.selectors.rebateContainer.on("input", ".input-orderMsg-container", function (e) {
                var val = $$(this).val();
                255 < val.length && $$(this).val($$(this).val().substr(0, 255)),
                    $$(this).parent().find("span").html(255 - val.length)
            }),
            this.selectors.headLiItem.on("click", function () {
                var ds, link, header, data;
                $$(this).hasClass("btn-isShowMore") ? ($$(this).prevAll().toggleClass("hide"),
                    $$(this).parent().children().eq(0).removeClass("hide"),
                    $$(this).parent().children(".hide").length ? $$(this).text("展开更多") : $$(this).text("收起更多")) : (ds = $$(this).dataset(),
                        cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && ["paywayandshipping", "useDefines", "baseInfo", "invoice"].indexOf(ds.key) < 0 || ("invoice" == ds.key ? ((data = cb.cache.get(ds.key) || self.tool.format.call(self, ds.key)).agentId = self.newOrder.iAgentId,
                            data.iBankId = self.newOrder.cBank ? self.newOrder.cBank.id : null,
                            data.oAgent = self.newOrder.oAgent,
                            myApp.mainView.router.loadPage({
                                url: ds.link + "?isSelectModel=true&fromOrder=true&agentId=" + self.newOrder.iAgentId,
                                query: data
                            })) : "paywayandshipping" == ds.key ? ((data = cb.cache.get(ds.key) || self.tool.format.call(self, ds.key)).clientPaywayCode = self.newOrder.oPayWayCode && self.newOrder.oPayWayCode.cCode,
                                data.agentRelationId = self.newOrder.agentRelationId,
                                myApp.mainView.router.loadPage({
                                    url: ds.link,
                                    query: data
                                })) : "useDefines" == ds.key ? (data = cb.cache.get("orderDefines"),
                                    link = ds.link + "?orderType=order&archiveType=1" + (self.newOrder.bizId ? "&bizId=" + self.newOrder.bizId : ""),
                                    header = {},
                                    $$.isArray(data.header) && data.header.forEach(function (item) {
                                        header[item.name] = item.value,
                                            self.temp.isCorpUser && "iTransactionTypeId" == item.name && (header[item.name] = item.transaction.name),
                                            item.transaction && (header.transaction = item.transaction)
                                    }),
                                    myApp.mainView.router.loadPage({
                                        url: link,
                                        query: {
                                            useDefines: header,
                                            order: self.newOrder,
                                            type: "order"
                                        }
                                    })) : ("baseInfo" == ds.key ? ((data = cb.cache.get("baseInfo")).isRequiredHopeReceiveDate = self.newOrder.isRequiredHopeReceiveDate,
                                        data.isShowHopeReceiveDate = self.newOrder.isShowHopeReceiveDate,
                                        data.dOrderCreateDate = self.newOrder.dOrderCreateDate || "--") : data = cb.cache.get(ds.key) || self.tool.format.call(self, ds.key),
                                        myApp.mainView.router.loadPage({
                                            url: ds.link,
                                            query: data
                                        }))))
            }),
            setTimeout(function () {
                900 < window.screen.height && $$(page.container).find(".btn-isShowMore").trigger("click")
            }, 100),
            this.selectors.productDetailContainer.on("change", ".item-title .label-switch", function (e) {
                self.data.isCalcPromotionBtn = e.target.checked,
                    self.data.isCalcPromotionBtn && self.load.computePromotion.call(self)
            }),
            this.selectors.btnAddRemark.on("click", function () {
                myApp.mainView.router.loadPage({
                    url: "pages/addRemarks.html",
                    query: {
                        orderInfo: self.newOrder
                    }
                })
            }),
            this.selectors.productDetailContainer.on("click", ".discountDescContainer", function (e) {
                e.stopPropagation();
                var e = $$(this)
                    , pid = $$(this).attr("data-productid")
                    , ds = $$(this).dataset();
                upcommon.showGiftInfo(e, pid, ds.unitname)
            }),
            this.selectors.productDetailContainer.on("click", ".sku-media-content .item-media img", function () {
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
                        onClose: function (photobrowser) {
                            console.log("执行了关闭"),
                                cb.photoBrowser = null
                        },
                        onClick: function (swiper) {
                            setTimeout(function () {
                                cb.photoBrowser && cb.photoBrowser.opened && cb.photoBrowser.close()
                            }, 500)
                        }
                    }),
                    cb.photoBrowser.open())
            }),
            this.selectors.productDetailContainer.on("click", ".combine a", function (e) {
                var details, cid, group, e = $$(e.target);
                cid = e.parents("[data-cid]").data("cid"),
                    group = self.newOrder.oOrderDetailGroups.find(function (item) {
                        return item.suiteGroup === cid
                    }),
                    "u8c" === cb.rest.runtime.env && group ? myApp.mainView.router.loadPage({
                        url: "pages/suiteGroup.html",
                        query: {
                            order: self.newOrder,
                            group: group
                        }
                    }) : (cid = Number(e.parents("[data-cid]").data("cid")),
                        (group = self.newOrder.oOrderDetailGroups.filter(function (item) {
                            return item.iComPromotionGroupId === cid
                        })) && group.length && (details = new Array,
                            self.newOrder.oOrderDetails.forEach(function (item) {
                                item.iGroupIndex == group[0].index && details.push({
                                    iSKUId: item.iSKUId,
                                    iQuantity: item.iQuantity,
                                    iAuxUnitQuantity: item.iAuxUnitQuantity,
                                    iComPreGroupId: group[0].iComPromotionGroupId,
                                    iGroupQuantity: group[0].iGroupQuantity,
                                    bizId: item.bizId,
                                    saleOrgId: item.salesOrgId
                                })
                            }),
                            myApp.mainView.router.loadPage({
                                url: "pages/combineEdit.html",
                                query: {
                                    details: details
                                }
                            })))
            }),
            this.selectors.productDetailContainer.on("click", ".body-define", function () {
                var data = cb.cache.get("orderDefines")
                    , ds = $$(this).dataset()
                    , cloneOrder = cb.utils.extend(!0, {}, self.newOrder)
                    , detail = cloneOrder.oOrderDetails.find(function (item) {
                        return item.idKey == ds.idkey
                    })
                    , query = {
                        container: $$(this),
                        iSKUId: ds.iskuid,
                        order: cloneOrder,
                        type: "order"
                    };
                data && data.body && $$.each(data.body, function (key, item) {
                    item.idKey == ds.idkey && (query.useDefines = item,
                        "NONE" != cb.FunctionOptions.SHOWAGENTORG) && detail.iSaleOrgId && (query.useDefines.simpleOrg = {
                            iSaleOrgId: detail.iSaleOrgId,
                            cSaleOrgName: detail.cSaleOrgName
                        })
                }),
                    query.useDefines || (query.useDefines = {
                        iSKUId: ds.iskuid,
                        idKey: ds.idkey
                    }),
                    detail.dSendDate && (query.useDefines.dSendDate = detail.dSendDate),
                    myApp.mainView.router.loadPage({
                        url: "pages/useDefines.html?orderType=order&archiveType=2" + (detail ? "&bizId=" + detail.bizId : ""),
                        query: query
                    })
            }),
            this.selectors.rebateContainer.on("click", ".toEnclosureListModify", function () {
                "u8c" === cb.rest.runtime.env ? myApp.mainView.router.load({
                    url: "pages/ucEclosureListModify.html",
                    query: {
                        orderId: self.newOrder.id || self.oldObjectId,
                        orderType: "add"
                    }
                }) : myApp.mainView.router.load({
                    url: "pages/enclosureListModify.html",
                    query: {
                        papers: self.newOrder.oAttachments,
                        orderType: "order"
                    }
                })
            }),
            this.selectors.rebateContainer.on("click", ".btn", function () {
                var cOrderNo = self.newOrder.cOrderNo
                    , dataType = $$(this).attr("data-type");
                if (dataType && cOrderNo)
                    switch (dataType) {
                        case "saveMessage":
                            var msg = (msg = self.selectors.rebateContainer.find(".input-orderMsg-container").val()) && msg.replace(upcommon.regs.emoji, "");
                            cb.rest.postData({
                                url: cb.router.HTTP_ORDER_ADDORDERMEMO,
                                params: {
                                    cRemark: msg,
                                    cOrderNo: cOrderNo
                                },
                                success: function (data) {
                                    200 == data.code && cb.rest.getJSON({
                                        url: cb.router.HTTP_ORDER_FINDORDERMEMOS,
                                        params: {
                                            cOrderNo: cOrderNo,
                                            pageSize: 999
                                        },
                                        success: function (data) {
                                            var cloneOrder = cb.utils.extend(!0, {}, self.newOrder)
                                                , data = (cloneOrder.oOrderMemos = data.data,
                                                    cloneOrder.isHidePrice = self.temp.isHidePrice,
                                                    cloneOrder.fRebateTotalMoney = self.selectors.rebateContainer.find("#spanUseableM").text(),
                                                    cloneOrder.isHideMondiyDetail = cloneOrder.cSeparatePromotionType && "old" == cloneOrder.cSeparatePromotionType,
                                                    (cloneOrder = self.tool.choosePromotions.call(self, cloneOrder)).isShowRebate = "u8c" != cb.rest.runtime.env,
                                                    cloneOrder.isYs = "u8c" === cb.rest.runtime.env,
                                                    self.temp.isHidePrice || cb.cache.set("order", cloneOrder),
                                                    self.productPartInfoFunc(cloneOrder));
                                            self.selectors.rebateContainer.html(data),
                                                self.selectors.rebateContainer.find("#spanUseableM").text(cloneOrder.fRebateTotalMoney),
                                                self.load.rebate.call(self, cloneOrder)
                                        }
                                    })
                                },
                                error: function (err) {
                                    myApp.toast(err.message, "error").show(!0)
                                }
                            });
                            break;
                        case "checkAll":
                            myApp.mainView.router.load({
                                url: "pages/allMessage.html",
                                query: {
                                    cOrderNo: cOrderNo
                                }
                            });
                            break;
                        case "addMessage":
                            myApp.mainView.router.load({
                                url: "pages/addMessage.html",
                                query: {
                                    cOrderNo: cOrderNo,
                                    type: "add"
                                }
                            })
                    }
            }),
            this.selectors.rebateContainer.on("change", ".enclosure #file", function () {
                $$(this).attr("name", "file");
                var file = $$(this)[0];
                myApp.showIndicator(),
                    cb.rest.backStatus = !1,
                    cb.rest.uploadPaper("mf/uploadAttachments", file, function (data) {
                        if (200 != data.code)
                            return myApp.hideIndicator(),
                                myApp.toast(data.message, "error").show(!0),
                                $$("#uploadIframe").remove(),
                                !1;
                        myApp.hideIndicator(),
                            self.newOrder.oAttachments.push(data.data),
                            self.temp.isHidePrice && (self.cloneOrder.oAttachments = self.newOrder.oAttachments),
                            self.dataPage.find(".enclosure .item-title.num-title").html("附件(" + self.newOrder.oAttachments.length + ")"),
                            self.dataPage.find(".enclosure #fileChange").html("/修改"),
                            self.dataPage.find("#uploadIframe").remove(),
                            myApp.toast("上传成功", "success").show(!0),
                            cb.rest.backStatus = !0
                    }, function (e) {
                        myApp.hideIndicator(),
                            myApp.toast(e, "error").show(!0),
                            self.dataPage.find("#uploadIframe").remove(),
                            cb.rest.backStatus = !0
                    })
            }),
            this.selectors.productDetailContainer.on("click", "li:first-child i", function () {
                var query;
                $$(this).hasClass("icon-del") ? ($$(this).addClass("hide"),
                    $$(this).nextAll(".icon-add-bank").addClass("hide"),
                    $$(this).parent().children(".finish").removeClass("hide"),
                    self.selectors.productDetailContainer.children("li.productItemContent").addClass("del-orders"),
                    self.selectors.toolBarButtons.children("div").toggleClass("hide")) : $$(this).hasClass("finish") ? ($$(this).addClass("hide"),
                        $$(this).nextAll(".icon-add-bank").removeClass("hide"),
                        $$(this).parent().children(".icon-del").removeClass("hide"),
                        self.selectors.productDetailContainer.children("li.productItemContent").removeClass("del-orders"),
                        self.selectors.toolBarButtons.children("div").toggleClass("hide")) : $$(this).hasClass("icon-add-bank") ? (query = {
                            iAgentId: self.newOrder.iAgentId,
                            productUnit: {
                                OPENAUXUNIT: cb.FunctionOptions.OPENAUXUNIT
                            },
                            order: self.newOrder,
                            isOrder: !0
                        },
                            self.newOrder.bizId && (query.bizId = self.newOrder.bizId),
                            self.newOrder.salesOrgId && (query.salesOrgId = self.newOrder.salesOrgId),
                            cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && (query.isShowAllProduct = !0),
                            myApp.mainView.router.loadPage({
                                url: "pages/commodtyList.html",
                                query: query
                            })) : $$(this).hasClass("icon-arrow-up") ? ($$(this).removeClass("icon-arrow-up").addClass("icon-arrow-down"),
                                $$(this).parents("li").nextAll().addClass("hide"),
                                $$(this).parents(".list-block.media-list").children(".order-btn.message-btn").addClass("hide")) : $$(this).hasClass("icon-arrow-down") && ($$(this).removeClass("icon-arrow-down").addClass("icon-arrow-up"),
                                    $$(this).parents("li").nextAll().removeClass("hide"),
                                    $$(this).parents(".list-block.media-list").children(".order-btn.message-btn").removeClass("hide"))
            }),
            this.selectors.toolBarButtons.on("click", "a", function () {
                var ds = $$(this).dataset()
                    , $$self = $$(this);
                switch (ds.type) {
                    case "calcel":
                        self.selectors.toolBarButtons.children("div").toggleClass("hide"),
                            self.selectors.productDetailContainer.children("li:first-child").find("i.icon-del").removeClass("hide"),
                            self.selectors.productDetailContainer.children("li:first-child").find("i.icon-add-bank").removeClass("hide"),
                            self.selectors.productDetailContainer.children("li:first-child").find("i.finish").addClass("hide"),
                            self.selectors.productDetailContainer.children("li.productItemContent").removeClass("del-orders");
                        break;
                    case "del":
                        cb.confirm("是否确定要删除该商品？", "提示信息", function () {
                            cb.rest.appContext.isAgentOrder || !self.temp.isCorpUser ? self.selectors.productDetailContainer.find('li.productItemContent input[type="checkbox"]:checked').length ? (self.selectors.toolBarButtons.children("div").toggleClass("hide"),
                                self.newOrder.bClearGiveaway = !0,
                                self.load.computePromotion.call(self, {
                                    isAddCart: cb.FunctionOptions.PRODUCTRETURNSHOPPINGCART
                                })) : myApp.toast("请选择要删除的商品", "tips").show(!0) : self.selectors.productDetailContainer.children("li.productItemContent").find('input[type="checkbox"]:checked').length ? (self.newOrder.bClearGiveaway = !0,
                                    self.load.computePromotion.call(self),
                                    self.selectors.toolBarButtons.children("div").toggleClass("hide")) : myApp.toast("请选择要删除的商品", "tips").show(!0)
                        });
                        break;
                    case "submit":
                    case "save":
                        self.tool.debounce(function () {
                            self.newOrder.oAgent.freezeAccountFlag ? myApp.toast("您的账号已被冻结，不能提交单据", "tips").show(!0) : self.load.submitOrder.call(self, $$self)
                        }, 1500);
                        break;
                    case "define":
                        var params, define = self.definesData.header.find(function (item) {
                            return item.id == ds.defineid
                        });
                        define && 15 === define.fieldType && define.outerDataUrl && (params = {
                            data: {
                                model: self.temp.isHidePrice ? self.cloneOrder : self.newOrder,
                                context: {
                                    clientType: 2,
                                    user: cb.rest.appContext.context
                                }
                            }
                        },
                            cb.rest.postData({
                                url: cb.router.HTTP_COMMON_DEFINEBUTTONLINK.format(define.id),
                                params: params,
                                success: function (data) {
                                    ((data = "string" == typeof data ? JSON.parse(data) : data).data || data.message) && myApp.toast(data.data || data.message, "tips").show(!0)
                                },
                                error: function (e) {
                                    myApp.toast(e.message, "tips").show(!0)
                                }
                            }))
                }
            }),
            this.selectors.toolBarButtons.on("change", function () {
                var checked = $$(this).find("input")[0].checked;
                self.selectors.productDetailContainer.find('input[type="checkbox"]').each(function () {
                    this.checked = checked
                })
            }),
            this.selectors.productDetailContainer.on("change", 'input[type="checkbox"]', function (e) {
                var checked = !1
                    , e = ($$(e.target).hasClass("pro-cbox") ? (checked = e.target.checked,
                        $$(this).parents(".productItemContent").find('input[type="checkbox"]').each(function () {
                            this.checked = checked
                        })) : $$(e.target).hasClass("sku-cbox") && (checked = $$(this).parents(".proCheckPoint").find('input[type="checkbox"]:checked').length == $$(this).parents(".proCheckPoint").find('input[type="checkbox"]').length,
                            $$(this).parents(".productItemContent").children(".label-checkbox").find("input")[0].checked = checked),
                        self.selectors.productDetailContainer.children(".productItemContent.del-orders"));
                e.find('.label-checkbox.item-content input[type="checkbox"]:checked').length == e.find('.label-checkbox.item-content input[type="checkbox"]').length ? self.selectors.toolBarButtons.find('input[type="checkbox"]').each(function () {
                    this.checked = !0
                }) : self.selectors.toolBarButtons.find('input[type="checkbox"]').each(function () {
                    this.checked = !1
                })
            }),
            this.selectors.productDetailContainer.on("click", ".combine input", function () {
                "checkbox" !== this.type && ($$(this).addClass("readOnly"),
                    myApp.keypad({
                        input: this,
                        toolbarCloseText: "完成",
                        decimalLength: 0,
                        scrollToInput: !0,
                        onClose: function (p) {
                            var ds = p.input.dataset()
                                , element = p.input.parents(".combine")
                                , value = "" === p.input.val() ? 1 : Number(p.input.val())
                                , cid = Number(element.data("cid"))
                                , element = (ds.min && parseInt(ds.min) > value && (value = ds.min,
                                    myApp.toast("不能低于最小起订套数", "tips").show(!0),
                                    setTimeout(function () {
                                        p.input.val(ds.min)
                                    }, 10)),
                                    self.temp.isHidePrice ? self.cloneOrder : self.newOrder)
                                , detailGroup = element.oOrderDetailGroups.filter(function (item) {
                                    return item.iComPromotionGroupId && item.iComPromotionGroupId === cid
                                })[0];
                            element.oOrderDetails.forEach(function (item) {
                                var quantity, auxUnitQuantity;
                                item.iGroupIndex === detailGroup.index && (quantity = item.iQuantity / detailGroup.iGroupQuantity * value,
                                    auxUnitQuantity = item.iAuxUnitQuantity / detailGroup.iGroupQuantity * value,
                                    item.iQuantity = upcommon.unitPreciseCalc(quantity, item.oSKU.oProduct.oUnit.unitPrecision, item.oSKU.oProduct.oUnit.unitRoundType),
                                    item.oSKU.oProductAuxUnit) && (item.iAuxUnitQuantity = upcommon.unitPreciseCalc(auxUnitQuantity, item.oSKU.oProductAuxUnit.oUnit.unitPrecision, item.oSKU.oProductAuxUnit.oUnit.unitRoundType))
                            }),
                                self.load.computePromotion.call(self)
                        }
                    }).open())
            }),
            cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && cb.FunctionOptions.USERSELECTGIVEAWAY && this.selectors.manualChooseGift.on("click", function () {
                myApp.mainView.router.loadPage({
                    url: "pages/commodtyList.html",
                    query: {
                        iAgentId: self.newOrder.iAgentId,
                        type: "chooseGift",
                        isShowAllProduct: !0,
                        productUnit: {
                            OPENAUXUNIT: cb.FunctionOptions.OPENAUXUNIT
                        },
                        bizId: self.newOrder.bizId,
                        salesOrgId: self.newOrder.salesOrgId || null,
                        order: self.newOrder
                    }
                })
            }),
            $$(document).on("pageBack", '.page[data-page="EditOrderDetail"]', function () {
                cb.cache.del("address,baseInfo,invoice,paywayandshipping,rebateAmount,useDefines,orderDefines,order")
            }),
            this.selectors.productDetailContainer.on("click", 'input[type="numpad"]', function () {
                $$(this).addClass("inputActive");
                var ds = $$(this).dataset()
                    , ds = "" !== ds.unitprecision ? parseInt(ds.unitprecision) : 2;
                self.isKeyPadOpen || (self.isKeyPadOpen = !0,
                    myApp.keypad({
                        input: this,
                        toolbarCloseText: "完成",
                        decimalLength: ds,
                        scrollToInput: !0,
                        onOpen: function (p) {
                            $$(".productDetailContainer").css("padding-bottom", "200px");
                            var p = p.input.offset()
                                , height = window !== top ? $$("body").height() : Template7.global.deviceHeight;
                            p.top > height - 260 && (p = p.top - height + 300 + myApp.getScroller().scrollTop(),
                                myApp.getScroller().scrollTop(p, 300))
                        },
                        onChange: function (p, val) {
                            var currentDetail, conv, convTxt, iQuantity, idkey, iQuantityObj, unitprecision, unitroundtype, oldPrice, oldFParticularlyMoney, specialOffer, spceialSpan;
                            val = val ? parseFloat(val) : 0,
                                isNaN(val) && (val = 0),
                                p.input.hasClass("corp-editPrice") ? (val = parseFloat(val),
                                    iQuantity = p.input.parent().find("input.cart-sku-num-input").val(),
                                    idkey = p.input.parents(".productconv").attr("data-idkey"),
                                    iQuantityObj = self.tool.convert.call(self, idkey, iQuantity),
                                    p.input.parents(".productconv").find("input.cart-sku-price-input").val(cb.utils.FloatCalc.divide(val, iQuantityObj.iQuantity)),
                                    oldPrice = parseFloat(p.input.attr("data-val")),
                                    oldFParticularlyMoney = (oldFParticularlyMoney = p.input.attr("data-fParticularlyMoney")) ? parseFloat(oldFParticularlyMoney) : 0,
                                    specialOffer = oldPrice - val,
                                    (spceialSpan = document.createElement("span")).className = "specialOffer " + (cb.FunctionOptions.HIDEPORDERROMOTION ? "hide" : ""),
                                    spceialSpan.innerHTML = "特殊优惠" + (self.temp.currTypeSign || "") + (oldFParticularlyMoney + specialOffer).toFixed(2),
                                    p.input.parent().children(".specialOffer").length && p.input.parent().children(".specialOffer").detach(),
                                    specialOffer + oldFParticularlyMoney != 0 && (p.input.parent().prepend(spceialSpan),
                                        p.input.parent().children(".specialOffer").attr("data-specialOffer", oldFParticularlyMoney + specialOffer))) : p.input.hasClass("cart-sku-num-input") ? self.newOrder && (idkey = p.input.parents(".productconv").attr("data-idkey"),
                                            iQuantity = parseFloat(val),
                                            isNaN(iQuantity) && (iQuantity = 0),
                                            upcommon.checkUnitPrecise(p.input) || (p.input.val(upcommon.unitPrecise(p.input)),
                                                iQuantity = parseFloat(p.input.val())),
                                            currentDetail = self.newOrder.oOrderDetails.find(function (item) {
                                                return item.idKey == idkey
                                            }),
                                            cb.FunctionOptions.OPENAUXUNIT) && currentDetail && currentDetail.oSKU.hasOwnProperty("oProductAuxUnit") && (unitprecision = (conv = p.input.parent().children(".conv")).data("unitprecision") && parseInt(conv.data("unitprecision")),
                                                unitroundtype = conv.data("unitroundtype") && parseInt(conv.data("unitroundtype")),
                                                currentDetail.oSKU.oProduct && "AUXUNIT" != currentDetail.oSKU.oProduct.isAuxUnitOrder || self.temp.isCorpUser && !cb.rest.appContext.isAgentOrder ? (convTxt = cb.utils.FloatCalc.divide(iQuantity, currentDetail.oSKU.oProductAuxUnit.iConversionRate),
                                                    convTxt = upcommon.unitPreciseCalc(convTxt, unitprecision, unitroundtype),
                                                    conv.html("(" + convTxt + currentDetail.cProductAuxUnitName + ")")) : (convTxt = cb.utils.FloatCalc.mult(currentDetail.oSKU.oProductAuxUnit.iConversionRate, iQuantity),
                                                        convTxt = upcommon.unitPreciseCalc(convTxt, unitprecision, unitroundtype),
                                                        conv.html("(" + convTxt + currentDetail.cProductUnitName + ")"))) : p.input.hasClass("cart-sku-price-input") && self.newOrder && (p.input.parents(".productconv").attr("data-productid"),
                                                            p.input.parents(".productconv").attr("data-skuid"),
                                                            iQuantity = p.input.parents(".productconv").find(".editControl.cart-sku-num-input").val(),
                                                            idkey = p.input.parents(".productconv").attr("data-idkey"),
                                                            iQuantityObj = self.tool.convert.call(self, idkey, iQuantity),
                                                            unitprecision = cb.utils.FloatCalc.mult(val, iQuantityObj.iQuantity),
                                                            (unitroundtype = p.input.parents(".productconv").find(".corp-editPrice")).val(unitprecision.toFixed(self.newOrder.originalCurrencyVo.priceDigit)),
                                                            val = unitprecision,
                                                            oldPrice = parseFloat(unitroundtype.attr("data-val")),
                                                            oldFParticularlyMoney = (oldFParticularlyMoney = unitroundtype.attr("data-fParticularlyMoney")) ? parseFloat(oldFParticularlyMoney) : 0,
                                                            specialOffer = oldPrice - val,
                                                            (spceialSpan = document.createElement("span")).className = "specialOffer " + (cb.FunctionOptions.HIDEPORDERROMOTION ? "hide" : ""),
                                                            spceialSpan.innerHTML = "特殊优惠" + (self.temp.currTypeSign || "") + cb.utils.FloatCalc.add(oldFParticularlyMoney, specialOffer),
                                                            unitroundtype.parent().children(".specialOffer").length && unitroundtype.parent().children(".specialOffer").detach(),
                                                            specialOffer + oldFParticularlyMoney != 0) && (unitroundtype.parent().prepend(spceialSpan),
                                                                unitroundtype.parent().children(".specialOffer").attr("data-specialOffer", oldFParticularlyMoney + specialOffer))
                        },
                        onClose: function (p) {
                            p.input.hasClass("inputActive") && p.input.removeClass("inputActive"),
                                $$(".productDetailContainer").css("padding-bottom", "0");
                            var orderInfo, val = p.input.val(), min = p.input.attr("data-min"), val = val ? parseFloat(val) : 0, cloneVal = val = isNaN(val) ? 0 : val;
                            if (p.input.hasClass("cart-sku-num-input")) {
                                min && parseFloat(min) > parseFloat(val) && (myApp.toast("数量不能低于最小起订量" + min, "tips").show(!0),
                                    val = min);
                                var idkey = p.input.parents(".productconv").attr("data-idKey")
                                    , iQuantity = parseFloat(val)
                                    , order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder;
                                if (!order)
                                    return;
                                function setStepVal(cloneVal, item, min) {
                                    var times = Math.ceil(cb.utils.FloatCalc.divide(cloneVal, item.oSKU.oProduct.enquiryQuintuple)) || 1;
                                    return cloneVal = cb.utils.FloatCalc.mult(item.oSKU.oProduct.enquiryQuintuple, times),
                                        min && parseFloat(min) > parseFloat(cloneVal) ? parseFloat(min) : cloneVal
                                }
                                order.oOrderDetails.forEach(function (item) {
                                    var unitprecision, conv;
                                    idkey == item.idKey && ("GIFT" == item.cOrderProductType ? (self.cloneOrder && (self.cloneOrder.isOnlyEditUserAddGiveaway = !0),
                                        self.newOrder.isOnlyEditUserAddGiveaway = !0) : (self.cloneOrder && (self.cloneOrder.isOnlyEditUserAddGiveaway = !1),
                                            self.newOrder.isOnlyEditUserAddGiveaway = !1),
                                        self.tool.clearDefines.call(self, idkey),
                                        item.oOrderProductApportions = null,
                                        unitprecision = (conv = p.input.parent().children(".conv")).data("unitprecision") && parseInt(conv.data("unitprecision")),
                                        conv = conv.data("unitroundtype") && parseInt(conv.data("unitroundtype")),
                                        cb.FunctionOptions.OPENAUXUNIT ? item.oSKU.hasOwnProperty("oProductAuxUnit") ? item.oSKU.oProduct && "AUXUNIT" != item.oSKU.oProduct.isAuxUnitOrder || self.temp.isCorpUser && !cb.rest.appContext.isAgentOrder ? (item.oSKU.oProduct.enquiryQuintuple && (iQuantity = setStepVal(cloneVal, item, min)),
                                            item.iQuantity = iQuantity,
                                            item.iAuxUnitQuantity = cb.utils.FloatCalc.divide(item.iQuantity, item.oSKU.oProductAuxUnit.iConversionRate),
                                            item.iAuxUnitQuantity = upcommon.unitPreciseCalc(item.iAuxUnitQuantity, unitprecision, conv)) : item.oSKU.hasOwnProperty("oProductAuxUnit") && (item.oSKU.oProduct.enquiryQuintuple && (iQuantity = setStepVal(cb.utils.FloatCalc.mult(item.oSKU.oProductAuxUnit.iConversionRate, cloneVal), item, item.oSKU.iMinOrderQuantity),
                                                item.iQuantity = iQuantity,
                                                item.iAuxUnitQuantity = cb.utils.FloatCalc.divide(item.iQuantity, item.iConversionRate),
                                                item.iAuxUnitQuantity = upcommon.unitPreciseCalc(item.iAuxUnitQuantity, unitprecision, conv)),
                                                item.iQuantity = upcommon.unitPreciseCalc(cb.utils.FloatCalc.mult(item.oSKU.oProductAuxUnit.iConversionRate, iQuantity), item.oSKU.oProduct.oUnit.unitPrecision, item.oSKU.oProduct.oUnit.unitRoundType),
                                                item.iAuxUnitQuantity = iQuantity) : item.cProductAuxUnitName && null != item.iAuxUnitQuantity && item.iConversionRate ? (item.oSKU.oProduct.enquiryQuintuple && (iQuantity = setStepVal(cloneVal, item, min)),
                                                    item.iQuantity = iQuantity,
                                                    item.iAuxUnitQuantity = cb.utils.FloatCalc.divide(item.iQuantity, item.iConversionRate),
                                                    item.iAuxUnitQuantity = upcommon.unitPreciseCalc(item.iAuxUnitQuantity, unitprecision, conv)) : (item.oSKU.oProduct.enquiryQuintuple && (iQuantity = setStepVal(cloneVal, item, min)),
                                                        item.iQuantity = iQuantity) : (item.oSKU.oProduct.enquiryQuintuple && (iQuantity = setStepVal(cloneVal, item, min)),
                                                            item.iQuantity = iQuantity),
                                        item.oOrderProductApportions || delete item.oOrderProductApportions)
                                }),
                                    order.bClearGiveaway = !0,
                                    self.load.computePromotion.call(self)
                            } else
                                (p.input.hasClass("cart-sku-price-input") || p.input.hasClass("corp-editPrice")) && (orderInfo = self.temp.isHidePrice ? self.cloneOrder : self.newOrder,
                                    orderInfo = self.tool.fillDefines(orderInfo),
                                    (self.temp.isCorpUser ? !cb.rest.appContext.isAgentOrder : cb.FunctionOptions.ORDERAGENTMODIFYPRICE) && self.selectors.productDetailContainer.find(".productconv").each(function () {
                                        var fParticularlyMoney, idKey = $$(this).attr("data-idKey"), val = $$(this).find("input.corp-editPrice").val(), oldFParticularlyMoney = (oldFParticularlyMoney = $$(this).find("input.corp-editPrice").attr("data-fParticularlyMoney")) ? parseFloat(oldFParticularlyMoney) : 0;
                                        idKey && (fParticularlyMoney = 0,
                                            orderInfo.oOrderDetails.forEach(function (item) {
                                                var newFParticularlyMoney;
                                                item.idKey == idKey && (item.oOrderProductApportions || (item.oOrderProductApportions = new Array),
                                                    0 != (newFParticularlyMoney = cb.utils.FloatCalc.add(cb.utils.FloatCalc.sub(item.fSalePayMoney, parseFloat(val)), oldFParticularlyMoney)) ? 0 == item.oOrderProductApportions.filter(function (citem) {
                                                        return "PARTICULARLY" == citem.cApportionType
                                                    }).length ? item.oOrderProductApportions.push({
                                                        cApportionName: "特殊优惠",
                                                        cApportionType: "PARTICULARLY",
                                                        cOrderProductType: "SALE",
                                                        fApportionMoney: newFParticularlyMoney
                                                    }) : item.oOrderProductApportions.forEach(function (citem) {
                                                        "PARTICULARLY" == citem.cApportionType && (citem.fApportionMoney = newFParticularlyMoney)
                                                    }) : item.oOrderProductApportions = item.oOrderProductApportions.filter(function (citem) {
                                                        return "PARTICULARLY" != citem.cApportionType
                                                    }),
                                                    item.fSalePayMoney = parseFloat(val),
                                                    item.fParticularlyMoney = newFParticularlyMoney,
                                                    item.fTransactionPrice = cb.utils.FloatCalc.divide(item.fSalePayMoney, item.iQuantity)),
                                                    item.fParticularlyMoney && (fParticularlyMoney = cb.utils.FloatCalc.add(fParticularlyMoney, item.fParticularlyMoney))
                                            }),
                                            orderInfo.fParticularlyMoney = fParticularlyMoney)
                                    }),
                                    self.load.rollbackRebate.call(self, orderInfo, function (order) {
                                        self.load.defineFormula.call(self, order)
                                    }));
                            p.input.val(val),
                                p.destroy()
                        }
                    }).open())
            }),
            this.selectors.productDetailContainer.on("click", ".productItemContent .cdClass", function () {
                var cdObj = $$(this).dataset()
                    , cdObj = {
                        iAgentId: self.newOrder.iAgentId,
                        productUnit: {
                            OPENAUXUNIT: cb.FunctionOptions.OPENAUXUNIT
                        },
                        order: self.newOrder,
                        isOrder: !0,
                        isCD: !0,
                        proId: cdObj.addonproid,
                        promotionType: cdObj.cpromotiontype,
                        promotionId: cdObj.ipreid
                    };
                self.newOrder.bizId && (cdObj.bizId = self.newOrder.bizId),
                    self.newOrder.salesOrgId && (cdObj.salesOrgId = self.newOrder.salesOrgId),
                    myApp.mainView.router.loadPage({
                        url: "pages/commodtyList.html",
                        query: cdObj
                    })
            }),
            $$(page.container).on("click", ".integration-box input", function () {
                var input = this
                    , maxValue = $$(this).parents(".integration-box").find(".useablePoints").text();
                myApp.keypad({
                    maxValue: parseFloat(maxValue),
                    input: input,
                    toolbarCloseText: "完成",
                    dotButton: !1,
                    onClose: function (p) {
                        var order, p = p.input.val() ? parseFloat(p.input.val()) : 0;
                        self.newOrder && self.newOrder.iPoints != p && ((order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder).iPoints = p,
                            cb.rest.postData({
                                url: cb.router.HTTP_ORDER_CALCPOINTSAPPORTION,
                                params: {
                                    order: order
                                },
                                success: function (data) {
                                    200 == data.code && (self.tool.outRender.call(self, data.data),
                                        $$(input).parent().children("span").text("¥" + data.data.fPointsMoney))
                                },
                                error: function (e) {
                                    myApp.toast(e.message, "error").show(!0)
                                }
                            }))
                    }
                }).open()
            }),
            $$(page.container).on("change", ".choose-order-promotion", function () {
                var value = parseFloat($$(this).find("select").val())
                    , isMoney = "money" === $$(this).data("type");
                self[self.temp.isHidePrice ? "cloneOrder" : "newOrder"].oOrderDetailGroups.forEach(function (group) {
                    0 === group.index && (group[isMoney ? "iEntityMoneyPreId" : "iEntityGiveawayPreId"] = value,
                        group.bUserSelected = !1)
                }),
                    self.load.computePromotion.call(self)
            }),
            $$(page.container).on("click", ".coupons-box", function () {
                var coupons = self.context.coupons || {}
                    , orderCoupons = (self.temp.isHidePrice ? self.cloneOrder : self.newOrder).orderCoupons;
                Array.isArray(orderCoupons) && orderCoupons.length ? coupons.usable && coupons.usable.map(function (item) {
                    item.isChecked = item.sn === orderCoupons[0].couponPk
                }) : coupons.usable && coupons.usable.map(function (item) {
                    item.isChecked = !1
                }),
                    myApp.mainView.router.load({
                        url: "pages/coupons.html",
                        query: {
                            coupons: coupons
                        }
                    })
            }),
            self.getRebate = function () {
                var cloneOrderData = cb.utils.extend(!0, {}, self.newOrder);
                cloneOrderData.oRebates = void 0,
                    cloneOrderData.isAutoUseRebate = self.selectors.rebateContainer.find(".rebateClass")[0].checked,
                    cb.rest.postData({
                        url: cb.router.HTTP_ORDER_CALCORDERRATE,
                        params: cloneOrderData,
                        success: function (data) {
                            self.newOrder = data.data,
                                self.load.calcOrderRebate.call(self, {
                                    loadRebate: !0,
                                    order: self.newOrder
                                })
                        }
                    })
            }
            ,
            "u8c" == cb.rest.runtime.env && this.selectors.rebateContainer.on("change", 'input[class="rebateClass"]', self.getRebate)
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.load = {
        orderDetail: function () {
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
        },
        rebate: function (orderInfo) {
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
                            orderInfo.isCanUsedRebate) && (updata.data.displayAvailableRebateTips ? self.selectors.rebateContainer.find(".rabate-tip").addClass("hide").text("") : (tipstxt = "",
                                tipstxt = orderInfo.isCanUsedRebate ? "该订单可用的最大折扣为" + updata.data.surplusMaxRebateMoney + "元,最大抵现为" + updata.data.surplusCashMaxRebateMoney + "元" : "该订单金额未达到" + orderInfo.fMiniRebateRuleMoney + "元，不能使用返利！",
                                self.selectors.rebateContainer.find(".rabate-tip").removeClass("hide").text(tipstxt)),
                                self.selectors.rebateContainer.find("#spanUseableM").parent().html('本次使用 <span id="spanUseableM" class="active-state">' + updata.data.totalRebateMoney + "</span> 元返利"),
                                self.selectors.rebateContainer.find("#spanUseableM").on("click", function () {
                                    var rebateAmount = cb.cache.get("rebateAmount") || {
                                        resultArray: self.tool.initOrderRebate(orderInfo)
                                    };
                                    myApp.mainView.router.loadPage({
                                        url: "pages/rebateSelect.html",
                                        query: {
                                            type: "select",
                                            selectItems: rebateAmount,
                                            orderInfo: self.newOrder,
                                            rebateControl: {
                                                orderMaxRebateMoney: updata.data.orderMaxRebateMoney,
                                                orderCashMaxRebateMoney: updata.data.orderCashMaxRebateMoney,
                                                fPayMoney: cb.utils.FloatCalc.sub(orderInfo.fPayMoney, orderInfo.fReight)
                                            }
                                        }
                                    })
                                }))
                    }
                })
        },
        rollbackRebate: function (order, callback) {
            var self = this
                , order = self.tool.fillDefines(order);
            order = self.tool.dealRebate.call(self, order),
                myApp.showPreloader(),
                cb.rest.postData({
                    url: cb.router.HTTP_ORDER_ROLLBACKORDERREBATE,
                    params: {
                        order: order
                    },
                    success: function (data) {
                        myApp.hidePreloader(),
                            200 == data.code && (data = (self.temp.isHidePrice ? data.oldData : data).data,
                                cb.cache.set("order", data),
                                data.cOrderNo || cb.cache.del("rebateAmount"),
                                callback) && callback.call(self, data)
                    },
                    error: function (err) {
                        myApp.hidePreloader(),
                            myApp.toast(err.message, "error").show(!0)
                    }
                })
        },
        defineFormula: function (order) {
            var self = this
                , order = self.tool.fillDefines(order);
            myApp.showPreloader(),
                cb.rest.postData({
                    url: cb.router.HTTP_ORDER_GETORDERDEFINEFORMULAVALUE,
                    params: {
                        order: order
                    },
                    success: function (data) {
                        var orderDefines;
                        myApp.hidePreloader(),
                            200 == data.code && (self.tool.formatSuitGroup.call(self, data.data),
                                self.tool.mergeOrderDefines.call(self, data.data),
                                self.temp.isHidePrice ? (self.cloneOrder = cb.utils.extend(!0, {}, data.data),
                                    self.newOrder = cb.dataLoop(data.data)) : self.newOrder = data.data,
                                cb.cache.set("order", self.temp.isHidePrice ? self.cloneOrder : self.newOrder),
                                self.tool.isShowRegiht.call(self) && self.temp.isCorpUser && cb.cache.set("baseInfo", self.tool.format.call(self, "baseInfo")),
                                cb.cache.get("orderDefines") && (orderDefines = cb.cache.get("orderDefines"),
                                    $$.isArray(orderDefines.header) && (orderDefines.header.forEach(function (header) {
                                        var value = self.newOrder.oOrderDefine[header.name];
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
                                            for (attr in !body.iTransactionTypeId && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && self.temp.isCorpUser && (headTransaction = orderDefines.header.find(function (item) {
                                                return "iTransactionTypeId" == item.name
                                            })) && (body.iTransactionTypeId = headTransaction.value,
                                                body.transaction = headTransaction.transaction),
                                                detail.detailDefine = "",
                                                body)
                                                "iSKUId" != attr && "iTransactionTypeId" != attr && "id" != attr && "idKey" != attr && (attrValue = body[attr],
                                                    (value = detail.oOrderDetailDefine && detail.oOrderDetailDefine[attr]) && (body[attr] = attrValue = value),
                                                    attrValue && (0 == attr.indexOf("define") && (detail.detailDefine += self.tool.getDefineTitle.call(self, attr) + ":" + attrValue + ";"),
                                                        "object" == typeof attrValue) && attrValue.name) && (detail.detailDefine += attrValue.name + ";")
                                    })),
                                (data = {
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
                                }).isHideMondiyDetail && (data.orderAgentModifyPrice = !1),
                                self.temp.isHidePrice || self.load.rebate.call(self, self.newOrder),
                                self.selectors.productDetailContainer.html(self.productDetailFunc(data)),
                                self.render(),
                                self.isKeyPadOpen = !1,
                                self.IsShowUsePoint(self.newOrder),
                                setTimeout(function () {
                                    myApp.initImagesLazyLoad(self.temp.page.container)
                                }, 10))
                    },
                    error: function (err) {
                        self.isKeyPadOpen = !1,
                            myApp.hidePreloader(),
                            myApp.toast(err.message, "error").show(!0)
                    }
                })
        },
        computePromotion: function (options) {
            console.log("computePromotion",options)
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
        },
        defines: function (callback) {
            var self = this;
            cb.rest.getJSON({
                url: cb.router.HTTP_ORDER_GETORDERDEFINES,
                params: {
                    bizId: self.newOrder.bizId || ""
                },
                success: function (definesData) {
                    200 == definesData.code && (self.definesData = definesData.data,
                        cb.cache.get("useDefines") ? self.definesData = cb.cache.get("useDefines") : cb.cache.set("useDefines", definesData.data),
                        callback) && callback.call(self)
                },
                error: function (err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            })
        },
        coupons: function () {
            var self = this
                , order = this.temp.isHidePrice ? this.cloneOrder : this.newOrder;
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_GETORDEVALIDCOUPONS,
                params: {
                    order: order
                },
                success: function (data) {
                    200 == data.code && (self.context.coupons = data.data || {},
                        $$(self.temp.page.container).find(".coupons-box").removeClass("hide").find(".item-title").text("可用优惠券(" + (self.context.coupons.usable ? self.context.coupons.usable.length : 0) + ")"))
                },
                error: function (e) {
                    myApp.toast(e.message, "error").show(!0)
                }
            })
        },
        calcCoupons: function (order) {
            var self = this;
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_CALCORDERCOUPONS,
                params: {
                    order: order
                },
                success: function (data) {
                    self.tool.outRender.call(self, data.data)
                },
                error: function (e) {
                    myApp.toast(e.message, "error").show(!0)
                }
            })
        },
        submitOrder: function ($this) {
            var self = this;
            if ("u8c" === cb.rest.runtime.env)
                if (!1 === self.selectors.rebateContainer.find(".rebateClass")[0].checked && 0 < self.orderMaxRebateMoney)
                    cb.confirm("您当前有可使用的返利，但您并没有使用，需要帮您使用吗？", "提示信息", function () {
                        self.selectors.rebateContainer.find(".rebateClass")[0].checked = !0,
                            self.getRebate()
                    }, function () {
                        if (self.data.isCalcPromotionBtn) {
                            if (cb.loadMsgInterval && clearInterval(cb.loadMsgInterval),
                                self.isCommit)
                                return !1;
                            setTimeout(function () {
                                self.isCommit = !1
                            }, 1e3),
                                self.isCommit = !0,
                                self.getCheckMinQuantity($this)
                        } else {
                            self.selectors.productDetailContainer.find(".item-title .label-switch").find("input").prop("checked", !0);
                            var msg = self.selectors.rebateContainer.find(".input-orderMsg-container").val();
                            self.newOrder.cRemark = msg && msg.replace(upcommon.regs.emoji, ""),
                                self.data.isCalcPromotionBtn = !0,
                                self.load.computePromotion.call(this, {
                                    isAddCart: !1,
                                    isChangeTax: !1,
                                    callback: function () {
                                        myApp.toast("请再次确认订单信息", "success").show(!0)
                                    }
                                })
                        }
                    });
                else if (this.data.isCalcPromotionBtn) {
                    if (cb.loadMsgInterval && clearInterval(cb.loadMsgInterval),
                        this.isCommit)
                        return !1;
                    setTimeout(function () {
                        self.isCommit = !1
                    }, 1e3),
                        this.isCommit = !0,
                        this.getCheckMinQuantity($this)
                } else {
                    this.selectors.productDetailContainer.find(".item-title .label-switch").find("input").prop("checked", !0),
                        this.data.isCalcPromotionBtn = !0;
                    var msg = self.selectors.rebateContainer.find(".input-orderMsg-container").val();
                    self.newOrder.cRemark = msg && msg.replace(upcommon.regs.emoji, ""),
                        this.load.computePromotion.call(this, {
                            isAddCart: !1,
                            isChangeTax: !1,
                            callback: function () {
                                myApp.toast("请再次确认订单信息", "success").show(!0)
                            }
                        })
                }
            else if (this.data.isCalcPromotionBtn) {
                if (cb.loadMsgInterval && clearInterval(cb.loadMsgInterval),
                    this.isCommit)
                    return !1;
                setTimeout(function () {
                    self.isCommit = !1
                }, 1e3),
                    this.isCommit = !0,
                    this.getCheckMinQuantity($this)
            } else {
                this.selectors.productDetailContainer.find(".item-title .label-switch").find("input").prop("checked", !0);
                msg = self.selectors.rebateContainer.find(".input-orderMsg-container").val();
                self.newOrder.cRemark = msg && msg.replace(upcommon.regs.emoji, ""),
                    this.data.isCalcPromotionBtn = !0,
                    this.load.computePromotion.call(this, {
                        isAddCart: !1,
                        isChangeTax: !1,
                        callback: function () {
                            myApp.toast("请再次确认订单信息", "success").show(!0)
                        }
                    })
            }
        },
        loadBizs: function (callback) {
            var self = this;
            cb.rest.getJSON({
                url: cb.router.HTTP_ORGINAZATION_GETLIST,
                success: function (data) {
                    self.context.bizsData = data.data || [],
                        callback && callback.call(self)
                },
                error: function (e) {
                    myApp.toast(e.massage, "error").show(!0)
                }
            })
        },
        calcOrderRebate: function (options) {
            var self = this;
            myApp.showPreloader(),
                cb.rest.postData({
                    url: cb.router.HTTP_ORDER_CALCORDERRATE,
                    showPreloader: !0,
                    params: options.order,
                    success: function (data) {
                        var orderDefines;
                        200 == data.code && data.data && (self.tool.formatSuitGroup.call(self, data.data),
                            self.newOrder = data.data,
                            cb.cache.baseInfo.fReight = self.newOrder.fReight,
                            cb.cache.del("orderDefines"),
                            self.tool.initDefines.call(self),
                            cb.cache.get("orderDefines") && (orderDefines = cb.cache.get("orderDefines"),
                                $$.isArray(orderDefines.header) && (orderDefines.header.forEach(function (header) {
                                    var value = self.newOrder.oOrderDefine && self.newOrder.oOrderDefine[header.name];
                                    header.formulaFieldName && value && (header.value = value)
                                }),
                                    self.selectors.headerDefine.html(self.headerUseDefines({
                                        defines: orderDefines.header
                                    }))),
                                self.newOrder.oOrderDetails.forEach(function (detail, index) {
                                    var body = orderDefines.body.find(function (item) {
                                        return item.idKey == detail.idKey
                                    });
                                    if (body)
                                        for (var attr in detail.detailDefine = "",
                                            body) {
                                            var attrValue = body[attr];
                                            attrValue && (0 == attr.indexOf("define") && (detail.detailDefine += self.tool.getDefineTitle.call(self, attr) + ":" + attrValue + ";"),
                                                "object" == typeof attrValue) && (detail.detailDefine += attrValue.name + ";")
                                        }
                                })),
                            cb.cache.set("order", self.newOrder),
                            cb.FunctionOptions.OPENCOUPONS && cb.FunctionOptions.AGENTSYNCUHY && self.load.coupons.call(self),
                            (data = {
                                isPreSaleOrder: !!data.data.presaleId || "GROUPBUY" == self.newOrder.promotionType || "SECKILL" == self.newOrder.promotionType,
                                isNewOrder: !data.data.cOrderNo,
                                isHideMondiyDetail: data.data.cSeparatePromotionType && "old" == data.data.cSeparatePromotionType,
                                detailData: self.FormatDetailDataFunc(data.data.oOrderDetails, data.data.oOrderDetailGroups),
                                isNotCorp: !self.temp.isCorpUser,
                                isHidePrice: self.temp.isHidePrice,
                                hideOrderPromotion: cb.FunctionOptions.HIDEPORDERROMOTION,
                                orderAgentModifyPrice: self.temp.isCorpUser ? !(cb.rest.appContext.isAgentOrder || cb.bizFunctionOptions[cb.rest.appContext.context.bizId] && cb.bizFunctionOptions[cb.rest.appContext.context.bizId].FORBIDCORPMODIFYORDERPRICE) : cb.FunctionOptions.ORDERAGENTMODIFYPRICE,
                                isYs: "u8c" === cb.rest.runtime.env,
                                isAbled: cb.FunctionOptions.ALLOWCHOOSETERMINALSTORE
                            }).isHideMondiyDetail && (data.orderAgentModifyPrice = !1),
                            self.selectors.productDetailContainer.html(self.productDetailFunc(data)),
                            data = {
                                rebateAmount: (self.temp.isHidePrice ? self.cloneOrder : self.newOrder).oRebates,
                                resultArray: self.tool.initOrderRebate(self.temp.isHidePrice ? self.cloneOrder : self.newOrder)
                            },
                            cb.cache.set("rebateAmount", data),
                            options.loadRebate && self.load.rebate.call(self, self.newOrder),
                            self.render(),
                            myApp.hidePreloader(),
                            setTimeout(function () {
                                myApp.initImagesLazyLoad(self.temp.page.container)
                            }, 10))
                    },
                    error: function (data) {
                        myApp.toast(data.message, "error").show(!0)
                    }
                })
        }
    },
    UOrderApp.pages.EditOrderDetailController.prototype.FormatDetailDataFunc = function (val, orderDetailGroups) {
        var self = this
            , productList = new Array
            , productGift = new Array
            , productType = {};
        if (val && 0 < val.length)
            for (var index = 0; index < val.length; index++) {
                var item = val[index];
                if (item.cProductName) {
                    var o = {
                        cName: item.cProductName,
                        suiteGroup: item.suiteGroup || "",
                        cProductCode: item.cProductCode,
                        cProductUnitName: item.cProductUnitName,
                        iProductId: item.iProductId,
                        cImgUrl: item.oSKU && item.oSKU.oProduct && item.oSKU.oProduct.imgUrl || "img/nopic.jpg",
                        oOrderProductApportions: new Array,
                        iGroupIndex: item.iGroupIndex,
                        iGroupId: item.iGroupId,
                        iSKUId: item.iSKUId,
                        cOrderProductType: item.cOrderProductType,
                        isHidePrice: self.temp.isHidePrice,
                        iAgentId: self.newOrder.iAgentId,
                        bizId: item.bizId,
                        bizProductId: item.bizProductId,
                        isHideProm: !!self.temp.isCorpUser && !cb.rest.appContext.isAgentOrder,
                        isShowSkuPic: self.context.isShowSkuPic,
                        addOnGroupIndex: item.addOnGroupIndex,
                        oSKU: item.oSKU
                    };
                    if (0 < o.cName.indexOf("®") && (o.cName = o.cName.replace("®", "<sup>®</sup>")),
                        !item.cOrderProductType || "GIFT" != item.cOrderProductType && "REBATE" != item.cOrderProductType) {
                        if (item.suiteGroup) {
                            if (productType[item.iProductId + "-" + item.suiteGroup])
                                continue
                        } else if (productType[item.iProductId + "-" + item.iGroupIndex])
                            continue;
                        function totalfApportionMoney(itemArr, type) {
                            for (var totalApportion = 0, k = 0; k < itemArr.length; k++)
                                (!type || itemArr[k].cApportionType == type) && (totalApportion += itemArr[k].fApportionMoney);
                            return parseFloat(parseFloat(totalApportion).toFixed(2))
                        }
                        var arraySku, arraySkuUnHide;
                        arraySkuUnHide = item.suiteGroup ? (arraySku = val.filter(function (itemObj) {
                            return itemObj.iProductId === item.iProductId && "GIFT" != itemObj.cOrderProductType && "REBATE" != itemObj.cOrderProductType && itemObj.suiteGroup === item.suiteGroup
                        }),
                            self.temp.isHidePrice && self.newOrder && self.newOrder.oOrderDetails.filter(function (itemObj) {
                                return itemObj.iProductId === item.iProductId && "GIFT" != itemObj.cOrderProductType && "REBATE" != itemObj.cOrderProductType && itemObj.suiteGroup === item.suiteGroup
                            })) : (arraySku = val.filter(function (itemObj) {
                                return itemObj.iProductId === item.iProductId && "GIFT" != itemObj.cOrderProductType && "REBATE" != itemObj.cOrderProductType && itemObj.iGroupIndex === item.iGroupIndex && !itemObj.suiteGroup
                            }),
                                self.temp.isHidePrice && self.newOrder && self.newOrder.oOrderDetails.filter(function (itemObj) {
                                    return itemObj.iProductId === item.iProductId && "GIFT" != itemObj.cOrderProductType && "REBATE" != itemObj.cOrderProductType && itemObj.iGroupIndex === item.iGroupIndex && !itemObj.suiteGroup
                                }));
                        if (item.suiteGroup ? productType[item.iProductId + "-" + item.suiteGroup] = !0 : productType[item.iProductId + "-" + item.iGroupIndex] = !0,
                            0 < arraySku.length) {
                            for (var attrArray = new Array, j = 0; j < arraySku.length; j++) {
                                var attr = {
                                    bizSkuId: arraySku[j].bizSkuId,
                                    saleOrgId: self.newOrder.salesOrgId,
                                    salesOrgId: self.newOrder.salesOrgId,
                                    isHidePrice: self.temp.isHidePrice,
                                    iQuantity: arraySku[j].iQuantity,
                                    cProductUnitName: o.cProductUnitName,
                                    fSalePrice: arraySku[j].fSalePrice,
                                    fTransactionPrice: arraySku[j].fTransactionPrice,
                                    fSalePayMoney: arraySku[j].fSalePayMoney,
                                    fParticularlyMoney: arraySku[j].oOrderProductApportions ? totalfApportionMoney(arraySku[j].oOrderProductApportions, "PARTICULARLY") : 0,
                                    fPromotionMoney: self.temp.isHidePrice ? arraySku[j].fPromotionMoney : arraySku[j].fPromotionMoney ? arraySku[j].fPromotionMoney.toFixed(2) : 0,
                                    fRebateMoney: arraySku[j].oOrderProductApportions ? totalfApportionMoney(arraySku[j].oOrderProductApportions, "REBATE") : 0,
                                    id: arraySku[j].id,
                                    suiteSonAmount: arraySku[j].suiteSonAmount,
                                    iSKUId: arraySku[j].iSKUId,
                                    iMinOrderQuantity: arraySku[j].iMinOrderQuantity,
                                    iProductId: arraySku[j].iProductId,
                                    iGroupIndex: arraySku[j].iGroupIndex,
                                    suiteGroup: arraySku[j].suiteGroup || "",
                                    apportionMoney: arraySku[j].oOrderProductApportions ? totalfApportionMoney(arraySku[j].oOrderProductApportions) : 0,
                                    lsSkuSpecItems: self.tool.splitAttr(arraySku[j].cSpecDescription),
                                    iGroupId: item.iGroupId,
                                    pricePrecision: self.newOrder.originalCurrencyVo.moneyDigit,
                                    unitPricePrecision: self.newOrder.originalCurrencyVo.priceDigit,
                                    hasDefines: self.definesData.body && self.definesData.body.length || cb.FunctionOptions.OPENSTOCK && (!!cb.rest.appContext.corpUser || cb.FunctionOptions.USERSELECTSTOCK) || cb.FunctionOptions.SETTINGTRANSACTIONTYPES,
                                    stockInfo: cb.FunctionOptions.OPENSTOCK && (!!cb.rest.appContext.corpUser || cb.FunctionOptions.USERSELECTSTOCK) && arraySku[j].oStock && arraySku[j].oStock.cName,
                                    cOrderProductType: "SALE",
                                    detailDefine: arraySku[j].detailDefine,
                                    idKey: arraySku[j].idKey,
                                    isShowSkuPic: self.context.isShowSkuPic,
                                    imgUrl: arraySku[j].oSKU.imgUrl,
                                    currTypeSign: self.temp.currTypeSign || "",
                                    cusDiscountRate: arraySku[j].cusDiscountRate,
                                    cusDiscountMoney: arraySku[j].cusDiscountMoney,
                                    enquiryQuintuple: arraySku[j].oSKU.oProduct && arraySku[j].oSKU.oProduct.enquiryQuintuple
                                };
                                cb.FunctionOptions.AGENTSYNCUHY && (attr.fPointsMoney = arraySku[j].fPointsMoney),
                                    arraySku[j].iComPreGroupId && (attr.iComPreGroupId = arraySku[j].iComPreGroupId),
                                    self.temp.isHidePrice && arraySkuUnHide && arraySkuUnHide.length && 0 == arraySkuUnHide[j].fPromotionMoney && (attr.fPromotionMoney = 0),
                                    arraySku[j].oSKU && arraySku[j].oSKU.oProduct && arraySku[j].oSKU.oProduct && (attr.unitPrecision = arraySku[j].oSKU.oProduct.oUnit.unitPrecision,
                                        attr.unitRoundType = arraySku[j].oSKU.oProduct.oUnit.unitRoundType),
                                    arraySku[j].oSKU && arraySku[j].oSKU.oProductAuxUnit && arraySku[j].oSKU.oProductAuxUnit.oUnit && (attr.auxUnitPrecision = arraySku[j].oSKU.oProductAuxUnit.oUnit.unitPrecision,
                                        attr.auxUnitRoundType = arraySku[j].oSKU.oProductAuxUnit.oUnit.unitRoundType),
                                    cb.FunctionOptions.OPENAUXUNIT && (attr.OPENAUXUNIT = !0,
                                        cb.rest.appContext.isAgentOrder || !self.temp.isCorpUser ? attr.isMainUnit = arraySku[j].oSKU.oProduct && "AUXUNIT" != arraySku[j].oSKU.oProduct.isAuxUnitOrder : self.temp.isCorpUser && (attr.isMainUnit = !0),
                                        attr.hasAUXUNIT = arraySku[j].oSKU && arraySku[j].oSKU.hasOwnProperty("oProductAuxUnit") || arraySku[j].cProductAuxUnitName && null != arraySku[j].iAuxUnitQuantity,
                                        attr.cProductAuxUnitName = arraySku[j].cProductAuxUnitName,
                                        attr.iAuxUnitQuantity = arraySku[j].iAuxUnitQuantity,
                                        arraySku[j].iMinOrderQuantity) && (attr.iMinAuxUnitQuantity = cb.utils.FloatCalc.mult(arraySku[j].iMinOrderQuantity, cb.utils.FloatCalc.divide(arraySku[j].iAuxUnitQuantity, arraySku[j].iQuantity)),
                                            attr.iMinAuxUnitQuantity = upcommon.unitPreciseCalc(attr.iMinAuxUnitQuantity, attr.auxUnitPrecision, attr.auxUnitRoundType)),
                                    attrArray.push(attr)
                            }
                            o.SkuSpecItems = attrArray
                        }
                        if (o.hasPromotions = (!cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder) && item.lsPromotionFlags && 0 < item.lsPromotionFlags.length,
                            o.hasPromotions && (o.hasPType1 = 0 <= item.lsPromotionFlags.indexOf(1),
                                o.hasPType2 = 0 <= item.lsPromotionFlags.indexOf(2),
                                o.hasPType3 = 0 <= item.lsPromotionFlags.indexOf(3)),
                            self.newOrder.addOnGroups && self.newOrder.addOnGroups.length)
                            for (var n = 0; n < self.newOrder.addOnGroups.length; n++)
                                if (!self.newOrder.addOnGroups[n].addOnConditions && void 0 !== o.addOnGroupIndex && o.addOnGroupIndex === self.newOrder.addOnGroups[n].index) {
                                    o.cdObj = self.newOrder.addOnGroups[n];
                                    var tempObjs = cb.utils.extend(!0, {}, self.newOrder.addOnGroups[n]);
                                    tempObjs.products && delete tempObjs.products,
                                        o.cdObj = tempObjs;
                                    break
                                }
                        if (!o.cdObj && self.newOrder.oOrderDetailGroups && self.newOrder.oOrderDetailGroups.length)
                            for (n = 0; n < self.newOrder.oOrderDetailGroups.length; n++)
                                if (!self.newOrder.oOrderDetailGroups[n].addOnConditions && void 0 !== o.iGroupIndex && o.iGroupIndex === self.newOrder.oOrderDetailGroups[n].index) {
                                    var tempObj = cb.utils.extend(!0, {}, self.newOrder.oOrderDetailGroups[n]);
                                    tempObj.products && delete tempObj.products,
                                        o.cdObj = tempObj;
                                    break
                                }
                        productList.push(o)
                    } else
                        o.idKey = item.idKey,
                            o.iQuantity = item.iQuantity,
                            o.suiteGroup = item.suiteGroup || "",
                            o.fSalePrice = item.fSalePrice,
                            o.fTransactionPrice = item.fTransactionPrice,
                            o.SkuSpecItems = self.tool.splitAttr(item.cSpecDescription),
                            o.fPromotionMoney = item.fPromotionMoney,
                            o.fSalePayMoney = item.fSalePayMoney,
                            o.cProductUnitName = item.cProductUnitName,
                            o.oOrderProductApportions = item.oOrderProductApportions,
                            o.iSKUId = item.oSKU.id,
                            o.iProductId = item.iProductId,
                            "GIFT" == item.cOrderProductType && (o.iconType = item.bUserAddGiveaway ? "icon-gift-hand" : "icon-gift"),
                            o.bUserAddGiveaway = item.bUserAddGiveaway && cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder,
                            o.hasDefines = self.definesData.body && self.definesData.body.length || cb.FunctionOptions.OPENSTOCK && (!!cb.rest.appContext.corpUser || cb.FunctionOptions.USERSELECTSTOCK),
                            o.stockInfo = cb.FunctionOptions.OPENSTOCK && (!!cb.rest.appContext.corpUser || cb.FunctionOptions.USERSELECTSTOCK) && item.oStock && item.oStock.cName,
                            o.detailDefine = item.detailDefine,
                            o.OPENAUXUNIT = cb.FunctionOptions.OPENAUXUNIT,
                            item.oSKU.oProductAuxUnit && cb.FunctionOptions.OPENAUXUNIT && (o.cProductAuxUnitName = item.cProductAuxUnitName,
                                o.iAuxUnitQuantity = item.iAuxUnitQuantity,
                                o.hasAUXUNIT = !0,
                                o.unitPrecision = item.oSKU.oProductAuxUnit.oUnit.unitPrecision,
                                o.unitRoundType = item.oSKU.oProductAuxUnit.oUnit.unitRoundType,
                                o.auxUnitPrecision = item.oSKU.oProductAuxUnit.oUnit.unitPrecision,
                                o.auxUnitRoundType = item.oSKU.oProductAuxUnit.oUnit.unitRoundType),
                            o.hasAUXUNIT = !(!(item.oSKU.oProductAuxUnit || item.cProductAuxUnitName && null != item.iAuxUnitQuantity) || !cb.FunctionOptions.OPENAUXUNIT),
                            cb.rest.appContext.isAgentOrder || !self.temp.isCorpUser ? o.isMainUnit = item.oSKU.oProduct && "AUXUNIT" != item.oSKU.oProduct.isAuxUnitOrder : self.temp.isCorpUser && (o.isMainUnit = !0),
                            cb.FunctionOptions.AGENTSYNCUHY && (o.fPointsMoney = item.fPointsMoney),
                            self.temp.currTypeSign && (o.currTypeSign = self.temp.currTypeSign),
                            productGift.push(o)
                }
            }
        if (productList = productList.concat(productGift),
            cb.rest.appContext.showImage)
            for (var i = 0; i < productList.length; i++)
                productList[i].showImage = !0;
        self.data = {
            length: productList.length,
            groups: [],
            products: [],
            isShowCalcPromotionBtn: cb.rest.appContext.isHavePromotion && (!cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder)
        },
            self.data.isShowCalcPromotionBtn ? self.data.isCalcPromotionBtn = self.newOrder.isCalcPromotionBtn : self.data.isCalcPromotionBtn = self.newOrder.isCalcPromotionBtn = !0,
            productList.forEach(function (item) {
                if (item.iGroupIndex || item.suiteGroup) {
                    for (var detailGroup = null, i = 0; i < self.data.groups.length; i++)
                        item.suiteGroup ? item.suiteGroup === self.data.groups[i].suiteGroup && (detailGroup = self.data.groups[i]).products.push(item) : item.iGroupIndex === self.data.groups[i].index && (detailGroup = self.data.groups[i]).products.push(item);
                    if (!detailGroup)
                        if ((detailGroup = (detailGroup = orderDetailGroups.filter(function (itemm) {
                            return item.suiteGroup ? itemm.suiteGroup && itemm.suiteGroup === item.suiteGroup : itemm.index && itemm.index === item.iGroupIndex
                        }))[0]) && detailGroup.iComPromotionGroupId) {
                            switch (detailGroup.iPreType) {
                                case 1:
                                    detailGroup.promotionName = "折";
                                    break;
                                case 2:
                                    detailGroup.promotionName = "减";
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
                                detailGroup.hasSpecs = !1,
                                self.data.groups.push(detailGroup)
                        } else
                            item.suiteGroup ? (detailGroup.products = [],
                                detailGroup.products.push(item),
                                detailGroup.hasSpecs = !1,
                                self.data.groups.push(detailGroup)) : self.data.products.push(item)
                } else
                    self.data.products.push(item)
            });
        for (var x = 0; x < self.data.groups.length; x++) {
            var combine = self.data.groups[x];
            if (combine.isShowEdit = !self.temp.isCorpUser || cb.rest.appContext.isAgentOrder,
                combine.hasSpecs)
                break;
            for (var y = 0; y < combine.products.length && !combine.hasSpecs; y++)
                for (var product = combine.products[y], z = 0; z < product.SkuSpecItems.length; z++) {
                    var sku = product.SkuSpecItems[z];
                    if (sku.lsSkuSpecItems && 0 < sku.lsSkuSpecItems.length) {
                        combine.hasSpecs = !0;
                        break
                    }
                }
        }
        return Array.isArray(this.newOrder.oOrderBizGroups) && (this.data.bizs = new Array,
            this.newOrder.oOrderBizGroups.map(function (oOrderBizGroup) {
                var biz = cb.utils.extend(!0, {}, oOrderBizGroup);
                biz.groups = self.data.groups.filter(function (item) {
                    return item.bizId == biz.bizId
                }),
                    biz.products = self.data.products.filter(function (item) {
                        return item.bizId == biz.bizId
                    }),
                    self.data.bizs.push(biz)
            }),
            this.data.isShowBizs = 1 < this.newOrder.oOrderBizGroups.length,
            this.data.isShowReight = this.tool.isShowRegiht.call(this)),
            self.data
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.IsShowChangeGift = function (order) {
        var self = this
            , isShowChange = !1;
        if (order.data && order.data.oOrderDetails.forEach(function (item) {
            "GIFT" == item.cOrderProductType && (isShowChange = !0)
        }),
            isShowChange)
            for (var i = 0; i < order.data.oOrderDetailGroups.length; i++) {
                var item = order.data.oOrderDetailGroups[i];
                if (isShowChange = item.bCanChangeGiveaway && 3 == item.iPreType)
                    break
            }
        isShowChange ? (self.dataPage.find(".canChooseGift").removeClass("hide"),
            self.dataPage.find(".canChooseGift").on("click", function () {
                myApp.mainView.router.load({
                    url: "pages/fareGift.html?cOrderNo=" + self.newOrder.cOrderNo,
                    query: {
                        orderInfo: self.temp.isHidePrice ? self.cloneOrder : self.newOrder
                    }
                })
            })) : self.dataPage.find(".canChooseGift").addClass("hide")
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.IsShowUsePoint = function (order) {
        var self = this;
        self.context.isShowPoints ? ($$(self.temp.page.container).find(".integration-box").removeClass("hide"),
            cb.rest.getJSON({
                url: cb.router.HTTP_ORDER_GETUSEABLEPOINTS.format(order.iAgentId),
                params: {
                    orderno: order.cOrderNo || ""
                },
                success: function (pointsData) {
                    200 == pointsData.code && $$(self.temp.page.container).find(".integration-box .useablePoints").text(pointsData.data.maxPoints)
                },
                error: function (e) {
                    myApp.toast(e.message, "error").show(!0)
                }
            })) : $$(self.temp.page.container).find(".integration-box").addClass("hide")
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.tool = {
        convert: function (idkey, val) {
            var currentDetail, o = {
                iQuantity: 0,
                auxIQuantity: 0
            };
            return cb.FunctionOptions.OPENAUXUNIT ? (currentDetail = this.newOrder.oOrderDetails.find(function (item) {
                return item.idKey == idkey
            })) && (currentDetail.oSKU.hasOwnProperty("oProductAuxUnit") ? currentDetail.oSKU.oProduct && "AUXUNIT" != currentDetail.oSKU.oProduct.isAuxUnitOrder || this.temp.isCorpUser && !cb.rest.appContext.isAgentOrder ? (o.iQuantity = val,
                o.auxIQuantity = cb.utils.FloatCalc.divide(val, currentDetail.oSKU.oProductAuxUnit.iConversionRate)) : (o.auxIQuantity = val,
                    o.iQuantity = cb.utils.FloatCalc.mult(currentDetail.oSKU.oProductAuxUnit.iConversionRate, val)) : o.iQuantity = val) : o.iQuantity = val,
                o
        },
        splitAttr: function (str) {
            var arr = new Array;
            if (str)
                for (var strList = str.split(";"), i = 0; i < strList.length; i++)
                    strList[i] && 0 < strList[i].indexOf(":") && arr.push({
                        cName: strList[i].split(":")[0],
                        cSpecItemName: strList[i].split(":")[1]
                    });
            return arr
        },
        formatSuitGroup: function (newOrder) {
            "u8c" === cb.rest.runtime.env && newOrder.orderDetailGroupSuiteVos && 0 < newOrder.orderDetailGroupSuiteVos.length && (newOrder.orderDetailGroupSuiteVos.map(function (item) {
                item.bizId || Object.assign(item, {
                    bizId: newOrder.bizId
                })
            }),
                newOrder.oOrderDetailGroups = newOrder.oOrderDetailGroups.concat(newOrder.orderDetailGroupSuiteVos))
        },
        format: function (type) {
            var val = this.newOrder
                , o = {
                    bizId: this.newOrder.bizId
                };
            switch (this.temp.currTypeSign && (o.currTypeSign = this.temp.currTypeSign),
            type) {
                case "address":
                    o.iReceiveId = val.iReceiveId,
                        o.cReceiver = val.cReceiver,
                        o.cReceiveMobile = val.cReceiveMobile,
                        o.cReceiveAddress = val.cReceiveAddress;
                    break;
                case "storeAddress":
                    o.iReceiveId = val.iReceiveId,
                        o.receiveStoreId = val.receiveStoreId,
                        o.receiveStoreName = val.receiveStoreName,
                        o.custShippingAddressCaddress = val.custShippingAddressCaddress,
                        o.code = val.code;
                    break;
                case "baseInfo":
                    o.agentName = val.oAgent.cName,
                        o.cReceiveContacter = val.cReceiveContacter,
                        o.cReceiveContacterPhone = val.cReceiveContacterPhone,
                        o.dOrderDate = val.dOrderDate,
                        o.dSendDate = val.dSendDate,
                        o.countryCode = val.countryCode || null,
                        o.dHopeReceiveDate = val.isShowHopeReceiveDate && val.dHopeReceiveDate,
                        o.isHideSendData = cb.FunctionOptions.SHOWHOPERERECEIVEDATE,
                        o.iCorpContactId = val.iCorpContactId,
                        o.cCorpContactUserName = val.cCorpContactUserName,
                        o.cReceiveContacterCountryCode = val.cReceiveContacterCountryCode,
                        this.tool.isShowRegiht.call(this) && this.temp.isCorpUser && (o.showfReight = !0,
                            o.fReight = val.fReight);
                    break;
                case "payment":
                    o.oPayWayCode = val.oPayWayCode.cCode,
                        o.oPayWayName = val.oPayWayCode.cName,
                        o.oSettlementWayCode = val.oSettlementWay ? val.oSettlementWay.id : "",
                        o.oSettlementWayName = val.oSettlementWay ? val.oSettlementWay.cName : "",
                        o.oShippingChoiceCode = val.oShippingChoice ? val.oShippingChoice.id : "",
                        o.oShippingChoiceName = val.oShippingChoice ? val.oShippingChoice.cName : "";
                    break;
                case "invoice":
                    o.cInvoiceType = val.cInvoiceType,
                        o.cBankAccount = val.cBankAccount,
                        o.cBankCode = val.cBankCode,
                        o.iBankId = val.cBank ? val.cBank.id : null,
                        o.cBankName = val.cBankName,
                        o.cInvoiceContent = val.cInvoiceContent,
                        o.cInvoiceTitle = val.cInvoiceTitle,
                        o.cInvoiceName = val.oDefaultInvoiceType ? val.oDefaultInvoiceType.cName : "",
                        o.cSubBankName = val.cSubBankName,
                        o.invoiceTitleType = val.invoiceTitleType,
                        o.cTaxNum = val.cTaxNum,
                        "VAT" == val.cInvoiceType && (o.cInvoiceAddress = val.cInvoiceAddress,
                            o.cInvoiceTelephone = val.cInvoiceTelephone),
                        o.cInvoiceTelephone = val.cInvoiceTelephone,
                        o.cInvoiceAddress = val.cInvoiceAddress,
                        val.invoiceId && (o.invoiceId = val.invoiceId);
                    break;
                case "paywayandshipping":
                    val.oPayWayCode && (o.paywayCode = val.oPayWayCode.cCode,
                        o.paywayName = val.oPayWayCode.cName),
                        o.isShowPayway = this.temp.isCorpUser && !cb.rest.appContext.isAgentOrder,
                        val.oShippingChoice ? (o.isShowShipping = !0,
                            o.shippingCode = val.oShippingChoice.cCode,
                            o.shippingErpCode = val.oShippingChoice.cErpCode,
                            o.shippingName = val.oShippingChoice.cName,
                            o.shippingCorpId = val.oShippingChoice.iCorpId,
                            o.shippingid = val.oShippingChoice.id) : o.isShowShipping = !1,
                        val.oSettlementWay ? (o.isShowSettlement = !0,
                            o.settlementAccountNotBlank = val.oSettlementWay.bAccountNotBlank,
                            o.settlementCode = val.oSettlementWay.cCode,
                            o.settlementErpCode = val.oSettlementWay.cErpCode,
                            o.settlementName = val.oSettlementWay.cName,
                            o.settlementCorpId = val.oSettlementWay.iCorpId,
                            o.settlementDepth = val.oSettlementWay.iDepth,
                            o.settlementOrder = val.oSettlementWay.iOrder,
                            o.settlementParentId = val.oSettlementWay.iParentId,
                            o.settlementuid = val.oSettlementWay.id) : o.isShowSettlement = !1;
                    break;
                case "total":
                    o.fTotalMoney = this.temp.isHidePrice ? val.fTotalMoney : parseFloat(val.fTotalMoney),
                        o.productType = 0,
                        o.productCount = 0,
                        o.auxSum = 0,
                        o.isShowPoints = cb.FunctionOptions.AGENTSYNCUHY,
                        o.fRebateMoney = val.fRebateMoney,
                        o.fRebateCashMoney = val.fRebateCashMoney,
                        o.fPromotionMoney = val.fPromotionMoney,
                        o.fPayMoney = val.fPayMoney,
                        o.totalRebate = cb.utils.FloatCalc.add(val.fRebateCashMoney, val.fRebateMoney),
                        o.fCouponsMoney = val.fCouponsMoney,
                        o.productId = {},
                        o.isPreSaleOrder = !(!cb.FunctionOptions.OPENPRESALE || !val.presaleId) || "GROUPBUY" == val.promotionType || "SECKILL" == val.promotionType,
                        o.isU8c = "u8c" == cb.rest.runtime.env,
                        o.isShowRebate = !o.isU8c,
                        $$.isArray(val.orderCoupons) && val.orderCoupons.map(function (item) {
                            switch (item.type) {
                                case 1:
                                    o.couponName = item.title + "(代金券)";
                                    break;
                                case 2:
                                    o.couponName = item.title + "(折扣券)";
                                    break;
                                case 5:
                                    o.couponName = item.title + "(计次卡)";
                                    break;
                                case 6:
                                    o.couponName = item.title + "(兑换)"
                            }
                        }),
                        this.tool.isShowRegiht.call(this) && (o.fReight = val.fReight,
                            o.isShowRegiht = !0),
                        cb.FunctionOptions.AGENTSYNCUHY && (o.fPointsMoney = val.fPointsMoney,
                            o.iPoints = val.iPoints),
                        val.fParticularlyMoney && (o.fParticularlyMoney = val.fParticularlyMoney);
                    for (var index = 0; index < val.oOrderDetails.length; index++) {
                        var item = val.oOrderDetails[index];
                        o.productId[item.iProductId] || o.productType++,
                            o.productId[item.iProductId] = !0,
                            o.productCount = upcommon.addByMaxPrecise(o.productCount, item.iQuantity),
                            cb.FunctionOptions.OPENAUXUNIT && item.iAuxUnitQuantity && (o.auxSum = upcommon.addByMaxPrecise(o.auxSum, item.iAuxUnitQuantity))
                    }
                    o.productType = val.oOrderDetails.length;
                    var attrValue, orderDefines = cb.cache.get("orderDefines");
                    if (o.headerDefines = orderDefines.header,
                        this.temp.isHidePrice)
                        o.fPromotionMoney = "***",
                            o.fRebateMoney = "***",
                            o.fRebateCashMoney = "***";
                    else
                        for (var attr in o)
                            "productType" != attr && "productCount" != attr && "auxSum" != attr && "number" == typeof (attrValue = o[attr]) && (cb.FunctionOptions.ORDERSHOWWAY && "u8c" != cb.rest.runtime.env || !this.newOrder.originalCurrencyVo ? o[attr] = parseFloat(attrValue).toFixed(2) : o[attr] = upcommon.unitPreciseCalc(o[attr], this.newOrder.originalCurrencyVo.moneyDigit, this.newOrder.originalCurrencyVo.moneyRount));
                    o.OPENAUXUNIT = cb.FunctionOptions.OPENAUXUNIT
            }
            return o.isNotCorp = !this.temp.isCorpUser,
                o.hideOrderPromotion = cb.FunctionOptions.HIDEPORDERROMOTION,
                o
        },
        collect: function () {
            var data = {
                isCorpUser: cb.rest.appContext.corpUser
            };
            return this.newOrder && (data.address = cb.cache.get("address") || this.tool.format.call(this, "address"),
                data.storeAddress = cb.cache.get("storeAddress") || this.tool.format.call(this, "storeAddress"),
                data.baseInfo = cb.cache.get("baseInfo") || this.tool.format.call(this, "baseInfo"),
                data.baseInfo.ableEditOrderHeader = !0,
                data.baseInfo.showfReight = this.tool.isShowRegiht.call(this),
                data.invoice = cb.cache.get("invoice") || this.tool.format.call(this, "invoice"),
                data.paywayandshipping = cb.cache.get("paywayandshipping") || this.tool.format.call(this, "paywayandshipping"),
                data.headerDefine = cb.cache.get("orderDefines") && cb.cache.get("orderDefines").header,
                data.ableEditOrderHeader = !this.temp.isCorpUser || cb.rest.appContext.isAgentOrder,
                data.ableEditInvoice = this.temp.isCorpUser && "CONFIRMORDER" == this.newOrder.cNextStatus || !this.temp.isCorpUser || cb.rest.appContext.isAgentOrder),
                data
        },
        valiData: function () {
            var payRemork, useDefines, msg, self = this, re = !0;
            return (payRemork = this.selectors.rebateContainer.find(".input-orderMsg-container").val()) && 255 < payRemork.length ? (myApp.toast("字符长度不能大于255!", "error").show(!0),
                this.isCommit = !1) : (payRemork = payRemork && payRemork.replace(upcommon.regs.emoji, ""),
                    payRemork = cb.cache.get("orderDefines"),
                    useDefines = cb.cache.get("useDefines"),
                    $$.isArray(payRemork.header) && (msg = "",
                        payRemork.header.forEach(function (header) {
                            var val = header.value;
                            switch (header.requiredType) {
                                case 1:
                                    val || (re = !1,
                                        msg += "表头自定义项【" + header.showCaption + "】不能为空！<br/>");
                                    break;
                                case 2:
                                    !cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder || val || (re = !1,
                                        msg += "表头自定义项【" + header.showCaption + "】不能为空！<br/>");
                                    break;
                                case 3:
                                    cb.rest.appContext.corpUser ? cb.rest.appContext.isAgentOrder && !val && (re = !1,
                                        msg += "表头自定义项【" + header.showCaption + "】不能为空！<br/>") : val || (re = !1,
                                            msg += "表头自定义项【" + header.showCaption + "】不能为空！<br/>")
                            }
                        }),
                        re || myApp.toast(msg, "tips").show(!0)),
                    re && $$.isArray(payRemork.body) && (msg = "",
                        payRemork.body.forEach(function (body) {
                            if (self.newOrder.oOrderDetails.find(function (item) {
                                return item.idKey == body.idKey
                            }))
                                for (var attr in body) {
                                    var attrValue = body[attr]
                                        , field = useDefines.body.find(function (item) {
                                            return item.name == attr
                                        });
                                    if (field && !attrValue)
                                        switch (field.requiredType) {
                                            case 1:
                                                re = !1,
                                                    msg += "表体自定义项【" + field.showCaption + "】不能为空！<br/>";
                                                break;
                                            case 2:
                                                !cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder || attrValue || (re = !1,
                                                    msg += "表体自定义项【" + field.showCaption + "】不能为空！<br/>");
                                                break;
                                            case 3:
                                                (!cb.rest.appContext.corpUser || cb.rest.appContext.isAgentOrder) && (re = !1,
                                                    msg += "表体自定义项【" + field.showCaption + "】不能为空！<br/>")
                                        }
                                }
                        }),
                        re || myApp.toast(msg, "tips").show(!0)),
                    re || (this.isCommit = !1),
                    re)
        },
        convertProduct: function (data, isSubmit) {
            var prodArr = new Array;
            return isSubmit ? data : (data.length && data.forEach(function (item) {
                var o = cb.utils.extend(!0, {}, item);
                o.cProductCode = item.cCode,
                    o.imgUrl ? o.cProductImgUrl = o.imgUrl : item.oDefaultAlbum && (o.cProductImgUrl = item.oDefaultAlbum.cFolder + item.oDefaultAlbum.cImgName),
                    o.bNewOrderDetail = !0,
                    o.cOrderProductType = "SALE",
                    o.cProductName = item.cName,
                    item.saleOrgId && (o.salesOrgId = item.saleOrgId),
                    delete o.lsProductSkus,
                    item.lsProductSkus && item.lsProductSkus.forEach(function (citem) {
                        for (var attr in o.oSKU = citem,
                            o.oSKU.oProduct = cb.utils.extend(!0, {}, item),
                            delete o.oSKU.oProduct.lsProductSkus,
                            o.oSKU.oProduct.oUnit = item.oUnit,
                            delete o.oUnit,
                            o.iSKUId = citem.id,
                            o.cSkuCode = citem.cCode,
                            o.cProductUnitName = citem.unit || citem.oProduct.oUnit.cName,
                            citem) {
                            var attrValue = citem[attr];
                            switch (attr) {
                                case "id":
                                    o.iSKUId = attrValue;
                                    break;
                                case "code":
                                    o.cSkuCode = citem.cCode;
                                    break;
                                case "unit":
                                    o.cProductUnitName = citem.unit;
                                    break;
                                case "iAuxUnitQuantity":
                                case "iQuantity":
                                    o[attr] = parseFloat(attrValue);
                                    break;
                                case "saleOrgId":
                                    o.salesOrgId = citem.saleOrgId;
                                    break;
                                default:
                                    o[attr] = attrValue
                            }
                        }
                        prodArr.push(cb.utils.extend(!0, {}, o))
                    })
            }),
                prodArr)
        },
        initDefines: function () {
            var self = this
                , cloneDefines = {
                    header: new Array,
                    body: new Array
                };
            cb.FunctionOptions.PRODUCTREADYDATE && cloneDefines.header.push({
                name: "dSendDate",
                value: self.newOrder.dSendDate || "",
                showCaption: "预计发货日期"
            }),
                this.definesData && $$.isArray(this.definesData.header) && this.definesData.header.length && self.definesData.header.forEach(function (header) {
                    switch (self.newOrder.oOrderDefine && (self.newOrder.oOrderDefine.hasOwnProperty(header.name) ? header.value = self.newOrder.oOrderDefine[header.name] : header.value = header.defaultValue),
                    header.enableType) {
                        case 1:
                        case 3:
                            cloneDefines.header.push(header);
                            break;
                        case 2:
                            cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && cloneDefines.header.push(header)
                    }
                }),
                self.temp.isCorpUser && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && cloneDefines.header && cloneDefines.header.push({
                    name: "iTransactionTypeId",
                    value: self.newOrder.iTransactionTypeId || "",
                    showCaption: "交易类型",
                    isTransaction: !0,
                    transaction: {
                        id: self.newOrder.iTransactionTypeId || "",
                        name: self.newOrder.oTransactionType ? self.newOrder.oTransactionType.cName : ""
                    }
                }),
                $$.isArray(self.newOrder.oOrderDetails) && self.newOrder.oOrderDetails.forEach(function (detail) {
                    var bodyDefine = {
                        iSKUId: detail.iSKUId,
                        idKey: detail.idKey
                    };
                    if (detail.dSendDate && cb.FunctionOptions.PRODUCTREADYDATE && (bodyDefine.dSendDate = detail.dSendDate),
                        cb.FunctionOptions.OPENSTOCK && detail.iStockId && (bodyDefine.iStockId = detail.iStockId,
                            bodyDefine.stock = {
                                id: detail.iStockId,
                                name: detail.oStock ? detail.oStock.cName : ""
                            }),
                        self.temp.isCorpUser && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && detail.iTransactionTypeId && (bodyDefine.iTransactionTypeId = detail.iTransactionTypeId,
                            bodyDefine.transaction = {
                                id: detail.iTransactionTypeId,
                                name: detail.oTransactionType && detail.oTransactionType.cName
                            }),
                        $$.isArray(self.definesData.body)) {
                        self.definesData.body.forEach(function (body) {
                            if (detail.salesOrgId ? 1 === body.platForm || 2 === body.platForm : 1 === body.platForm || 3 === body.platForm)
                                switch (body.enableType) {
                                    case 1:
                                    case 3:
                                        bodyDefine[body.name] = body.defaultValue || "";
                                        break;
                                    case 2:
                                        cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && (bodyDefine[body.name] = body.defaultValue || "")
                                }
                        });
                        var lineDefine = [];
                        if (self.definesData.body.forEach(function (body) {
                            var attrValue = detail.oOrderDetailDefine ? detail.oOrderDetailDefine[body.name] : null;
                            if (detail.salesOrgId ? 1 === body.platForm || 2 === body.platForm : 1 === body.platForm || 3 === body.platForm)
                                switch (detail.oOrderDetailDefine && detail.oOrderDetailDefine.hasOwnProperty(body.name) || (attrValue = body.defaultValue),
                                body.enableType) {
                                    case 1:
                                    case 3:
                                        attrValue && lineDefine.push(body.showCaption + ":" + attrValue);
                                        break;
                                    case 2:
                                        cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && attrValue && lineDefine.push(body.showCaption + ":" + attrValue)
                                }
                        }),
                            detail.oOrderDetailDefine)
                            for (var attr in detail.oOrderDetailDefine) {
                                var attrValue = detail.oOrderDetailDefine[attr];
                                "id" == attr ? bodyDefine.id = attrValue : bodyDefine.hasOwnProperty(attr) && (bodyDefine[attr] = attrValue)
                            }
                        bodyDefine.iStockId && detail.oStock && (cb.rest.appContext.corpUser || cb.FunctionOptions.USERSELECTSTOCK) && lineDefine.push("仓库:" + detail.oStock.cName),
                            bodyDefine.iTransactionTypeId && detail.oTransactionType && lineDefine.push("交易类型:" + (detail.oTransactionType && detail.oTransactionType.cName)),
                            bodyDefine.dSendDate && detail.dSendDate && cb.FunctionOptions.PRODUCTREADYDATE && lineDefine.push("预计发货日期:" + detail.dSendDate),
                            "NONE" != cb.FunctionOptions.SHOWAGENTORG && detail.cSaleOrgName && lineDefine.push("组织名称:" + detail.cSaleOrgName),
                            lineDefine.length && (detail.detailDefine = lineDefine.join(";"))
                    }
                    cloneDefines.body.push(bodyDefine)
                }),
                cb.cache.get("orderDefines") || cb.cache.set("orderDefines", cloneDefines)
        },
        fillDefines: function (order) {
            var orderDefines = cb.cache.get("orderDefines") || {};
            return orderDefines.header && $$.isArray(orderDefines.header) && (order.oOrderDefine || (order.oOrderDefine = {}),
                orderDefines.header.forEach(function (header) {
                    order.oOrderDefine[header.name] = header.value,
                        "iTransactionTypeId" == header.name && (header.value ? order.iTransactionTypeId = parseInt(header.value) : delete order.oOrderDefine.iTransactionTypeId,
                            header.transaction) && header.transaction.id && (order.oTransactionType = {
                                id: header.transaction.id,
                                cName: header.transaction.name
                            }),
                        "dSendDate" == header.name && (order.dSendDate = header.value)
                })),
                order.oOrderDetails.forEach(function (detail) {
                    var detailDefine = orderDefines.body.find(function (body) {
                        return body.idKey == detail.idKey
                    });
                    detailDefine ? ((detail.oOrderDetailDefine = detailDefine).iStockId && (detail.iStockId = detailDefine.iStockId),
                        detailDefine.stockOrgId && (detail.stockOrgId = detailDefine.stockOrgId),
                        detailDefine.dSendDate && (detail.dSendDate = detailDefine.dSendDate),
                        detailDefine.iTransactionTypeId && (detail.iTransactionTypeId = parseInt(detailDefine.iTransactionTypeId)),
                        detailDefine.transaction && detailDefine.transaction.id && (detail.oTransactionType = {
                            id: detailDefine.transaction.id,
                            cName: detailDefine.transaction.name
                        })) : orderDefines.header && (detailDefine = orderDefines.header.find(function (item) {
                            return "iTransactionTypeId" == item.name
                        })) && !detail.iTransactionTypeId && (detail.iTransactionTypeId = parseInt(detailDefine.value),
                            detail.oTransactionType = {
                                id: detail.iTransactionTypeId,
                                cName: detailDefine.transaction.name
                            })
                }),
                order
        },
        clearDefines: function (idkey) {
            var orderDefines, order = this.temp.isHidePrice ? this.cloneOrder : this.newOrder;
            order.__outFields && order.__outFields.clear && (orderDefines = cb.cache.get("orderDefines"),
                $$.isArray(orderDefines.header) && $$.isArray(order.__outFields.clear.header) && orderDefines.header.forEach(function (header) {
                    -1 < order.__outFields.clear.header.indexOf("oOrderDefine." + header.name) && (header.value = "")
                }),
                $$.isArray(orderDefines.body) && $$.isArray(order.__outFields.clear.body) && orderDefines.body.forEach(function (body) {
                    if (body.idKey == idkey)
                        for (var attr in body)
                            -1 < order.__outFields.clear.body.indexOf("oOrderDetailDefine." + attr) && (body[attr] = "")
                }),
                cb.cache.set("orderDefines", orderDefines))
        },
        mergeOrderDetails: function (data) {
            var self = this
                , details = new Array;
            return data.length && data.forEach(function (item) {
                var bodyDefine, lineDefine, current = details.filter(function (citem) {
                    return item.idKey && citem.idKey == item.idKey
                });
                current && current.length ? (cb.FunctionOptions.OPENAUXUNIT && item.iAuxUnitQuantity && (current[0].iAuxUnitQuantity += item.iAuxUnitQuantity),
                    current[0].iQuantity += item.iQuantity) : (details.push(item),
                        cb.cache.get("orderDefines") && (current = cb.cache.get("orderDefines"),
                            self.definesData.body && self.definesData.body.length && (bodyDefine = {
                                idKey: item.idKey || cb.utils.getGUID()
                            },
                                lineDefine = [],
                                $$.isArray(self.definesData.body) && self.definesData.body.forEach(function (body) {
                                    switch (body.enableType) {
                                        case 1:
                                        case 3:
                                            bodyDefine[body.name] = body.defaultValue || "",
                                                body.defaultValue && lineDefine.push(body.defaultValue);
                                            break;
                                        case 2:
                                            cb.rest.appContext.corpUser && !cb.rest.appContext.isAgentOrder && (bodyDefine[body.name] = body.defaultValue || "",
                                                body.defaultValue) && lineDefine.push(body.defaultValue)
                                    }
                                }),
                                lineDefine.length && (item.detailDefine = lineDefine.join(";")),
                                current.body.find(function (citem) {
                                    return citem.idKey == item.idKey
                                }) || current.body.push(bodyDefine)),
                            cb.cache.set("orderDefines", current)))
            }),
                details
        },
        mergeOrderDefines: function (order) {
            var self = this
                , orderDefines = cb.cache.get("orderDefines");
            $$.isArray(orderDefines.header) && orderDefines.header.forEach(function (header) {
                var defineValue = order.oOrderDefine[header.name];
                defineValue && order.oOrderDefine && 0 <= header.name.indexOf("define") && (header.value = defineValue)
            }),
                $$.isArray(orderDefines.body) && orderDefines.body.forEach(function (body) {
                    var detail = order.oOrderDetails.find(function (item) {
                        return item.idKey == body.idKey
                    });
                    if (detail && detail.oOrderDetailDefine) {
                        var attr, valArray = [];
                        for (attr in body) {
                            var value = detail.oOrderDetailDefine[attr]
                                , value = (value && 0 <= attr.indexOf("define") && (body[attr] = value),
                                    body[attr]);
                            "idKey" != attr && "iSKUId" != attr && "requiredType" != attr && "iStockId" != attr && "iTransactionTypeId" != attr && value && valArray.push("object" == typeof value ? value.name : value)
                        }
                        self.selectors.productDetailContainer.find('.body-define[data-idkey="' + body.idKey + '"]').find("p:first-child").text(valArray.join(";"))
                    }
                }),
                cb.cache.set("orderDefines", orderDefines),
                self.selectors.headerDefine.html(self.headerUseDefines({
                    defines: orderDefines.header
                }))
        },
        initOrderRebate: function (order) {
            var resultArray = order.oRebates || [];
            return $$.isArray(order.oOrderDetails) && order.oOrderDetails.forEach(function (orderDetail) {
                "REBATE" == orderDetail.cOrderProductType && ("u8c" === cb.rest.runtime.env ? resultArray.push({
                    iRebateReturnProductId: orderDetail.iRebateReturnProductId,
                    iSKUId: orderDetail.iSKUId,
                    iQuantity: orderDetail.iQuantity,
                    iAuxUnitQuantity: orderDetail.iAuxUnitQuantity,
                    cOrderProductType: orderDetail.cOrderProductType,
                    sku: orderDetail.oSKU,
                    cUseWayCode: "NUMBERPRODUCT"
                }) : resultArray.push({
                    iRebateReturnProductId: orderDetail.iRebateReturnProductId,
                    iSKUId: orderDetail.iSKUId,
                    iQuantity: orderDetail.iQuantity,
                    iAuxUnitQuantity: orderDetail.iAuxUnitQuantity,
                    cOrderProductType: orderDetail.cOrderProductType,
                    cUseWayCode: "NUMBERPRODUCT"
                }))
            }),
                resultArray
        },
        mergeOrderRebate: function (order, rebateList) {
            $$.isArray(rebateList) && rebateList.forEach(function (rebate) {
                var find;
                "NUMBERPRODUCT" != rebate.cUseWayCode && "AMOUNTPRODUCT" != rebate.cUseWayCode ? (order.oRebates || (order.oRebates = []),
                    (find = order.oRebates.find(function (oRebate) {
                        return oRebate.cRebateNo == rebate.cRebateNo
                    })) ? find.fOrderRebateMoney = rebate.fOrderRebateMoney : order.oRebates.push(rebate)) : rebate.detail.forEach(function (rProduct) {
                        var detail = order.oOrderDetails.find(function (oOrderDetail) {
                            return "REBATE" == oOrderDetail.cOrderProductType && oOrderDetail.iRebateReturnProductId == rProduct.iRebateReturnProductId && oOrderDetail.iSKUId == rProduct.iSKUId
                        });
                        detail ? (detail.iQuantity = rProduct.iQuantity,
                            rProduct.iAuxUnitQuantity && (detail.iAuxUnitQuantity = rProduct.iAuxUnitQuantity)) : order.oOrderDetails.push(rProduct)
                    })
            })
        },
        mergeOrderGroup: function (order) {
            return order.oOrderDetails.forEach(function (orderDetail) {
                var orderDetailGroup;
                !orderDetail.dSendDate && order.dSendDate && (orderDetail.dSendDate = order.dSendDate),
                    orderDetail.bUserAddGiveaway && $$.isArray(order.oOrderDetailGroups) && ((orderDetailGroup = order.oOrderDetailGroups.find(function (detailGroup) {
                        return detailGroup.bUserAddGiveawayGroup
                    })) ? orderDetail.iGroupIndex = orderDetailGroup.index : (orderDetail.iGroupIndex = order.oOrderDetailGroups.length + 1,
                        order.oOrderDetailGroups.push({
                            bUserAddGiveawayGroup: !0,
                            cApportionName: "手工赠品",
                            index: order.oOrderDetailGroups.length + 1
                        })))
            }),
                order
        },
        dealRebate: function (newOrder) {
            return cb.cache.get("rebateAmount") && cb.cache.get("rebateAmount").resultArray && (newOrder.oRebates = cb.cache.get("rebateAmount").resultArray.filter(function (item) {
                return "NUMBERPRODUCT" != item.cUseWayCode && "AMOUNTPRODUCT" != item.cUseWayCode
            }),
                $$.isArray(newOrder.oRebates)) && (newOrder.fRebateMoney = 0,
                    newOrder.fRebateCashMoney = 0,
                    newOrder.oRebates.forEach(function (rebate) {
                        "NUMBERPRODUCT" != rebate.cUseWayCode && "AMOUNTPRODUCT" != rebate.cUseWayCode && ("TOCASH" != rebate.cUseWayCode ? newOrder.fRebateMoney = cb.utils.FloatCalc.add(newOrder.fRebateMoney, rebate.fOrderRebateMoney) : newOrder.fRebateCashMoney = cb.utils.FloatCalc.add(newOrder.fRebateCashMoney, rebate.fOrderRebateMoney))
                    }),
                    newOrder.oOrderDetails.forEach(function (detail) {
                        "REBATE" == detail.cOrderProductType && (newOrder.fRebateMoney = cb.utils.FloatCalc.add(newOrder.fRebateMoney, detail.fSaleCost))
                    })),
                newOrder
        },
        outRender: function (order) {
            var orderDefines, self = this, order = (self.tool.formatSuitGroup.call(self, order),
                self.tool.mergeOrderDefines.call(self, order),
                self.temp.isHidePrice ? (self.cloneOrder = cb.utils.extend(!0, {}, order),
                    self.newOrder = cb.dataLoop(order)) : self.newOrder = order,
                cb.cache.set("order", self.temp.isHidePrice ? self.cloneOrder : self.newOrder),
                this.tool.isShowRegiht.call(this) && self.temp.isCorpUser && cb.cache.set("baseInfo", self.tool.format.call(self, "baseInfo")),
                cb.cache.get("orderDefines") && (orderDefines = cb.cache.get("orderDefines"),
                    $$.isArray(orderDefines.header) && (orderDefines.header.forEach(function (header) {
                        var value = self.newOrder.oOrderDefine[header.name];
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
                            for (attr in !body.iTransactionTypeId && cb.FunctionOptions.SETTINGTRANSACTIONTYPES && self.temp.isCorpUser && (headTransaction = orderDefines.header.find(function (item) {
                                return "iTransactionTypeId" == item.name
                            })) && (body.iTransactionTypeId = headTransaction.value,
                                body.transaction = headTransaction.transaction),
                                detail.detailDefine = "",
                                body)
                                "iSKUId" != attr && "iTransactionTypeId" != attr && "id" != attr && "idKey" != attr && (attrValue = body[attr],
                                    (value = detail.oOrderDetailDefine && detail.oOrderDetailDefine[attr]) && (body[attr] = attrValue = value),
                                    attrValue && (0 == attr.indexOf("define") && (detail.detailDefine += self.tool.getDefineTitle.call(self, attr) + ":" + attrValue + ";"),
                                        "object" == typeof attrValue) && attrValue.name) && (detail.detailDefine += attrValue.name + ";")
                    })),
            {
                isPreSaleOrder: !!order.presaleId || "GROUPBUY" == self.newOrder.promotionType || "SECKILL" == self.newOrder.promotionType,
                isNewOrder: !order.cOrderNo,
                isHideMondiyDetail: order.cSeparatePromotionType && "old" == order.cSeparatePromotionType,
                detailData: self.FormatDetailDataFunc(order.oOrderDetails, order.oOrderDetailGroups),
                isNotCorp: !self.temp.isCorpUser || cb.rest.appContext.isAgentOrder,
                isHidePrice: self.temp.isHidePrice,
                hideOrderPromotion: cb.FunctionOptions.HIDEPORDERROMOTION,
                orderAgentModifyPrice: self.temp.isCorpUser ? !(cb.rest.appContext.isAgentOrder || cb.bizFunctionOptions[cb.rest.appContext.context.bizId] && cb.bizFunctionOptions[cb.rest.appContext.context.bizId].FORBIDCORPMODIFYORDERPRICE) : cb.FunctionOptions.ORDERAGENTMODIFYPRICE,
                isYs: "u8c" === cb.rest.runtime.env,
                isAbled: cb.FunctionOptions.ALLOWCHOOSETERMINALSTORE
            });
            order.isHideMondiyDetail && (order.orderAgentModifyPrice = !1),
                self.selectors.productDetailContainer.html(self.productDetailFunc(order)),
                self.temp.isHidePrice || self.load.rebate.call(self, self.newOrder),
                self.render(),
                self.isKeyPadOpen = !1,
                setTimeout(function () {
                    myApp.initImagesLazyLoad(self.temp.page.container)
                }, 10)
        },
        choosePromotions: function (order) {
            var currentPromotion, orderPromotions = {
                lsMoneyPromotions: [],
                lsGiveawayPromotions: []
            };
            return $$.isArray(order.oOrderDetailGroups) && "old" !== order.cSeparatePromotionType && ((currentPromotion = order.oOrderDetailGroups.find(function (item) {
                return 0 === item.index
            })) && $$.isArray(currentPromotion.lsMoneyPromotions) && currentPromotion.lsMoneyPromotions.length && (orderPromotions.lsMoneyPromotions = currentPromotion.lsMoneyPromotions,
                orderPromotions.lsMoneyPromotions.splice(0, 0, {
                    id: 0,
                    pName: "不使用"
                }),
                orderPromotions.lsMoneyPromotions.forEach(function (citem) {
                    citem.isCheck = citem.id == (currentPromotion.iEntityMoneyPreId || 0)
                })),
                currentPromotion) && $$.isArray(currentPromotion.lsGiveawayPromotions) && currentPromotion.lsGiveawayPromotions.length && (orderPromotions.lsGiveawayPromotions = currentPromotion.lsGiveawayPromotions,
                    orderPromotions.lsGiveawayPromotions.splice(0, 0, {
                        id: 0,
                        pName: "不使用"
                    }),
                    orderPromotions.lsGiveawayPromotions.forEach(function (citem) {
                        citem.isCheck = citem.id == (currentPromotion.iEntityGiveawayPreId || 0)
                    })),
                order.hasOrderPromotion = 0 < orderPromotions.lsMoneyPromotions.length || 0 < orderPromotions.lsGiveawayPromotions.length,
                order.orderPromotions = orderPromotions,
                order
        },
        checkDetails: function (order) {
            order.oOrderDetails.map(function (detail) {
                var iAuxUnitQuantity;
                cb.FunctionOptions.OPENAUXUNIT && detail.oSKU.oProductAuxUnit && (iAuxUnitQuantity = upcommon.unitPreciseCalc(cb.utils.FloatCalc.divide(detail.iQuantity, detail.iConversionRate || detail.oSKU.oProductAuxUnit.iConversionRate), detail.oSKU.oProductAuxUnit.oUnit.unitPrecision, detail.oSKU.oProductAuxUnit.oUnit.unitRoundType),
                    "AUXUNIT" == detail.oSKU.oProduct.isAuxUnitOrder || detail.iAuxUnitQuantity && parseFloat(detail.iAuxUnitQuantity) == parseFloat(iAuxUnitQuantity) || (detail.iAuxUnitQuantity = iAuxUnitQuantity))
            })
        },
        defineButtons: function () {
            var inner, self = this, defines = this.definesData && $$.isArray(this.definesData.header) && this.definesData.header.filter(function (item) {
                return 15 === item.fieldType && (!self.temp.isCorpUser || cb.rest.appContext.isAgentOrder ? 2 != item.enableType : 3 != item.enableType)
            });
            $$.isArray(defines) && defines.length && (inner = new Array,
                defines.map(function (item) {
                    inner.push('<a class="button button-fill col-33 confirmOrderCommond tool-define-button" href="#" data-type="define" data-defineid="' + item.id + '">' + item.showCaption + "</a>")
                }),
                $$(inner.join("")).insertBefore(this.selectors.toolBarButtons.find(".button").eq(0)))
        },
        isShowRegiht: function () {
            var showRegiht = !1;
            return Array.isArray(this.newOrder.oOrderBizGroups) && this.newOrder.oOrderBizGroups.map(function (group) {
                cb.bizFunctionOptions[group.bizId] && (showRegiht = showRegiht || cb.bizFunctionOptions[group.bizId].OPENFREIGHT)
            }),
                showRegiht
        },
        getDefineTitle: function (name) {
            return (this.definesData && this.definesData.body && this.definesData.body.find(function (item) {
                return item.name == name
            })).showCaption || ""
        },
        submitModal: function (order, isSubmit) {
            var self = this
                , modalButtons = [];
            "OPPOSE" == order.cNextStatus || cb.native.isEsnApp() && cb.rest.appContext.insteadAgent || modalButtons.push('<span><i class="icon icon-forOrder"></i>查看订单</span>'),
                cb.native.isEsnApp() && cb.rest.appContext.insteadAgent || "OPPOSE" == order.cNextStatus || 0 == order.fPayMoney || !(["FINISHPAYMENT", "CONFIRMPAYMENT_ALL"].indexOf(order.cPayStatusCode) < 0) || self.temp.isHidePrice || isSubmit || (self.temp.isCorpUser ? !cb.rest.appContext.corpAutData.orderPay : !cb.rest.appContext.autData.agentOrderPay) || self.newOrder.cOrderNo || !cb.bizFunctionOptions[order.bizId] || cb.bizFunctionOptions[order.bizId].ORDERPAYFORCONFIRM || cb.rest.appContext.isRelationOrder || modalButtons.push('<span><i class="icon icon-payfor"></i>去付款</span>'),
                cb.native.isEsnApp() && cb.rest.appContext.insteadAgent || "OPPOSE" != order.cNextStatus || self.temp.isHidePrice || !(0 < order.fPayMoney) || self.newOrder.cOrderNo || !cb.rest.runtime.redirectMailianPay || isSubmit || cb.FunctionOptions.ORDERPAYFORCONFIRM || cb.rest.appContext.isRelationOrder || modalButtons.push('<span><i class="icon icon-payfor-mailian"></i>去付款</span>'),
                modalButtons.push('<span><i class="icon icon-goon"></i>继续订货</span>'),
                myApp.modal({
                    title: '<div class="common-tips-title success-tips"><i class="icon icon-succeed"></i><span>保存成功！</span><i class="icon icon-colse"></i></div>',
                    text: '<div class="common-tips-content"><div class="tips-content"><div>' + order.cOrderNo + '</div><div class="sp-money">' + (self.temp.currTypeSign || "") + (self.temp.isHidePrice ? "***" : order.fPayMoney) + '<span>元</span></div></div><div class="tips-manage"><span>您还可以</span></div><div class="button-row">' + modalButtons.join("") + "</div></div>"
                }),
                $$(".common-tips-title .icon.icon-colse").on("click", function () {
                    cb.rest.backStatus = !0,
                        myApp.closeModal(),
                        myApp.mainView.router.back({
                            reload: !0
                        })
                }),
                $$(".common-tips-content .button-row span").on("click", function () {
                    cb.rest.backStatus = !0,
                        myApp.closeModal();
                    var i = $$(this).find("i");
                    i.hasClass("icon-payfor") && (self.temp.isHidePrice ? myApp.toast("隐藏价格模式下不能付款", "tips").show(!0) : myApp.mainView.router.loadPage({
                        url: "pages/newpaybill.html?orderNo=" + order.cOrderNo + "&bizId=" + order.bizId + "&orgId=" + (order.salesOrgId || ""),
                        query: {
                            agent: {
                                id: order.iAgentId,
                                cName: order.agentName,
                                bizId: order.oAgent && order.oAgent.bizId
                            }
                        },
                        reload: !0
                    })),
                        i.hasClass("icon-payfor-mailian") && (cb.rest.runtime.redirectMailianPay ? cb.rest.getJSON({
                            url: cb.router.HTTP_AGENT_INITTHIRDURL.format(1),
                            success: function (result) {
                                result.data && cb.native.frames({
                                    url: cb.rest.runtime.redirectMailianPay + result.data,
                                    data: {
                                        data: {
                                            order: order
                                        }
                                    },
                                    name: "脉链支付",
                                    isFullScreen: !0,
                                    autoRedirect: !0
                                })
                            },
                            error: function (e) {
                                myApp.toast(e.message, "error").show(!0)
                            }
                        }) : myApp.toast("请配置支付跳转地址", "tips").show(!0)),
                        i.hasClass("icon-forOrder") && (cb.cache.del("orderListSearchParams"),
                            myApp.mainView.router.loadPage({
                                url: "pages/orderDetail.html?oid=" + order.cOrderNo,
                                reload: !0
                            })),
                        i.hasClass("icon-goon") && myApp.mainView.router.loadPage({
                            url: "pages/products.html?dataType=allProduct",
                            reload: !0
                        })
                })
        },
        debounce: function (func, wait) {
            setTimeout(func, wait)
        }
    },
    UOrderApp.pages.EditOrderDetailController.prototype.render = function (type) {
        var self = this
            , data = this.tool.collect.call(this);
        if (data)
            for (var attr in data) {
                data[attr];
                if (type) {
                    if (type == attr)
                        switch (attr) {
                            case "address":
                                this.selectors.addressContainer.html(this.addrListFunc(data));
                                break;
                            case "storeAddress":
                                this.selectors.storeContainer.html(this.storeAddressListFunc(data));
                                break;
                            case "baseInfo":
                                this.selectors.baseInfoContainer.html(this.baseInfoFunc(data));
                                break;
                            case "invoice":
                                this.selectors.invoiceContainer.html(this.invoiceFunc(data));
                                break;
                            case "paywayandshipping":
                                this.selectors.paywayandshippingContainer.html(this.paywayandshippingFunc(data));
                                break;
                            case "headerDefine":
                                this.selectors.headerDefine.html(this.headerUseDefines({
                                    defines: data.headerDefine
                                }))
                        }
                } else
                    this.selectors.addressContainer.html(this.addrListFunc(data)),
                        this.selectors.storeContainer.html(this.storeAddressListFunc(data)),
                        this.selectors.baseInfoContainer.html(this.baseInfoFunc(data)),
                        this.selectors.invoiceContainer.html(this.invoiceFunc(data)),
                        this.selectors.paywayandshippingContainer.html(this.paywayandshippingFunc(data)),
                        this.selectors.headerDefine.html(this.headerUseDefines({
                            defines: data.headerDefine
                        }))
            }
        var total = this.tool.format.call(this, "total");
        this.selectors.statisticContainer.html(this.tplEditOrderTotal(total)),
            this.selectors.toolbarContainer.html(this.tplEditOrderToolbartotal(total)),
            this.selectors.rebateContainer.find("#spanUseableM").text(total.totalRebate),
            total.hasOwnProperty("fPointsMoney") && this.selectors.rebateContainer.find(".integration-box input").val(parseInt(total.iPoints)).parent().children("span").text("¥" + total.fPointsMoney),
            this.selectors.rebateContainer.find(".coupons-box span").text(total.couponName || "请选择"),
            this.newOrder.isCanUsedRebate || (this.selectors.rebateContainer.find("#spanUseableM").parents(".item-link.item-content").addClass("hide"),
                this.selectors.rebateContainer.find(".rabate-tip").text("订单金额未达到" + this.newOrder.fMiniRebateRuleMoney + "元，不可使用返利")),
            cb.rest.runtime.pageConfig && cb.rest.runtime.pageConfig.orderDetail && (this.newOrder.oOrderDetails && this.newOrder.oOrderDetails.find(function (detail) {
                return self.context.bizsData && self.context.bizsData.find(function (biz) {
                    return biz.id == detail.bizId && 1 === biz.bizType
                })
            }) ? this.selectors.noticeBar.removeClass("hide").html(!this.context.isCorpUser || this.context.isAgentOrder ? cb.rest.runtime.pageConfig.orderDetail.agentTips : cb.rest.runtime.pageConfig.orderDetail.corpTips) : this.selectors.noticeBar.addClass("hide")),
            myApp.initImagesLazyLoad(this.temp.page.container)
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.getCheckMinQuantity = function ($this) {
        var self = this
            , params = {
                ods: (self.temp.isHidePrice ? self.cloneOrder : self.newOrder).oOrderDetails
            };
        params.ods && params.ods.length ? cb.rest.postData({
            url: cb.router.HTTP_ORDER_GETCHECKMINQUANTITY,
            showPreloader: !0,
            params: params,
            success: function (data) {
                200 == data.code && (data.data.isQuanExceed ? self.temp.isCorpUser && !cb.rest.appContext.isAgentOrder ? cb.confirm(data.data.message + "，是否继续？", "提示信息", function () {
                    self.getExceedInventoryOrder($this)
                }, function () {
                    self.isCommit = !1
                }) : (self.isCommit = !1,
                    myApp.modal({
                        title: '<div class="common-tips-title error-tips"><i class="icon icon-no-message"></i><span  class="font-23">提示信息</span></div>',
                        text: '<div class="common-tips-content"><div class="tips-info">' + data.data.message + "</div></div>",
                        buttons: [{
                            text: "我再改改",
                            onClick: function () { }
                        }]
                    })) : self.getExceedInventoryOrder($this))
            },
            error: function (err) {
                myApp.toast(err.message, "error").show(!0),
                    self.isCommit = !1
            }
        }) : myApp.toast("请添加要结算的商品", "tips").show(!0)
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.getExceedInventoryOrder = function ($this) {
        var self = this
            , skuArray = new Array
            , params = (this.newOrder.oOrderDetails.map(function (item) {
                skuArray.push({
                    iProductId: item.iProductId,
                    iSKUId: item.iSKUId,
                    iQuantity: item.iQuantity,
                    bizId: item.bizId,
                    iStockId: item.iStockId || null,
                    stockOrgId: item.stockOrgId,
                    salesOrgId: item.salesOrgId
                })
            }),
            {
                productJson: JSON.stringify(skuArray),
                cOrderNo: self.newOrder.cOrderNo
            });
        self.newOrder.cOrderNo ? params.cAction = "MODIFY" : params.cAction = $this.hasClass("confirmOrderSaveBtn") ? "SAVE" : "SUBMIT",
            cb.rest.postData({
                url: cb.router.HTTP_ORDER_GETEXCEEDINVENTORYORDER.format(params.cAction, params.cOrderNo || "", !!self.newOrder.presaleId),
                showPreloader: !0,
                params: {
                    productJson: skuArray
                },
                success: function (exceedData) {
                    "true" === exceedData.data.isControl || !0 === exceedData.data.isControl ? exceedData.data.isExceed ? (exceedData.data.message && 80 < exceedData.data.message.length && (exceedData.data.message = exceedData.data.message.substring(0, 80) + "..."),
                        myApp.toast(exceedData.data.message, "tips").show(!0),
                        self.isCommit = !1) : self.checkUserCredit($this) : "false" === exceedData.data.isControl || !1 === exceedData.data.isControl ? exceedData.data.isExceed ? cb.confirm(exceedData.data.message, "提示信息", function () {
                            self.checkUserCredit($this)
                        }, function () {
                            self.isCommit = !1
                        }) : self.checkUserCredit($this) : "none" === exceedData.data.isControl && self.checkUserCredit($this)
                },
                error: function (data) {
                    self.isCommit = !1,
                        myApp.toast(data.message, "error").show(!0)
                }
            })
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.checkUserCredit = function ($this) {
        var creditworthCode, careditWorth, reditworthiness, params, self = this;
        self.newOrder.bizId ? (creditworthCode = cb.FunctionOptions.CREDITWORTHREMIND,
            careditWorth = self.newOrder.oAgent.iCusCreLine || 0,
            reditworthiness = self.newOrder.oAgent.iCreditValue || 0,
            params = {
                bizId: self.newOrder.bizId,
                _t: Math.random()
            },
            self.newOrder.salesOrgId && (params.orgId = self.newOrder.salesOrgId),
            self.temp.isCorpUser && (params.iAgentId = self.newOrder.oAgent.id),
            cb.rest.getJSON({
                url: cb.router.HTTP_AGENT_CREDITCTRLUSE,
                params: params,
                success: function (data) {
                    var msg;
                    200 == data.code && data.data && (!(data.data && data.data.creditCtrl && (creditworthCode = data.data.value,
                        (reditworthiness = data.data.oAgent && null !== data.data.oAgent.iCreditValue ? data.data.oAgent.iCreditValue : reditworthiness) < self.newOrder.fPayMoney) && !1 !== creditworthCode && "false" != creditworthCode && "DELIVERYCONTROL" != creditworthCode) ? self.submitOrderFunc($this) : !0 === creditworthCode || "true" == creditworthCode ? (msg = "您的信用额度为：" + careditWorth + "，当前余额是：" + reditworthiness + "，该订单提交会超出信用余额，是否确认提交该订单？",
                            setTimeout(function () {
                                cb.confirm(msg, "提示信息", function () {
                                    self.submitOrderFunc($this)
                                }, function () {
                                    self.isCommit = !1
                                })
                            }, 200)) : "ALLCONTROL" == creditworthCode || "ORDERCONTROL" == creditworthCode ? (msg = "您的信用额度是:" + careditWorth + ",当前余额是:" + reditworthiness + ",该订单提交会超出信用余额，不能提交该订单!",
                                self.isCommit = !1,
                                myApp.modal({
                                    title: '<div class="common-tips-title"><i class="icon icon-warning"></i><span>提示信息</span></div>',
                                    text: '<div class="common-tips-content"><div class="tips-info">' + msg + '</div><div class="tips-manage"><span>您还可以</span></div></div>',
                                    buttons: [{
                                        text: "我知道了",
                                        onClick: function () {
                                            myApp.closeModal()
                                        }
                                    }]
                                })) : cb.confirm("获取业务选项失败", "提示信息", function () {
                                    self.isCommit = !1
                                }, function () {
                                    self.isCommit = !1
                                }))
                },
                error: function (err) {
                    myApp.toast(err.message, "error").show(!0)
                }
            })) : (params = {
                bizIds: [],
                agentId: this.newOrder.oAgent.id
            },
                this.newOrder.oOrderBizGroups.forEach(function (oOrderBizGroup) {
                    params.bizIds.indexOf(oOrderBizGroup.bizId) < 0 && params.bizIds.push(oOrderBizGroup.bizId)
                }),
                cb.rest.postData({
                    url: cb.router.HTTP_AGENT_ISCREDITCTRLUSE,
                    params: params,
                    success: function (data) {
                        if (200 == data.code) {
                            var attr, isPass = !0, isTemp = !0, tips = new Array;
                            for (attr in data.data) {
                                var creditworthCode, careditWorth, biz, attrValue = data.data[attr];
                                attrValue.cusCreCtl && (creditworthCode = data.data.value,
                                    careditWorth = attrValue.cusCreLine || 0,
                                    (attrValue = attrValue.creditValue || 0) < self.newOrder.fPayMoney) && ("true" == creditworthCode ? (biz = self.newOrder.oOrderBizGroups.find(function (v) {
                                        return v.bizId === attr
                                    }),
                                        isTemp = !1,
                                        tips.push(biz.bizName + "信用额度是:" + careditWorth + ",当前余额是:" + attrValue)) : "ALLCONTROL" != creditworthCode && "ORDERCONTROL" != creditworthCode || (biz = "您的信用额度是:" + careditWorth + ",当前余额是:" + attrValue + ",该订单提交会超出信用余额，不能提交该订单!",
                                            self.isCommit = isPass = !1,
                                            myApp.modal({
                                                title: '<div class="common-tips-title"><i class="icon icon-warning"></i><span>提示信息</span></div>',
                                                text: '<div class="common-tips-content"><div class="tips-info">' + biz + '</div><div class="tips-manage"><span>您还可以</span></div></div>',
                                                buttons: [{
                                                    text: "我知道了",
                                                    onClick: function () {
                                                        myApp.closeModal()
                                                    }
                                                }]
                                            })))
                            }
                            isPass && (isTemp ? self.submitOrderFunc($this) : setTimeout(function () {
                                var msg = tips.join(",") + ",该订单提交会超出信用余额，是否仍然提交该订单？";
                                cb.confirm(msg, "提示信息", function () {
                                    self.submitOrderFunc($this)
                                }, function () {
                                    self.isCommit = !1
                                })
                            }, 200))
                        }
                    },
                    error: function (e) {
                        myApp.toast(e.message, "error").show(!0)
                    }
                }))
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.submitOrderFunc = function ($this, isVerify) {
        var self = this;
        if (!self.isPost) {
            self.isPost = !0;
            var newOrderInfo = cb.utils.extend(!0, {}, self.temp.isHidePrice ? self.cloneOrder : self.newOrder);
            if (this.tool.valiData.call(self)) {
                var newOrderInfo = self.tool.fillDefines(newOrderInfo)
                    , addrList = cb.cache.get("address")
                    , storeAddrList = cb.cache.get("storeAddress")
                    , baseinfor = cb.cache.get("baseInfo")
                    , invoice = cb.cache.get("invoice")
                    , paywayandshipping = cb.cache.get("paywayandshipping");
                if (paywayandshipping && (paywayandshipping.settlementuid && (newOrderInfo.iSettlementId = paywayandshipping.settlementuid),
                    paywayandshipping.shippingCode && (newOrderInfo.cShippingChoiceCode = paywayandshipping.shippingCode,
                        newOrderInfo.shippingChoiceId = paywayandshipping.shippingId),
                    paywayandshipping.paywayCode) && (newOrderInfo.cOrderPayType = paywayandshipping.paywayCode),
                    $$.each(addrList, function (key, value) {
                        value && (newOrderInfo[key] = value)
                    }),
                    $$.each(storeAddrList, function (key, value) {
                        value && (newOrderInfo[key] = value)
                    }),
                    $$.each(baseinfor, function (key, value) {
                        value && "fReight" !== key && (newOrderInfo[key] = value)
                    }),
                    $$.each(invoice, function (key, value) {
                        newOrderInfo[key] = value
                    }),
                    newOrderInfo.isRequiredHopeReceiveDate && !newOrderInfo.dHopeReceiveDate)
                    myApp.toast("请输入期望收货日期！", "tips").show(!0),
                        self.isPost = self.isCommit = !1;
                else {
                    cb.cache.get("rebateAmount") && cb.cache.get("rebateAmount").resultArray && (newOrderInfo.oRebates = cb.cache.get("rebateAmount").resultArray.filter(function (item) {
                        return "NUMBERPRODUCT" != item.cUseWayCode && "AMOUNTPRODUCT" != item.cUseWayCode
                    }));
                    var commandUrl, params, paywayandshipping = self.dataPage.find(".input-orderMsg-container").val();
                    if (newOrderInfo.cRemark = paywayandshipping && paywayandshipping.replace(upcommon.regs.emoji, ""),
                        self.remarkList)
                        for (var i = 0; i < newOrderInfo.oOrderDetails.length; i++)
                            for (var detail = newOrderInfo.oOrderDetails[i], j = 0; j < self.remarkList.length; j++)
                                detail.iSKUId != self.remarkList[j].skuid || detail.idKey && detail.idKey != self.remarkList[j].idKey || (detail.cMemo = self.remarkList[j].val);
                    0 == newOrderInfo.oOrderDetails.length ? (myApp.toast("请添加商品行信息", "tips").show(!0),
                        self.isPost = self.isCommit = !1) : newOrderInfo.iReceiveId ? (self.temp.isCorpUser && !cb.rest.appContext.isAgentOrder && self.selectors.productDetailContainer.find(".productconv").each(function () {
                            $$(this).attr("data-skuid"),
                                $$(this).attr("data-productid");
                            var idKey = $$(this).attr("data-idKey")
                                , val = $$(this).find("input.corp-editPrice").val()
                                , oldFParticularlyMoney = (oldFParticularlyMoney = $$(this).find("input.corp-editPrice").attr("data-fParticularlyMoney")) ? parseFloat(oldFParticularlyMoney) : 0;
                            idKey && void 0 !== val && newOrderInfo.oOrderDetails.forEach(function (item) {
                                var newFParticularlyMoney;
                                item.idKey == idKey && (item.oOrderProductApportions || (item.oOrderProductApportions = new Array),
                                    0 != (newFParticularlyMoney = item.fSalePayMoney - parseFloat(val) + oldFParticularlyMoney) ? 0 == item.oOrderProductApportions.filter(function (citem) {
                                        return "PARTICULARLY" == citem.cApportionType
                                    }).length ? item.oOrderProductApportions.push({
                                        cApportionName: "特殊优惠",
                                        cApportionType: "PARTICULARLY",
                                        cOrderProductType: "SALE",
                                        fApportionMoney: newFParticularlyMoney
                                    }) : item.oOrderProductApportions.forEach(function (citem) {
                                        "PARTICULARLY" == citem.cApportionType && (citem.fApportionMoney = newFParticularlyMoney)
                                    }) : item.oOrderProductApportions = item.oOrderProductApportions.filter(function (citem) {
                                        return "PARTICULARLY" != citem.cApportionType
                                    }),
                                    item.fSalePayMoney = parseFloat(val),
                                    item.fParticularlyMoney = newFParticularlyMoney,
                                    item.fTransactionPrice = cb.utils.FloatCalc.divide(item.fSalePayMoney, item.iQuantity))
                            })
                        }),
                            cb.rest.appContext.isAgentOrder || !self.temp.isCorpUser ? (commandUrl = $this.hasClass("confirmOrderSaveBtn") ? cb.router.HTTP_ORDER_SAVE : cb.router.HTTP_ORDER_SUBMIT,
                                params = {
                                    neworder: newOrderInfo
                                }) : self.temp.isCorpUser && (commandUrl = cb.router.HTTP_ORDER_MODIFY,
                                    params = {
                                        neworder: newOrderInfo
                                    }),
                            "u8c" == window.__config__.productLine && (commandUrl = cb.router.HTTP_ORDER_YSSAVE,
                                params = newOrderInfo),
                            null != isVerify && (commandUrl += "&isVerify=" + isVerify),
                            self.tool.checkDetails.call(self, newOrderInfo),
                            cb.rest.postData({
                                url: commandUrl,
                                params: params,
                                showPreloader: !0,
                                success: function (data) {
                                    var bindArr;
                                    200 == data.code && (self.isCommit = !1,
                                        self.isPost = !1,
                                        "u8c" == cb.rest.runtime.env && cb.native.isEsnApp() && self.oldObjectId && (bindArr = [{
                                            objectId: data.data.id,
                                            bussinessType: "YonSuite",
                                            oldObjectId: self.oldObjectId
                                        }],
                                            window.YYCooperationBridge.YYUploadedFilesBind(bindArr)),
                                        cb.cache.del("address,baseInfo,invoice,paywayandshipping,rebateAmount,useDefines,orderDefines,order,sanOrderProcuts,codeList"),
                                        data.data ? newOrderInfo.cOrderNo ? (myApp.modal({
                                            title: '<div class="common-tips-title success-tips"><i class="icon icon-succeed"></i><span>修改成功！</span><i class="icon icon-colse"></i></div>',
                                            text: '<div class="common-tips-content" style="padding:20px 0;"><div class="tips-content"><div>' + data.data.cOrderNo + '</div><div class="sp-money">' + (self.temp.currTypeSign || "") + (self.temp.isHidePrice ? "***" : data.data.fPayMoney) + "<span>元</span></div></div>"
                                        }),
                                            setTimeout(function () {
                                                myApp.closeModal(),
                                                    myApp.mainView.router.back()
                                            }, 2e3),
                                            $$(".common-tips-title .icon.icon-colse").on("click", function () {
                                                myApp.closeModal(),
                                                    myApp.mainView.router.back()
                                            })) : !cb.rest.appContext.isRelationOrder && "OPPOSE" != data.data.cNextStatus && data.data.oPayWayCode && "FIRSTPAY" == data.data.oPayWayCode.cCode && cb.bizFunctionOptions[data.data.bizId] && cb.bizFunctionOptions[data.data.bizId].ENTERPAYMENT && !cb.bizFunctionOptions[data.data.bizId].ORDERPAYFORCONFIRM && !self.temp.isHidePrice && 0 < data.data.fPayMoney ? myApp.mainView.router.loadPage({
                                                url: "pages/newpaybill.html?orderNo=" + data.data.cOrderNo + "&bizId=" + data.data.bizId + "&orgId=" + (data.data.salesOrgId || ""),
                                                query: {
                                                    agent: {
                                                        id: data.data.iAgentId,
                                                        cName: data.data.agentName,
                                                        bizId: data.data.oAgent && data.data.oAgent.bizId
                                                    }
                                                },
                                                reload: !0
                                            }) : (cb.rest.backStatus = !1,
                                                self.remarkList = [],
                                                window.plus && plus.storage.removeItem("codeList"),
                                                self.tool.submitModal.call(self, data.data, $this.hasClass("confirmOrderSaveBtn"))) : myApp.toast("提交成功", "success").show(!0))
                                },
                                error: function (data) {
                                    var errModal;
                                    987 == data.code ? cb.confirm(data.message, "提示信息", function () {
                                        self.isCommit = !1,
                                            self.isPost = !1,
                                            self.submitOrderFunc.call(self, $this, !1)
                                    }, function () {
                                        self.isCommit = !1,
                                            self.isPost = !1,
                                            self.remarkList = []
                                    }) : (self.isCommit = !1,
                                        self.isPost = !1,
                                        self.remarkList = [],
                                        errModal = myApp.modal({
                                            title: '<div class="common-tips-title error-tips"><i class="icon icon-failure"></i><span>提交失败～</span><i class="icon icon-colse"></i></div>',
                                            text: '<div class="common-tips-content"><div class="tips-info">' + data.message + '</div><div class="tips-manage"><span>您还可以</span></div></div>',
                                            buttons: [{
                                                text: "修改订单",
                                                onClick: function () {
                                                    myApp.closeModal()
                                                }
                                            }, {
                                                text: "返回",
                                                onClick: function () {
                                                    myApp.mainView.router.back(),
                                                        2 <= myApp.mainView.history.length && 0 < myApp.mainView.history[myApp.mainView.history.length - 2].indexOf("quickOrder") && myApp.showToolbar(".toolbar.homeNavBar")
                                                }
                                            }]
                                        }),
                                        $$(".common-tips-title .icon.icon-colse").on("click", function () {
                                            myApp.closeModal()
                                        }),
                                        setTimeout(function () {
                                            $$(errModal).find(".common-tips-content .tips-info a").each(function () {
                                                $$(this).attr("data-href", $$(this).attr("href")),
                                                    $$(this).attr("href", "#"),
                                                    $$(this).on("click", function () {
                                                        var ds = $$(this).dataset();
                                                        upcommon.regs.url.test(ds.href) && cb.native.frames({
                                                            name: "提示信息",
                                                            url: ds.href
                                                        })
                                                    })
                                            })
                                        }, 10))
                                },
                                netError: function () {
                                    self.isCommit = !1
                                }
                            })) : (myApp.toast("请选择收货地址", "tips").show(!0),
                                self.isPost = self.isCommit = !1)
                }
            } else
                self.isPost = self.isCommit = !1
        }
    }
    ,
    UOrderApp.pages.EditOrderDetailController.prototype.afterFromPageBack = function (page) {
        var baseInfoData, hasChange, self = this;
        switch (self.page = page,
        this.temp.page || (this.temp.page = page),
        page.fromPage.name) {
            case "addrNewPage":
                cb.cache.set("address", page.query.addressData),
                    self.render(page.query.addressData);
                break;
            case "coupons":
                page.query.isSelect && ((order = this.temp.isHidePrice ? this.cloneOrder : this.newOrder).orderCoupons = page.query.coupon ? [page.query.coupon] : [],
                    self.load.calcCoupons.call(self, order));
                break;
            case "useDefines":
                if (page.query.useDefine) {
                    var transaction, has, orderDefines = cb.cache.get("orderDefines");
                    if (1 == page.query.archiveType ? (orderDefines.header.forEach(function (header) {
                        header.value = page.query.useDefine[header.name],
                            "iTransactionTypeId" == header.name && header.value && (header.isTransaction = !0,
                                header.transaction = page.query.useDefine.transaction)
                    }),
                        cb.FunctionOptions.PRODUCTREADYDATE && page.query.useDefine.dSendDate && (self.newOrder.dSendDate = page.query.useDefine.dSendDate,
                            orderDefines.body) && orderDefines.body.map(function (item) {
                                if (!item.dSendDate) {
                                    item.dSendDate = page.query.useDefine.dSendDate;
                                    var attr, valStr = [item.dSendDate];
                                    for (attr in item) {
                                        var attrValue = item[attr];
                                        !attrValue || 0 <= ["id", "idKey", "iStockId", "stockOrgId", "iTransactionTypeId", "iComPreGroupId", "iSKUId", "requiredType"].indexOf(attr) || valStr.push("object" == typeof attrValue ? attrValue.name : attrValue)
                                    }
                                    self.dataPage.find('.body-define[data-idkey="' + item.idKey + '"]').find("p:first-child").text(valStr.join(";"))
                                }
                            }),
                        page.query.useDefine.transaction && (transaction = page.query.useDefine.transaction,
                            orderDefines.body) && orderDefines.body.forEach(function (body) {
                                var rowText;
                                body.iTransactionTypeId ? (body.iTransactionTypeId = transaction.id,
                                    body.transaction = transaction,
                                    (rowText = []).push(transaction.name)) : (body.iTransactionTypeId = transaction.id,
                                        body.transaction = transaction,
                                        (rowText = (rowText = self.dataPage.find('div[data-idkey="' + body.idKey + '"]').find("p").text()) ? rowText.split(";") : []).indexOf(transaction.name) < 0 && rowText.push(transaction.name)),
                                    self.dataPage.find('div[data-idkey="' + body.idKey + '"]').find("p:first-child").text(rowText.join(";"))
                            })) : 2 == page.query.archiveType && (orderDefines.body ? (has = !1,
                                orderDefines.body.map(function (item, index) {
                                    item.idKey == page.query.useDefine.idKey && (orderDefines.body[index] = page.query.useDefine,
                                        cb.FunctionOptions.PRODUCTREADYDATE && orderDefines.body[index].dSendDate && orderDefines.header && orderDefines.header.map(function (header) {
                                            "dSendDate" == header.name && (header.value = header.value ? cb.utils.FloatCalc.compareDate(header.value, page.query.useDefine.dSendDate) : page.query.useDefine.dSendDate)
                                        }),
                                        has = !0)
                                }),
                                has || orderDefines.body.push(page.query.useDefine)) : orderDefines.body = [page.query.useDefine]),
                        cb.cache.set("orderDefines", orderDefines),
                        self.render("headerDefine"),
                        2 == page.query.archiveType) {
                        var valStr = [];
                        for (attr in page.query.useDefine) {
                            var attrValue = page.query.useDefine[attr];
                            "id" != attr && "idKey" != attr && "iStockId" != attr && "stockOrgId" != attr && "iTransactionTypeId" != attr && "iComPreGroupId" != attr && "iSKUId" != attr && "requiredType" != attr && attrValue && ("object" == typeof attrValue ? valStr.push(attrValue.name) : 0 == attr.indexOf("define") ? valStr.push(self.tool.getDefineTitle.call(self, attr) + ":" + attrValue) : valStr.push(attrValue))
                        }
                        page.query.container.html("<p>" + valStr.join(";") + '</p><p class="more">更多</p>')
                    }
                }
                page.query.isChangeNum && (order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder,
                    self.load.defineFormula.call(self, order)),
                    page.query.isOutUrl && page.query.order && self.tool.outRender.call(self, page.query.order),
                    "u8c" == cb.rest.runtime.env && page.query && page.query.useDefine && page.query.useDefine.stockOrgId && 2 == page.query.archiveType && self.newOrder.indispensablyPricingDimension && -1 < self.newOrder.indispensablyPricingDimension.indexOf("stockOrgId") && self.load.computePromotion.call(self);
                break;
            case "addrListPage":
                page.query.addressData && page.query.addressData.iReceiveId && (cb.cache.set("address", page.query.addressData),
                    self.render("address"));
                break;
            case "storeAddrListPage":
                page.query.storeAddressData && page.query.storeAddressData.iReceiveId && (cb.cache.set("storeAddress", page.query.storeAddressData),
                    self.newOrder.receiveStoreId = page.query.storeAddressData.receiveStoreId,
                    self.newOrder.receiveStoreName = page.query.storeAddressData.receiveStoreName,
                    self.render("storeAddress"),
                    cb.rest.getJSON({
                        url: cb.router.HTTP_AGENT_GETAGENT_ADDRESS.format(page.query.storeAddressData.iReceiveId),
                        success: function (data) {
                            data = data.data,
                                data.address = data.address || "",
                                data.cDistrct = [data.country, data.province, data.city, data.area].join(" "),
                                data = {
                                    iReceiveId: data.id,
                                    cReceiver: data.receiver,
                                    cReceiveMobile: data.mobile,
                                    cReceiveAddress: data.cDistrct + data.address,
                                    cReceiveZipCode: data.zipCode,
                                    receiveCountryCode: data.countryCode || "86"
                                };
                            cb.cache.set("address", data),
                                self.render("address")
                        }
                    }),
                    self.load.computePromotion.call(self, {
                        isAddCart: !1
                    }));
                break;
            case "BaseInfo":
                page.query.baseInfoData && (page.query.baseInfoData.isHideSendData = cb.FunctionOptions.SHOWHOPERERECEIVEDATE,
                    baseInfoData = cb.cache.get("baseInfo"),
                    hasChange = !1,
                    order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder,
                    self.tool.isShowRegiht.call(self) && baseInfoData.fReight != page.query.baseInfoData.fReight && (hasChange = !0,
                        order.fReight = (void 0 === page.query.baseInfoData.fReight ? order : page.query.baseInfoData).fReight),
                    baseInfoData.dOrderDate != page.query.baseInfoData.dOrderDate && (hasChange = !0,
                        order.dOrderDate = page.query.baseInfoData.dOrderDate),
                    (hasChange = "u8c" == cb.rest.runtime.env && baseInfoData.iCorpContactId != page.query.baseInfoData.iCorpContactId && order.indispensablyPricingDimension && -1 < order.indispensablyPricingDimension.indexOf("iCorpContactId") ? !0 : hasChange) && self.load.computePromotion.call(self),
                    cb.cache.set("baseInfo", page.query.baseInfoData),
                    self.render("baseInfo"));
                break;
            case "invoiceList":
                if (page.query.invoiceData) {
                    if (cb.cache.get("invoice").cInvoiceType != page.query.invoiceData.cInvoiceType) {
                        var attr, order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder;
                        for (attr in page.query.invoiceData)
                            order.hasOwnProperty(attr) && (order[attr] = page.query.invoiceData[attr]);
                        self.load.computePromotion.call(self, {
                            isAddCart: !1,
                            isChangeTax: !0
                        })
                    }
                    cb.cache.set("invoice", page.query.invoiceData),
                        self.render("invoice")
                }
                break;
            case "payment":
                page.query.paymentData && (baseInfoData = cb.cache.get("paywayandshipping"),
                    hasChange = !1,
                    order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder,
                    baseInfoData.settlementuid != page.query.paymentData.settlementuid && order.indispensablyPricingDimension && -1 < order.indispensablyPricingDimension.indexOf("iSettlementId") && (hasChange = !0),
                    baseInfoData.shippingid != page.query.paymentData.shippingid && order.indispensablyPricingDimension && -1 < order.indispensablyPricingDimension.indexOf("shippingChoiceId") && (hasChange = !0),
                    baseInfoData.paywayCode && baseInfoData.paywayCode != page.query.paymentData.paywayCode && order.indispensablyPricingDimension && -1 < order.indispensablyPricingDimension.indexOf("cOrderPayType") && (hasChange = !0),
                    cb.cache.set("paywayandshipping", page.query.paymentData),
                    self.render("paywayandshipping"),
                    hasChange) && "u8c" == cb.rest.runtime.env && self.load.computePromotion.call(self);
                break;
            case "viewRemarks":
                if (page.query.remark) {
                    self.remarkList = page.query.remark;
                    for (var i = 0; i < self.newOrder.oOrderDetails.length; i++)
                        for (var j = 0; j < self.remarkList.length; j++)
                            self.newOrder.oOrderDetails[i].iSKUId != self.remarkList[j].skuid || self.remarkList[j].idKey && self.remarkList[j].idKey != self.newOrder.oOrderDetails[i].idKey || (self.newOrder.oOrderDetails[i].cMemo = self.remarkList[j].val)
                }
                break;
            case "addMessage":
                page.query.submit && cb.rest.getJSON({
                    url: cb.router.HTTP_ORDER_FINDORDERMEMOS,
                    params: {
                        cOrderNo: self.newOrder.cOrderNo,
                        pageSize: 999
                    },
                    success: function (data) {
                        var cloneOrder = cb.utils.extend(!0, {}, self.newOrder)
                            , data = (cloneOrder.oOrderMemos = data.data,
                                cloneOrder.isHidePrice = self.temp.isHidePrice,
                                cloneOrder.fRebateTotalMoney = self.selectors.rebateContainer.find("#spanUseableM").text(),
                                cloneOrder.isHideMondiyDetail = cloneOrder.cSeparatePromotionType && "old" == cloneOrder.cSeparatePromotionType,
                                (cloneOrder = self.tool.choosePromotions.call(self, cloneOrder)).isShowRebate = "u8c" != cb.rest.runtime.env,
                                cloneOrder.isYs = "u8c" === cb.rest.runtime.env,
                                self.productPartInfoFunc(cloneOrder));
                        self.selectors.rebateContainer.html(data),
                            self.selectors.rebateContainer.find("#spanUseableM").text(cloneOrder.fRebateTotalMoney),
                            self.load.rebate.call(self, cloneOrder)
                    }
                });
                break;
            case "allMessage":
                page.query.cOrderNo && cb.rest.getJSON({
                    url: cb.router.HTTP_ORDER_FINDORDERMEMOS,
                    params: {
                        cOrderNo: page.query.cOrderNo,
                        pageSize: 999
                    },
                    success: function (data) {
                        var cloneOrder = cb.utils.extend(!0, {}, self.newOrder)
                            , data = (cloneOrder.oOrderMemos = data.data,
                                cloneOrder.isHidePrice = self.temp.isHidePrice,
                                cloneOrder.isHideMondiyDetail = cloneOrder.cSeparatePromotionType && "old" == cloneOrder.cSeparatePromotionType,
                                cloneOrder.fRebateTotalMoney = self.selectors.rebateContainer.find("#spanUseableM").text(),
                                (cloneOrder = self.tool.choosePromotions.call(self, cloneOrder)).isShowRebate = "u8c" != cb.rest.runtime.env,
                                cloneOrder.isYs = "u8c" === cb.rest.runtime.env,
                                self.productPartInfoFunc(cloneOrder));
                        self.selectors.rebateContainer.html(data),
                            self.selectors.rebateContainer.find("#spanUseableM").text(cloneOrder.fRebateTotalMoney),
                            self.load.rebate.call(self, cloneOrder)
                    }
                });
            case "attachmentManage":
            case "EnclosureListModify":
                var timer = null;
                if (page.query.files && page.query.files.length)
                    self.newOrder.oAttachments = page.query.files,
                        self.temp.isHidePrice && (self.cloneOrder.oAttachments = page.query.files),
                        self.dataPage.find(".enclosure .item-title.num-title").html("附件(" + page.query.files.length + ")");
                else {
                    if (self.dataPage.find(".enclosure .item-title.num-title").html("附件(0)"),
                        self.dataPage.find(".enclosure #fileChange").html(""),
                        timer)
                        return !1;
                    timer = setTimeout(function () {
                        timer = null;
                        var newFileInput = document.createElement("input");
                        newFileInput.setAttribute("type", "file"),
                            newFileInput.className = "fileInput",
                            newFileInput.name = "file",
                            newFileInput.id = "file",
                            self.dataPage.find(".enclosure").append(newFileInput)
                    }, 100)
                }
                break;
            case "UcEnclosureListModify":
                page.query.oldObjectId && (self.oldObjectId = page.query.oldObjectId);
                break;
            case "rebateSelect":
                console.log("返利返回对象信息", page.query.rebateData)
                if (0 == page.query.isAutoUseRebate && (self.newOrder.isAutoUseRebate = page.query.isAutoUseRebate),
                    page.query.rebateData) {
                    cb.cache.set("rebateAmount", page.query.rebateData);
                    var param = {
                        order: self.temp.isHidePrice ? self.cloneOrder : self.newOrder
                    };
                    if (cb.cache.get("order") && (param.order = cb.cache.get("order")),
                        $$.isArray(page.query.rebateData.resultArray)) {
                        if (self.tool.mergeOrderRebate.call(self, param.order, page.query.rebateData.resultArray),
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
                }
                page.query.isCheck && self.selectors.rebateContainer.find(".rebateClass").length && "u8c" == cb.rest.runtime.env && (self.selectors.rebateContainer.find(".rebateClass")[0].checked = !0);
                break;
            case "commodtyList":
                page.query.selectedProducts && page.query.selectedProducts.length && (order = self.temp.isHidePrice ? self.cloneOrder : self.newOrder,
                    hasChange = (baseInfoData = self.tool.convertProduct(page.query.selectedProducts)).find(function (item) {
                        return "GIFT" != item.cOrderProductType
                    }),
                    order.isOnlyEditUserAddGiveaway = !hasChange,
                    "u8c" !== cb.rest.runtime.env && baseInfoData.forEach(function (item) {
                        item.fSalePrice && (item.fTransactionPrice = item.fSalePrice)
                    }),
                    order.oOrderDetails.push.apply(order.oOrderDetails, baseInfoData),
                    order.oOrderDetails = self.tool.mergeOrderDetails.call(self, order.oOrderDetails),
                    (order = self.tool.mergeOrderGroup(order)).bClearGiveaway = !0,
                    self.load.computePromotion.call(self));
                break;
            case "fareGiftPage":
                if (page.query.order) {
                    order = page.query.order;
                    if (self.remarkList)
                        for (i = 0; i < order.oOrderDetails.length; i++)
                            for (j = 0; j < self.remarkList.length; j++)
                                order.oOrderDetails[i].iSKUId == self.remarkList[j].skuid && (order.oOrderDetails[i].cMemo = self.remarkList[j].val);
                    order.isOnlyEditUserAddGiveaway = !1,
                        self.temp.isHidePrice ? self.cloneOrder = order : self.newOrder = order,
                        self.load.computePromotion.call(self)
                }
                break;
            case "combineEdit":
                var combine = page.query.combine
                    , group = null;
                if (combine) {
                    for (i = 0; i < self.newOrder.oOrderDetailGroups.length; i++)
                        self.newOrder.oOrderDetailGroups[i].iComPromotionGroupId === combine.id && (group = self.newOrder.oOrderDetailGroups[i]);
                    for (i = 0; i < self.newOrder.oOrderDetails.length; i++)
                        self.newOrder.oOrderDetails[i].iGroupIndex === group.index && (self.newOrder.oOrderDetails.splice(i, 1),
                            i--);
                    upcommon.thunks.compose(upcommon.thunks.product.total)(combine.lsProes, {
                        hidePrice: self.temp.isHidePrice
                    }),
                        combine.lsProes.forEach(function (item) {
                            item.oProduct.lsProductSkus.forEach(function (itemm) {
                                for (var key in itemm.oProduct = {},
                                    item.oProduct)
                                    item.oProduct.hasOwnProperty(key) && "lsProductSkus" !== key && (itemm.oProduct[key] = item.oProduct[key]);
                                var o = {
                                    cOrderProductType: "SALE",
                                    iSKUId: itemm.id,
                                    iProductId: item.oProduct.id,
                                    iQuantity: itemm.iQuantity,
                                    oSKU: itemm,
                                    cProductCode: item.oProduct.cCode,
                                    cProductName: item.oProduct.cName,
                                    cSpecDescription: itemm.cSpecDescription,
                                    fSalePrice: itemm.fSalePrice,
                                    fTransactionPrice: itemm.fTransactionPrice,
                                    fSaleCost: itemm.fSaleCost,
                                    fSalePayMoney: itemm.__total,
                                    iComPreGroupId: itemm.iComPreGroupId,
                                    iMinOrderQuantity: itemm.iMinOrderQuantity,
                                    cErpCode: item.oProduct.cERPCode,
                                    iAuxUnitQuantity: itemm.iAuxUnitQuantity,
                                    cProductUnitName: item.oProduct.oUnit.cName,
                                    cProductAuxUnitName: itemm.oProductAuxUnit ? itemm.oProductAuxUnit.oUnit.cName : "",
                                    iGroupIndex: group.index,
                                    bizId: itemm.bizId,
                                    bizProductId: itemm.bizProductId,
                                    bizSkuId: itemm.bizSkuId,
                                    saleOrgId: itemm.saleOrgId,
                                    salesOrgId: itemm.saleOrgId,
                                    cProductImgUrl: item.oProduct.imgUrl
                                };
                                itemm.oProductAuxUnit && (o.iConversionRate = itemm.oProductAuxUnit.iConversionRate),
                                    self.newOrder.oOrderDetails.push(o)
                            })
                        }),
                        self.load.computePromotion.call(self)
                }
                break;
            case "suiteGroup":
                var suitData = page.query.suiteGroupData
                    , group = null;
                if (suitData) {
                    for (i = 0; i < self.newOrder.oOrderDetailGroups.length; i++)
                        self.newOrder.oOrderDetailGroups[i].suiteGroup === suitData.suiteGroup && (group = self.newOrder.oOrderDetailGroups[i]);
                    suitData.products.forEach(function (item) {
                        item.SkuSpecItems.forEach(function (itemm) {
                            var orderDetail = self.newOrder.oOrderDetails.find(function (v) {
                                return itemm.iSKUId == v.oSKU.id && item.iProductId == v.iProductId && v.suiteGroup === group.suiteGroup
                            });
                            orderDetail.iQuantity = itemm.iQuantity,
                                orderDetail.iAuxUnitQuantity = itemm.iAuxUnitQuantity
                        })
                    }),
                        self.newOrder.orderDetailGroupSuiteVos.find(function (v) {
                            return v.suiteGroup === suitData.suiteGroup
                        }).suiteQty = suitData.suiteQty,
                        self.load.computePromotion.call(self)
                }
        }
    },
    UOrderApp.pages.EditOrderDetailController.prototype.rebateAuto = function (orderInfo) {
        console.log("自动使用返利", orderInfo)
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
                    console.log("自动使用返利", orderInfo, updata)
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
    ;
