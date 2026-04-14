package com.cmwsp.zentransfer.dto.alipay;

import com.alipay.api.domain.AuthParticipantInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UniApplyDTO implements Stringify {

  // 产品码，固定值 BATCH_API_TO_ACC
  private String productCode;

  // 场景码，根据接入场景传不同的值。资金制单（只用于批量有密）：STANDARD_MESSAGE_BATCH_PAY
  private String bizScene;

  // 外部单号
  private String outBizNo;

  // SHORT_URL("短链接")
  private String authorizeLinkType;

  // 跳转渠道
  private String channel;

  // 授权方信息
  private AuthParticipantInfo principalInfo;
  // 超时时间 （不填默认为1800（秒）） 格式：yyyy-MM-dd HH:mm
  private String applyExpireTime;

  // getters and setters
}
