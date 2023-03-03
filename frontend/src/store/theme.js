import {darkTheme, useOsTheme} from "naive-ui";
import {window} from "rxjs";


export function getTheme(){
    const osTheme = useTheme();
    const savedTheme = localStorage.get('saved-theme')
}