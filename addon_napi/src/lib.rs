use napi_derive::napi;

#[napi]
pub fn add(n1: f64, n2: f64) -> f64 {
  return n1 + n2;
}

#[napi]
pub fn divide(n1: f64, n2: f64) -> f64 {
  return n1 / n2;
}

#[napi]
pub fn multiply(n1: f64, n2: f64) -> f64 {
  return n1 * n2;
}
