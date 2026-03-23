using System.Globalization;

namespace HRHelpers.Formats;

public static class NumberHelper
{
    /// <summary>Formato moneda (RD$ / US$)</summary>
    public static string Currency(decimal value, string symbol = "RD$")
    {
        return string.Format(CultureInfo.GetCultureInfo("es-DO"),
            "{0} {1:N2}", symbol, value);
    }

    /// <summary>Formato número con decimales</summary>
    public static string FormatNumber(decimal value, int decimals = 2)
    {
        return value.ToString($"N{decimals}", CultureInfo.GetCultureInfo("es-DO"));
    }

    /// <summary>Parse seguro número</summary>
    public static decimal? ToNumber(string input)
    {
        return decimal.TryParse(input, NumberStyles.Any, CultureInfo.GetCultureInfo("es-DO"), out var result)
            ? result : null;
    }
}

