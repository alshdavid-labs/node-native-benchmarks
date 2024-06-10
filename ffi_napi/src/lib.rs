#[no_mangle]
pub extern fn add(n1: f32, n2: f32) -> f32 {
  return n1 + n2;
}

#[no_mangle]
pub extern fn divide(n1: f32, n2: f32) -> f32 {
  return n1 / n2;
}

#[no_mangle]
pub extern fn multiply(n1: f32, n2: f32) -> f32 {
  return n1 * n2;
}
