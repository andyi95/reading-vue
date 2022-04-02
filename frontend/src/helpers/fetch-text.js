
/**
 * Функция принимает текст и список выбранных морфем (пока только два - noun и verb)
 */
export function fetchText(response, onlyNouns, onlyVerbs) {


    if(typeof onlyNouns !== 'undefined' && onlyNouns === true){
        return  response.filter(function (itemff) {
            return itemff.tag === 'NOUN'});
    } else if(typeof onlyVerbs !== 'undefined' && onlyVerbs === true){
        return response.filter(function (item) {
            if(item.tag === 'VERB' || item.tag === 'INFN') {
                return true;
            }
        })
    }
    else {
        return response
    }
}