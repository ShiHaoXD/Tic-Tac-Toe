import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import { Socket, Server } from "socket.io";
import webpackConfig from "../../webpack.dev.js";
import internalIp from "internal-ip";
const app = express();
// app.use(express.static("public"))
if (process.env.NODE_ENV === "development") {
	const compiler = webpack(webpackConfig);
	app.use(webpackDevMiddleware(compiler));
} else {
	app.use(express.static("dist"));
}

const port = 3000;
function getIPAddress() {
	return internalIp.v4();
}
function check(listValue) {
	let status = [];
	listValue.forEach((e, index) => {
		// 横向
		const res = e.reduce((acc, cur) => {
			return acc + cur;
		});
		status.push(res);
	});
	// 竖向
	for (let i = 0; i < 3; i++) {
		let res = listValue[0][i] + listValue[1][i] + listValue[2][i];
		status.push(res);

		res = 0;
	}
	//斜向
	let res = listValue[0][0] + listValue[1][1] + listValue[2][2];
	status.push(res);

	res = 0;
	res = listValue[2][0] + listValue[1][1] + listValue[0][2];
	status.push(res);

	for (let i = 0; i < status.length; i++) {
		if (status[i] === 3) return 1;
		else if (status[i] === 6) return 2;
	}
	return -1;
}
const domain = await getIPAddress();
const server = app.listen(port, domain, () => {
	console.log(`Server is running at http://${domain}:${port}`);
});

const io = new Server(server, {
	maxHttpBufferSize: 1e8,
});
var userList = new Array(10).fill(0).map(() => [null]);
console.log(userList);
io.on("connect", (socket) => {
	var idNow;
	console.log("you ren jin ru");
	socket.on("join",(roomId)=>{
		idNow=roomId;
		socket.join(roomId);
		userList[roomId].push(socket.id);
		console.log(userList[roomId]);
		io.to(roomId).emit("join",userList[roomId]);
	})
	socket.on("downUpdate", (msg) => {
		msg.status=check(msg.listValue)
		console.log("收到了下棋数据" + msg.listValue);
		io.to(idNow).emit("downUpdate", msg);
	});
	socket.on("disconnect", () => {
		userList[idNow] = userList[idNow].filter(e =>  e !=socket.id);
		io.emit("updateUser", userList);
		console.log("user disconnected");
	});
});
