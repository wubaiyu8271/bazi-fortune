# PayPal支付集成配置指南

## 第一步：注册PayPal账号

1. 访问 [paypal.com](https://www.paypal.com) 并注册
2. 选择 **个人账户（Personal）** 或 **商业账户（Business）**
   - 个人账户：适合小额交易
   - 商业账户：适合正式运营，可提现到中国银行卡
3. 填写：
   - 个人信息（姓名、邮箱、手机号）
   - 验证邮箱和手机号
   - 绑定银行卡（用于提现）

## 第二步：获取API密钥

1. 登录后，访问 [PayPal开发者后台](https://developer.paypal.com/dashboard/)
2. 点击 **Apps & Credentials**（应用和凭据）
3. 在 **REST API Apps** 部分，点击 **Create App**
4. 填写：
   - **App name**：天机阁（或其他名称）
   - **Sandbox account**：选择测试账号
5. 创建后，你会看到：
   - **Client ID**（前端的公钥）
   - **Client Secret**（后端的私钥，**绝不能泄露**）

### 测试模式 vs 正式模式

| 模式 | 说明 | 密钥前缀 |
|------|------|---------|
| **Sandbox**（测试） | 开发阶段用，无需真实付款 | `AXXXX...` |
| **Live**（正式） | 上线后用，真实交易 | `AXXXX...` |

**注意**：Sandbox和Live的Client ID是不同的，需要分别创建。

## 第三步：配置环境变量

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
cd D:\workbuddy\bazi-fortune
cp .env.example .env
```

### 2. 编辑 .env 文件

使用你从PayPal获取的密钥：

```env
# 测试模式密钥
VITE_PAYPAL_CLIENT_ID=AXXXXXXXyour_actual_client_idXXXXXX
PAYPAL_CLIENT_SECRET=EHXXXXXXyour_actual_client_secretXXXXXX

# PayPal模式：sandbox（测试）
PAYPAL_MODE=sandbox

# 服务器端口
PORT=3001
```

**⚠️ 重要提示**：
- 不要把 `.env` 文件提交到git
- 不要把 `PAYPAL_CLIENT_SECRET` 泄露给任何人

## 第四步：启动服务

### 启动后端服务器

```bash
cd D:\workbuddy\bazi-fortune
node server.js
```

你会在终端看到：
```
PayPal支付服务器运行在 http://localhost:3001
PayPal模式: sandbox
```

### 启动前端开发服务器

新开一个终端窗口：

```bash
cd D:\workbuddy\bazi-fortune
npm run dev
```

## 第五步：测试支付

### 1. 获取PayPal测试账号

1. 登录 [PayPal开发者后台](https://developer.paypal.com/dashboard/)
2. 点击 **Sandbox → Accounts**
3. 你会看到一个测试账号（Email: buyer@example.com）
4. 点击账号可以看到密码

### 2. 测试支付步骤

1. 打开前端：http://localhost:5173
2. 输入八字信息，点击"开始测算"
3. 在支付弹窗中，点击 **PayPal** 按钮
4. 跳转到PayPal测试页面，登录测试账号：
   - **Email**: buyer@example.com（或你看到的测试邮箱）
   - **Password**: 点击账号查看密码
5. 点击 **Pay Now** 完成支付
6. 看到支付成功提示 ✅

### 3. 查看交易记录

1. 登录 [PayPal开发者后台](https://developer.paypal.com/dashboard/)
2. 点击 **Sandbox → Activity**
3. 你会看到刚才的测试交易

## 第六步：提现到中国银行卡

### 绑定银行卡

1. 登录PayPal账号（正式账号，不是测试账号）
2. 点击 **设置 → 银行账户**
3. 添加你的银行卡：
   - **开户银行**：选择你的银行（如招商银行）
   - **银行代码**：填写SWIFT代码
   - **账号类型**：储蓄账户

### 提现流程

| 步骤 | 说明 |
|------|------|
| 申请提现 | 在PayPal点击提现，输入金额 |
| 处理时间 | 通常2-3个工作日到账 |
| 费用 | 免费提现（超过$150），小额提现可能收$35手续费 |
| 到账方式 | 直接进入你的银行卡（美元需自动结汇） |

## 第七步：上线部署

### 1. 切换到正式模式

在 `.env` 文件中：

```env
# 正式模式密钥（上线后替换）
VITE_PAYPAL_CLIENT_ID=AXXXXXXXyour_live_client_idXXXXXX
PAYPAL_CLIENT_SECRET=EHXXXXXXyour_live_client_secretXXXXXX

# PayPal模式：live（正式）
PAYPAL_MODE=live
```

### 2. 获取正式密钥

1. 登录 [PayPal开发者后台](https://developer.paypal.com/dashboard/)
2. 在 **REST API Apps** 中，选择 **Live** 标签
3. 点击 **Create App** 创建正式应用
4. 复制 **Client ID** 和 **Client Secret**

### 3. 部署后端服务器

建议使用：
- **Vercel**（推荐，免费）
- **Railway**
- **Heroku**

### 4. 更新前端API地址

在 `src/components/PaymentModal.tsx` 中：

```typescript
// 开发环境
fetch('http://localhost:3001/api/create-paypal-order', ...)

// 生产环境（替换为你的后端域名）
fetch('https://your-backend.com/api/create-paypal-order', ...)
```

## 常见问题

### Q1: 收款到银行卡要多久？

A: 
- 测试模式：立即看到
- 正式模式：2-3个工作日到账

### Q2: 费用是多少？

A: PayPal收取 **3.4% + 固定费用**（中国大陆）。例如：
- $2.99订单 → PayPal收取 $0.40 → 你收到$2.59

### Q3: 支持哪些国家/地区？

A: PayPal支持全球200+个国家/地区，海外华侨可以用当地PayPal账户支付。

### Q4: 如何查看交易记录？

A: 登录PayPal → **活动（Activity）** 查看所有交易。

### Q5: 如何退款？

A: PayPal → 活动 → 选择交易 → 退款

### Q6: 中国银行卡能收美元吗？

A: 可以，PayPal会自动将美元兑换成人民币汇入你的银行卡。

### Q7: 每年有结汇额度限制吗？

A: PayPal提现到银行卡受中国外汇管制限制，每人每年$5万美元等值额度。

### Q8: 测试支付怎么撤销？

A: 测试环境中的支付不会产生真实扣款，无需撤销。

### Q9: PayPal支持微信支付吗？

A: 不支持，PayPal只支持PayPal账户绑定信用卡/借记卡。

## 技术支持

如果遇到问题：
1. 查看PayPal开发者文档：https://developer.paypal.com/docs/
2. 检查浏览器控制台错误
3. 检查后端服务器日志
4. 确认API密钥是否正确
