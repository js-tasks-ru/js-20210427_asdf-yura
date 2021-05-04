/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const arrCopy = [...arr];

    if(param=='asc')
        arrCopy.sort( (a, b) => {     
            return a.normalize().localeCompare(b.normalize(),  ["ru", "en"], {caseFirst:"upper"}  ); //, numeric: true  //return a.localeCompare(b, ["ru","en"], {caseFirst:"upper", sensitivity:"accent", kn:"true" }  ); //kn - Определяет, должно ли использоваться числовое сравнение, то есть, чтобы выполнялось условие "1" < "2" < "10". //[caseFirst="upper", sensitivity="accent"]  //{caseFirst:"upper"} 
    } );
    else if(param=='desc')
       arrCopy.sort( (a, b) => {     
           return -a.normalize().localeCompare(b.normalize(),  ["ru", "en"], {caseFirst:"upper"}  ); //, numeric: true  //return a.localeCompare(b, ["ru","en"], {caseFirst:"upper", sensitivity:"accent", kn:"true" }  ); //kn - Определяет, должно ли использоваться числовое сравнение, то есть, чтобы выполнялось условие "1" < "2" < "10". //[caseFirst="upper", sensitivity="accent"]  //{caseFirst:"upper"} 
    } );
    
    return [...arrCopy];
}
