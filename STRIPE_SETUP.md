# Stripe支付集成配置指南

## 第一步：注册Stripe账号

1. 访问 [stripe.com](https://stripe.com) 并注册
2. 选择 **Individual**（个人开发者）
3. 填写：
   - 个人信息（姓名、地址）
   - 银行卡信息（收款账户）
   - 验证邮箱和手机号

## 第二步：获取API密钥

1. 登录Stripe Dashboard
2. 左侧菜单：**Developers** → **API keys**
3. 你会看到两个密钥对：
   - **Test mode**（测试模式）
   - **Live mode**（正式模式）

### 测试模式密钥（开发阶段用）

```
Publishable key: pk_test_...
Secret key: sk_test_...
```

### 正式模式密钥（上线后用）

```
Publishable key: pk_live_...
Secret key: sk_live_...
```

## 第三步：配置环境变量

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
cd D:\workbuddy\bazi-fortune
cp .env.example .env
```

### 2. 编辑 .env 文件

使用你从Stripe获取的密钥：

```env
# 测试模式密钥
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key

# 服务器端口
PORT=3001
```

**⚠️ 重要提示**：
- 不要把 `.env` 文件提交到git
- 不要把 `STRIPE_SECRET_KEY` 泄露给任何人

## 第四步：启动服务

### 启动后端服务器

```bash
cd D:\workbuddy\bazi-fortune
node server.js
```

你会在终端看到：
```
Stripe支付服务器运行在 http://localhost:3001
```

### 启动前端开发服务器

新开一个终端窗口：

```bash
cd D:\workbuddy\bazi-fortune
npm run dev
```

## 第五步：测试支付

### 测试卡号（Stripe提供的测试卡）

| 卡号 | 卡片类型 | 结果 |
|------|---------|------|
| 4242 4242 4242 4242 | Visa | 支付成功 |
| 4000 0000 0000 0002 | Visa | 支付失败（被拒绝） |
| 4000 0025 0000 3155 | Visa | 需要验证（3D Secure） |
| 5555 5555 5555 4444 | Mastercard | 支付成功 |

### 其他测试信息

- **过期日期**：任意未来日期（如 12/34）
- **CVC**：任意3位数字
- **邮编**：任意5位数字

### 测试步骤

1. 打开前端：http://localhost:5173
2. 输入八字信息，点击"开始测算"
3. 在支付弹窗中输入测试卡号：`4242 4242 4242 4242`
4. 点击"立即支付"
5. 看到支付成功提示 ✅

## 第六步：上线部署

### 1. 切换到正式模式

在 `.env` 文件中：

```env
# 正式模式密钥（上线后替换）
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
```

### 2. 部署后端服务器

建议使用：
- **Vercel**（推荐，免费）
- **Railway**
- **Heroku**

### 3. 更新前端API地址

在 `src/components/PaymentModal.tsx` 中：

```typescript
// 开发环境
fetch('http://localhost:3001/api/create-payment-intent', ...)

// 生产环境（替换为你的后端域名）
fetch('https://your-backend.com/api/create-payment-intent', ...)
```

## 常见问题

### Q1: 收款到银行卡要多久？

A: 测试模式可以立即看到，正式模式T+2到账（2个工作日）。

### Q2: 费用是多少？

A: Stripe收取 **2.9% + $0.30** 每笔交易。例如：
- $2.99订单 → Stripe收取 $0.39 → 你收到$2.60

### Q3: 如何查看交易记录？

A: 登录Stripe Dashboard → **Payments** 查看所有交易。

### Q4: 支持哪些国家/地区？

A: Stripe支持全球195个国家/地区，海外华侨可以用当地信用卡支付。

### Q5: 如何退款？

A: Stripe Dashboard → Payments → 选择订单 → Refund

## 技术支持

如果遇到问题：
1. 查看Stripe文档：https://stripe.com/docs
2. 检查浏览器控制台错误
3. 检查后端服务器日志
