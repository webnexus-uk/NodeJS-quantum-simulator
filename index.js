const readline = require("readline");

// Initialize variables
let r0 = 1,
  i0 = 0,
  r1 = 0,
  i1 = 0;
let r2 = 0,
  i2 = 0,
  r3 = 0,
  i3 = 0;
let a0 = 0;
let shots = 28;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(String.fromCharCode(147));
console.log("NodeJS quantum simulator");
console.log("created by davide gessa (dakk)");
console.log("adapted by Coding Nexus");

rl.question("Enter gate seq (x0,x1,y0,y1,z0,z1,h0,h1,cx,sw): ", (g) => {
  console.log("calculating the statevector...");
  for (let i = 0; i < g.length; i += 2) {
    let gate = g.substr(i, 2);
    simulateGate(gate);
    process.stdout.write(".");
  }
  console.log();

  let sq =
    r0 * r0 +
    i0 * i0 +
    r1 * r1 +
    i1 * i1 +
    r2 * r2 +
    i2 * i2 +
    r3 * r3 +
    i3 * i3;
  if (Math.abs(sq - 1) > 0.00001) {
    normalizeStatevector();
  }

  console.log(`running ${shots} iterations...`);
  let z0 = 0,
    z1 = 0,
    z2 = 0,
    z3 = 0;
  let p0 = r0 * r0 + i0 * i0;
  let p1 = r1 * r1 + i1 * i1 + p0;
  let p2 = r2 * r2 + i2 * i2 + p1;
  let p3 = r3 * r3 + i3 * i3 + p2;

  for (let i = 0; i < shots; i++) {
    let r = Math.random();
    if (r < p0) {
      z0++;
    } else if (r >= p0 && r < p1) {
      z1++;
    } else if (r >= p1 && r < p2) {
      z2++;
    } else if (r >= p2 && r < p3) {
      z3++;
    }
  }

  console.log("results:");
  console.log(`00: [${z0}] ${"Q".repeat(z0)}`);
  console.log(`01: [${z2}] ${"Q".repeat(z2)}`);
  console.log(`10: [${z1}] ${"Q".repeat(z1)}`);
  console.log(`11: [${z3}] ${"Q".repeat(z3)}`);

  rl.close();
});

function simulateGate(gate) {
  switch (gate) {
    case "x0":
      [r0, r1] = swap(r0, r1);
      [i0, i1] = swap(i0, i1);
      [r2, r3] = swap(r2, r3);
      [i2, i3] = swap(i2, i3);
      break;
    case "x1":
      [r1, r3] = swap(r1, r3);
      [i1, i3] = swap(i1, i3);
      [r0, r2] = swap(r0, r2);
      [i0, i2] = swap(i0, i2);
      break;
    case "y0":
      [i0, r0] = swap(i0, -r0);
      [i1, r1] = swap(i1, -r1);
      [i2, r2] = swap(i2, -r2);
      [i3, r3] = swap(i3, -r3);
      break;
    case "y1":
      [i1, r1] = swap(i1, -r1);
      [i3, r3] = swap(i3, -r3);
      break;
    case "z0":
      i2 = -i2;
      i3 = -i3;
      break;
    case "z1":
      i1 = -i1;
      i3 = -i3;
      break;
    case "h0":
      let a0 = (r0 + r1) / Math.sqrt(2);
      let a1 = (i0 + i1) / Math.sqrt(2);
      let b0 = (r0 - r1) / Math.sqrt(2);
      let b1 = (i0 - i1) / Math.sqrt(2);
      r0 = a0;
      i0 = a1;
      r1 = b0;
      i1 = b1;
      a0 = (r2 + r3) / Math.sqrt(2);
      a1 = (i2 + i3) / Math.sqrt(2);
      b0 = (r2 - r3) / Math.sqrt(2);
      b1 = (i2 - i3) / Math.sqrt(2);
      r2 = a0;
      i2 = a1;
      r3 = b0;
      i3 = b1;
      break;
    case "h1":
      a0 = (r0 + r2) / Math.sqrt(2);
      a1 = (i0 + i2) / Math.sqrt(2);
      b0 = (r0 - r2) / Math.sqrt(2);
      b1 = (i0 - i2) / Math.sqrt(2);
      r0 = a0;
      i0 = a1;
      r2 = b0;
      i2 = b1;
      a0 = (r1 + r3) / Math.sqrt(2);
      a1 = (i1 + i3) / Math.sqrt(2);
      b0 = (r1 - r3) / Math.sqrt(2);
      b1 = (i1 - i3) / Math.sqrt(2);
      r1 = a0;
      i1 = a1;
      r3 = b0;
      i3 = b1;
      break;
    case "cx":
      [r1, r3] = swap(r1, r3);
      [i1, i3] = swap(i1, i3);
      break;
    case "sw":
      [r1, r2] = swap(r1, r2);
      [i1, i2] = swap(i1, i2);
      break;
  }
}

function normalizeStatevector() {
  let nf = 1 / Math.sqrt(sq);
  r0 *= nf;
  i0 *= nf;
  r1 *= nf;
  i1 *= nf;
  r2 *= nf;
  i2 *= nf;
  r3 *= nf;
  i3 *= nf;
}

function swap(a, b) {
  return [b, a];
}
