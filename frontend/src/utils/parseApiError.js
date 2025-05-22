/**
 * Parses API errors and returns field-specific messages for forms.
 * Handles MySQL duplicate entry errors with fields like 'name_UNIQUE'.
 */
export function parseApiError(err) {
  const msg = err?.response?.data?.message || err?.message;

  // Match MySQL duplicate key error message
  const match = msg?.match(/field '([\w_]+)' is already in use/i);

  if (match) {
    let rawField = match[1];
    let field = rawField.endsWith("_UNIQUE")
      ? rawField.replace("_UNIQUE", "")
      : rawField;

    const cleanMessage = `The value of field '${field}' is already in use.`;

    return { [field]: cleanMessage };
  }

  return { form: msg || "Unexpected error occurred." };
}
