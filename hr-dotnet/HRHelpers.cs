using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HRHelpers;

/// <summary>
/// Fachada principal de HRHelpers (.NET port de HR-Library JS).
/// Uso: HR.Api.Get<T>("https://api/endpoint") o new ApiHelper(options);
/// </summary>
public static class HR
{
    /// <summary>API HTTP helper (mirror de JS Api.js)</summary>
    public static ApiHelper Api { get; } = new();

    /// <summary>Validaciones dominicanas/estándar (cedula/RNC/email)</summary>
    public static Validator Validation { get; } = new();

    /// <summary>Formato strings (slug/truncate)</summary>
    public static StringHelper Strings { get; } = new();

    /// <summary>Formato números/moneda</summary>
    public static NumberHelper Numbers { get; } = new();
}

/// <summary>
/// Configuración global (appsettings.json: "HRHelpers": {...})
/// </summary>
public class HRHelpersOptions
{
    public string? BaseUrl { get; set; }
    public int TimeoutSeconds { get; set; } = 30;
    public bool AutoAlerts { get; set; } = false;
    public string? Token { get; set; }
}

public static class HRHelpersExtensions
{
    /// <summary>
    /// Registra HRHelpers en DI (services.AddHRHelpers(...))
    /// </summary>
    public static IServiceCollection AddHRHelpers(this IServiceCollection services,
        Action<HRHelpersOptions>? configure = null)
    {
        services.Configure(configure ?? (_ => { }));
        services.AddSingleton<ApiHelper>();
        services.AddHttpClient<ApiHelper>();
        return services;
    }
}

