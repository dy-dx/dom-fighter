export function aabb(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}
export function hitboxOverlaps(p1, h1, p2, h2) {
    const rect1 = {
        x: p1.x + h1.x,
        y: p1.y + h1.y,
        width: h1.width,
        height: h1.height,
    };
    const rect2 = {
        x: p2.x + h2.x,
        y: p2.y + h2.y,
        width: h2.width,
        height: h2.height,
    };
    return aabb(rect1, rect2);
}
//# sourceMappingURL=aabb.js.map