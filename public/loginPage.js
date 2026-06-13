const loginPageHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - BingeMatch API</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .container {
        background: rgba(255, 255, 255, 0.95);
        padding: 60px 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
      }
      h1 {
        color: #333;
        margin-bottom: 10px;
        font-size: 2em;
        text-align: center;
      }
      .subtitle {
        color: #666;
        text-align: center;
        margin-bottom: 40px;
        font-size: 1em;
      }
      .form-group {
        margin-bottom: 20px;
      }
      label {
        display: block;
        color: #333;
        font-weight: 600;
        margin-bottom: 8px;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 1em;
        transition: border-color 0.3s;
      }
      input:focus {
        outline: none;
        border-color: #667eea;
      }
      .btn {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 8px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
      }
      .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
      }
      .token-panel {
        margin-bottom: 20px;
      }
      .token-panel label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 600;
      }
      .token-panel textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 0.95em;
        resize: none;
        margin-bottom: 10px;
      }
      .btn-secondary {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        background: #f5f5f5;
        color: #333;
      }
      .btn-secondary:hover {
        background: #e1e1e1;
      }
      .divider {
        display: flex;
        align-items: center;
        margin: 30px 0;
        gap: 10px;
      }
      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #ddd;
      }
      .divider-text {
        color: #999;
        font-size: 0.9em;
      }
      .btn-github {
        background: #333;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .btn-github:hover {
        background: #555;
        transform: translateY(-3px);
      }
      .github-icon {
        font-size: 1.2em;
      }
      .links {
        text-align: center;
        margin-top: 20px;
        color: #666;
        font-size: 0.95em;
      }
      .links a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }
      .links a:hover {
        text-decoration: underline;
      }
      .error {
        color: #d32f2f;
        font-size: 0.9em;
        margin-top: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Sign In</h1>
      <p class="subtitle">Access BingeMatch API Documentation</p>

      <form id="loginForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required placeholder="Enter your password">
        </div>
        <div id="error" class="error"></div>
        <div id="tokenPanel" class="token-panel" style="display:none;">
          <label for="tokenValue">Your Auth Token</label>
          <textarea id="tokenValue" readonly rows="4"></textarea>
          <button id="copyToken" type="button" class="btn btn-secondary">Copy Token</button>
          <button id="openDocs" type="button" class="btn btn-primary" style="margin-top: 10px; display:none;">Open API Docs</button>
        </div>
        <button type="submit" class="btn btn-primary">Sign In with Email</button>
      </form>

      <div class="divider">
        <span class="divider-text">Or</span>
      </div>

      <a href="/auth/github" class="btn btn-github">
        <span class="github-icon">🐙</span>
        Sign In with GitHub
      </a>

      <div class="links">
        Don't have an account? <a href="/register">Create one</a>
      </div>
    </div>

    <script>
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = '';

        try {
          const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (res.ok && data.token) {
            const tokenPanel = document.getElementById('tokenPanel');
            const tokenValue = document.getElementById('tokenValue');
            const openDocsButton = document.getElementById('openDocs');
            tokenValue.value = data.token;
            tokenPanel.style.display = 'block';
            openDocsButton.style.display = 'block';
            localStorage.setItem('token', data.token);
          } else {
            errorDiv.textContent = data.error || 'Login failed';
          }
        } catch (err) {
          errorDiv.textContent = 'Network error. Please try again.';
        }
      });

      document.getElementById('copyToken').addEventListener('click', async () => {
        const tokenInput = document.getElementById('tokenValue');
        if (!tokenInput.value) return;
        await navigator.clipboard.writeText(tokenInput.value);
        alert('Token copied to clipboard');
      });

      document.getElementById('openDocs').addEventListener('click', () => {
        window.location.href = '/api-docs';
      });
    </script>
  </body>
  </html>
`;

module.exports = loginPageHTML;
