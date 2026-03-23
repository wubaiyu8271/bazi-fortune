/**
 * PayPal支付后端服务器
 * 用于创建和捕获PayPal订单
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';

// 首先加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 通用的HTTPS请求函数
function makeRequest(hostname, path, method, headers, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method,
      headers,
      port: 443,
    };

    console.log(`Making ${method} request to ${hostname}${path}`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Response status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

// 获取PayPal访问令牌
async function getPayPalAccessToken() {
  const hostname = process.env.PAYPAL_MODE === 'live' 
    ? 'api-m.paypal.com' 
    : 'api-m.sandbox.paypal.com';

  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  console.log('PayPal模式:', process.env.PAYPAL_MODE);
  console.log('Client ID 是否存在:', !!clientId);
  console.log('Client Secret 是否存在:', !!clientSecret);

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = 'grant_type=client_credentials';

  const result = await makeRequest(
    hostname,
    '/v1/oauth2/token',
    'POST',
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
      'Content-Length': body.length,
    },
    body
  );

  if (result.statusCode !== 200) {
    throw new Error(`Failed to get access token: ${JSON.stringify(result.data)}`);
  }

  return result.data.access_token;
}

// 创建PayPal订单
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    const hostname = process.env.PAYPAL_MODE === 'live' 
      ? 'api-m.paypal.com' 
      : 'api-m.sandbox.paypal.com';

    // 获取访问令牌
    const accessToken = await getPayPalAccessToken();

    // 创建订单
    const body = JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency || 'USD',
          value: amount || '2.99',
        },
        description: '八字命理详批',
        custom_id: JSON.stringify(metadata),
      }],
      application_context: {
        brand_name: '天机阁',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    });

    const result = await makeRequest(
      hostname,
      '/v2/checkout/orders',
      'POST',
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Length': body.length,
      },
      body
    );

    if (result.statusCode !== 201) {
      throw new Error(`Failed to create order: ${JSON.stringify(result.data)}`);
    }

    console.log('PayPal订单创建成功:', result.data.id);
    res.json({ orderID: result.data.id });
  } catch (error) {
    console.error('创建PayPal订单失败:', error.message);
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// 捕获PayPal订单支付
app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body;

    const hostname = process.env.PAYPAL_MODE === 'live' 
      ? 'api-m.paypal.com' 
      : 'api-m.sandbox.paypal.com';

    // 获取访问令牌
    const accessToken = await getPayPalAccessToken();

    // 捕获订单
    const result = await makeRequest(
      hostname,
      `/v2/checkout/orders/${orderID}/capture`,
      'POST',
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Length': 2,
      },
      '{}'
    );

    if (result.data.status === 'COMPLETED') {
      console.log('支付成功:', result.data.id);
      res.json({ status: 'COMPLETED', data: result.data });
    } else {
      console.error('PayPal支付捕获失败:', result.data);
      res.status(500).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('捕获PayPal支付失败:', error.message);
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: process.env.PAYPAL_MODE || 'sandbox' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`PayPal支付服务器运行在 http://localhost:${PORT}`);
  console.log(`PayPal模式: ${process.env.PAYPAL_MODE || 'sandbox'}`);
});
