# 实体关系图

## ER 图 (Mermaid)

```mermaid
erDiagram
    BaseEntity ||--o{ AlipayFundAuthRecord : "继承"
    BaseEntity ||--o{ OauthToken : "继承"
    BaseEntity ||--o{ UserInfo : "继承"
    BaseEntity ||--o{ AlipayBatchPayRecord : "继承"
    BaseEntity ||--o{ Order : "继承"

    Order ||--o{ AlipayBatchPayRecord : "1对1"
    Order ||--o{ AlipayFundAuthRecord : "1对1"
    UserInfo ||--o{ OauthToken : "1对N"
    UserInfo ||--o{ AlipayFundAuthRecord : "1对N"

    BaseEntity {
        string id PK "UUID主键"
        LocalDateTime created_at "创建时间"
        LocalDateTime updated_at "更新时间"
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

## 业务流程图

```mermaid
flowchart TD
    A[用户创建订单] --> B[保存到 uorder_orders]
    B --> C{用户是否已授权?}
    C -->|否| D[申请支付宝授权]
    D --> E[保存到 alipay_fund_auth_record]
    E --> F[用户授权成功]
    F --> G[创建批量支付订单]
    C -->|是| G
    G --> H[保存到 alipay_batch_pay_record]
    H --> I[调用支付宝支付渲染]
    I --> J[用户完成支付]
    J --> K[更新订单状态]
    K --> L[回调通知]

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#ffe1e1
    style G fill:#e1ffe1
    style K fill:#e1ffe1
```

## 数据库表关系详情

### 1. Order (订单表)
- **业务用途**: 存储业务订单信息
- **关联关系**:
  - 与 `AlipayBatchPayRecord` 通过 `out_batch_no` (pay_no) 关联
  - 与 `AlipayFundAuthRecord` 通过 `user_id` 间接关联

### 2. AlipayFundAuthRecord (支付宝资金授权记录)
- **业务用途**: 记录用户资金授权状态
- **关联关系**:
  - 通过 `user_id` 关联到用户
  - 通过 `agreement_no` 维护授权协议

### 3. AlipayBatchPayRecord (支付宝批量支付记录)
- **业务用途**: 记录支付宝批量支付订单
- **关联关系**:
  - `out_batch_no` 对应订单的 `pay_no`
  - `batch_trans_id` 是支付宝返回的订单号

### 4. OauthToken (OAuth令牌)
- **业务用途**: 存储OAuth授权令牌
- **关联关系**:
  - 通过 `user_id` 关联到 `UserInfo`
  - 通过 `session_id` 管理会话

### 5. UserInfo (用户信息)
- **业务用途**: 存储支付宝用户基本信息
- **关联关系**:
  - 与 `OauthToken` 是1对N关系（一个用户可以有多个token）
  - 与 `AlipayFundAuthRecord` 是1对N关系（一个用户可以有多条授权记录）

---

## 字段映射关系

### Order → AlipayBatchPayRecord
| Order 字段 | AlipayBatchPayRecord 字段 |
|------------|---------------------------|
| pay_no | out_batch_no |

### AlipayFundAuthRecord → Order
| 字段 | 说明 |
|------|------|
| user_id | 通过用户关联到订单 |

### UserInfo → OauthToken
| UserInfo 字段 | OauthToken 字段 |
|---------------|-----------------|
| user_id | user_id |
| user_id | alipay_user_id |

---

## 注意事项

1. ⚠️ **外键关系**: 当前设计未使用数据库外键，依赖应用层维护数据一致性
2. ⚠️ **级联操作**: 需要在应用层处理级联删除和更新
3. ⚠️ **事务管理**: 跨表操作需要使用 `@Transactional` 保证数据一致性
4. ⚠️ **数据完整性**: 订单支付流程需要确保订单状态与支付记录同步
