/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    let words = path.split(".");

    return function (obj) {
        let next = obj;
        let result = false;
        for(let word of words) {
            
            for (let [key, value] of Object.entries(next)) {
                if(word===key) {
                    next = value;
                    result = true;
                    break;
                }
                else
                    result = false;
            }
        }
        if(!result) next = undefined;
        return  next;
    };
}
