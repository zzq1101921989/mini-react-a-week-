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
function createElementVdom(type, props, ...children) {
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

function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(vdom.type);
}

function updateProps(dom, props) {
	Object.keys(props).forEach((key) => {
		if (key !== "children") {
			dom[key] = props[key];
		}
	});
}

/**
 * 执行渲染任务
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
    
    // 没有 stateNode 的时候才去创建，比如处理root顶层元素的时候就不需要
    if (!fiber.stateNode) {
		// 1、创建 dom 元素
		const dom = createDom(fiber.type);
		// 插入到container容器中
		fiber.dom.append(dom);

		// 2、添加属性
		updateProps(dom, fiber.props);
	}

	// 3、转换链表，设置好指针
	const children = fiber.props.children;
	const prveChild = null;
	children.forEach((child, idx) => {
		// 创建新的子fiber
		const newFiber = {
			props: child.props,
			type: child.type,
			return: fiber,
			child: null,
			sibling: null,
		};

		// 由于fiber架构的设计，只有第一个子元素才会被绑定在父fiber中
		if (idx === 0) {
			fiber.child = newFiber;
		}
		// 然后子节点之间的 sibling 就一个接一个的链接下去
		else {
			prveChild.sibling = newFiber;
		}
		prveChild = newFiber;
	});

	// 4、构建完任务的时候返回下一个节点任务
	if (fiber.child) {
		return fiber.child;
	}
	if (fiber.sibling) {
		return fiber.sibling;
	}

	return fiber.return.sibling;
}

// 当前任务
let nextWorkTesk = null;
/**
 * 开启循环任务
 * @param {*} deadlineTime 空闲是的时间是多少
 */
function workLoop(deadlineTime) {
	let isStartTask = true;
	if (isStartTask && nextWorkTesk) {
		nextWorkTesk = performWorkOfUnit(nextWorkTesk);
		isStartTask = deadlineTime.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop);
}

/**
 * 准备开始渲染方
 * @param {} fible
 * @param {*} container
 */
function render(startFible, container) {
	// 主动添加第一个任务（最顶层的初始任务）
	nextWorkTesk = {
		stateNode: container,
		props: {
			children: [fible],
		},
	};

	// 空余时间开始执行了！
	requestIdleCallback(workLoop);
}

export default {
	render,
	createElementVdom,
};
