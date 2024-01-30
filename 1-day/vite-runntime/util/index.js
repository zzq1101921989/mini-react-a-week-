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
	Object.keys(styleMap).forEach((sty) => {
		el.style[sty] = styleMap[sty];
	});
}

/**
 * 绑定props属性
 * @param {HTMLElement} el
 * @param {*} newProps
 */
export function updateDomElementProps(dom, nextProps, prevProps) {

	// 1.如果旧Props上面没有数据，那么就要清空掉
	Object.keys(prevProps).forEach((key) => {
		if (key !== "children") {
			if (!(key in nextProps)) {
				dom.removeAttribute(key);
			}
		}
	});

	Object.keys(nextProps).forEach((key) => {
		if (key !== "children") {
			if (nextProps[key] !== prevProps[key]) {
				if (key.startsWith("on")) {
					const eventType = key.slice(2).toLowerCase();
					dom.removeEventListener(eventType, prevProps[key]);
					dom.addEventListener(eventType, nextProps[key]);
				}
                else if (key === 'style') { 
                    handlerElementStyle(dom, nextProps[key])
                } 
                else {
					dom[key] = nextProps[key];
				}
			}
		}
	});
}

export function isFunctionComponent(type) {
	return typeof type === "function";
}

export const createDomElement = (fiber) => {
	if (fiber.type === "TEXT_ELEMENT") {
		return document.createTextNode(fiber.props.nodeValue);
	} else {
		const dom = document.createElement(fiber.type);
		updateDomElementProps(dom, fiber.props, {});
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

/**
 * 找寻非函数组件、类组件的fiber（dom属性为空）
 * @param {*} fiber
 */
export const findParentContainer = (fiber) => {
	let fiberParent = fiber.parent;

	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent;
	}

	return fiberParent;
};
