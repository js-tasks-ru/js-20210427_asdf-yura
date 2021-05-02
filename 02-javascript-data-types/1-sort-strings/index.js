/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
          arr.sort( (a, b) => { 
           return a.localeCompare(b, "ru", {caseFirst:"upper"} );
    } );
    let arrCopy=[];
    if(param=='asc')
        arrCopy = [...arr];
    else if(param=='desc')
        arrCopy = [...arr.reverse()];
    return arrCopy;
}
