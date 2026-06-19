const landingPageHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BingeMatch API</title>
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
        text-align: center;
        background: rgba(255, 255, 255, 0.95);
        padding: 60px 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 90%;
      }
      h1 {
        color: #333;
        margin-bottom: 20px;
        font-size: 2.5em;
      }
      p {
        color: #666;
        margin-bottom: 40px;
        font-size: 1.1em;
      }
      .btn {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 45px;
        border: none;
        border-radius: 50px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: transform 0.3s, box-shadow 0.3s;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        margin: 10px;
      }
      .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
      }
      .btn:active {
        transform: translateY(-1px);
      }
      .btn-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        justify-content: center;
        align-items: center;
      }
      .token-panel {
        background: #f5f5f5;
        padding: 20px;
        border-radius: 10px;
        margin-top: 30px;
        text-align: left;
        display: none;
      }
      .token-panel.visible {
        display: block;
      }
      .token-panel h3 {
        color: #333;
        margin-bottom: 10px;
        font-size: 1.1em;
      }
      .token-panel textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 0.85em;
        resize: none;
        height: 100px;
        font-family: monospace;
        margin-bottom: 10px;
      }
      .btn-secondary {
        width: 100%;
        padding: 10px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
      }
      .btn-secondary:hover {
        background: #764ba2;
      }
      .success-msg {
        color: #27ae60;
        margin-top: 10px;
        font-size: 0.9em;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎬 BingeMatch API</h1>
      <p>A Tinder-style movie picker for groups</p>
      <div class="btn-container">
        <a href="/login" class="btn">Sign In to View Docs</a>
      </div>
      <div id="tokenPanel" class="token-panel">
        <h3>Your JWT Token</h3>
        <textarea id="tokenText" readonly></textarea>
        <button class="btn-secondary" onclick="copyToken()">Copy Token</button>
        <div id="successMsg" class="success-msg" style="display: none;">Token copied to clipboard!</div>
      </div>
    </div>

    <script>
      function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
      }

      function copyToken() {
        const tokenText = document.getElementById('tokenText');
        tokenText.select();
        document.execCommand('copy');
        const successMsg = document.getElementById('successMsg');
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 2000);
      }

      const token = getQueryParam('token');
      if (token) {
        document.getElementById('tokenPanel').classList.add('visible');
        document.getElementById('tokenText').value = token;
      }
    </script>
  </body>
  </html>
`;

module.exports = landingPageHTML;
