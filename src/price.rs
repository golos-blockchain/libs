use wasm_bindgen::prelude::*;

use asset::_Asset;

#[derive(Clone)]
#[wasm_bindgen]
pub struct _Price {
    base: _Asset,
    quote: _Asset,
}

#[wasm_bindgen]
impl _Price {
    pub fn new(base: &_Asset, quote: &_Asset) -> _Price {
        _Price{ base: base.clone(), quote: quote.clone() }
    }

    #[wasm_bindgen(js_name = clone)]
    pub fn clone_me(&self) -> _Price {
        self.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn base(&self) -> _Asset {
        self.base.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_base(&mut self, value: &_Asset) {
        self.base = value.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn quote(&self) -> _Asset {
        self.quote.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_quote(&mut self, value: &_Asset) {
        self.quote = value.clone()
    }
}
