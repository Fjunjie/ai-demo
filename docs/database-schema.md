# 数据库设计文档

## 项目概述

zentransfer 是一个基于 Spring Boot 的支付转账系统，主要处理支付宝支付、批量转账和组合支付业务。

## 数据库表结构

### 1. BaseEntity (基础实体类)

所有实体类继承的基础类，提供通用字段。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, NOT NULL, UUID |
| created_at | LocalDateTime | 创建时间 | NOT NULL, 自动生成 |
| updated_at | LocalDateTime | 更新时间 | NOT NULL, 自动更新 |

---

### 2. pay_order (支付单表) ⭐ 核心表

组合支付主单，支持多种支付方式组合（返利抵扣+余额支付+支付宝支付）。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| u_order_no | String | UOrder订单号 | - |
| pay_no | String | 支付单号 | UNIQUE |
| batch_trans_id | String | 支付宝业务号 | - |
| total_amount | BigDecimal | 总金额 | - |
| rebate_amount | BigDecimal | 返利抵扣金额 | - |
| balance_amount | BigDecimal | 余额支付 | - |
| real_amount | BigDecimal | 实际支付金额 | - |
| type | PayOrderType | 支付类型 | ENUM |
| agent_id | String | 客户ID | - |
| pay_status | Integer | 支付状态 | - |
| agent_erp_code | String | 客商ERP | - |
| agent_name | String | 客商名称 | - |
| u_agent_id | String | 客商编码 | - |
| source_pay_no | String | 来源支付单号 | - |
| alipay_order_no | String | 支付宝唯一交易号 | - |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `pay_no` (UNIQUE)

**支付类型枚举 (PayOrderType)**:
- `ALIPAY` - 支付宝支付
- `COMBINED` - 组合支付（返利+余额+支付宝）
- `BALANCE` - 纯余额支付
- `REBATE` - 纯返利支付

---

### 3. pay_order_detail (支付单明细表) ⭐ 核心表

支付单明细，记录每种支付方式的支付详情。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| pay_order_id | String | 支付单ID (FK) | - |
| detail_type | PayDetailType | 支付类型 | ENUM |
| amount | BigDecimal | 支付金额 | - |
| status | Integer | 支付状态 | - |
| deduction_pay_no | String | 抵扣支付单号 | - |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `pay_order_id`

**支付明细类型枚举 (PayDetailType)**:
- `REBATE` - 返利支付
- `BALANCE` - 余额支付
- `ALIPAY` - 支付宝支付

**支付状态**:
- `0` - 未支付(锁定状态)
- `1` - 已支付
- `2` - 支付失败

---

### 4. alipay_fund_auth_record (支付宝资金授权记录表)

存储支付宝资金授权相关的记录。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| out_biz_no | String | 外部请求号 | - |
| user_id | String | 用户编码 | - |
| agreement_no | String | 签约协议号 | - |
| status | String | 签约状态 | - |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `user_id`
- `out_biz_no`
- `user_id` + `status` (组合索引)

---

### 5. alipay_oauth_tokens (OAuth令牌表)

存储支付宝OAuth授权的令牌信息。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| session_id | String | Session ID | UNIQUE, NOT NULL |
| access_token | String | 访问令牌 | UNIQUE, NOT NULL |
| alipay_user_id | String | 支付宝用户ID(将废弃) | - |
| auth_start | LocalDateTime | 授权开始时间 | NOT NULL |
| expires_in | int | 访问令牌过期时间(秒) | NOT NULL |
| re_expires_in | int | 刷新令牌过期时间(秒) | NOT NULL |
| refresh_token | String | 刷新令牌 | UNIQUE, NOT NULL |
| user_id | String | 用户ID | UNIQUE, NOT NULL |
| auth_code | String | 授权一次性code | - |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `session_id` (UNIQUE)
- `access_token` (UNIQUE)
- `user_id` (UNIQUE)
- `refresh_token` (UNIQUE)
- `user_id` + `created_at` (组合索引，降序)

---

### 6. alipay_user_infos (用户信息表)

存储支付宝用户的基本信息。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| user_id | String | 用户ID (2088开头16位) | UNIQUE, NOT NULL |
| nick_name | String | 昵称 | - |
| avatar | String | 头像URL | - |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `user_id` (UNIQUE)

---

### 7. alipay_batch_pay_record (支付宝批量支付记录表)

存储支付宝批量支付的订单记录。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| out_batch_no | String | 外部单号 | - |
| batch_trans_id | String | 批次支付订单号 | - |
| status | String | 批次状态 | - |
| notify_success | Boolean | 是否通知成功 | - |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `batch_trans_id`
- `out_batch_no`

---

### 8. uorder_orders (UOrder订单表)

存储UOrder系统的订单信息（历史数据）。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, 继承自BaseEntity |
| pay_no | String | 支付单号 | UNIQUE, NOT NULL |
| order_no | String | 订单单号 | NOT NULL |
| amount | Money | 金额 | NOT NULL |
| produce_desc | String | 商品描述 | NOT NULL |
| src_reserve | String | 保留字段(CustomChannel) | NOT NULL |
| biz_id | String | 商家ID | NOT NULL |
| agent_id | String | 客户ID | NOT NULL |
| out_trade_no | String | 外部订单号 | - |
| status | short | 支付状态(0表示成功) | NOT NULL |
| input_charset | String | 输入字符集 | NOT NULL |
| return_url | String | 返回地址 | NOT NULL |
| size | String | - | NOT NULL |
| notify_url | String | 通知地址 | NOT NULL |
| created_at | LocalDateTime | 创建时间 | NOT NULL |
| updated_at | LocalDateTime | 更新时间 | NOT NULL |

**索引**：
- `pay_no` (UNIQUE)
- `order_no`

---

## 实体关系说明

### 核心支付流程关系

1. **组合支付流程** ⭐
   - `pay_order` 是主支付单，支持多种支付方式组合
   - `pay_order_detail` 记录每种支付方式的详细信息
   - 一个支付单可包含多个支付明细（1对N关系）

2. **订单流程**
   - `uorder_orders` 是原始订单数据
   - `pay_order` 是基于订单生成的支付单
   - 通过 `u_order_no` 关联

3. **支付宝集成**
   - `alipay_batch_pay_record` 是支付宝批量支付记录
   - `alipay_fund_auth_record` 记录授权信息
   - `alipay_oauth_tokens` 和 `alipay_user_infos` 管理OAuth和用户信息

### 数据流向

1. 用户下单 → `uorder_orders`
2. 生成支付单 → `pay_order`
3. 分解支付明细 → `pay_order_detail`
4. 支付宝授权 → `alipay_fund_auth_record`
5. 创建支付宝批量支付 → `alipay_batch_pay_record`
6. OAuth认证 → `alipay_oauth_tokens` + `alipay_user_infos`

---

## 组合支付说明 ⭐

### 支付金额计算公式

```
total_amount = rebate_amount + balance_amount + real_amount
```

- **total_amount**: 订单总金额
- **rebate_amount**: 使用返利抵扣的金额
- **balance_amount**: 使用账户余额支付的金额
- **real_amount**: 需要支付宝实际支付的金额

### 支付类型说明

| 支付类型 | 说明 | 支付明细组合 |
|---------|------|-------------|
| `ALIPAY` | 纯支付宝支付 | 只有 ALIPAY 类型的明细 |
| `COMBINED` | 组合支付 | 可包含 REBATE + BALANCE + ALIPAY |
| `BALANCE` | 纯余额支付 | 只有 BALANCE 类型的明细 |
| `REBATE` | 纯返利支付 | 只有 REBATE 类型的明细 |

### 组合支付示例

**场景**: 用户购买商品1000元，使用100元返利+300元余额，剩余600元通过支付宝支付

```
pay_order:
  - total_amount: 1000.00
  - rebate_amount: 100.00
  - balance_amount: 300.00
  - real_amount: 600.00
  - type: COMBINED

pay_order_detail (3条记录):
  1. detail_type: REBATE, amount: 100.00, status: 1 (已支付)
  2. detail_type: BALANCE, amount: 300.00, status: 1 (已支付)
  3. detail_type: ALIPAY, amount: 600.00, status: 0 (待支付)
```

---

## 数据库配置

当前配置：
```properties
spring.jpa.hibernate.ddl-auto=update
```

**建议**：
- 生产环境应使用 `validate` 或 `none`
- 使用 Flyway 进行数据库版本管理
- 配置文件中未找到数据库连接信息，可能在环境变量中

---

## 安全建议

1. ⚠️ **敏感信息管理**：证书和私钥路径不应硬编码在配置文件中
2. ⚠️ **金额精度**：使用 BigDecimal 处理金额，避免浮点数精度问题
3. ⚠️ **外键关系**：当前 PayOrder 和 PayOrderDetail 使用了 @JoinColumn 但禁用了外键约束
4. ⚠️ **支付状态同步**：组合支付需要确保多个支付明细的状态同步

---

## 技术栈

- Spring Boot 3.2.6
- Java 17
- JPA (Hibernate)
- Joda Money (金额处理)
- MySQL / H2 (数据库)
- Flyway (数据库迁移)
- Spring Security (认证授权)
