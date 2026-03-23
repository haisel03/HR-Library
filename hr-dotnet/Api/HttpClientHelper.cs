using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Specialized;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using HRHelpers;

namespace HRHelpers.Api;

/// <summary>
/// HttpClient wrapper mirror de JS Api.js (Bearer auth, timeouts, JSON).
/// Uso: await HR.Api.GetAsync<T>("/usuarios");
/// </summary>
public class ApiHelper
{
    private readonly HttpClient _http;
    private readonly ILogger<ApiHelper>? _logger;
    private string? _token;
    private readonly bool _autoAlerts;
    private readonly string _baseUrl;
    private readonly int _timeoutSeconds;

    public ApiHelper(IOptions<HRHelpersOptions>? options = null)
    {
        var opts = options?.Value ?? new HRHelpersOptions();
        _baseUrl = opts.BaseUrl ?? string.Empty;
        _timeoutSeconds = opts.TimeoutSeconds;
        _autoAlerts = opts.AutoAlerts;
        _token = opts.Token;

        _http = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(_timeoutSeconds),
            BaseAddress = new Uri(_baseUrl.EndsWith('/') ? _baseUrl : _baseUrl + "/")
        };
        _http.DefaultRequestHeaders.Add("Accept", "application/json");
        _http.DefaultRequestHeaders.Add("X-Requested-With", "XMLHttpRequest");

        _logger = null; // Inyectar via DI
    }

    /// <summary>Establece token Bearer</summary>
    public void SetToken(string token) => _token = token;

    /// <summary>Obtiene token actual</summary>
    public string? GetToken() => _token;

    /// <summary>GET typed</summary>
    public async Task<T?> GetAsync<T>(string url, Dictionary<string, object>? query = null)
    {
        var fullUrl = BuildUrl(url, query);
        _http.DefaultRequestHeaders.Authorization = _token != null ?
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _token) : null;

        try
        {
            var response = await _http.GetAsync(fullUrl);
            return await HandleResponse<T>(response);
        }
        catch (Exception ex)
        {
            LogError("GET {Url}: {Error}", fullUrl, ex.Message);
            if (_autoAlerts) Console.WriteLine("Error API: " + ex.Message); // Reemplazar por ILogger/Serilog
            throw;
        }
    }

    // POST, PUT, PATCH, DELETE similares...

    /// <summary>Construye URL con query params</summary>
    private string BuildUrl(string path, Dictionary<string, object>? query)
    {
        if (query == null || query.Count == 0) return path.StartsWith("/") ? path : $"/{path}";

        var uriBuilder = new UriBuilder(path);
        var queryParams = new List<string>();
        foreach (var kvp in query)
            queryParams.Add($"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value?.ToString() ?? "")}");

        uriBuilder.Query = string.Join("&amp;", queryParams);
        return uriBuilder.ToString();
    }

    /// <summary>Maneja response, retorna data o lanza error</summary>
    private async Task<T?> HandleResponse<T>(HttpResponseMessage response)
    {
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    private void LogError(string message, params object[] args)
    {
        _logger?.LogError(message, args);
        // Fallback: Console.Error.WriteLine(message);
    }
}

