var ffi = require('ffi-napi');
var path = require('path');

let libPath = undefined

if (process.platform === 'win32') {
  libPath = path.join(__dirname, './target/release/ffi_napi.dll')
}

if (process.platform === 'darwin') {
  libPath = path.join(__dirname, './target/release/ffi_napi.dylib')
}

if (process.platform === 'linux') {
  libPath = path.join(__dirname, './target/release/ffi_napi.so')
}

var lib = ffi.Library(libPath, {
	'add': ['float', ['float', 'float']],
	'divide': ['float', ['float', 'float']],
	'multiply': ['float', ['float', 'float']],
});

module.exports = lib
