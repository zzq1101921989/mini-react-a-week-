import {
	HOST_ROOT,
	HOST_COMPONENT,
	getTag,
	toArray,
	createDomElement,
	isFunctionComponent,
	updateDomElementProps,
	FUNCTION_COMPONENT,
	findParentContainer,
} from "../util";

// 当前任务
let subTask = null;

// 已经构建好的fiber树，并且已经挂载到视图上了
let currentRoot = null;

// 将要进行删除的fiber数组
let deleteFiberList = [];

// 当前构建的fiber
let wipFiber = null;

// 当前正在进行构建的fiber
let wipRoot = null;

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
				typeof child === "string" || typeof child === "number"
					? createTextNodeVdom(child)
					: child
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
function reconcileChildren(fiber, children) {
	let oldFiber = fiber.alternate?.child;

	let prevChild = null;

	const childList = toArray(children);

	childList.filter(Boolean).forEach((child, index) => {

		let newFiber;

		const isSameType = oldFiber && oldFiber.type === child.type;

		if (isSameType) {
			newFiber = {
				type: child.type,
				props: child.props,
				dom: oldFiber.dom,
				child: null,
				parent: fiber,
				sibling: null,
				effectTag: "update",
				alternate: oldFiber,
			};
		} else {
			newFiber = {
				type: child.type,
				props: child.props,
				dom: null,
				child: null,
				parent: fiber,
				sibling: null,
				effectTag: "placement",
			};

			// 如果新旧对比不对，那就证明需要删除了
			if (oldFiber) {
				deleteFiberList.push(oldFiber);
			}
		}

		/**
		 * 重点计算fiber节点的下一个节点
		 */
		if (oldFiber) {
			oldFiber = oldFiber?.sibling;
		}

		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});

	while (oldFiber) {
		deleteFiberList.push(oldFiber);
		oldFiber = oldFiber.sibling;
	}
}

/**
 * 处理函数fiber父与子节点的关系
 * @param {} fiber
 */
function updateFunctionComponent(fiber) {
	wipFiber = fiber;
	reconcileChildren(fiber, fiber.type(fiber.props));
}

/**
 * 构建普通fiber节点
 * @param {*} fiber
 */
function updateHostComponent(fiber) {
	if (!fiber.dom) {
		fiber.dom = createDomElement(fiber);
	}
	reconcileChildren(fiber, fiber.props.children);
}

/**
 * 执行单个任务（构建父fiber与子fiber，并且关联起来）
 * @param {*} fiber
 */
function performWorkOfUnit(fiber) {
	if (isFunctionComponent(fiber.type)) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	// 如果有子fiber节点，那就继续向下构建咯（深度优先遍历 --- 递归）
	if (fiber.child) {
		return fiber.child;
	}

	// 定义变量接收一下当前正在处理的fiber对象
	let currentHanlderFiber = fiber;

	while (currentHanlderFiber.parent) {
		if (currentHanlderFiber.sibling) {
			return currentHanlderFiber.sibling;
		}
		currentHanlderFiber = currentHanlderFiber.parent;
	}

	return null;
}

/**
 * 从记录将要进行删除fiber的数组中，移除掉不需要的fiber
 * @param {*} fiber
 */
function commitDeleteFiber(fiber) {
	let parentFiber = findParentContainer(fiber);

	let removerFiber = fiber;

	while (isFunctionComponent(removerFiber.type)) {
		removerFiber = removerFiber.child;
	}

    if (removerFiber.dom) {
        parentFiber.dom.removeChild(removerFiber.dom);
    }

}

/**
 * 根据 fiber 节点，生成真正dom节点
 */
function commitWork(fiber) {
	// 下一级，或者兄弟级有可能是没有的
	if (!fiber) return;

	// 找寻父级挂载点
	const fiberParentContainer = findParentContainer(fiber);

	if (fiber.effectTag === "placement") {
		if (fiber.dom) {
			fiberParentContainer.dom.append(fiber.dom);
		}
	} else if (fiber.effectTag === "update") {
		updateDomElementProps(fiber.dom, fiber.props, fiber.alternate?.props);
	}

	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

/**
 * 根据fiber树进行构建整颗dom节点
 * @param {*} fiber
 */
function commitRoot(fiber) {
	console.log(fiber, "fiber");
	deleteFiberList.forEach(commitDeleteFiber);
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
	deleteFiberList = [];
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
			if (wipRoot?.sibling?.type === subTask?.type) {
				subTask = null;
			}
		}

		// 准备开始构建真实dom节点了哦
		if (!subTask && !!wipRoot) {
			commitRoot(wipRoot);
		}
	}
	// 递归的去执行构建任务 workLoop
	if (subTask) requestIdleCallback(workLoop);
}

/**
 * 准备开始渲染
 * @param {} fible
 * @param {*} container
 */
function render(startFible, container) {
	// 1、创建第一个task任务，默认一开始都是最顶层的root元素开始
	wipRoot = {
		props: { children: startFible },
		dom: container,
		tag: HOST_ROOT,
		child: null,
	};

	subTask = wipRoot;

	// 空余时间开始执行了！
	requestIdleCallback(workLoop);
}

/**
 * 更新逻辑
 */
function update() {
	let currentFiber = wipFiber;

	return () => {
		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
			child: null,
		};

		subTask = wipRoot;

		// 空余时间开始执行了！
		requestIdleCallback(workLoop);
	};
}

export default {
	render,
	update,
	createElement,
};
