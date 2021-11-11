import io from "socket.io-client";
const socketProtocal = window.location.protocol.includes("https")
	? "wss"
	: "ws";
const socket = io(`${socketProtocal}://${window.location.host}`, {
	reconnection: false,
});
const list = document.querySelector("ul");
var userList = [null];
var listValue = new Array(3).fill(10).map(() => new Array(3).fill(10));
var downOrder = 1;
function render() {
	console.log(listValue);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (listValue[i][j] === 1) {
				document.querySelectorAll("li")[i * 3 + j].innerHTML = `×`;
			} else if (listValue[i][j] === 2) {
				document.querySelectorAll("li")[i * 3 + j].innerHTML = `○`;
			}
		}
	}
	console.log(listValue);
	return 0;
}
list.onclick = (e) => {
	let order = e.target.className;
	let status;
	console.log(1);
	console.log(userList);
	if (listValue[parseInt(order / 3)][order % 3] == 10) {
		if (downOrder === 1 && userList[downOrder] === socket.id) {
			listValue[parseInt(order / 3)][order % 3] = downOrder;
			downOrder = 2;
			console.log(2);
		} else if (downOrder === 2 && userList[downOrder] === socket.id) {
			listValue[parseInt(order / 3)][order % 3] = downOrder;
			downOrder = 1;
			console.log(3);
		}
		socket.emit("downUpdate", { listValue, downOrder ,status });
	} else {
		return 0;
	}
};
const connectPromise = new Promise((resolve) => {
	socket.on("connect", () => {
		resolve();
		let roomId=prompt("请输入房间号");
		socket.emit("join",roomId);
		socket.on("join",function(value){
			userList=value;
		})
		socket.on("downUpdate", function (msg) {
			listValue = msg.listValue;
			downOrder = msg.downOrder;
			console.log(msg);
			render();
			if (msg.status === 1) {
				alert("1赢了");
			} else if (msg.status === 2) {
				alert("2赢了");
			}
			console.log("客户端收到了下棋数据" + downOrder);
		});
		socket.on("updateUser", function (msg) {
			userList = msg;
			console.log(userList);
		});
	});
});
export const connect = () => {
	connectPromise.then(() => {
		console.log("connect");
	});
};
