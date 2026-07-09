const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
try {
  dom.window.eval(fs.readFileSync('app.js', 'utf-8'));
} catch (e) {
  console.error("Error:", e);
}
