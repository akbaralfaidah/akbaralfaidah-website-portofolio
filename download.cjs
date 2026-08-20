const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  { weight: 400, url: 'https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2' },
  { weight: 500, url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2' },
  { weight: 600, url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2' },
  { weight: 700, url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2' }
];

fonts.forEach(font => {
  const fileName = `poppins-${font.weight}.woff2`;
  const filePath = path.join(fontsDir, fileName);
  https.get(font.url, (response) => {
    response.pipe(fs.createWriteStream(filePath));
  });
});
console.log('Fonts downloaded successfully to public/fonts!');
