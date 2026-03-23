export function formatRequestQuery(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(value as Record<string, unknown>)) {
        result[`${key}[${subKey}]`] = subValue
      }
    } else {
      result[key] = value
    }
  }

  return result
}
