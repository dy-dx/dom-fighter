export default class RenderSystem {
    constructor(elem) {
        if (!elem) {
            throw new Error();
        }
        this.gameElement = elem;
    }
    update(entities, dt) {
        entities
            .filter((e) => !!e.appearanceComp)
            .forEach((e) => {
            const elem = this.findOrCreateElement(e);
            this.setStyles(elem, e.appearanceComp, e.positionComp);
            if (e.physicsComp) {
                [
                    { hitbox: e.physicsComp.pushbox, type: "pushbox" },
                    { hitbox: e.physicsComp.hurtbox, type: "hurtbox" },
                    { hitbox: e.physicsComp.hitbox, type: "hitbox" },
                    { hitbox: e.physicsComp.blockbox, type: "blockbox" },
                ].forEach(({ hitbox, type }) => {
                    const elementId = `${elem.id}-${type}`;
                    const hitboxElem = document.getElementById(elementId);
                    if (!hitboxElem) {
                        throw new Error(`No element with id: ${elementId}`);
                    }
                    this.setHitboxDimensions(hitboxElem, hitbox);
                });
            }
        });
    }
    findOrCreateElement(e) {
        const existingElement = document.getElementById(e.id.toString());
        if (existingElement) {
            return existingElement;
        }
        const newElement = this.createParentElement(e.appearanceComp, e.id.toString());
        if (e.physicsComp) {
            this.createDebugBoxes(newElement, e.physicsComp);
        }
        return newElement;
    }
    createParentElement(appearanceComp, id) {
        const elem = document.createElement("div");
        elem.id = id;
        elem.className = "entity";
        this.gameElement.appendChild(elem);
        return elem;
    }
    createDebugBoxes(parentElem, physicsComp) {
        const boxColors = [
            {
                id: `${parentElem.id}-blockbox`,
                hitbox: physicsComp.blockbox,
                borderColor: "gray",
                backgroundColor: "rgba(80, 80, 80, 0.25)",
            },
            {
                id: `${parentElem.id}-hurtbox`,
                hitbox: physicsComp.hurtbox,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.25)",
            },
            {
                id: `${parentElem.id}-pushbox`,
                hitbox: physicsComp.pushbox,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.25)",
            },
            {
                id: `${parentElem.id}-hitbox`,
                hitbox: physicsComp.hitbox,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.25)",
            },
            // a hack to display the position marker using hitbox renderer
            {
                id: `${parentElem.id}-position`,
                hitbox: {
                    isActive: true,
                    width: 3,
                    height: 12,
                    x: -1,
                    y: 0,
                },
                borderColor: "white",
                backgroundColor: "black",
            },
        ];
        boxColors.forEach(({ id, hitbox, borderColor, backgroundColor }) => {
            const boxElem = document.createElement("div");
            boxElem.style.backgroundColor = backgroundColor;
            boxElem.style.borderColor = borderColor;
            boxElem.style.borderStyle = "solid";
            boxElem.style.borderWidth = "1px";
            boxElem.className = "hitbox";
            this.setHitboxDimensions(boxElem, hitbox);
            boxElem.id = id;
            parentElem.appendChild(boxElem);
        });
    }
    setStyles(elem, appearanceComp, positionComp) {
        elem.style.transform = `translate3d(${positionComp.x}px,${-positionComp.y}px,0px)`;
        elem.style.width = `${appearanceComp.width}px`;
        elem.style.height = `${appearanceComp.height}px`;
        elem.style.zIndex = `${appearanceComp.zIndex || 0}`;
    }
    setHitboxDimensions(elem, hitbox) {
        elem.style.transform = `translate3d(${hitbox.x}px,${-hitbox.y}px,0px)`;
        elem.style.width = `${hitbox.width}px`;
        elem.style.height = `${hitbox.height}px`;
        elem.style.visibility = hitbox.isActive ? "visible" : "hidden";
    }
}
//# sourceMappingURL=render.system.js.map