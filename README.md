# node-watchable-jsonpath

Watch specific object properties for changes. Add and remove listeners. Supports nested objects and arrays. Intended for use in lightweight data-bindings.

It's exactly like [watchable](https://github.com/illusori/node-watchable) but you can use JSONPath to specify the keys you want to listen to.

# Install

Not on npm yet, so you'll have to download it the old fashioned way. FIXME: update once it's released.

# Usage

```js
const { WatchableJSONPath } = require('watchable-jsonpath');

let m = new WatchableJSONPath({ a: { b: 1 } });
m.addListener('a.b', (newValue, oldValue, prop) => console.log(`${prop} changed from ${JSON.stringify(oldValue)} to ${JSON.stringify(newValue)}.`));

// a changed from undefined to 1.
// Gets called with the initial value.
```

See [watchable](https://github.com/illusori/node-watchable) for more examples, this is a fairly thin wrapper. The only difference is that you can't attach listeners to properties that don't exist yet.

# API

## Construction

```js
watchable = new WatchableJSONPath(original);
```

Creates a watchable from `original`. A watchable is a Proxy wrapper around the original.

WARNING: Changes to `original` will NOT be watched, you will need to use the returned watchable. However, since nested objects are replaced, the original object will be modified. Use the returned watchable and you'll be fine. If you want the original data-structure to be unmodified, create a deep clone yourself before watching.

## watchable.addListener(jsonpath, listener)

Adds a listener to a property of the watchable.

Unlike standard watchable, the property does need to exist otherwise JSONPath can't find it.

You can have multiple listeners for a property if you need to, although you'll need to make multiple calls to do so.

## watchable.removeListener(jsonpath, listener)

Removes the given listener from the watch list on that property. If you added an anonymous function as a listener, you'll have needed to have kept a reference to it somewhere for this to work.

## watchable[property]._rawValue_

Gets the raw (unwrapped) value of a property in case you need the non-proxied version for some reasons.

# See also

 * [on-change](https://github.com/sindresorhus/on-change) - Watch entire objects for non-specific changes.
 * [watchable](https://github.com/illusori/node-watchable) - The base library this uses.
