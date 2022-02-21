let data = {
	num: 1,
	num1: 1,
};
console.log(
	-(data.num1 / data.num) * Math.log2(data.num1 / data.num) -
		((data.num - data.num1) / data.num) *
			Math.log2((data.num - data.num1) / data.num)
);
