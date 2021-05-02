/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    arr.sort( (a, b) => { 
        if(a.normalize().toUpperCase().codePointAt(0) == b.normalize().toUpperCase().codePointAt(0)) {
            if(a.normalize().codePointAt(0) > b.normalize().codePointAt(0))
                return a.localeCompare(b) ;
            else
                return -a.localeCompare(b) 
        } else {
            if(param=='asc')
                return a.localeCompare(b);
            else
                return -a.localeCompare(b);
        }
    } );
}
