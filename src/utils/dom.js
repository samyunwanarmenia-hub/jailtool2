export const injectScriptOnce = ({ id, src, parent = document.body, async = true, attrs = {} }) => {
  if (!parent || !src) return null;
  const existing = id ? document.getElementById(id) : null;
  if (existing) return existing;
  const script = document.createElement('script');
  if (id) script.id = id;
  script.src = src;
  script.async = async;
  Object.entries(attrs).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  parent.appendChild(script);
  return script;
};
