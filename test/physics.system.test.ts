import {IPhysicsComp, IPositionComp} from "../src/components";
import {IEntity} from "../src/entities/entity";
import PhysicsSystem from "../src/systems/physics.system";

interface IPhysicsEntity extends IEntity {
  physicsComp: IPhysicsComp;
  positionComp: IPositionComp;
}

const createEntity = ({
  x = 0,
  y = 0,
  velocityX = 0,
  velocityY = 0,
  boxOffsetX = 0,
  boxOffsetY = 0,
  boxWidth = 100,
  boxHeight = 100,
}): IPhysicsEntity => {
  return {
    id: 0,
    positionComp: {x, y},
    physicsComp: {
      isMoveable: true,
      velocityX,
      velocityY,
      accelerationY: 0,
      pushbox: {
        isActive: true,
        width: boxWidth,
        height: boxHeight,
        x: boxOffsetX,
        y: boxOffsetY,
      },
      hitbox: {isActive: false, width: 2, height: 2, x: 0, y: 0},
      hurtbox: {isActive: false, width: 2, height: 2, x: 0, y: 0},
      blockbox: {isActive: false, width: 2, height: 2, x: 0, y: 0},
    },
  };
};

test("updates position according to velocity", () => {
  const system = new PhysicsSystem(1000);
  const e1 = createEntity({x: 100, velocityX: 1});
  const e2 = createEntity({x: 900, velocityX: -1});
  system.update([e1, e2], 1);
  expect(e1.positionComp.x).toEqual(101);
  expect(e2.positionComp.x).toEqual(899);
});

test("clamps pushboxes to stage edges", () => {
  const system = new PhysicsSystem(1000);
  const e1 = createEntity({x: 0, boxWidth: 4, boxOffsetX: -2});
  const e2 = createEntity({x: 1000, boxWidth: 4, boxOffsetX: -2});
  system.update([e1, e2], 1);
  expect(e1.positionComp.x).toEqual(2);
  expect(e2.positionComp.x).toEqual(998);
});

describe("when two pushboxes overlap", () => {
  const getUpdatedPositions = ({x1, x2, w1, w2}: {[k: string]: number}) => {
    const system = new PhysicsSystem(1000);
    const e1 = createEntity({x: x1, boxWidth: w1, boxOffsetX: 0});
    const e2 = createEntity({x: x2, boxWidth: w2, boxOffsetX: 0});
    system.update([e1, e2], 1);
    return {x1: e1.positionComp.x, x2: e2.positionComp.x};
  };

  it("pushes one to the left and one to the right", () => {
    expect(getUpdatedPositions({x1: 200, x2: 250, w1: 100, w2: 100}))
      .toEqual({x1: 175, x2: 275});
  });

  describe("by 1 pixel", () => {
    it("pushes one to the left and one to the right", () => {
      expect(getUpdatedPositions({x1: 200, x2: 299, w1: 100, w2: 100}))
        .toEqual({x1: 200, x2: 300});
    });
  });

  describe("and one lies entirely within the other", () => {
    it("pushes one to the left and one to the right", () => {
      expect(getUpdatedPositions({x1: 200, x2: 225, w1: 100, w2: 50}))
        // this is not necessarily the intended outcome, but it's good enough for now
        .toEqual({x1: 238, x2: 188});
    });
  });

  describe("and they share a left edge", () => {
    it("pushes one to the left and one to the right", () => {
      expect(getUpdatedPositions({x1: 200, x2: 200, w1: 100, w2: 50}))
        // this is not necessarily the intended outcome, but it's good enough for now
        .toEqual({x1: 225, x2: 175});
    });
  });

  describe("and they share a right edge", () => {
    it("pushes one to the left and one to the right", () => {
      expect(getUpdatedPositions({x1: 200, x2: 250, w1: 100, w2: 50}))
        .toEqual({x1: 175, x2: 275});
    });
  });

  describe("and they occupy the same exact space", () => {
    it("pushes one out of the way", () => {
      expect(getUpdatedPositions({x1: 200, x2: 200, w1: 100, w2: 100}))
        .toEqual({x1: 150, x2: 250});
    });
  });

  describe("and one is already clamped to the left edge of the stage", () => {
    it("pushes the non-clamped pushbox to the right", () => {
      expect(getUpdatedPositions({x1: 0, x2: 50, w1: 100, w2: 100}))
        .toEqual({x1: 0, x2: 100});
    });
  });

  describe("and one is already clamped to the right edge of the stage", () => {
    it("pushes the non-clamped pushbox to the right", () => {
      expect(getUpdatedPositions({x1: 900, x2: 850, w1: 100, w2: 100}))
        .toEqual({x1: 900, x2: 800});
    });
  });
});
