// Gamepad ve dokunma köprüleri gerçek klavye olayları üretir. Böylece
// useXmbInput ve panellerin kendi keydown dinleyicileri girdinin nereden
// geldiğini bilmek zorunda kalmaz.
export function emitKey(type, key) {
  window.dispatchEvent(
    new KeyboardEvent(type, { key, code: key, bubbles: true })
  );
}

// Tek atışlık basış: keydown + keyup peş peşe.
export function tapKey(key) {
  emitKey('keydown', key);
  emitKey('keyup', key);
}
