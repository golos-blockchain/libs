
use wasm_bindgen::prelude::*;

use price::_Price;
use fixed_utils::{fixed2string, string2fixed};

#[derive(Clone)]
#[wasm_bindgen]
pub struct _Asset {
    amount: i64,
    precision: u32,
    symbol: String,
}

fn js_err(msg: &str, data: String) -> js_sys::Error {
    let mut err = msg.to_string();
    err.push_str(&data);
    js_sys::Error::new(&err)
}

#[wasm_bindgen]
impl _Asset {
    #[wasm_bindgen(js_name = fromString)]
    pub fn from_string(value: String) -> Result<_Asset, JsValue> {
        let mut amount_str = value.clone();
        let space_idx: usize;
        match amount_str.find(' ') {
            Some(idx) => {
                space_idx = idx;
            },
            None => {
                return Err(js_err("No space in string: ", amount_str).into())
            }
        }
        let symbol = amount_str.split_off(space_idx + 1);
        amount_str.pop();

        let mut precision = 0u32;
        let amount: i64;
        match string2fixed(amount_str.clone(), None, &mut precision, None) {
            Ok(val) => {
                amount = val
            },
            Err(_) => {
                return Err(js_err("Cannot parse number: ", amount_str).into())
            }
        }

        Ok(_Asset{ amount, precision, symbol })
    }

    pub fn new(amount: f64, precision: u32, symbol: String) -> _Asset {
        _Asset{ amount: amount as i64, precision, symbol }
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_me(&self) -> _Asset {
        self.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> f64 {
        self.amount as f64
    }

    #[wasm_bindgen(setter)]
    pub fn set_amount(&mut self, value: f64){
        self.amount = value as i64;
    }

    #[wasm_bindgen(getter = amountFloat)]
    pub fn amount_float(&self) -> String {
        fixed2string(self.amount, self.precision, None)
    }

    #[wasm_bindgen(setter = amountFloat)]
    pub fn set_amount_float(&mut self, amount_str: String) -> Result<f64, JsValue> {
        let mut precision = 0u32;
        match string2fixed(amount_str.clone(), Some(self.precision), &mut precision, None) {
            Ok(val) => {
                self.amount = val;
                return Ok(self.amount())
            },
            Err(_) => {
                return Err(js_err("Cannot parse number: ", amount_str).into())
            }
        }
    }

    #[wasm_bindgen(js_name = updateAmountFloat)]
    pub fn update_amount_float(&mut self, amount_str: String) -> Result<String, JsValue> {
        let mut precision = 0u32;
        let mut norm_s = String::with_capacity(amount_str.len());
        let parsed = string2fixed(amount_str.clone(), Some(self.precision), &mut precision, Some(&mut norm_s));
        match parsed {
            Ok(amount) => {
                self.amount = amount;
                Ok(norm_s)
            },
            Err(_e) => {
                Err(js_sys::Error::new("NaN").into())
            }
        }
    }

    #[wasm_bindgen(getter)]
    pub fn precision(&self) -> u32 {
        self.precision
    }

    #[wasm_bindgen(setter)]
    pub fn set_precision(&mut self, value: u32) {
        self.precision = value
    }

    #[wasm_bindgen(getter)]
    pub fn symbol(&self) -> String {
        self.symbol.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_symbol(&mut self, value: String) {
        self.symbol = value.clone()
    }

    #[wasm_bindgen(getter = isUIA)]
    pub fn is_uia(&self) -> bool {
        self.symbol != "GOLOS" && self.symbol != "GBG" && self.symbol != "GESTS"
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self, dec_places: Option<u32>) -> String {
        let amount_str = fixed2string(self.amount, self.precision,
            Some(dec_places.unwrap_or(self.precision)));
        amount_str + " " + &self.symbol
    }

    #[wasm_bindgen(getter = floatString)]
    pub fn float_string(&self) -> String {
        let af = self.amount_float();
        af + " " + &self.symbol
    }

    fn _copy(&self, amount: i64, _from: &_Asset) -> _Asset {
        let mut a = self.clone();
        a.amount = amount;
        a
    }

    // Arithmetic +, -, *, /

    pub fn _plus_num(&self, num: f64) -> _Asset {
        self._copy(self.amount + (num as i64), self)
    }

    pub fn _plus(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount + a.amount, a)
    }

    pub fn _minus_num(&self, num: f64) -> _Asset {
        self._copy(self.amount - (num as i64), self)
    }

    pub fn _minus(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount - a.amount, a)
    }

    pub fn _mul_num(&self, num: f64) -> _Asset {
        self._copy(self.amount * (num as i64), self)
    }

    pub fn _mul(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount * a.amount, a)
    }

    pub fn _div_num(&self, num: f64) -> _Asset {
        self._copy(self.amount / (num as i64), self)
    }

    pub fn _div(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount / a.amount, a)
    }

    pub fn _mod_num(&self, num: f64) -> _Asset {
        self._copy(self.amount % (num as i64), self)
    }

    pub fn _mod(&self, a: &_Asset) -> _Asset {
        self._copy(self.amount % a.amount, a)
    }

    pub fn _mul_price(&self, p: &_Price, remain: &mut _Asset) -> _Asset {
        let mut a = p.base();
        let mut b = p.quote();
        if self.symbol == a.symbol {
            a = p.quote();
            b = p.base();
        }

        let safe = self.amount as i128;
        let a_safe = a.amount as i128;
        let b_safe = b.amount as i128;

        let mul = safe * a_safe;
        *remain = self.clone();
        (*remain).amount = (mul % b_safe) as i64;
        let mut res = a.clone();
        res.amount = (mul / b_safe) as i64;
        res
    }

    // Arithmetic eq, lte, gte, gt, lt, ne, min, max

    pub fn _eq(&self, a: &_Asset) -> bool {
        self.amount == a.amount
    }

    pub fn _eq_num(&self, num: f64) -> bool {
        self.amount == num as i64
    }

    pub fn _ne(&self, a: &_Asset) -> bool {
        !self._eq(a)
    }

    pub fn _ne_num(&self, num: f64) -> bool {
        !self._eq_num(num)
    }

    pub fn _lt(&self, a: &_Asset) -> bool {
        self.amount < a.amount
    }

    pub fn _lt_num(&self, num: f64) -> bool {
        self.amount < num as i64
    }

    pub fn _lte(&self, a: &_Asset) -> bool {
        self.amount <= a.amount
    }

    pub fn _lte_num(&self, num: f64) -> bool {
        self.amount <= num as i64
    }

    pub fn _gt(&self, a: &_Asset) -> bool {
        self.amount > a.amount
    }

    pub fn _gt_num(&self, num: f64) -> bool {
        self.amount > num as i64
    }

    pub fn _gte(&self, a: &_Asset) -> bool {
        self.amount >= a.amount
    }

    pub fn _gte_num(&self, num: f64) -> bool {
        self.amount >= num as i64
    }

    fn clone_with_amount(&self, amount: i64) -> _Asset {
        let mut a = self.clone();
        a.amount = amount;
        a
    }

    pub fn _min(&self, a: &_Asset) -> _Asset {
        if self._lte(a) { self.clone() } else { a.clone() }
    }

    pub fn _min_num(&self, num: f64) -> _Asset {
        if self._lte_num(num) {
            self.clone()
        } else {
            self.clone_with_amount(num as i64)
        }
    }

    pub fn _max(&self, a: &_Asset) -> _Asset {
        if self._gte(a) { self.clone() } else { a.clone() }
    }

    pub fn _max_num(&self, num: f64) -> _Asset {
        if self._gte_num(num) {
            self.clone()
        } else {
            self.clone_with_amount(num as i64)
        }
    }
}
