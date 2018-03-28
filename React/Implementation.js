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
    if (isClass(type)) {//是自定义类的话调用声明周期并更新
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }

      publicInstance.props = nextProps;
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {//不是判断节点类型
      nextRenderedElement = type(nextProps);
    }
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedCompoennt.receive(nextRenderedElement);//修改属性值
      return;
    } else {//类型不相同只好全部卸载更新
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

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;

    var nextProps = nextElement.props;
    this.currentElement = nextElement;

    object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });

    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }

    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    var operationQueue = [];//干吗用啊?

    for (var i = 0; i < nextChildren.length; i++) {
      var prevChild = prevRenderedChildren[i];

      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;//如果替换前节点不存在则直接添加，存在只好一个一个判断计算
      }

      var canUpadte = prevChildren[i].type === nextChildren[i].type;

      if (!canUpdate) { //节点种类不相同只好替换
        var prevNode = prevChild.node;
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;//二选一
      }

      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    for (var j = nextChildren.length; j < prevChildren; j++) { //不存在的子节点直接卸载
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.node;
      prevChild.unmount();

      operationQueue.push({type: 'REMOVE', node});
    }
    
    this.renderedChildren = nextRenderedChildren;

    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
        case 'ADD':
          this.node.appendChild(operation.node);
          break;
        case 'REPLACE':
          this.node.replaceChild(operation.nextNode, operation.prevNode);
          break;
        case 'REMOVE': 
          this.node.removeChild(operation.node);
          break;
      }
    }
  }
}

function mountTree(element, containerNode) {
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

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