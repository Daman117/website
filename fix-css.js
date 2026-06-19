const fs = require('fs');
let css = fs.readFileSync('frontend/src/index.css', 'utf-8');

// Fix backdrop-filter ordering
css = css.replace(/backdrop-filter:\s*([^;]+);\s*-webkit-backdrop-filter:\s*([^;]+);/g, '-webkit-backdrop-filter: $2;\n  backdrop-filter: $1;');

// Fix background-position and size for #hero::before
css = css.replace(
  /background-position: right -300px center;\s*background-size: auto 102%;/,
  'background-position: right -180px top 90px;\n  background-size: auto 95%;'
);

fs.writeFileSync('frontend/src/index.css', css);
console.log('Done');
