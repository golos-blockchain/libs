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

#[wasm_bindgen]
pub struct _Asset {
    amount: i64,
    precision: u32,
    symbol: String,
}

#[wasm_bindgen]
impl _Asset {
    #[wasm_bindgen(js_name = fromString)]
    pub fn from_string(value: String) -> _Asset {
        let mut amount_str = value.clone();
        let space_idx = amount_str.find(' ').unwrap();
        let symbol = amount_str.split_off(space_idx + 1);
        amount_str.pop();

        let amount_float: f64 = amount_str.parse().unwrap();

        let mut precision: u32 = 0;
        let precision_idx0 = amount_str.find('.');
        if let Some(precision_idx) = precision_idx0 {
            precision = (amount_str.chars().count() - precision_idx) as u32 - 1u32;
        }

        let amount = (amount_float * (i32::pow(10, precision) as f64)) as i64;

        _Asset{ amount, precision, symbol }
    }

    pub fn new(amount: i64, precision: u32, symbol: String) -> _Asset {
        _Asset{ amount, precision, symbol }
    }

    #[wasm_bindgen(method, getter)]
    pub fn amount(&self) -> i64 {
        self.amount
    }

    #[wasm_bindgen(method, setter)]
    pub fn set_amount(&mut self, value: i64) {
        self.amount = value
    }

    #[wasm_bindgen(method, getter, js_name=amountFloat)]
    pub fn amount_float(&self) -> f64 {
        self.amount as f64 / (i32::pow(10, self.precision) as f64)
    }

    #[wasm_bindgen(method, setter, js_name=amountFloat)]
    pub fn set_amount_float(&mut self, value: f64) {
        self.amount = (value * (i32::pow(10, self.precision) as f64)) as i64
    }

    #[wasm_bindgen(method, getter)]
    pub fn precision(&self) -> u32 {
        self.precision
    }

    #[wasm_bindgen(method, setter)]
    pub fn set_precision(&mut self, value: u32) {
        self.precision = value
    }

    #[wasm_bindgen(method, getter)]
    pub fn symbol(&self) -> String {
        self.symbol.clone()
    }

    #[wasm_bindgen(method, setter)]
    pub fn set_symbol(&mut self, value: String) {
        self.symbol = value.clone()
    }

    #[wasm_bindgen(js_name = isUIA)]
    pub fn is_uia(&self) -> bool {
        self.symbol != "GOLOS" && self.symbol != "GBG" && self.symbol != "GESTS"
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self, _dec_places: Option<i32>) -> String {
        let mut amount_str = self.amount().to_string();
        let amount_len = amount_str.chars().count() as u32;
        if amount_len <= self.precision {
            for _ in amount_len..=self.precision {
                amount_str.insert(0, '0');
            }
        }
        let dot_pos = (amount_str.chars().count() as u32 - self.precision) as usize;
        amount_str.insert(dot_pos, '.');
        if let Some(dec_places) = _dec_places {
            let mut soff = dot_pos + 1 + dec_places as usize;
            if dec_places == 0 {
                soff -= 1
            }
            let _ = amount_str.split_off(soff);
        }
        amount_str + " " + &self.symbol
    }

    fn _copy(&self, amount: i64, _from: &_Asset) -> _Asset {
        _Asset{amount,
            precision: self.precision, symbol: self.symbol.clone()}
    }

    // Arithmetic +, -, *, /

    pub fn _plus_num(&self, num: i64) -> _Asset {
        self._copy(self.amount + num, self)
    }

    pub fn _plus(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount + a.amount, a)
    }

    pub fn _minus_num(&self, num: i64) -> _Asset {
        self._copy(self.amount - num, self)
    }

    pub fn _minus(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount - a.amount, a)
    }

    pub fn _mul_num(&self, num: i64) -> _Asset {
        self._copy(self.amount * num, self)
    }

    pub fn _mul(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount * a.amount, a)
    }

    pub fn _div_num(&self, num: i64) -> _Asset {
        self._copy(self.amount / num, self)
    }

    pub fn _div(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount / a.amount, a)
    }

    // Arithmetic eq, lte, gte, gt, lt, ne

    pub fn eq(&self, a: &_Asset) -> bool {
        self.amount == a.amount
    }

    pub fn ne(&self, a: &_Asset) -> bool {
        !self.eq(a)
    }

    pub fn lt(&self, a: &_Asset) -> bool {
        self.amount < a.amount
    }

    pub fn lte(&self, a: &_Asset) -> bool {
        self.amount <= a.amount
    }

    pub fn gt(&self, a: &_Asset) -> bool {
        self.amount > a.amount
    }

    pub fn gte(&self, a: &_Asset) -> bool {
        self.amount >= a.amount
    }
}

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
