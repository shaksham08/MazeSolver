//* Matter JS Boiler CODE

const { Engine, Runner, Render, World, Bodies } = Matter;

//!ENgine tracks changes
//! Render = draw on screen
//! coordinate among World and ENgine
//! Body reference to entire collection on world
const cells = 6;
const width = 600;
const height = 600;
const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: { width: width, height: height, wireframes: true },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// const shape = Bodies.rectangle(200, 200, 50, 50, {
//   isStatic: true,
// });
// World.add(world, shape);

//? walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 40, height, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 40, height, {
    isStatic: true,
  }),
];

World.add(world, walls);

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

//Maze Generation
const grid = Array(cells)
  .fill(null)
  .map(() => {
    return Array(cells).fill(false);
  });

const verticals = Array(cells)
  .fill(null)
  .map(() => {
    return Array(cells - 1).fill(false);
  });

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => {
    return Array(cells).fill(false);
  });

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCells = (row, column) => {
  //if i have visited the cell then return
  if (grid[row][column]) {
    return;
  }
  //mark it visited
  grid[row][column] = true;
  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // For each neighbor....
  for (let neighbour of neighbors) {
    const [nextRow, nextColumn, direction] = neighbour;
    // See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }
    // If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    // Remove a wall from either horizontals or verticals
    if (direction == "left") {
      verticals[row][column - 1] = true;
    } else if (direction == "right") {
      verticals[row][column] = true;
    } else if (direction == "up") {
      horizontals[row - 1][column] = true;
    } else if (direction == "down") {
      horizontals[row][column] = true;
    }

    stepThroughCells(nextRow, nextColumn);
  }

  // Visit that next cell
};
stepThroughCells(1, 1);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      5,
      {
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      5,
      unitLength,
      {
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});
