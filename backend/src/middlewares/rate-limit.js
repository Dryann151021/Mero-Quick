const store = new Map();

const createRateLimiter = ({ windowMs, max, message }) => {
  return async (c, next) => {
    const ip =
      c.req.header('x-forwarded-for') ||
      c.req.header('x-real-ip') ||
      '127.0.0.1';
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!store.has(ip)) {
      store.set(ip, []);
    }

    const timestamps = store.get(ip);

    // Remove old timestamps
    const currentWindowTimestamps = timestamps.filter(
      (time) => time > windowStart
    );

    if (currentWindowTimestamps.length >= max) {
      store.set(ip, currentWindowTimestamps);
      return c.json({ status: 'fail', message }, 429);
    }

    currentWindowTimestamps.push(now);
    store.set(ip, currentWindowTimestamps);

    await next();
  };
};

export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak permintaan login. Coba lagi setelah beberapa menit.',
});

export const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    'Terlalu banyak percobaan register. Coba lagi setelah beberapa saat.',
});

export const notificationsLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message:
    'Terlalu banyak permintaan notifikasi. Coba lagi setelah beberapa saat.',
});

export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi nanti.',
});
