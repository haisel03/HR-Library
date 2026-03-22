# HR Library — API de Prueba (JSON Server)

Base URL: `http://localhost:3001/api`

## Instalación

```bash
npm install
npm run api
# Con delay de 500ms para simular latencia real:
npm run api:delay
```

## Rutas disponibles

### Auth
| Método | Endpoint               | Descripción |
|--------|------------------------|-------------|
| POST   | `/api/auth/login`      | Login — body: `{ email, password }` |

**Usuarios de prueba:**
```
admin@gmail.com      / password123  (rol: admin)
director@minerd.gob.do / password123 (rol: director)
```
*(Ver db.json → usuarios para todos los emails)*

---

### Dashboard
| Método | Endpoint                  | Descripción |
|--------|---------------------------|-------------|
| GET    | `/api/dashboard/stats`    | Estadísticas generales (objeto único) |
| GET    | `/api/events`             | Eventos para FullCalendar |
| GET    | `/api/tasks`              | Tareas Kanban |

---

### Académico
| Método | Endpoint                              | Descripción |
|--------|---------------------------------------|-------------|
| GET    | `/api/academico/cursos`               | Lista de cursos |
| GET    | `/api/academico/cursos/:id`           | Curso por ID |
| GET    | `/api/academico/estudiantes`          | Lista estudiantes |
| GET    | `/api/academico/estudiantes/:id`      | Estudiante por ID |
| GET    | `/api/academico/calificaciones`       | Calificaciones |
| GET    | `/api/academico/calificaciones?estudiante_id=1` | Por estudiante |
| GET    | `/api/academico/asistencia`           | Asistencia |

---

### Administración
| Método | Endpoint                    | Descripción |
|--------|-----------------------------|-------------|
| GET    | `/api/admin/empleados`      | Lista empleados |
| POST   | `/api/admin/empleados`      | Crear empleado |
| PUT    | `/api/admin/empleados/:id`  | Actualizar empleado |
| DELETE | `/api/admin/empleados/:id`  | Eliminar empleado |
| GET    | `/api/admin/escuelas`       | Lista escuelas |
| GET    | `/api/admin/clientes`       | Lista clientes |

---

### Finanzas
| Método | Endpoint                      | Descripción |
|--------|-------------------------------|-------------|
| GET    | `/api/finanzas/facturas`      | Lista facturas |
| GET    | `/api/finanzas/facturas?estado=Pendiente` | Filtrar por estado |
| GET    | `/api/finanzas/pagos`         | Lista pagos |
| GET    | `/api/finanzas/gastos`        | Lista gastos |

---

## Filtros, paginación y búsqueda (JSON Server nativo)

```
# Filtrar por campo
GET /api/empleados?departamento=Tecnología&estado=Activo

# Paginación
GET /api/estudiantes?_page=1&_limit=10

# Ordenar
GET /api/facturas?_sort=fecha&_order=desc

# Búsqueda full-text
GET /api/estudiantes?q=González

# Relaciones
GET /api/cursos?_expand=escuela
GET /api/calificaciones?estudiante_id=1&_expand=curso
```

## Restaurar datos originales

JSON Server modifica el `db.json` con cada POST/PUT/DELETE.
Para restaurar al estado inicial:
```bash
npm run api:reset
```

## Uso en Hr Library (config.js)

```js
api: {
  baseURL: "http://localhost:3001/api",
  timeout: 15000,
}
```
