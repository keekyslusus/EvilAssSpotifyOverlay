/**
 * VibeClown Bundle v0.2.0
 * Python-style syntax with Kotlin safety
 *
 * Usage:
 *   <script src="vibe_bundle.js"></script>
 *   <script type="text/vibe">
 *       print "Hello!"
 *   </script>
 *
 * Note: Requires vibeclown_bg.wasm in the same directory
 */

let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
let wasm = undefined;

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

/**
 * Проверить код на ошибки (без генерации)
 *
 * # Arguments
 * * `source` - Исходный код на VibeClown
 *
 * # Returns
 * JSON строка с CheckResult
 * @param {string} source
 * @returns {string}
 */
function check(source) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.check(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Компилировать VibeClown код в JavaScript
 *
 * # Arguments
 * * `source` - Исходный код на VibeClown
 *
 * # Returns
 * JSON строка с CompileResult
 * @param {string} source
 * @returns {string}
 */
function compile(source) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compile(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Отформатировать ошибку для отображения (текстовый формат)
 * @param {string} error_json
 * @returns {string}
 */
function format_error(error_json) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(error_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.format_error(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Отформатировать все ошибки из результата компиляции
 * @param {string} result_json
 * @returns {string}
 */
function format_errors(result_json) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(result_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.format_errors(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Получить stdlib (runtime functions) для инъекции
 * Единственный источник истины для всех runtime функций
 * @returns {string}
 */
function get_stdlib() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.get_stdlib();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Получить информацию о компиляторе
 * @returns {string}
 */
function info() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.info();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Инициализация паники для лучших stack traces в консоли браузера
 */
function init() {
    wasm.init();
}

/**
 * Получить версию компилятора
 * @returns {string}
 */
function version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.version();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined' && typeof script_src !== 'undefined') {
        module_or_path = script_src.replace(/\.js$/, '_bg.wasm');
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}


    // Export functions
    __exports.check = check;
    __exports.compile = compile;
    __exports.format_error = format_error;
    __exports.format_errors = format_errors;
    __exports.get_stdlib = get_stdlib;
    __exports.info = info;
    __exports.init = init;
    __exports.version = version;

    wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);
})();


/**
 * VibeClown Loader v0.2.0
 * Uses get_stdlib() from WASM - single source of truth
 *
 * Usage:
 *   <script src="vibe_loader.js"></script>
 *   <script type="text/vibe" src="app.clown"></script>
 *   <script type="text/vibe">
 *       val x = 42
 *       print x
 *   </script>
 */

(function() {
    'use strict';

    // Configuration (can be overridden before loading)
    window.VibeConfig = window.VibeConfig || {};
    const config = {
        wasmPath: window.VibeConfig.wasmPath || './vibeclown_bg.wasm',
        loaderPath: window.VibeConfig.loaderPath || './vibeclown.js',
        autoRun: window.VibeConfig.autoRun !== false,
        debug: window.VibeConfig.debug || false
    };

    // State
    let wasmReady = false;
    let stdlibCache = null;

    // Dedent - remove common leading indentation
    function dedent(source) {
        const lines = source.split('\n');
        while (lines.length > 0 && lines[0].trim() === '') lines.shift();
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
        if (lines.length === 0) return '';

        let minIndent = Infinity;
        for (const line of lines) {
            if (line.trim() === '') continue;
            const indent = line.match(/^[ \t]*/)[0].length;
            if (indent < minIndent) minIndent = indent;
        }

        if (minIndent === 0 || minIndent === Infinity) {
            return lines.join('\n');
        }

        return lines.map(line => {
            if (line.trim() === '') return '';
            return line.slice(minIndent);
        }).join('\n');
    }

    // Get stdlib (cached after first call)
    function getStdlib() {
        if (stdlibCache === null) {
            stdlibCache = wasm_bindgen.get_stdlib();
        }
        return stdlibCache;
    }

    // Compile and execute
    function compileAndRun(source, scriptName) {
        if (!wasmReady) {
            throw new Error('VibeClown WASM not loaded yet');
        }

        const resultJson = wasm_bindgen.compile(source);
        const result = JSON.parse(resultJson);

        if (!result.success) {
            const errors = result.errors.map(e =>
                `[${e.severity}] Line ${e.line}: ${e.message}`
            ).join('\n');
            throw new Error(`VibeClown compilation error in ${scriptName}:\n${errors}`);
        }

        if (config.debug) {
            console.log(`[VibeClown] Compiled ${scriptName}:`, result.code);
        }

        // Execute: stdlib from WASM + compiled code
        const fullCode = getStdlib() + '\n' + result.code;

        try {
            const fn = new Function(fullCode);
            fn();
        } catch (e) {
            throw new Error(`VibeClown runtime error in ${scriptName}: ${e.message}`);
        }
    }

    // Process <script type="text/vibe"> tags
    async function processVibeScripts() {
        const scripts = document.querySelectorAll('script[type="text/vibe"]');

        for (const script of scripts) {
            if (script.dataset.vibeProcessed) continue;
            script.dataset.vibeProcessed = 'true';

            let source = '';
            const scriptName = script.src || 'inline';

            try {
                if (script.src) {
                    const response = await fetch(script.src);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${script.src}: ${response.status}`);
                    }
                    source = await response.text();
                } else {
                    source = dedent(script.textContent);
                }

                compileAndRun(source, scriptName);

                if (config.debug) {
                    console.log(`[VibeClown] Executed: ${scriptName}`);
                }
            } catch (e) {
                console.error(e.message);
                if (window.VibeError) window.VibeError(e);
            }
        }
    }

    // Load WASM
    async function loadWasm() {
        try {
            // Load vibeclown.js if needed
            if (typeof wasm_bindgen === 'undefined') {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = config.loaderPath;
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('Failed to load vibeclown.js'));
                    document.head.appendChild(script);
                });
            }

            // Check for embedded WASM (for all-in-one bundle)
            if (window.__VIBE_EMBEDDED_WASM__) {
                const base64 = window.__VIBE_EMBEDDED_WASM__;
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const wasmModule = await WebAssembly.compile(bytes);
                await wasm_bindgen({ module_or_path: wasmModule });
            } else {
                await wasm_bindgen(config.wasmPath);
            }
            wasmReady = true;

            if (config.debug) {
                console.log('[VibeClown] WASM loaded, version:', wasm_bindgen.version());
            }

            if (config.autoRun) {
                await processVibeScripts();
            }

            window.dispatchEvent(new CustomEvent('vibeready'));
            if (window.VibeReady) window.VibeReady();

        } catch (e) {
            console.error('[VibeClown] Failed to load:', e.message);
            if (window.VibeError) window.VibeError(e);
        }
    }

    // Public API
    window.Vibe = {
        compile: function(source) {
            if (!wasmReady) throw new Error('WASM not ready');
            return JSON.parse(wasm_bindgen.compile(source));
        },

        run: function(source, name) {
            compileAndRun(source, name || 'Vibe.run');
        },

        check: function(source) {
            if (!wasmReady) throw new Error('WASM not ready');
            return JSON.parse(wasm_bindgen.check(source));
        },

        version: function() {
            if (!wasmReady) return 'not loaded';
            return wasm_bindgen.version();
        },

        ready: function() {
            return wasmReady;
        },

        // Stdlib from WASM - single source of truth
        getStdlib: function() {
            if (!wasmReady) throw new Error('WASM not ready');
            return getStdlib();
        },

        processScripts: processVibeScripts
    };

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadWasm);
    } else {
        loadWasm();
    }

    // MutationObserver for SPA support
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT' && node.type === 'text/vibe') {
                        if (wasmReady) {
                            processVibeScripts();
                        }
                    }
                }
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

})();

