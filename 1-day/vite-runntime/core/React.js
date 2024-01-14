/**
 * 创建文本虚拟dom对象
 * @param { string } nodeValue
 */
function createTextNodeVdom(nodeValue) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue,
			children: [],
		},
	};
}

/**
 * 创建元素的虚拟dom对象
 * @param { string } type 元素的类型
 * @param { string } props 元素的属性
 * @param { string } children 元素的子元素
 */
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) =>
				typeof child === "string" ? createTextNodeVdom(child) : child
			),
		},
	};
}

function render(vdom, container) {
	// 创建元素
	const dom =
		vdom.type === "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(vdom.type);

	// 添加属性
	Object.keys(vdom.props).forEach((key) => {
		if (key !== "children") {
			dom[key] = vdom.props[key];
		}
	});

	// 创建子元素
	vdom.props.children.forEach((item) => {
		render(item, dom);
	});

	// 插入到container容器中
	container.append(dom);
}

export default {
	render,
    createElement
};
