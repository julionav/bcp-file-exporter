const svg2img = require("svg2img");

module.exports = svg =>
  new Promise((resolve, reject) => {
    svg2img(svg, (error, buffer) => (error ? reject(error) : resolve(buffer)));
  });
