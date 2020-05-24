import './css/style.css'
import img from './img/big.png'

var imgElement = document.createElement('img')
imgElement.src = img
document.body.appendChild(imgElement)

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
