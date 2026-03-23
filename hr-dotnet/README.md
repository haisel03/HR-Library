# HRHelpers - .NET Port de HR-Library JS

## 🚀 Uso Rápido

### Server-side (.NET MVC/API/Blazor)

```csharp
// NuGet: Install-Package HRHelpers (post dotnet pack)
using HRHelpers;

var isValid = HR.Validation.IsValidCedula("001-1234567-8");
var slug = HR.Strings.Slug("Gestión Académica");
var monto = HR.Numbers.Currency(1500.50m, "RD$");
var usuarios = await HR.Api.GetAsync<List<Usuario>>("/api/usuarios");
```

### Client-side (wwwroot)

```
1. npm run build:prod
2. Copiar public/dist/hr.min.js → wwwroot/lib/hr-helpers/
3. _Layout.cshtml: <script src="~/lib/hr-helpers/hr.min.js"></script>
4. $(() => $HR.init());
```

## 📦 Build NuGet

```bash
cd hr-dotnet
dotnet pack -c Release
```

## ✅ Funcionalidades Completadas

- ✅ Api/HttpClient (Bearer, typed GET)
- ✅ Validation (Cédula/RNC/Email/Phone)
- ✅ Strings (Slug/Truncate/TitleCase)
- ✅ Numbers (Currency/Format)
- ✅ Forms (Serialize model → FormData)

## 🔗 Integración .NET MVC Template

1. Copiar `bin/Release/net8.0/HRHelpers.1.0.0.nupkg` a proyecto .NET
2. `wwwroot/lib/hr-helpers/hr.min.js` del build JS
3. Controller: `HR.Validation.IsValidCedula(model.Cedula)`
4. View: `$HR.Api.getSelect(&#39;#selectPais&#39;, &#39;/api/paises&#39;)`

**Listo para usar en Crud_Upanel_template!**
