/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
          const arrCopy = [...arr];
          arrCopy.sort( (a, b) => { 
           return a.normalize().localeCompare(b.normalize(), "ru", {caseFirst:"upper"}  ); 
    } );
    let arrNew=[];
    if(param=='asc')
        arrNew = [...arrCopy];
    else if(param=='desc')
        arrNew = [...arrCopy.reverse()];
    return arrNew;
}
