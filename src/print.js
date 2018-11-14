export default function printMe() {
    console.error('I get called from print.js!');
    // 
}

import _ from 'lodash';

console.log(
    _.join(['Another', 'module', 'loaded!'], ' ')
);