const jwt = require('jsonwebtoken');

function webAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token and it's a browser request, redirect to login
    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari')) {
      return res.redirect('/login');
    }
    return res.status(401).json({ error: 'Unauthorized: no token provided' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not defined in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id || payload.userId || payload.sub };
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: invalid token' });
  }
}

module.exports = webAuth;
