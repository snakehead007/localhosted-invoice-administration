/**
 * removes all duplicates in an array
 * @param {Array} _array - array to distinct
 * @returns a distinct array with no duplicates
 * */
export let distinct = (_array) =>{
    let array = _array;
    let disctincts = [];
    for (let o of array) {
        let isDistinct = true;
        for (let d of disctincts) {
            if (d._id == o._id) {
                isDistinct = false;
            }
        }
        if (isDistinct) {
            disctincts.push(o);
        }
    }
    return disctincts;
};