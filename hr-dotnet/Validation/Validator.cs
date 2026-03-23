using System.Text.RegularExpressions;

namespace HRHelpers.Validation;

/// <summary>
/// Validaciones mirror de JS Validation.js.
/// Uso: HR.Validation.IsValidCedula("001-1234567-8")
/// </summary>
public static class Validator
{
    private static readonly Regex EmailRegex = new("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private static readonly Regex PhoneRegex = new("^(\\+?1[-. ]?)?\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$");

    /// <summary>Cédula dominicana válida</summary>
    public static bool IsValidCedula(string cedula)
    {
        if (string.IsNullOrWhiteSpace(cedula) || cedula.Length != 13) return false;
        cedula = cedula.Replace("-", "").Replace(" ", "");
        if (!Regex.IsMatch(cedula, "^[0-9]{3}-[0-9]{6}-[0-9]$")) return false;

        // Algoritmo verificador cédula RD
        int sum = 0;
        int[] digits = cedula.Where(char.IsDigit).Select(c => int.Parse(c.ToString())).ToArray();
        for (int i = 0; i < 11; i++)
        {
            int mul = i < 2 ? 1 : ((i == 2 || i == 5 || i == 8) ? 2 : 1);
            int temp = digits[i] * mul;
            sum += temp > 9 ? temp - 9 : temp;
        }
        return (11 - (sum % 11)) % 11 == digits[12];
    }

    /// <summary>RNC dominicano válido</summary>
    public static bool IsValidRnc(string rnc)
    {
        if (string.IsNullOrWhiteSpace(rnc) || rnc.Length != 11) return false;
        rnc = rnc.Replace("-", "").Replace(" ", "");
        // Similar a cedula pero prefijo 1xx-...
        return rnc.StartsWith("1") && IsValidCedula(rnc.Insert(3, "-").Insert(11, "-"));
    }

    /// <summary>Email válido</summary>
    public static bool IsValidEmail(string email) => !string.IsNullOrEmpty(email) && EmailRegex.IsMatch(email);

    /// <summary>Teléfono válido (RD/US)</summary>
    public static bool IsValidPhone(string phone) => !string.IsNullOrEmpty(phone) && PhoneRegex.IsMatch(phone);

    // Más: IsValidPlaca, IsNumber, IsInRange, etc.
    public static bool IsNumber(string value) => double.TryParse(value, out _);
}

