using System.Text.RegularExpressions;
using System.Globalization;
using System.Text;

namespace HRHelpers.Formats;

public static class StringHelper
{
    /// <summary>Genera slug SEO-friendly</summary>
    public static string Slug(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var normalized = input.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (char c in normalized)
        {
            UnicodeCategory cat = CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        string result = Regex.Replace(sb.ToString().ToLowerInvariant(), @"[^a-z0-9\s-]", "", RegexOptions.Compiled);
        result = Regex.Replace(result, @"\s+", " ", RegexOptions.Compiled).Trim();
        result = Regex.Replace(result, @"\s+[-]+", "-", RegexOptions.Compiled).Trim('-');
        return result;
    }

    /// <summary>Trunca string con ellipsis</summary>
    public static string Truncate(string input, int length, string suffix = "...")
    {
        if (string.IsNullOrEmpty(input) || input.Length <= length) return input;
        return input[..Math.Min(length, input.Length - suffix.Length)] + suffix;
    }

    /// <summary>Title case</summary>
    public static string TitleCase(string input) => CultureInfo.CurrentCulture.TextInfo.ToTitleCase(input.ToLower());
}

