export default function deepClone(o) {
    if (typeof o !== "object") {
        return o;
    }
    if (!o) {
        return o;
    }
    if (Object.prototype.toString.apply(o) === "[object Array]") {
        // assume arrays are not sparse
        return o.map((e) => deepClone(e));
    }
    const newO = {};
    for (const k in o) {
        if (o.hasOwnProperty(k)) {
            newO[k] = deepClone(o[k]);
        }
    }
    return newO;
}
//# sourceMappingURL=deep-clone.js.map