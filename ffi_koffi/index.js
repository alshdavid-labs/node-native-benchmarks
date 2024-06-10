const koffi = require('koffi');
var path = require('path');

let libPath = undefined

if (process.platform === 'win32') {
  libPath = path.join(__dirname, './target/release/ffi_koffi.dll')
}

if (process.platform === 'darwin') {
  libPath = path.join(__dirname, './target/release/libffi_koffi.dylib')
}

if (process.platform === 'linux') {
  libPath = path.join(__dirname, './target/release/libffi_koffi.so')
}

const lib = koffi.load(libPath);

const add = lib.func('add', 'float', ['float', 'float']);
const divide = lib.func('divide', 'float', ['float', 'float']);
const multiply = lib.func('multiply', 'float', ['float', 'float']);

module.exports ={
  add,
  divide,
  multiply,
}