// Independent of the 3D engine: usable while models load, without touching light presets.
(() => {
  const panel = document.querySelector('#toolbar');
  const content = document.querySelector('#toolbarContent');
  const button = document.querySelector('#toolbarToggle');
  const label = document.querySelector('#toolbarToggleLabel');
  if (!panel || !content || !button || !label) return;
  const storageKey = 'qinhuai:main-map:toolbar-collapsed:v1';
  let collapsed = false;
  let scrollTop = 0;
  try { collapsed = window.localStorage.getItem(storageKey) === '1'; } catch { /* Storage may be unavailable. */ }

  function render() {
    panel.classList.toggle('is-collapsed', collapsed);
    content.hidden = collapsed;
    button.setAttribute('aria-expanded', String(!collapsed));
    const action = collapsed ? '展开' : '收起';
    label.textContent = action;
    button.setAttribute('aria-label', action + '调节菜单');
    button.title = action + '调节菜单';
    if (!collapsed) content.scrollTop = scrollTop;
  }
  button.addEventListener('click', () => {
    if (!collapsed) scrollTop = content.scrollTop;
    collapsed = !collapsed;
    render();
    try { window.localStorage.setItem(storageKey, collapsed ? '1' : '0'); } catch { /* The toggle still works without storage. */ }
  });
  render();
})();
