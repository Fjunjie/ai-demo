# 数据库设计文档

## 项目概述

zentransfer 是一个基于 Spring Boot 的支付转账系统，主要处理支付宝支付和批量转账业务。

## 数据库表结构

### 1. BaseEntity (基础实体类)

所有实体类继承的基础类，提供通用字段。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | String | 主键ID | PRIMARY KEY, NOT NULL, UUID |
| created_at | LocalDateTime | 创建时间 | NOT NULL, 自动生成 |
| updated_at | LocalDateTime | 更新时间 | NOT NULL, 自动更新 |

---

### 2. alipay_fund_auth_record (支付宝资金授权记录表)

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

### 3. alipay_oauth_tokens (OAuth令牌表)

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

### 4. alipay_user_infos (用户信息表)

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

### 5. alipay_batch_pay_record (支付宝批量支付记录表)

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

### 6. uorder_orders (订单表)

存储订单信息，使用 Money 类型存储金额。

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

**注意**：
- `pay_no` 字段目前 `unique=true`，根据TODO注释，发布前需确认
- `order_no` 字段目前 `unique=false`，根据TODO注释，发布前需改回 `true`

---

## 实体关系说明

### 业务流程关系

1. **订单流程**
   - `Order` 是业务订单，存储订单基本信息
   - `AlipayBatchPayRecord` 是支付宝批量支付记录，与订单通过 `out_batch_no` 关联

2. **授权流程**
   - `AlipayFundAuthRecord` 记录用户资金授权信息
   - 通过 `user_id` 关联到具体用户

3. **OAuth流程**
   - `OauthToken` 存储OAuth令牌
   - 通过 `user_id` 关联到 `UserInfo`

### 数据流向

1. 用户创建订单 → `uorder_orders`
2. 用户授权 → `alipay_fund_auth_record`
3. 创建批量支付订单 → `alipay_batch_pay_record`
4. OAuth认证 → `alipay_oauth_tokens` + `alipay_user_infos`

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
2. ⚠️ **数据完整性**：`Order` 表的唯一约束需要确认
3. ⚠️ **外键关系**：当前未使用数据库外键，完全依赖应用层维护

---

## 技术栈

- Spring Boot 3.2.6
- Java 17
- JPA (Hibernate)
- Joda Money (金额处理)
- MySQL / H2 (数据库)
- Flyway (数据库迁移)
