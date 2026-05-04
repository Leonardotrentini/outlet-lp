const { Redis } = require('@upstash/redis');

const COUNTER_KEY = 'outlet-lp:wa-rotator';
/** Sem Redis: próximo índice por navegador (cada clique avança 0→1→2→0…) */
const COOKIE_NAME = 'outlet_wa_i';
const ONE_YEAR_SEC = 60 * 60 * 24 * 365;

/** Mesmos links da landing `lpoutletvendedores2.html` (ordem = round-robin). */
const WA_URLS = [
  'https://wa.me/5511910532881?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20queria%20comprar%20no%20atacado!',
  'https://wa.me/5511934677186?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20gostaria%20e%20comprar%20no%20atacado!',
  'https://wa.me/5511932069987?text=Ol%C3%A1%2C%20vim%20do%20site%20e%20gostaria%20de%20comprar%20no%20atacado!%20',
];

function noStore(res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
}

function parseCookieIndex(cookieHeader, n) {
  if (!cookieHeader || typeof cookieHeader !== 'string') return 0;
  const re = new RegExp('(?:^|;)\\s*' + COOKIE_NAME + '=(-?\\d+)');
  const m = cookieHeader.match(re);
  if (!m) return 0;
  const v = parseInt(m[1], 10);
  if (!Number.isFinite(v)) return 0;
  return ((v % n) + n) % n;
}

function buildSetCookie(nextIndex, req) {
  const proto = String(req.headers['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim();
  const parts = [
    `${COOKIE_NAME}=${nextIndex}`,
    'Path=/',
    `Max-Age=${ONE_YEAR_SEC}`,
    'SameSite=Lax',
    'HttpOnly',
  ];
  if (proto === 'https') parts.push('Secure');
  return parts.join('; ');
}

/** Rotação sequencial sem Redis: este clique usa `idx`, cookie passa a guardar o próximo. */
function redirectCookieRoundRobin(req, res, n) {
  const idx = parseCookieIndex(req.headers.cookie, n);
  const next = (idx + 1) % n;
  res.setHeader('Set-Cookie', buildSetCookie(next, req));
  res.setHeader('X-Outlet-WhatsApp', 'cookie-' + idx);
  return res.redirect(302, WA_URLS[idx]);
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).end();
  }
  const n = WA_URLS.length;
  noStore(res);

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const redis = new Redis({ url, token });
      const id = await redis.incr(COUNTER_KEY);
      const index = (id - 1) % n;
      res.setHeader('X-Outlet-WhatsApp', 'redis-' + index);
      return res.redirect(302, WA_URLS[index]);
    } catch (e) {
      // Redis indisponível: sequência por cookie (não aleatório).
    }
  }

  return redirectCookieRoundRobin(req, res, n);
};
