import React from "./core/React.js";

// vite遇到jsx的文件，其实在内部是会转换成下面这种形式的，而且刚好我们在上面也引入了React，所以就是用我们自己写的了
// export default React.createElementVdom("div", { id: "app" }, "hi ", 'mini-react');

const count = 10;
function NumberComponent() {
	return <div id="numberContainer">这是一个函数组件</div>;
}

const App = () => {
    
	const handlerClick = () => {
		console.log("click");
	};

	return (
		<div
			id="container"
			style={{ color: "red" }}
		>
			<NumberComponent />
			<div>
				count: {count}
				<button onClick={handlerClick}>点击</button>
			</div>
			hi - mini-react
		</div>
	);
};

export default App;
