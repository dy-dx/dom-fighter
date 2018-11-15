export default function deepClone(o: any): any {
  if (typeof o !== "object") { return o; }
  if (!o) { return o; }

  if (Object.prototype.toString.apply(o) === "[object Array]") {
    // assume arrays are not sparse
    return (o as any[]).map((e) => deepClone(e));
  }

  const newO: {[k: string]: any} = {};
  for (const k in o) {
    if (o.hasOwnProperty(k)) {
      newO[k] = deepClone(o[k]);
    }
  }
  return newO;
}
