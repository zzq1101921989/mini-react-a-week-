import {
	HOST_ROOT,
    HOST_COMPONENT,
	getTag,
	toArray,
	createStateNode,
	isFunctionComponent,
} from "../util";

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
			effects: [],
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
		if (isFunctionComponent(fiber.type)) {
			reconciler(fiber, fiber.stateNode());
		} else {
			reconciler(fiber, fiber.props.children);
		}
	}

	/* 如果有子fiber节点，那就继续向下构建咯（深度优先遍历 --- 递归） */
	if (fiber.child) {
		return fiber.child;
	}

	/* 定义变量接收一下当前正在处理的fiber对象 */
	let currentHanlderFiber = fiber;

	// 如果有父级节点，证明就还没有完全构建完成
	while (currentHanlderFiber.return) {
		currentHanlderFiber.return.effects =
			currentHanlderFiber.return.effects.concat(
				currentHanlderFiber.effects.concat(currentHanlderFiber)
			);

		if (currentHanlderFiber.sibling) {
			return currentHanlderFiber.sibling;
		}
		currentHanlderFiber = currentHanlderFiber.return;
	}

	// 到了这一步，那就证明fiber全部构建完毕
	paddingCommit = currentHanlderFiber;

	return null;
}

function commitRoot(fiber) {

	fiber.effects.forEach((child) => {
        
		// 父级fiber
		let parentFiber = child.return;

		// 函数组件和类组件其实也会生成一个fiber对象，只不过是用来链接组件内部的子fiber用的
		while (isFunctionComponent(parentFiber.type)) {
            parentFiber = parentFiber.return
		}

        if (child.tag === HOST_COMPONENT) {
            parentFiber.stateNode.append(child.stateNode);
        }

	});
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
			commitRoot(paddingCommit);
		}
	}
	// 递归的去执行构建任务 workLoop
	if (subTask) requestIdleCallback(workLoop);
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
		// 保存所有子孙的fiber对象
		effects: [],
		child: null,
	};

	// 空余时间开始执行了！
	requestIdleCallback(workLoop);
}

export default {
	render,
	createElement,
};
