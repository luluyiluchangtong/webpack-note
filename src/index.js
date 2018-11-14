
async function getComponent() {

    var element = document.createElement('div');
    const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');

    element.innerHTML = _.join(['Helvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvlo', 'webpack'], ' ');

    return element;
}

getComponent().then(component => {
    document.body.appendChild(component);
})
function box() {
    var ele = document.createElement("h1")
    ele.innerHTML = "sssssssss"
    document.body.appendChild(ele)
}
box()