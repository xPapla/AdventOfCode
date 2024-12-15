console.time("part2");
let input = require("fs").readFileSync("./input.txt", "utf8").split("\n\n"),
  grid = input[0]
    .replaceAll("#", "##")
    .replaceAll("O", "[]")
    .replaceAll(".", "..")
    .replace("@", "@.")
    .split("\n")
    .map((l) => l.split("")),
  instructions = input[1].split("\n").join(""),
  directions = { "^": [-1, 0], ">": [0, 1], "<": [0, -1], v: [1, 0] },
  y,
  x,
  seen = new Set();

for (let _y = 0; _y < grid.length; _y++)
  for (let _x = 0; _x < grid[0].length; _x++)
    if (grid[_y][_x] === "@") {
      y = _y;
      x = _x;
    }

function lookAhead(Y, X, dir) {
  let halfA = grid[Y][X],
    halfBX = X + (halfA === "]" ? -1 : 1);
  seen.add(Y + "-" + X);
  seen.add(Y + "-" + halfBX);
  let upA = grid[Y + dir][X],
    upB = grid[Y + dir][halfBX];
  if (upA === "." && upB === ".") {
    seen.add(Y + dir + "-" + X);
    seen.add(Y + dir + "-" + halfBX);
    return true;
  }
  if (upA === "#" || upB === "#") return false;
  if (upA === ".") {
    seen.add(Y + dir + "-" + X);
    return lookAhead(Y + dir, halfBX, dir);
  }
  if (upB === ".") {
    seen.add(Y + dir + "-" + halfBX);
    return lookAhead(Y + dir, X, dir);
  }
  return lookAhead(Y + dir, X, dir) && lookAhead(Y + dir, halfBX, dir);
}

for (let i of instructions) {
  let dy = directions[i][0],
    dx = directions[i][1],
    ny = y + dy,
    nx = x + dx;
  if (grid[ny][nx] === ".") {
    grid[y][x] = ".";
    grid[ny][nx] = "@";
    y = ny;
    x = nx;
    continue;
  }
  if (grid[ny][nx] === "#") continue;

  if (i === "<" || i === ">") {
    let fy = ny,
      fx = nx;
    while (true) {
      fy += dy;
      fx += dx;
      if (grid[fy][fx] === "[" || grid[fy][fx] === "]") continue;
      if (grid[fy][fx] === "#") break;
      let slice = grid[y].slice(Math.min(x, fx - dx), Math.max(x, fx - dx) + 1);
      if (i === "<") slice.push(".");
      else slice.unshift(".");
      grid[y].splice(Math.min(x, fx), slice.length, ...slice);
      y = ny;
      x = nx;
      break;
    }
  }

  if ((i === "^" || i === "v") && lookAhead(ny, nx, dy)) {
    let points = Array.from(seen).sort((a, b) => {
      let yA = +a.split("-")[0],
        yB = +b.split("-")[0];
      return dy * (yB - yA);
    });
    for (let p of points) {
      let arr = p.split("-"),
        Y = +arr[0],
        X = +arr[1];
      grid[Y][X] = seen.has(Y - dy + "-" + X) ? grid[Y - dy][X] : ".";
    }
    grid[ny][nx] = "@";
    grid[y][x] = ".";
    y = ny;
    x = nx;
  }
  seen.clear();
}

let sum = 0;
for (let Y = 0; Y < grid.length; ++Y)
  for (let X = 0; X < grid[0].length; ++X)
    if (grid[Y][X] === "[") sum += 100 * Y + X;

console.log(sum);
console.timeEnd("part2");
