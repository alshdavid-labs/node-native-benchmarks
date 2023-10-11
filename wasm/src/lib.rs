use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub extern fn add(n1: f32, n2: f32) -> f32 {
  return n1 + n2;
}

#[wasm_bindgen]
pub extern fn divide(n1: f32, n2: f32) -> f32 {
  return n1 / n2;
}

#[wasm_bindgen]
pub extern fn multiply(n1: f32, n2: f32) -> f32 {
  return n1 * n2;
}
