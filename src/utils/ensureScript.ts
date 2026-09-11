export const ensureScript = (doc: Document, id: string, src: string): HTMLScriptElement => {
  const existing = doc.getElementById(id);
  if (existing instanceof HTMLScriptElement) {
    return existing;
  }
  const script = doc.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  doc.head.appendChild(script);
  return script;
};
