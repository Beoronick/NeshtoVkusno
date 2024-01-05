window.addEventListener('load', main, { once: true });

const actionMap = {
  collapse: (target) => {
    const el = document.getElementById(target.dataset.target);

    if (el.classList.contains('collapsed')) {
      el.classList.remove('collapsed');
    } else {
      el.classList.add('collapsed');
    }
  },
};

function main() {
  window.addEventListener('click', ({ target }) => {
    const toggle = target.dataset.toggle;

    if (typeof actionMap[toggle] === 'function') {
      actionMap[toggle].call(target, target);
    }
  });
}
