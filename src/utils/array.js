export let distinct = (_array) =>{
    var array = _array;
    var disctincts = [];
    for (var o of array) {
        var isDistinct = true;
        for (var d of disctincts) {
            if (d._id == o._id) {
                isDistinct = false;
            }
        }
        if (isDistinct) {
            disctincts.push(o);
        }
    }
    return disctincts;
}