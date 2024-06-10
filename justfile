profile := env_var_or_default("profile", "debug")

os := \
if \
  env_var_or_default("os", "") == "Windows_NT" { "windows" } \
else if \
  env_var_or_default("os", "") != "" { env_var("os") } \
else \
  { os() }

arch := \
if \
  env_var_or_default("arch", "") != "" { env_var("arch") } \
else if \
  arch() == "x86_64" { "amd64" } \
else if \
  arch() == "aarch64" { "arm64" } \
else \
  { arch() }

dylib := \
if \
  os == "windows" { "dll" } \
else if \
  os == "macos" { "dylib" } \
else if \
  os == "linux" { "so" } \
else \
  { os() }

profile_cargo := \
if \
  profile != "debug" { "--profile " + profile } \
else \
  { "" }

build:
  cargo build
  cd wasm && wasm-pack build --target nodejs {{profile_cargo}}
  cd addon_c && npm run build
  cp target/{{profile}}/libaddon_napi.{{dylib}} addon_napi/index.node
  cp target/{{profile}}/libaddon_neon.{{dylib}} addon_neon/index.node
  cp target/{{profile}}/libffi_koffi.{{dylib}} ffi_koffi/index.node
  cp target/{{profile}}/libffi_napi.{{dylib}} ffi_napi/index.node
  
bench:
  node "./_benchmark/index.js"
