/* tslint:disable */
/* eslint-disable */
/**
* @param {string} source
* @returns {string}
*/
export function interpret(source: string): string;
/**
* @param {string} source
* @returns {string}
*/
export function interpret_with_minmaxprob(source: string): string;
/**
* @param {string} source
* @param {number} top_k
* @returns {string}
*/
export function interpret_with_topkproofs(source: string, top_k: number): string;
/**
* @param {string} source
* @param {number} k
* @returns {string}
*/
export function interpret_with_topbottomkclauses(source: string, k: number): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly interpret: (a: number, b: number, c: number) => void;
  readonly interpret_with_minmaxprob: (a: number, b: number, c: number) => void;
  readonly interpret_with_topkproofs: (a: number, b: number, c: number, d: number) => void;
  readonly interpret_with_topbottomkclauses: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
