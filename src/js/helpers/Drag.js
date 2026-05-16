import Sortable from "sortablejs";

const _instances = new Map();

const Drag = {
  create(key, containers = [], options = {}) {
    if (_instances.has(key)) return _instances.get(key);
    const group = key;
    const instances = containers.map((el) =>
      Sortable.create(el, { group, ...options })
    );
    _instances.set(key, instances);
    return instances;
  },

  get: (key) => _instances.get(key) ?? null,

  destroy(key) {
    const instances = _instances.get(key);
    if (instances) {
      instances.forEach((s) => s.destroy());
      _instances.delete(key);
    }
  },

  addContainer(key, container) {
    const instances = _instances.get(key);
    if (!instances || !(container instanceof HTMLElement)) return;
    if (_instances.has(key) && instances.length > 0) {
      const group = instances[0].options.group;
      const s = Sortable.create(container, { group, ...instances[0].options });
      instances.push(s);
    }
  },

  _each(key, event, callback) {
    const instances = _instances.get(key);
    if (!instances) return;
    instances.forEach((s) => {
      s.option("onEnd", null);
      s.option("onStart", null);
      s.option("onCancel", null);
    });
    const map = { drop: "onEnd", drag: "onStart", cancel: "onCancel" };
    const mapped = map[event];
    if (!mapped) return;
    instances.forEach((s) => {
      s.option(mapped, (evt) => {
        const el = evt.item;
        const target = evt.to;
        const source = evt.from;
        const sibling = evt.next || null;
        callback(el, target, source, sibling);
      });
    });
  },

  onDrop(key, callback) {
    Drag._each(key, "drop", callback);
  },
  onDrag(key, callback) {
    Drag._each(key, "drag", callback);
  },
  onCancel(key, callback) {
    Drag._each(key, "cancel", callback);
  },
  onSpill(_key, _callback) {
    /* SortableJS no tiene evento "spill" nativo; se ignora */
  },

  /** Invocado por init.js */
  init() {},
};

export default Object.freeze(Drag);
