# Prompt para Capotiao OpenCode

## Contexto

Capotiao es un SaaS multi-tenancy (Laravel) para gestión escolar. Se integró la librería HR-Library que provee helpers JS (`App.tblCol`, `App.tblBadge`, `App.tblBoolean`, `App.tblMoney`, `App.tblActionsCol`, `App.onTableAction`, `App.crudSave`, `App.crudDelete`, `App.openCrudModal`, `App.handleApiResponse`) y espera respuestas del backend con el formato `AppResponse`.

### Formato AppResponse (JS espera esto)

```json
{
    "isError": false,
    "type": "S" | "W" | "D" | "I",
    "Message": "Operación exitosa",
    "data": { ... } | null
}
```

- `type`: `S` (success/green), `W` (warning/yellow), `D` (danger/red), `I` (info/blue)
- `isError`: `true` si es error (type D), `false` en cualquier otro caso
- `Message`: texto legible para mostrar en notificación SweetAlert2
- `data`: objeto con el registro creado/actualizado, o `null`

---

## Tarea 1: Crear AppResponse helper

Crear `app/Http/Responses/AppResponse.php`:

```php
<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class AppResponse
{
    public static function success(string $message = 'Operación exitosa', mixed $data = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'isError' => false,
            'type' => 'S',
            'Message' => $message,
            'data' => $data,
        ], $code);
    }

    public static function error(string $message = 'Error', mixed $data = null, int $code = 400): JsonResponse
    {
        return response()->json([
            'isError' => true,
            'type' => 'D',
            'Message' => $message,
            'data' => $data,
        ], $code);
    }

    public static function warning(string $message, mixed $data = null): JsonResponse
    {
        return response()->json([
            'isError' => false,
            'type' => 'W',
            'Message' => $message,
            'data' => $data,
        ]);
    }

    public static function info(string $message, mixed $data = null): JsonResponse
    {
        return response()->json([
            'isError' => false,
            'type' => 'I',
            'Message' => $message,
            'data' => $data,
        ]);
    }
}
```

---

## Tarea 2: Crear BaseController

Crear `app/Http/Controllers/BaseController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Responses\AppResponse;
use Illuminate\Http\JsonResponse;

abstract class BaseController extends Controller
{
    protected function success(string $message = 'Operación exitosa', mixed $data = null): JsonResponse
    {
        return AppResponse::success($message, $data);
    }

    protected function error(string $message = 'Error', mixed $data = null, int $code = 400): JsonResponse
    {
        return AppResponse::error($message, $data, $code);
    }

    protected function warning(string $message, mixed $data = null): JsonResponse
    {
        return AppResponse::warning($message, $data);
    }

    protected function info(string $message, mixed $data = null): JsonResponse
    {
        return AppResponse::info($message, $data);
    }

    protected function notFound(string $message = 'Registro no encontrado'): JsonResponse
    {
        return AppResponse::error($message, null, 404);
    }
}
```

---

## Tarea 3: Refactorizar TODOS los controladores CRUD

Cada controlador CRUD debe extender `BaseController` y usar `$this->success()`, `$this->error()`, `$this->notFound()` en lugar de `response()->json(...)`.

### Patrón estándar

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Xxx;

class XxxController extends BaseController
{
    public function index(): JsonResponse
    {
        $items = Xxx::all();
        return $this->success('Listado obtenido', $items);
    }

    public function show(int $id): JsonResponse
    {
        $item = Xxx::find($id);
        if (!$item) return $this->notFound();
        return $this->success('Registro obtenido', $item);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // reglas de validación
        ]);
        $item = Xxx::create($validated);
        return $this->success('Creado correctamente', $item);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Xxx::find($id);
        if (!$item) return $this->notFound();
        $validated = $request->validate([
            // reglas de validación
        ]);
        $item->update($validated);
        return $this->success('Actualizado correctamente', $item);
    }

    public function destroy(int $id): JsonResponse
    {
        $item = Xxx::find($id);
        if (!$item) return $this->notFound();
        $item->delete();
        return $this->success('Eliminado correctamente', ['id' => $id]);
    }
}
```

### Controladores a refactorizar (lista referencial)

- TenantsController
- PlansController
- SubscriptionsController
- InvoicesController
- PaymentMethodsController
- CouponsController
- AcademicYearsController
- AcademicGradesController
- AcademicSubjectsController
- Cualquier otro controlador CRUD existente

### Requerimientos

- NO usar `response()->json()` directamente en ningún controlador CRUD
- Siempre retornar `$this->success()`, `$this->error()`, etc.
- Validar existencia con `$this->notFound()` antes de operar
- En `store`/`update`, devolver el registro creado/modificado en `data`
- En `destroy`, devolver `data` = `['id' => $id]`
- El field `isError` debe escribirse exactamente así (con la letra 'r'), no `isEror`
- `type` debe ser exactamente `"S"`, `"W"`, `"D"` o `"I"` — mayúscula y string
