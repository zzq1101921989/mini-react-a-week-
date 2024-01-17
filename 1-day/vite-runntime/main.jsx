// v1 通过最简单的命令式去创建app元素

// 1、创建app组件
// const app = document.createElement('div');
// app.id = 'app'
// document.getElementById('root').appendChild(app);

// 2、创建app文字节点
// const textEl = document.createTextNode('')
// textEl.nodeValue = 'app'
// app.append(textEl);

// --------------------------------------------------------------------------------------------------------------------------------------

// v2 react 通过vdom的形式去描述对象（js object）

// 这个对象可能需要什么值呢？
// 1. type类型，用于区分是元素节点，还是文本节点
// 2. 如果是元素节点，那么这个元素节点上肯定需要一些属性props
// const appVdom = {
// 	type: "div",
// 	props: {
// 		id: "app",
// 	},
// };

// const textElVdom = {
// 	type: "TEXT_ELEMENT",
// 	props: {
// 		nodeValue: "app",
// 	},
// };

// 3.如果有多个vdom对象，那我是不是要写多个一样结构的对象呢？那肯定是不行的，所以我决定抽离出一个专门创建元素和文本的函数

// const appVdom = createElement("div", { id: "app" });
// const textElVdom = createTextNode('app')

// const app = document.createElement(appVdom.type);
// app.id = appVdom.props.id;
// document.getElementById("root").appendChild(app);

// const textEl = document.createTextNode("");
// textEl.nodeValue = textElVdom.props.nodeValue;
// app.append(textEl);

// 4. 这个时候我又发现了一个问题，创建app元素和创建文本元素之间存在高度相似的步骤，比如（创建，append）也就是类型不一样的区别而已，那么我
// 可以直接定义一个函数统计去处理这个问题就好了吧？
// 5. 然后我们稍微修改一下vdom结构，让里面的子元素放在父元素的vdom里面

// function createTextNodeVdom(nodeValue) {
// 	return {
// 		type: "TEXT_ELEMENT",
// 		props: {
// 			nodeValue,
// 			children: [],
// 		},
// 	};
// }

// function createElementVdom(type, props, ...children) {
// 	return {
// 		type,
// 		props: {
// 			...props,
// 			children: children.map((child) =>
// 				typeof child === "string" ? createTextNodeVdom(child) : child
// 			),
// 		},
// 	};
// }

// function render(vdom, container) {
// 	// 创建元素
// 	const dom =
// 		vdom.type === "TEXT_ELEMENT"
// 			? document.createTextNode("")
// 			: document.createElement(vdom.type);

// 	// 添加属性
// 	Object.keys(vdom.props).forEach((key) => {
// 		if (key !== "children") {
// 			dom[key] = vdom.props[key];
// 		}
// 	});

// 	// 创建子元素
// 	vdom.props.children.forEach((item) => {
// 		render(item, dom);
// 	});

// 	// 插入到container容器中
// 	container.append(dom);
// }

import React from "./core/React.js";
import App from "./App.jsx";
import ReactDom from "./core/ReactDom.js";

ReactDom.createRoot(document.getElementById("root")).render(<App />);
