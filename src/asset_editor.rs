
use wasm_bindgen::prelude::*;

use asset::_Asset;

#[wasm_bindgen]
pub struct _AssetEditor {
    asset: _Asset,
    amount_str: String,
    has_change: bool,
}

#[wasm_bindgen]
impl _AssetEditor {
    fn get_str(asset: &_Asset) -> String {
        if asset.amount() == 0f64 {
            return String::new();
        }
        asset.amount_float()
    }

    #[wasm_bindgen(js_name = fromAsset)]
    pub fn from_asset(asset: &_Asset) -> _AssetEditor {
        let amount_str = Self::get_str(asset);
        _AssetEditor { asset: asset.clone(), amount_str, has_change: true }
    }

    #[wasm_bindgen(js_name = fromString)]
    pub fn from_string(value: String) -> Result<_AssetEditor, JsValue> {
        let asset: _Asset;
        match _Asset::from_string(value) {
            Ok(a) => {
                asset = a;
            },
            Err(err) => {
                return Err(err)
            }
        }
        let amount_str = Self::get_str(&asset);
        Ok(_AssetEditor { asset, amount_str, has_change: true })
    }

    pub fn new(amount: f64, precision: u32, symbol: String) -> _AssetEditor {
        let asset = _Asset::new(amount, precision, symbol);
        let amount_str = Self::get_str(&asset);
        _AssetEditor { asset, amount_str, has_change: true }
    }

    #[wasm_bindgen(js_name = withChange)]
    pub fn with_change(&self, str: String) -> _AssetEditor {
        let mut asset = self.asset.clone();
        match asset.update_amount_float(str) {
            Ok(amount_str) => {
                let has_change = amount_str != self.amount_str;
                _AssetEditor { asset, amount_str, has_change }
            },
            Err(_e) => {
                _AssetEditor { asset, amount_str: self.amount_str.clone(), has_change: false }
            }
        }
    }

    #[wasm_bindgen(getter)]
    pub fn asset(&self) -> _Asset {
        self.asset.clone()
    }

    #[wasm_bindgen(getter = amountStr)]
    pub fn amount_str(&self) -> String {
        self.amount_str.clone()
    }

    #[wasm_bindgen(getter = hasChange)]
    pub fn has_change(&self) -> bool {
        self.has_change
    }
}
