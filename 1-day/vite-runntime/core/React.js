import { HOST_ROOT, getTag, toArray, createStateNode } from "../util";

// 当前任务
let subTask = null;

// 准备好的fiber，将要转换成真实的dom对象
let paddingCommit = null;

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

/**
 * 更新元素的props属性
 * @param {*} dom
 * @param {*} props
 */
function updateProps(dom, props) {
	Object.keys(props).forEach((key) => {
		if (key !== "children") {
			dom[key] = props[key];
		}
	});
}

/**
 * 构建父与子fiber的关系
 */
function reconciler(parentFiber, childFiber) {
	// 统一转换为数组，方便进行处理
	const childFiberList = toArray(childFiber);

	/* 记得上一个生成的fiber节点，方便构建兄弟关系 */
	let preChildFiber = null;

	childFiberList.forEach((childFiber, index) => {
		const newFiber = {
			props: childFiber.props,
			type: childFiber.type,
			tag: getTag(childFiber),
			return: parentFiber,
			child: null,
			sibling: null,
		};
		newFiber.stateNode = createStateNode(newFiber);

		if (index === 0 && !parentFiber.child) {
			parentFiber.child = newFiber;
		}

		// 上一个兄弟节点的 sibling 记录下一个兄弟节点
		if (preChildFiber) {
			preChildFiber.sibling = newFiber;
		}
		preChildFiber = newFiber;
	});
}

/**
 * 执行单个任务（构建父fiber与子fiber，并且关联起来）
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
	if (fiber.props.children) {
		reconciler(fiber, fiber.props.children);
	}
	/* 如果有子fiber节点，那就继续向下构建咯（深度优先遍历 --- 递归） */
	if (fiber.child) {
		return fiber.child;
	}

	/* 定义变量接收一下当前正在处理的fiber对象 */
	let currentHanlderFiber = fiber;

	// 如果有父级节点，证明就还没有完全构建完成
	while (currentHanlderFiber.return) {
		if (currentHanlderFiber.sibling) {
			return currentHanlderFiber.sibling;
		}
		currentHanlderFiber = currentHanlderFiber.return;
	}

	// 到了这一步，那就证明fiber全部构建完毕
	paddingCommit = currentHanlderFiber;
	console.log(paddingCommit, "paddingCommit");

	return null;

}

/**
 * 开启循环任务
 * @param {*} deadlineTime 空闲是的时间是多少
 */
function workLoop(deadlineTime) {
	// 浏览器有空闲时间的时候才去执行
	if (deadlineTime.timeRemaining() > 1) {
		while (subTask) {
			subTask = performWorkOfUnit(subTask);
		}

		// 准备开始构建真实dom节点了哦
		if (paddingCommit) {

		}
	}
}

/**
 * 准备开始渲染方
 * @param {} fible
 * @param {*} container
 */
function render(startFible, container) {
	// 1、创建第一个task任务，默认一开始都是最顶层的root元素开始
	subTask = {
		props: { children: startFible },
		stateNode: container,
		tag: HOST_ROOT,
		child: null,
	};

	// 空余时间开始执行了！
	requestIdleCallback(workLoop);
}

export default {
	render,
	createElement,
};
