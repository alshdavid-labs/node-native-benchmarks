use neon::prelude::*;

fn add(mut cx: FunctionContext) -> JsResult<JsNumber> {
  let arg0: Handle<JsNumber> = cx.argument(0)?;
  let arg1: Handle<JsNumber> = cx.argument(1)?;

  let x: f64 = arg0.value(&mut cx);
  let y: f64 = arg1.value(&mut cx);
  
  return Ok(cx.number(x + y))
}

fn multiply(mut cx: FunctionContext) -> JsResult<JsNumber> {
  let arg0: Handle<JsNumber> = cx.argument(0)?;
  let arg1: Handle<JsNumber> = cx.argument(1)?;

  let x: f64 = arg0.value(&mut cx);
  let y: f64 = arg1.value(&mut cx);
  
  return Ok(cx.number(x * y))
}

fn divide(mut cx: FunctionContext) -> JsResult<JsNumber> {
  let arg0: Handle<JsNumber> = cx.argument(0)?;
  let arg1: Handle<JsNumber> = cx.argument(1)?;

  let x: f64 = arg0.value(&mut cx);
  let y: f64 = arg1.value(&mut cx);
  
  return Ok(cx.number(x / y))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("add", add)?;
    cx.export_function("multiply", multiply)?;
    cx.export_function("divide", divide)?;
    Ok(())
}
