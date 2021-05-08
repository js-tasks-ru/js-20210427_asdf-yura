/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const words = path.split(".");

    return function (obj) {
        if (!obj) { return; }
        if (Object.keys(obj).length === 0) { return; }
        let next = obj;
        let result = false;
        for (let word of words) {
            const index = Object.keys(next).indexOf(word);
            if (index > -1) {
                next = Object.values(next)[index]; 
                result = true;
            } else { result = false; }
        }
        if (!result) { return; } 
        return next;
    };
}
