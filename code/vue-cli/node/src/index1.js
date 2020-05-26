import './css/style.css'
import img from './img/big.png'

var imgElement = document.createElement('img')
imgElement.src = img
document.body.appendChild(imgElement)

console.log('__filename', __filename)
console.log('__dirname', __dirname)
console.log('global', global)
console.log('process', process)
