/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    let set = new Set();
    try {
        for( let num of arr) {
            set.add(num);
        }
    } catch(e) {
        return [];
    }
    return Array.from(set);
}
