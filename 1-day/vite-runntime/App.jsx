import React from "./core/React.js";

// vite遇到jsx的文件，其实在内部是会转换成下面这种形式的，而且刚好我们在上面也引入了React，所以就是用我们自己写的了
// export default React.createElementVdom("div", { id: "app" }, "hi ", 'mini-react');

let count = 10;
let props = { id: "button" };
let toggleFlag = true;
function NumberComponent() {
	return <div id="numberContainer">这是一个函数组件</div>;
}

const App = () => {
	const handlerClick = () => {
		count++;
		props = {};
		React.update();
	};

	const toggleDom = () => {
		toggleFlag = !toggleFlag;
		React.update();
	};

	return (
		<div
			id="container"
			style={{ color: "red" }}
		>
			{/* <NumberComponent />
			<div {...props}>
				count: {count}
				<button onClick={handlerClick}>点击</button>
			</div>
			hi - mini-react */}
			{toggleFlag ? <NumberComponent/> : <b>我把函数组件隐藏了</b>}
			{/* {toggleFlag ? <div id="numberContainer">这是一个函数组件</div> : <b>我把函数组件隐藏了</b>} */}
			<button onClick={toggleDom}>{toggleFlag ? '隐藏函数组件' : '打开函数组件'}</button>
		</div>
	);
};

export default App;
