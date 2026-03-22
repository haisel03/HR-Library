/**
 * Middleware para JSON Server — HR Library API
 *
 * Agrega:
 * 1. Headers CORS para permitir peticiones desde localhost (webpack-dev-server)
 * 2. Endpoint POST /api/auth/login (busca por email + password)
 * 3. Endpoint GET  /api/dashboard/stats (devuelve objeto único, no array)
 * 4. Header X-Total-Count para paginación
 */

module.exports = (req, res, next) => {
  // ── CORS ────────────────────────────────────────────────────────────────
  res.header("Access-Control-Allow-Origin",  "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Expose-Headers","X-Total-Count");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  // ── Login simulado ───────────────────────────────────────────────────────
  if (req.method === "POST" && req.url === "/api/auth/login") {
    const db   = require("./db.json");
    const body = req.body;
    const user = db.usuarios.find(
      (u) => u.email === body.email && u.password === body.password && u.activo
    );

    if (user) {
      const { password, ...userSafe } = user;
      return res.json({
        success: true,
        token:   `mock-jwt-token-${user.id}-${Date.now()}`,
        user:    userSafe
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas o usuario inactivo"
      });
    }
  }

  // ── Dashboard: devolver objeto único en lugar de array ───────────────────
  if (req.method === "GET" && req.url === "/api/dashboard/stats") {
    const db = require("./db.json");
    return res.json(db.dashboard[0]);
  }

  next();
};
