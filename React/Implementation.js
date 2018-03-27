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

  getHostNode() {
    return this.renderedComponent.getHostNode();
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

  unmount() {
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnMount) {
        publicInstance.componentWillUnMount();
      }
    }

    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedCompoennt = this.renderedComponent;
    var prevRenderedElement = prevRenderedCompoennt.currentElement;

    this.createElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    var nextRenderedElement;
    if (isClass(type)) {
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }

      publicInstance.props = nextProps;
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      nextRenderedElement = type(nextProps);
    }
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedCompoennt.receive(nextRenderedElement);
      return;
    } else {
      var prevNode = prevRenderedCompoennt.getHostNode();
      prevRenderedCompoennt.unmount();
      var nextRenderedComponent = instantiateComponent(nextRenderedElement);
      var nextNode = nextRenderedComponent.mount();
      this.renderedComponent = nextRenderedComponent;

      prevNode.parentNode.replaceChild(nextNode, prevNode);
    }
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

  getHostNode() {
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

  unmount() {
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }

  
}

function mountTree(element, containerNode) {
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }
  
  var rootComponent = instantiateComponent(element);
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  node._internalInstance = rootComponent;
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

function unmountTree(containerNode) {
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  rootComponent.unmount();
  containerNode.innerHTML= '';
}