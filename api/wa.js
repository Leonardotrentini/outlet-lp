const { Redis } = require('@upstash/redis');

const COUNTER_KEY = 'outlet-lp:wa-rotator';

/** Mesmos links da landing `lpoutletvendedores2.html` (ordem = round-robin). */
const WA_URLS = [
  'https://wa.me/5511910532881?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20queria%20comprar%20no%20atacado!',
  'https://wa.me/5511934677186?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20gostaria%20e%20comprar%20no%20atacado!',
];

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).end();
  }
  const n = WA_URLS.length;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    res.setHeader('X-Outlet-WhatsApp', 'fallback-config');
    return res.redirect(302, WA_URLS[0]);
  }
  try {
    const redis = new Redis({ url, token });
    const id = await redis.incr(COUNTER_KEY);
    const index = (id - 1) % n;
    res.setHeader('X-Outlet-WhatsApp', `rotate-${index}`);
    return res.redirect(302, WA_URLS[index]);
  } catch (e) {
    res.setHeader('X-Outlet-WhatsApp', 'fallback-error');
    return res.redirect(302, WA_URLS[0]);
  }
};
