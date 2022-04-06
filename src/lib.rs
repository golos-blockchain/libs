extern crate wasm_bindgen;
extern crate aes;
extern crate block_modes;
extern crate num_bigint;

use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsCast, UnwrapThrowExt};
use num_bigint::BigInt;
use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};

mod asset;
mod asset_editor;
mod price;
mod fixed_utils;

#[wasm_bindgen]
pub struct StreamingHandle {
    _closure: Closure<dyn FnMut(JsValue)>
}

#[wasm_bindgen]
pub fn stream_block_number(get_dgp: js_sys::Function, callback: js_sys::Function) -> StreamingHandle {
    let on_dgp = Closure::once(move |dgp: JsValue| {
        let this = JsValue::null();
        let _ = callback.call1(&this, &dgp);
    });

    let this = JsValue::null();
    let ret = get_dgp.call0(&this);
    match ret {
        Ok(prom) => {
            if prom.has_type::<js_sys::Promise>() {
                let pr = prom.unchecked_into::<js_sys::Promise>();

                let _ = pr.then(&on_dgp);
            }
        },
        Err(_e) => {
        }
    }

    StreamingHandle {
        _closure: on_dgp
    }
}

// create an alias for convenience
type Aes256Cbc = Cbc<Aes256, Pkcs7>;

#[wasm_bindgen]
pub fn aes256_decrypt(key: &[u8], iv: &[u8], data: &[u8]) -> Vec<u8> {
    let mut encrypted_data = data.clone().to_owned();
    let cipher = Aes256Cbc::new_from_slices(&key, &iv).expect_throw(
        "Wrong key or iv"
    );
    cipher.decrypt(&mut encrypted_data).expect_throw(
        "Cannot decrypt dta"
    ).to_vec()
}

pub fn multiply_buffers(a: &[u8], b: &[u8]) -> Vec<u8> {
    let mut ba = BigInt::from_signed_bytes_be(a);
    let bb = BigInt::from_signed_bytes_be(b);
    ba *= bb;
    ba.to_signed_bytes_be()
}
