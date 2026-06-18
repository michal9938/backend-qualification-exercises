export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

//shape used for non json tyeps
type TaggedValue = {
  __t : string;
  __v : unknown;
}

function isTagged(value: unknown): value is TaggedValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__t' in value &&
    '__v' in value
  );
}

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  /**
   * insert your code here
   */
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  
  if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  }
  
  if (Buffer.isBuffer(value)) {
    return { __t: 'Buffer', __v: Array.from(value) };
  }
  
  if (value instanceof Map) {
    const entries = Array.from(value.entries()).map(
      ([key, val]) => [serialize(key as Value), serialize(val as Value)]
    );
    return { __t: 'Map', __v: entries };
  }
  
  if (value instanceof Set) {
    const items = Array.from(value).map((item) => serialize(item as Value));
    return { __t: 'Set', __v: items };
  }
  
  if (Array.isArray(value)) {
    return value.map((item) => serialize(item));
  }

  // plain object — walk each key
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    result[key] = serialize(value[key]);
  }
  return result;
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  /**
   * insert your code here
   */
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deserialize(item)) as T;
  }

  if (typeof value === 'object' && isTagged(value)) {
    switch (value.__t) {
      case 'Date':
        return new Date(value.__v as number) as T;
      case 'Buffer':
        return Buffer.from(value.__v as number[]) as T;
      case 'Map': {
        const entries = (value.__v as unknown[]).map(
          ([key, val]) => [deserialize(key), deserialize(val)] as [unknown, unknown]
        );
        return new Map(entries) as T;
      }
      case 'Set': {
        const items = (value.__v as unknown[]).map((item) => deserialize(item));
        return new Set(items) as T;
      }
    }
  }
  
  // plain object
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value as object)) {
    result[key] = deserialize((value as Record<string, unknown>)[key]);
  }
  return result as T;
}
