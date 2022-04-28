declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	/**
	* @param {Function} get_dgp
	* @param {Function} callback
	* @returns {StreamingHandle}
	*/
	export function stream_block_number(get_dgp: Function, callback: Function): StreamingHandle;
	/**
	* @param {Uint8Array} key
	* @param {Uint8Array} iv
	* @param {Uint8Array} data
	* @returns {Uint8Array}
	*/
	export function aes256_decrypt(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Uint8Array;
	/**
	*/
	export class StreamingHandle {
	  free(): void;
	}
	/**
	*/
	export class _Asset {
	  free(): void;
	/**
	* @param {string} value
	* @returns {_Asset}
	*/
	  static fromString(value: string): _Asset;
	/**
	* @param {number} amount
	* @param {number} precision
	* @param {string} symbol
	* @returns {_Asset}
	*/
	  static new(amount: number, precision: number, symbol: string): _Asset;
	/**
	* @returns {_Asset}
	*/
	  clone(): _Asset;
	/**
	* @param {string} amount_str
	* @returns {string}
	*/
	  updateAmountFloat(amount_str: string): string;
	/**
	* @param {number | undefined} dec_places
	* @returns {string}
	*/
	  toString(dec_places?: number): string;
	/**
	* @param {number} num
	* @returns {_Asset}
	*/
	  _plus_num(num: number): _Asset;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  _plus(a: _Asset): _Asset;
	/**
	* @param {number} num
	* @returns {_Asset}
	*/
	  _minus_num(num: number): _Asset;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  _minus(a: _Asset): _Asset;
	/**
	* @param {number} num
	* @returns {_Asset}
	*/
	  _mul_num(num: number): _Asset;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  _mul(a: _Asset): _Asset;
	/**
	* @param {number} num
	* @returns {_Asset}
	*/
	  _div_num(num: number): _Asset;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  _div(a: _Asset): _Asset;
	/**
	* @param {number} num
	* @returns {_Asset}
	*/
	  _mod_num(num: number): _Asset;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  _mod(a: _Asset): _Asset;
	/**
	* @param {_Price} p
	* @param {_Asset} remain
	* @returns {_Asset}
	*/
	  _mul_price(p: _Price, remain: _Asset): _Asset;
	/**
	* @param {_Asset} a
	* @returns {boolean}
	*/
	  eq(a: _Asset): boolean;
	/**
	* @param {_Asset} a
	* @returns {boolean}
	*/
	  ne(a: _Asset): boolean;
	/**
	* @param {_Asset} a
	* @returns {boolean}
	*/
	  lt(a: _Asset): boolean;
	/**
	* @param {_Asset} a
	* @returns {boolean}
	*/
	  lte(a: _Asset): boolean;
	/**
	* @param {_Asset} a
	* @returns {boolean}
	*/
	  gt(a: _Asset): boolean;
	/**
	* @param {_Asset} a
	* @returns {boolean}
	*/
	  gte(a: _Asset): boolean;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  min(a: _Asset): _Asset;
	/**
	* @param {_Asset} a
	* @returns {_Asset}
	*/
	  max(a: _Asset): _Asset;
	/**
	* @returns {number}
	*/
	  amount: number;
	/**
	* @returns {string}
	*/
	  amountFloat: string;
	/**
	* @returns {string}
	*/
	  readonly floatString: string;
	/**
	* @returns {boolean}
	*/
	  readonly isUIA: boolean;
	/**
	* @returns {number}
	*/
	  precision: number;
	/**
	* @returns {string}
	*/
	  symbol: string;
	}
	/**
	*/
	export class _AssetEditor {
	  free(): void;
	/**
	* @param {_Asset} asset
	* @returns {_AssetEditor}
	*/
	  static fromAsset(asset: _Asset): _AssetEditor;
	/**
	* @param {string} value
	* @returns {_AssetEditor}
	*/
	  static fromString(value: string): _AssetEditor;
	/**
	* @param {number} amount
	* @param {number} precision
	* @param {string} symbol
	* @returns {_AssetEditor}
	*/
	  static new(amount: number, precision: number, symbol: string): _AssetEditor;
	/**
	* @param {string} str
	* @returns {_AssetEditor}
	*/
	  withChange(str: string): _AssetEditor;
	/**
	* @returns {string}
	*/
	  readonly amountStr: string;
	/**
	* @returns {_Asset}
	*/
	  readonly asset: _Asset;
	/**
	* @returns {boolean}
	*/
	  readonly hasChange: boolean;
	}
	/**
	*/
	export class _Price {
	  free(): void;
	/**
	* @param {_Asset} base
	* @param {_Asset} quote
	* @returns {_Price}
	*/
	  static new(base: _Asset, quote: _Asset): _Price;
	/**
	* @returns {_Price}
	*/
	  clone(): _Price;
	/**
	* @returns {_Asset}
	*/
	  base: _Asset;
	/**
	* @returns {_Asset}
	*/
	  quote: _Asset;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg__asset_free: (a: number) => void;
  readonly _asset_fromString: (a: number, b: number) => number;
  readonly _asset_new: (a: number, b: number, c: number, d: number) => number;
  readonly _asset_clone: (a: number) => number;
  readonly _asset_amount: (a: number) => number;
  readonly _asset_set_amount: (a: number, b: number) => void;
  readonly _asset_amount_float: (a: number, b: number) => void;
  readonly _asset_set_amount_float: (a: number, b: number, c: number) => void;
  readonly _asset_updateAmountFloat: (a: number, b: number, c: number, d: number) => void;
  readonly _asset_precision: (a: number) => number;
  readonly _asset_set_precision: (a: number, b: number) => void;
  readonly _asset_symbol: (a: number, b: number) => void;
  readonly _asset_set_symbol: (a: number, b: number, c: number) => void;
  readonly _asset_is_uia: (a: number) => number;
  readonly _asset_toString: (a: number, b: number, c: number, d: number) => void;
  readonly _asset_float_string: (a: number, b: number) => void;
  readonly _asset__plus_num: (a: number, b: number) => number;
  readonly _asset__plus: (a: number, b: number) => number;
  readonly _asset__minus_num: (a: number, b: number) => number;
  readonly _asset__minus: (a: number, b: number) => number;
  readonly _asset__mul_num: (a: number, b: number) => number;
  readonly _asset__mul: (a: number, b: number) => number;
  readonly _asset__div_num: (a: number, b: number) => number;
  readonly _asset__div: (a: number, b: number) => number;
  readonly _asset__mod_num: (a: number, b: number) => number;
  readonly _asset__mod: (a: number, b: number) => number;
  readonly _asset__mul_price: (a: number, b: number, c: number) => number;
  readonly _asset_eq: (a: number, b: number) => number;
  readonly _asset_ne: (a: number, b: number) => number;
  readonly _asset_lt: (a: number, b: number) => number;
  readonly _asset_lte: (a: number, b: number) => number;
  readonly _asset_gt: (a: number, b: number) => number;
  readonly _asset_gte: (a: number, b: number) => number;
  readonly _asset_min: (a: number, b: number) => number;
  readonly _asset_max: (a: number, b: number) => number;
  readonly __wbg__asseteditor_free: (a: number) => void;
  readonly _asseteditor_fromAsset: (a: number) => number;
  readonly _asseteditor_fromString: (a: number, b: number) => number;
  readonly _asseteditor_new: (a: number, b: number, c: number, d: number) => number;
  readonly _asseteditor_withChange: (a: number, b: number, c: number) => number;
  readonly _asseteditor_asset: (a: number) => number;
  readonly _asseteditor_amount_str: (a: number, b: number) => void;
  readonly _asseteditor_has_change: (a: number) => number;
  readonly __wbg__price_free: (a: number) => void;
  readonly _price_new: (a: number, b: number) => number;
  readonly _price_clone: (a: number) => number;
  readonly _price_base: (a: number) => number;
  readonly _price_set_base: (a: number, b: number) => void;
  readonly _price_quote: (a: number) => number;
  readonly _price_set_quote: (a: number, b: number) => void;
  readonly __wbg_streaminghandle_free: (a: number) => void;
  readonly stream_block_number: (a: number, b: number) => number;
  readonly aes256_decrypt: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hce2ed387aa1c2b69: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
