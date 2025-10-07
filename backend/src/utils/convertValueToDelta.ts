interface QuillDelta {
  ops: Array<{
    insert: string | object;
    attributes?: Record<string, unknown>;
  }>;
}

export function toDelta(data: unknown): QuillDelta {
  let parsed: unknown;

  if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data);
    } catch {
      throw new Error('Invalid Quill Delta format: not valid JSON');
    }
  } else {
    parsed = data;
  }

  if (
    parsed !== null &&
    typeof parsed === 'object' &&
    'ops' in parsed &&
    Array.isArray((parsed as { ops?: unknown }).ops)
  ) {
    return parsed as QuillDelta;
  }

  throw new Error('Invalid Quill Delta format');
}
