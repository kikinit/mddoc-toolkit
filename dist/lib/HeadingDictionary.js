var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HeadingDictionary_instances, _HeadingDictionary_dictionary, _HeadingDictionary_loadDictionaryFromFile;
import { readFileSync } from 'node:fs';
export class HeadingDictionary {
    constructor(data) {
        _HeadingDictionary_instances.add(this);
        _HeadingDictionary_dictionary.set(this, void 0);
        // If the data is a string, assume it's a file path and load JSON.
        if (typeof data === 'string') {
            __classPrivateFieldSet(this, _HeadingDictionary_dictionary, __classPrivateFieldGet(this, _HeadingDictionary_instances, "m", _HeadingDictionary_loadDictionaryFromFile).call(this, data), "f");
        }
        else {
            // Otherwise, assume it's an object with dictionary data.
            __classPrivateFieldSet(this, _HeadingDictionary_dictionary, data, "f");
        }
    }
    // Get the entire dictionary.
    get dictionary() {
        return __classPrivateFieldGet(this, _HeadingDictionary_dictionary, "f");
    }
    // Get all alternative keywords for a given section type.
    getKeywordsForSection(section) {
        return __classPrivateFieldGet(this, _HeadingDictionary_dictionary, "f")[section] || [];
    }
    // Add new keywords to a specific section type.
    addKeywordForSection(section, keyword) {
        if (!__classPrivateFieldGet(this, _HeadingDictionary_dictionary, "f")[section]) {
            __classPrivateFieldGet(this, _HeadingDictionary_dictionary, "f")[section] = [];
        }
        __classPrivateFieldGet(this, _HeadingDictionary_dictionary, "f")[section].push(keyword);
    }
}
_HeadingDictionary_dictionary = new WeakMap(), _HeadingDictionary_instances = new WeakSet(), _HeadingDictionary_loadDictionaryFromFile = function _HeadingDictionary_loadDictionaryFromFile(filePath) {
    try {
        const fileContent = readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error loading dictionary from file: ${err.message}`);
        }
        else {
            throw new Error('Unknown error occurred while loading the dictionary');
        }
    }
};
