package com.cmwsp.zentransfer.controller;


import com.alibaba.excel.EasyExcel;
import com.cmwsp.zentransfer.dto.reconciliation.QueryListParamsRequest;
import com.cmwsp.zentransfer.dto.reconciliation.ReconciliationDTO;
import com.cmwsp.zentransfer.model.pay.PayOrder;
import com.cmwsp.zentransfer.model.pay.PayOrderDetail;
import com.cmwsp.zentransfer.service.PayService;
import com.cmwsp.zentransfer.utils.PayDetailType;
import com.cmwsp.zentransfer.utils.converter.ReconciliationMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static com.cmwsp.zentransfer.utils.PayDetailType.BALANCE_PAY;

@RestController
@RequestMapping("/reconciliation")
@Slf4j
public class ReconciliationController {

    private final PayService payService;
    private final ReconciliationMapper mapper;

    public ReconciliationController(ReconciliationMapper mapper,
                                    PayService payService) {
        this.mapper = mapper;
        this.payService = payService;
    }

    @GetMapping("/list")
    public ModelAndView getListV3(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @ModelAttribute("params") QueryListParamsRequest params) {
        Pageable pageable = PageRequest.of(page, size, Sort.sort(PayOrder.class).by(PayOrder::getCreatedAt));

        var records = payService.queryPayOrderDetailPage(pageable, params);

        var list = records.getContent().stream()
                .map(this::getReconciliationDTO).toList();
        // 补充U订单的数据

        // 补充U订单的数据
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("account_record");
        modelAndView.addObject("data", list);
        modelAndView.addObject("currentPage", page);
        modelAndView.addObject("totalPages", records.getTotalPages());
        modelAndView.addObject("totalElements", records.getTotalElements());
        modelAndView.addObject("params", params);
        return modelAndView;
    }

    @GetMapping("/export")
    @Deprecated
    public void export(HttpServletResponse response,
                       @ModelAttribute("params") QueryListParamsRequest params) throws Exception {
        // 设置响应头
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码
        String fileName = URLEncoder.encode("对账信息" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-hh:mm:ss")), StandardCharsets.UTF_8).replaceAll("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        log.debug("文件：{},查询数据开始时间：{}",fileName,System.currentTimeMillis());
        var records = payService.queryPayOrderDetialList(params);
        log.debug("文件：{}, 查询数据结束时间：{}",fileName,System.currentTimeMillis());

        var list = records.stream()
                .map(this::getReconciliationDTO).toList();
        log.debug("文件：{}, 数据加工结束时间：{}",fileName,System.currentTimeMillis());
        // 写Excel
        EasyExcel.write(response.getOutputStream(), ReconciliationDTO.class).sheet("对账信息").doWrite(list);
        log.debug("文件：{},数据写入Excel结束时间：{}",fileName,System.currentTimeMillis());

    }

    /**
     * 处理数据转换
     *
     * @param payOrderDetail
     * @return
     */
    private @NotNull ReconciliationDTO getReconciliationDTO(PayOrderDetail payOrderDetail) {
        // 基于历史数据问题，支持数据自刷新
        var payOrder = payOrderDetail.getPayOrder();
        if(payOrder.getPayStatus().equals(1) && StringUtils.hasLength(payOrderDetail.getPayOrder().getBatchTransId())
                && !StringUtils.hasLength(payOrderDetail.getPayOrder().getAlipayOrderNo())){
            payService.updateAlipayOrderNo(payOrder);
        }
        var dto = mapper.toDTO(payOrder, ReconciliationDTO.class);
        if (!payOrderDetail.getDetailType().equals(PayDetailType.ALIPAY)) {
            dto.setBatchTransId(null);
            dto.setAlipayOrderNo(null);
        }
        dto.setOrderNo(payOrder.getUOrderNo());
        dto.setTotalAmount(BigDecimal.ZERO.add(null != payOrder.getBalanceAmount() ? payOrder.getBalanceAmount() : BigDecimal.ZERO)
                .add(null != payOrder.getRealAmount() ? payOrder.getRealAmount() : BigDecimal.ZERO)
                .add(null != payOrder.getRebateAmount() ? payOrder.getRebateAmount() : BigDecimal.ZERO));
        dto.setBalanceAmount(payOrder.getBalanceAmount());
        dto.setRealAmount(payOrder.getRealAmount());
        dto.setRebateAmount(payOrder.getRebateAmount());
        if (payOrder.getPayStatus() == 1) {
            dto.setVoucherNo(payOrder.getUOrderNo());
            if(BALANCE_PAY.equals(payOrderDetail.getDetailType())){
                // 余额支付的放核销的支付单号
                dto.setPayeeNo(payOrderDetail.getDeductionPayNo());
            } else {
                // 支付宝支付的放支付单号
                dto.setPayeeNo(payOrder.getPayNo());
            }
            dto.setPayStatusName("已支付");
        } else {
            dto.setPayStatusName("未支付");
        }
        return dto;
    }
}
