const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }

    const emailLower = email.toLowerCase();

    const existing = await User.findOne({ $or: [{ email: emailLower }, { username }] });
    if (existing) {
      return res.status(409).json({ error: 'User with that email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ username, email: emailLower, passwordHash });
    await user.save();

    return res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = createJwtToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function createJwtToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment');
    throw new Error('Server configuration error');
  }

  return jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
}

function renderOAuthSuccessPage(res, token) {
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>GitHub OAuth Success</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f3f4f6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .container { width: min(680px, 90%); background: white; border-radius: 18px; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        h1 { margin-bottom: 12px; color: #111827; }
        p { color: #4b5563; margin-bottom: 20px; }
        textarea { width: 100%; min-height: 120px; border: 2px solid #d1d5db; border-radius: 12px; padding: 16px; font-size: 0.95rem; color: #111827; resize: none; }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
        .btn { border: none; border-radius: 12px; padding: 14px 18px; cursor: pointer; font-weight: 600; }
        .btn-copy { background: #111827; color: white; }
        .btn-docs { background: #4f46e5; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>GitHub Sign-In Successful</h1>
        <p>Your API token is ready. Copy it to use the Swagger UI or other authorized requests.</p>
        <textarea id="tokenValue" readonly>${token}</textarea>
        <div class="buttons">
          <button class="btn btn-copy" id="copyToken">Copy Token</button>
          <button class="btn btn-docs" id="openDocs">Open API Docs</button>
        </div>
      </div>
      <script>
        document.getElementById('copyToken').addEventListener('click', async () => {
          const token = document.getElementById('tokenValue').value;
          await navigator.clipboard.writeText(token);
          alert('Token copied to clipboard');
        });

        document.getElementById('openDocs').addEventListener('click', () => {
          window.location.href = '/api-docs';
        });
      </script>
    </body>
    </html>
  `);
}

async function oauthSuccess(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: 'OAuth login failed' });
    }

    const token = createJwtToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

    if (req.accepts('html')) {
      return renderOAuthSuccessPage(res, token);
    }

    return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('OAuth success error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function oauthFailure(req, res) {
  return res.status(401).json({ error: 'OAuth authentication failed' });
}

async function changePassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Can only change your own password' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    user.passwordHash = newHash;
    await user.save();

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteAccount(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Can only delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.deleteOne();
    return res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('deleteAccount error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login, oauthSuccess, oauthFailure, changePassword, deleteAccount };
