/**
 * Restaura la base de datos al estado original.
 * JSON Server modifica db.json al hacer POST/PUT/DELETE.
 * Ejecutar: node reset.js
 */
const fs   = require("fs");
const path = require("path");

const orig = path.join(__dirname, "db.original.json");
const dest = path.join(__dirname, "db.json");

if (!fs.existsSync(orig)) {
  fs.copyFileSync(dest, orig);
  console.log("✓ Backup creado en db.original.json");
} else {
  fs.copyFileSync(orig, dest);
  console.log("✓ db.json restaurado al estado original");
}
