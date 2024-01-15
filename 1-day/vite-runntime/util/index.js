export const HOST_ROOT = "hoot_root";
export const HOST_COMPONENT = "hoot_component";
export const FUNCTION_COMPONENT = "function_component";
export const CLASS_COMPONENT = "class_component";

export const createDomElement = (type) => {
    return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

export const getTag = (vDom) => {
    switch (true) {
      case typeof vDom.type == "string":
        return HOST_COMPONENT;
      case typeof vDom.type === 'function':
        return FUNCTION_COMPONENT;
    }
}

export const toArray = (arg) => {
    return Array.isArray(arg) ? arg : [arg];
}

export const createStateNode = (fiber) => {
    switch (fiber.tag) {
        /* 处理普通元素情况 */
        case HOST_COMPONENT:
          return createDomElement(fiber.type);
    
        /* 处理类组件的情况 */
        case CLASS_COMPONENT:
          
        /* 处理函数组件的情况 */
        case FUNCTION_COMPONENT:
      }
}

