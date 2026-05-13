const { Client, Environment } = require('square');

const LOCATION_ID   = process.env.SQUARE_LOCATION_ID   || 'W367P5RXB7QQS';
const SITE_URL      = process.env.SITE_URL              || 'https://www.summerworkshop.fyi';
const ACCESS_TOKEN  = process.env.SQUARE_ACCESS_TOKEN   || '';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { childName, childCount, parentName, parentEmail, parentPhone } = req.body || {};
  const qty = Math.max(1, parseInt(childCount, 10) || 1);

  const client = new Client({
    accessToken: ACCESS_TOKEN,
    environment: Environment.Production,
  });

  try {
    const idempotencyKey = 'mpk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

    // Early Bird $45 through May 25, 2026; $50 after
    const EARLY_BIRD_DEADLINE = new Date('2026-05-26T00:00:00');
    const priceCents = (new Date() < EARLY_BIRD_DEADLINE) ? 4500 : 5000;

    const response = await client.checkoutApi.createPaymentLink({
      idempotencyKey,
      order: {
        locationId: LOCATION_ID,
        lineItems: [{
          name: 'My Purpose Kids Summer Workshop 2026',
          quantity: String(qty),
          note: 'Children: ' + (childName || '') + ' | Parent: ' + (parentName || ''),
          basePriceMoney: { amount: BigInt(priceCents), currency: 'USD' },
        }],
        metadata: {
          childName:   childName   || '',
          parentName:  parentName  || '',
          parentEmail: parentEmail || '',
          parentPhone: parentPhone || '',
        }
      },
      checkoutOptions: {
        allowTipping: false,
        redirectUrl: SITE_URL + '/thank-you.html',
        askForShippingAddress: false,
        merchantSupportEmail: 'summerworkshops25@gmail.com',
      },
      prePopulatedData: {
        buyerEmail: parentEmail || undefined,
      },
    });

    const link = response.result.paymentLink;
    return res.status(200).json({ url: link.url, id: link.id });

  } catch (err) {
    const errors = err?.errors || [];
    const msg = errors[0]?.detail || err.message || 'Could not create checkout.';
    console.error('Square checkout error:', errors);
    return res.status(500).json({ error: msg });
  }
};
