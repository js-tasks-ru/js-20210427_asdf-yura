/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if(isNaN(size) )  
            return string;
        
    if (size==0) 
            return "";

    let charpre = "";
    let count = 0;
    let newString="";
    for(let char of string )
    {
        if(char === charpre)
        {
            count++;
            if(count<size)
            {
                newString += char;
            }
        }
        else
        {
            newString += char;
            charpre = char;
            count = 0;
        }
    }
    return newString;
}
