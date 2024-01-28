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
export function updateDomElementProps(el, newProps, oldProps) {
	// 1.如果旧Props上面没有数据，那么就要清空掉
	Object.keys(oldProps).forEach((props) => {
		if (props !== "children") {
			if (!newProps[props] && el.nodeName !== "#text") {
				el.removeAttribute(props);
			}
		}
	});

	Object.keys(newProps).forEach((p) => {
		if (p !== "children") {
			// 绑定事件
			if (p.slice(0, 2) === "on") {
				const eventType = p.slice(2).toLocaleLowerCase();

				if (oldProps) el.removeEventListener(eventType, oldProps[p]);

				el.addEventListener(eventType, newProps[p]);
			}
			// 绑定类型样式
			else if (p === "style") {
				handlerElementStyle(el, newProps[p]);
			}
			// 绑定基本属性
			else {
				el[p] = newProps[p];
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
