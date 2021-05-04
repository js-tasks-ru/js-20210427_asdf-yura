/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    
    let direction;
    if(param === 'asc')
        direction = 1;
    else if(param === 'desc')
        direction = -1;
    else
        throw new Error('Îøèáêà!');

    const arrCopy = [...arr];

    arrCopy.sort( (a, b) => {     
        return direction * a.normalize().localeCompare(b.normalize(),  ['ru', 'en'], {caseFirst:'upper'}  );  
    } );
    
    return [...arrCopy];
}
