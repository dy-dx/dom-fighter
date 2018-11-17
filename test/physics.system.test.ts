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
      pushbox: {
        isActive: true,
        width: boxWidth,
        height: boxHeight,
        x: boxOffsetX,
        y: boxOffsetY,
      },
      hitbox: {isActive: false, width: 2, height: 2, x: 0, y: 0},
      hurtbox: {isActive: false, width: 2, height: 2, x: 0, y: 0},
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
