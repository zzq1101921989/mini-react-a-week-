import React from "./core/React.js";

// vite遇到jsx的文件，其实在内部是会转换成下面这种形式的，而且刚好我们在上面也引入了React，所以就是用我们自己写的了
// export default React.createElementVdom("div", { id: "app" }, "hi ", 'mini-react');

let count = 10;
let count2 = 10;
let count3 = 10;
let props = { id: "button" };
let toggleFlag = true;

function NumberComponent() {
	console.log("NumberComponent 更新了");

	const update = React.update();

	return (
		<div id="numberContainer">
			conut: {count}
			<button
				onClick={() => {
					count++;
					update();
				}}
			>
				更新试试看
			</button>
		</div>
	);
}

function NumberComponent1() {
	console.log("NumberComponent 更新了22");

	const update = React.update();

	return (
		<div id="numberContainer">
			count2: {count2}
			<button
				onClick={() => {
					count2++;
					update();
				}}
			>
				更新试试看2
			</button>
		</div>
	);
}

function ToggleDom() {
	const update = React.update();
	const toggleDom = () => {
		toggleFlag = !toggleFlag;
		update();
	};
	return (
		<div className="toggleDom">
			{toggleFlag ? <NumberComponent /> : <b>我把函数组件隐藏了</b>}
			<button onClick={toggleDom}>
				{toggleFlag ? "隐藏函数组件" : "打开函数组件"}
			</button>
		</div>
	);
}

let open = true;
function ToggleDom2() {
	const update = React.update();
	const toggleDom = () => {
		open = !open;
		update();
	};

	return (
		<div className="toggleDom">
			{open && <div>显示</div>}
			<button onClick={toggleDom}>{open ? "隐藏" : "打开"}</button>
		</div>
	);
}

const App = () => {
	const update = React.update();

	const handlerClick = () => {
		count++;
		props = {};
		update();
	};

	return (
		<div
			id="container"
			style={{ color: "red" }}
		>
            <ToggleDom2 />
            <ToggleDom />
			{/* <NumberComponent /> */}
			{/* <NumberComponent1 /> */}
		</div>
	);
};

export default App;
