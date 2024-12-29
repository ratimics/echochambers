function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function generateId(input?: string): string {
  const timestamp = Date.now().toString(36);
  const hash = input ? 
    hashString(input) : 
    hashString(timestamp + Math.random().toString());
  return `${timestamp}-${hash}`;
}