import React from "./core/React.js";

// vite遇到jsx的文件，其实在内部是会转换成下面这种形式的，而且刚好我们在上面也引入了React，所以就是用我们自己写的了
// export default React.createElementVdom("div", { id: "app" }, "hi ", 'mini-react');

let count2 = 10;
let count3 = 10;
let props = { id: "button" };
let toggleFlag = true;

function NumberComponent() {

	console.log("NumberComponent 更新了");

	const [count, setCount] = React.useState(10);

	const [bar, setBar] = React.useState("bar");

	return (
		<div id="numberContainer">
			<div>conut: {count}</div>
			<div>bar: {bar}</div>
			<button
				onClick={() => {
					setCount((v) => ++v);
					setBar((v) => v + "bar");
				}}
			>
				更新count
			</button>
			<button
				onClick={() => {
					setBar('bar');
				}}
			>
				更新bar
			</button>
		</div>
	);
}

function ToggleDom() {
	const [toggleFlag, setToggleFlag] = React.useState(false);

	const toggleDom = () => {
		setToggleFlag(!toggleFlag);
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
			<ToggleDom />
			{/* <NumberComponent /> */}
			{/* <NumberComponent1 /> */}
		</div>
	);
};

export default App;
