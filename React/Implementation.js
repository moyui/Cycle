function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    return new CompositeCompoent(element);
  }
}