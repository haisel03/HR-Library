using System;
using System.Collections.Specialized;
using System.Reflection;
using System.ComponentModel;

namespace HRHelpers.Forms;

public static class FormSerializer
{
    /// <summary>
    /// Serializa objeto/model a FormUrlEncodedDictionary (mirror JS Forms.serialize)
    /// Ignora nulls, disabled, buttons
    /// </summary>
    public static NameValueCollection Serialize(object model)
    {
        var collection = new NameValueCollection();
        var properties = model.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);

        foreach (var prop in properties)
        {
            if (prop.Name == string.Empty || !prop.CanRead) continue;

            var value = prop.GetValue(model);
            if (value == null) continue;

            var attr = prop.GetCustomAttribute(typeof(BindNeverAttribute)) as BindNeverAttribute;
            if (attr != null) continue;

            collection.Add(prop.Name, value.ToString() ?? string.Empty);
        }

        return collection;
    }
}

