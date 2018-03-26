function isClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    return new DOMComponent(element);
  }
}

class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      publicInstance = new type(props);
      publicInstance.props = props;
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      publicInstance = null;
      renderedElement = type(props);
    }

    this.publicInstance = publicInstance;
    
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    return renderedComponent.mount();
  }
}

class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var props = element.props;
    var type = element.type;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    var node = document.createElement(type);
    this.node = node;

    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    return node;
  }
}