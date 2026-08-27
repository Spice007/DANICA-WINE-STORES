const fs = require('fs');

function fixMojibake(filepath) {
  let text = fs.readFileSync(filepath, 'utf8');
  
  text = text.replace(/Ã°Å¸Â â€¹/g, '🍋');
  text = text.replace(/Ã°Å¸Â â€˜/g, '🍑');
  text = text.replace(/Ã¢Å“Â¨/g, '✨');
  text = text.replace(/Ã°Å¸Â â€™/g, '🍒');
  text = text.replace(/Ã°Å¸ÂªÂµ/g, '🪵');
  text = text.replace(/Ã°Å¸Â Â«/g, '🍫');
  text = text.replace(/ROSÃƒâ€°/g, 'ROSÉ');
  text = text.replace(/RosÃƒÂ©/g, 'Rosé');
  text = text.replace(/Ã°Å¸Â â€œ/g, '🍓');
  text = text.replace(/Ã°Å¸Å’Â¸/g, '🌸');
  text = text.replace(/Ã°Å¸Â Å /g, '🍊');
  text = text.replace(/Ã°Å¸Â â€°/g, '🍉');
  text = text.replace(/Ã¢Ëœâ€¢/g, '☕');
  text = text.replace(/Ã°Å¸â€™Â§/g, '💧');
  text = text.replace(/Ã°Å¸Â Â /g, '🍏');
  text = text.replace(/Ã°Å¸Â¥Â /g, '🥖');
  text = text.replace(/Ã°Å¸Â Â¯/g, '🍦');
  text = text.replace(/Ã°Å¸Â¥â€š/g, '🍐');
  text = text.replace(/Ã°Å¸Å’Â°/g, '🌰');
  text = text.replace(/Ã°Å¸Â Å¾/g, '🍞');
  text = text.replace(/ÃƒÂ§/g, 'ç');
  text = text.replace(/ÃƒÂ©/g, 'é');
  text = text.replace(/Ã—/g, '×');
  text = text.replace(/CuvÃƒÂ©e/g, 'Cuvée');
  text = text.replace(/ProvenÃƒÂ§al/g, 'Provençal');
  text = text.replace(/MÃƒÂ©thode/g, 'Méthode');
  text = text.replace(/Ã¢â‚¦â€ /g, '—');
  text = text.replace(/Ã¢â€ â‚¦/g, '─');
  
  fs.writeFileSync(filepath, text, 'utf8');
}

fixMojibake('index.html');
fixMojibake('script.js');
console.log('Fixed mojibake');
