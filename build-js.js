// Generador: convierte gallarditobot.html en un gallarditobot.js embebible
const fs = require("fs");
const src = fs.readFileSync("gallarditobot.html", "utf8");

const css = src.split("<style>")[1].split("</style>")[0];
const js  = src.split("<script>")[1].split("</script>")[0];

const idxDiv = src.indexOf('<div id="gb-root"');
const idxStyle = src.indexOf("<style>");
const html = src.slice(idxDiv, idxStyle).trim();

const out =
`/*!
 * GallarditoBot · CIFP Tony Gallardo — versión embebible
 * Inclúyelo en cualquier web con:
 *   <script src="https://TU-DOMINIO/gallarditobot/gallarditobot.js" defer></script>
 * Se inyecta solo (estilos + HTML + lógica). Sin dependencias externas.
 */
(function(){
  var GB_CSS = ${JSON.stringify(css)};
  var GB_HTML = ${JSON.stringify(html)};

  function inject(){
    if(document.getElementById("gb-root")) return;
    var s = document.createElement("style");
    s.textContent = GB_CSS;
    (document.head || document.documentElement).appendChild(s);
    var d = document.createElement("div");
    d.innerHTML = GB_HTML;
    while(d.firstChild){ document.body.appendChild(d.firstChild); }
  }

  function start(){
    inject();
    /* ===================== LÓGICA ORIGINAL ===================== */
    (function(){${js}})();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
`;

fs.writeFileSync("gallarditobot.js", out, "utf8");
console.log("gallarditobot.js generado:", out.length, "bytes");
