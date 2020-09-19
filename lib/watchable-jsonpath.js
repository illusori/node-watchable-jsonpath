/* jshint esversion: 9, node: true */
"use strict";

const { JSONPath } = require('jsonpath-plus');
const { Watchable, WatchableHandler } = require('watchable');

// Major gotcha vs basic Watchable is that JSONPath won't find properties that
// don't exist yet, and so it won't bind a listener to them.
class WatchableJSONPathHandler extends WatchableHandler {
    addListener (target, path, listener) {
        let wrapper = (newValue, oldValue, prop) => listener(newValue, oldValue, path);
        wrapper.originalListener = listener;

        JSONPath({
            resultType: 'all',
            path: path,
            json: target,
            callback: (res) => {
                if (res.parent === target) {
                    super.addListener(target, path, listener);
                } else {
                    res.parent.addListener(res.parentProperty, wrapper);
                }
            }
        });
    }

    removeListener (target, path, listener) {
        JSONPath({
            resultType: 'all',
            path: path,
            json: target,
            callback: (res) => {
                // Ew.
                let listeners = (res.parent === target) ? this.listeners : this.constructor.handlerFor(res.parent).listeners;
                listeners[res.parentProperty] = listeners[res.parentProperty]?.filter(f => f !== listener && f?.originalListener !== listener);
            }
        });
    }
}

class WatchableJSONPath extends Watchable {
    static watchableHandler = WatchableJSONPathHandler;
}

exports.WatchableJSONPathHandler = WatchableJSONPathHandler;
exports.WatchableJSONPath = WatchableJSONPath;
