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
      }
      .btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
      }
      .btn:active {
        transform: translateY(-1px);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎬 BingeMatch API</h1>
      <p>A Tinder-style movie picker for groups</p>
      <a href="/api-docs" class="btn">View API Documentation</a>
    </div>
  </body>
  </html>
`;

module.exports = landingPageHTML;
