export const HOST_ROOT = "hoot_root";
export const HOST_COMPONENT = "hoot_component";
export const FUNCTION_COMPONENT = "function_component";
export const CLASS_COMPONENT = "class_component";



/**
 * 渲染style props
 * @param {*} el 
 * @param {*} styleMap 
 */
function handlerElementStyle(el, styleMap) {
    Object.keys(styleMap).forEach(sty => {
        el.style[sty] = styleMap[sty]
    })
}

/**
 *
 * @param {*} el
 * @param {*} newProps
 */
function updateDomElementProps(el, newProps) {
	Object.keys(newProps).forEach((p) => {
		if (p !== "children") {
            if (p === 'style') {
                handlerElementStyle(el, newProps[p])
            } else {
                el.setAttribute(p, newProps[p]);
            }
		}
	});
}

export function isFunctionComponent(type) {
    return typeof type === 'function'
}

export const createDomElement = (fiber) => {
	if (fiber.type === "TEXT_ELEMENT") {
		return document.createTextNode(fiber.props.nodeValue);
	} else {
		const dom = document.createElement(fiber.type);
		updateDomElementProps(dom, fiber.props);
		return dom;
	}
};

export const getTag = (vDom) => {
	switch (true) {
		case typeof vDom.type == "string":
			return HOST_COMPONENT;
		case typeof vDom.type === "function":
			return FUNCTION_COMPONENT;
	}
};

export const toArray = (arg) => {
	return Array.isArray(arg) ? arg : [arg];
};

export const createStateNode = (fiber) => {
	switch (fiber.tag) {
		/* 处理普通元素情况 */
		case HOST_COMPONENT:
			return createDomElement(fiber);

		/* 处理类组件的情况 */
		case CLASS_COMPONENT:

		/* 处理函数组件的情况 */
		case FUNCTION_COMPONENT:
            return fiber.type
	}
};
