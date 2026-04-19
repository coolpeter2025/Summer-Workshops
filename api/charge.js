const { Client, Environment } = require('square');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sourceId, childName, parentEmail, parentName } = req.body || {};

  if (!sourceId) {
    return res.status(400).json({ error: 'Missing payment token.' });
  }

  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production,
  });

  try {
    const idempotencyKey = `mpk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const response = await client.paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(3500), // $35.00 in cents
        currency: 'USD',
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      note: `Summer Workshop 2026 — ${childName || 'Child'} (${parentName || ''})`,
      buyerEmailAddress: parentEmail || undefined,
    });

    const payment = response.result.payment;

    return res.status(200).json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
    });

  } catch (err) {
    const errors = err?.errors || [];
    const msg = errors[0]?.detail || err.message || 'Payment failed.';
    console.error('Square charge error:', errors);
    return res.status(500).json({ error: msg });
  }
};
