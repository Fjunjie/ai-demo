# 实体关系图

## ER 图 (Mermaid)

```mermaid
erDiagram
    BaseEntity ||--o{ AlipayFundAuthRecord : "继承"
    BaseEntity ||--o{ OauthToken : "继承"
    BaseEntity ||--o{ UserInfo : "继承"
    BaseEntity ||--o{ AlipayBatchPayRecord : "继承"
    BaseEntity ||--o{ Order : "继承"
    BaseEntity ||--o{ PayOrder : "继承"
    BaseEntity ||--o{ PayOrderDetail : "继承"

    PayOrder ||--o{ PayOrderDetail : "1对N"
    PayOrder ||--o| AlipayBatchPayRecord : "1对1"
    Order ||--o| PayOrder : "1对1"
    UserInfo ||--o{ OauthToken : "1对N"
    UserInfo ||--o{ AlipayFundAuthRecord : "1对N"

    BaseEntity {
        string id PK "UUID主键"
        LocalDateTime created_at "创建时间"
        LocalDateTime updated_at "更新时间"
    }

    PayOrder {
        string id PK
        string u_order_no "UOrder订单号"
        string pay_no UK "支付单号"
        string batch_trans_id "支付宝业务号"
        decimal total_amount "总金额"
        decimal rebate_amount "返利抵扣金额"
        decimal balance_amount "余额支付"
        decimal real_amount "实际支付金额"
        PayOrderType type "支付类型"
        string agent_id "客户ID"
        integer pay_status "支付状态"
        string agent_erp_code "客商ERP"
        string agent_name "客商名称"
        string u_agent_id "客商编码"
        string source_pay_no "来源支付单号"
        string alipay_order_no "支付宝唯一交易号"
    }

    PayOrderDetail {
        string id PK
        string pay_order_id FK "支付单ID"
        PayDetailType detail_type "支付类型"
        decimal amount "支付金额"
        integer status "支付状态(0未支付 1已支付 2失败)"
        string deduction_pay_no "抵扣支付单号"
    }

    AlipayFundAuthRecord {
        string id PK
        string out_biz_no "外部请求号"
        string user_id FK "用户编码"
        string agreement_no "签约协议号"
        string status "签约状态"
    }

    OauthToken {
        string id PK
        string session_id UK "Session ID"
        string access_token UK "访问令牌"
        string alipay_user_id "支付宝用户ID"
        LocalDateTime auth_start "授权开始时间"
        int expires_in "访问令牌过期时间(秒)"
        int re_expires_in "刷新令牌过期时间(秒)"
        string refresh_token UK "刷新令牌"
        string user_id UK "用户ID"
        string auth_code "授权一次性code"
    }

    UserInfo {
        string id PK
        string user_id UK "用户ID (2088开头)"
        string nick_name "昵称"
        string avatar "头像"
    }

    AlipayBatchPayRecord {
        string id PK
        string out_batch_no "外部单号"
        string batch_trans_id "批次支付订单号"
        string status "批次状态"
        boolean notify_success "是否通知成功"
    }

    Order {
        string id PK
        string pay_no UK "支付单号"
        string order_no "订单单号"
        decimal amount "金额"
        string produce_desc "商品描述"
        string src_reserve "保留字段"
        string biz_id "商家ID"
        string agent_id "客户ID"
        string out_trade_no "外部订单号"
        short status "支付状态(0=成功)"
        string input_charset "输入字符集"
        string return_url "返回地址"
        string size "大小"
        string notify_url "通知地址"
    }
```

## 组合支付业务流程图

```mermaid
flowchart TD
    A[用户下单] --> B[保存到 uorder_orders]
    B --> C[生成支付单 PayOrder]
    C --> D[计算支付方式组合]
    D --> E[创建支付明细 PayOrderDetail]

    E --> F{返利抵扣?}
    F -->|是| G[创建 REBATE 明细<br/>扣除返利余额]
    F -->|否| H

    H --> I{余额支付?}
    I -->|是| J[创建 BALANCE 明细<br/>扣除账户余额]
    I -->|否| K

    K --> L{需要支付宝支付?}
    L -->|是| M[检查授权]
    M --> N{是否已授权?}
    N -->|否| O[申请支付宝授权]
    O --> P[保存授权记录]
    P --> Q[创建 ALIPAY 明细]
    N -->|是| Q
    L -->|否| R[纯返利/余额支付完成]

    Q --> S[创建支付宝批量支付]
    S --> T[保存 AlipayBatchPayRecord]
    T --> U[调用支付宝支付渲染]
    U --> V[用户完成支付]
    V --> W[更新明细状态为已支付]

    G --> X[更新返利账户余额]
    J --> Y[更新账户余额]
    W --> Z{所有明细都完成?}
    Z -->|否| AA[等待其他明细]
    Z -->|是| AB[更新 PayOrder 状态为已支付]
    AB --> AC[回调通知]

    style A fill:#e1f5ff
    style C fill:#fff4e1
    style E fill:#ffe1e1
    style AB fill:#e1ffe1
```

## 支付单与明细关系图

```mermaid
flowchart LR
    subgraph PayOrder["支付单 (pay_order)"]
        PO1[pay_no: PAY202501230001]
        PO2[total_amount: 1000.00]
        PO3[real_amount: 600.00]
        PO4[balance_amount: 300.00]
        PO5[rebate_amount: 100.00]
    end

    subgraph Details["支付明细 (pay_order_detail)"]
        POD1[类型: REBATE<br/>金额: 100.00<br/>状态: 已支付]
        POD2[类型: BALANCE<br/>金额: 300.00<br/>状态: 已支付]
        POD3[类型: ALIPAY<br/>金额: 600.00<br/>状态: 已支付]
    end

    PayOrder -->|"1:N"| Details

    style PayOrder fill:#e1f5ff
    style Details fill:#e1ffe1
```

## 数据库表关系详情

### 1. PayOrder (支付单表) - 核心表
- **业务用途**: 组合支付主单，支持多种支付方式组合
- **关联关系**:
  - 与 `PayOrderDetail` 是1对N关系（一个支付单包含多个支付明细）
  - 与 `AlipayBatchPayRecord` 是1对1关系（支付宝批量支付记录）
  - 与 `Order` 是1对1关系（原始订单）

### 2. PayOrderDetail (支付单明细表)
- **业务用途**: 记录每种支付方式的详细信息和状态
- **关联关系**:
  - 属于 `PayOrder`，通过 `pay_order_id` 关联
  - 支持 REBATE、BALANCE、ALIPAY 三种支付类型

### 3. Order (UOrder订单表)
- **业务用途**: 存储UOrder系统的原始订单数据
- **关联关系**:
  - 通过 `order_no` 与 `PayOrder.u_order_no` 关联

### 4. AlipayFundAuthRecord (支付宝资金授权记录)
- **业务用途**: 记录用户资金授权状态
- **关联关系**:
  - 通过 `user_id` 关联到用户
  - 通过 `agreement_no` 维护授权协议

### 5. AlipayBatchPayRecord (支付宝批量支付记录)
- **业务用途**: 记录支付宝批量支付订单
- **关联关系**:
  - `batch_trans_id` 对应 `PayOrder.batch_trans_id`
  - `out_batch_no` 对应 `PayOrder.pay_no`

### 6. OauthToken (OAuth令牌)
- **业务用途**: 存储OAuth授权令牌
- **关联关系**:
  - 通过 `user_id` 关联到 `UserInfo`
  - 通过 `session_id` 管理会话

### 7. UserInfo (用户信息)
- **业务用途**: 存储支付宝用户基本信息
- **关联关系**:
  - 与 `OauthToken` 是1对N关系（一个用户可以有多个token）
  - 与 `AlipayFundAuthRecord` 是1对N关系（一个用户可以有多条授权记录）

---

## 字段映射关系

### Order → PayOrder
| Order 字段 | PayOrder 字段 |
|------------|---------------|
| order_no | u_order_no |
| pay_no | pay_no (UNIQUE) |

### PayOrder → AlipayBatchPayRecord
| PayOrder 字段 | AlipayBatchPayRecord 字段 |
|--------------|---------------------------|
| pay_no | out_batch_no |
| batch_trans_id | batch_trans_id |
| alipay_order_no | batch_trans_id |

### PayOrder → PayOrderDetail
| PayOrder 字段 | PayOrderDetail 字段 |
|--------------|---------------------|
| id | pay_order_id |

### UserInfo → OauthToken
| UserInfo 字段 | OauthToken 字段 |
|---------------|-----------------|
| user_id | user_id |
| user_id | alipay_user_id |

---

## 支付明细状态流转

```mermaid
stateDiagram-v2
    [*] --> 未支付
    未支付 --> 已支付: 支付成功
    未支付 --> 支付失败: 支付异常
    支付失败 --> 未支付: 重试
    已支付 --> [*]
```

**状态说明**:
- `0` - 未支付(锁定状态)：金额已扣除，等待实际支付
- `1` - 已支付：支付完成
- `2` - 支付失败：支付异常，需要处理

---

## 注意事项

1. ⚠️ **外键关系**: PayOrder 和 PayOrderDetail 使用了 `@ForeignKey(ConstraintMode.NO_CONSTRAINT)`，外键约束由应用层维护
2. ⚠️ **级联操作**: 需要在应用层处理级联删除和更新，特别是支付明细状态的同步
3. ⚠️ **事务管理**: 组合支付涉及多个账户操作，必须使用 `@Transactional` 保证数据一致性
4. ⚠️ **金额精度**: 所有金额字段使用 `BigDecimal`，避免浮点数精度问题
5. ⚠️ **支付状态同步**: 多个支付明细需要保证最终状态一致，全部成功或全部失败
6. ⚠️ **幂等性**: 支付回调需要保证幂等性，避免重复处理
