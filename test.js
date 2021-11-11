var arr = [1, 2, 3, 3, 4, 'a', 'a', 'b', 'c'];

function reduce(arr) {
    var res = [];
    for (var item1 of arr) {
        for (var item2 of res) {
            if (item2 != item1) {
                item2.push(item1);
            }
            if (item2 == item1) {
                continue;
            }
        }
    }

    return res;
}
 
console.log(reduce(arr)); //[1, 2, 3, 4, "a", "b", "c"]
