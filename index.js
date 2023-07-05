const readline = require("readline");

// Gate definitions
const gates = {
  x0: swapBits(0, 1),
  x1: swapBits(1, 3),
  y0: negateBit(0),
  y1: negateBit(1),
  z0: negateBit(2),
  z1: negateBit(1),
  h0: applyHadamard(0),
  h1: applyHadamard(1),
  cx: swapBits(1, 3),
  sw: swapBits(1, 2),
};

// Initialize variables
let stateVector = [1, 0, 0, 0];
const shots = 28;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(String.fromCharCode(147));
console.log("NodeJS quantum simulator");
console.log("created by davide gessa (dakk)");
console.log("adapted by Coding Nexus");

rl.question("Enter gate seq (x0,x1,y0,y1,z0,z1,h0,h1,cx,sw): ", (gateSeq) => {
  console.log("Calculating the state vector...");

  for (let i = 0; i < gateSeq.length; i += 2) {
    const gate = gateSeq.substr(i, 2);
    simulateGate(gate);
    process.stdout.write(".");
  }

  console.log();
  console.log(`Running ${shots} iterations...`);

  const measurements = measureStateVector(shots);
  displayResults(measurements);

  rl.close();
});

function simulateGate(gate) {
  const gateFunc = gates[gate];
  if (gateFunc) {
    stateVector = gateFunc(stateVector);
  }
}

function measureStateVector(shots) {
  const measurements = { z0: 0, z1: 0, z2: 0, z3: 0 };
  const probabilities = calculateProbabilities(stateVector);

  for (let i = 0; i < shots; i++) {
    const randomNum = Math.random();
    let sum = 0;
    let measuredQubit = "";

    for (const [key, probability] of Object.entries(probabilities)) {
      sum += probability;
      if (randomNum < sum) {
        measuredQubit = key;
        break;
      }
    }

    measurements[measuredQubit]++;
  }

  return measurements;
}

function displayResults(measurements) {
  console.log("Results:");
  console.log(`00: [${measurements.z0}] ${"Q".repeat(measurements.z0)}`);
  console.log(`01: [${measurements.z2}] ${"Q".repeat(measurements.z2)}`);
  console.log(`10: [${measurements.z1}] ${"Q".repeat(measurements.z1)}`);
  console.log(`11: [${measurements.z3}] ${"Q".repeat(measurements.z3)}`);
}

function calculateProbabilities(stateVector) {
  const probabilities = {};
  const sqNorm = stateVector.reduce(
    (sum, amplitude) => sum + Math.pow(amplitude, 2),
    0
  );

  if (Math.abs(sqNorm - 1) > 0.00001) {
    normalizeStateVector(stateVector);
  }

  probabilities.z0 = Math.pow(stateVector[0], 2) + Math.pow(stateVector[1], 2);
  probabilities.z1 = Math.pow(stateVector[2], 2) + Math.pow(stateVector[3], 2);
  probabilities.z2 = Math.pow(stateVector[4], 2) + Math.pow(stateVector[5], 2);
  probabilities.z3 = Math.pow(stateVector[6], 2) + Math.pow(stateVector[7], 2);

  return probabilities;
}

function normalizeStateVector(stateVector) {
  const norm = Math.sqrt(
    stateVector.reduce((sum, amplitude) => sum + Math.pow(amplitude, 2), 0)
  );
  stateVector.forEach(
    (amplitude, index) => (stateVector[index] = amplitude / norm)
  );
}

function swapBits(bitIndex1, bitIndex2) {
  return (stateVector) => {
    const newStateVector = [...stateVector];
    const temp = newStateVector[bitIndex1];
    newStateVector[bitIndex1] = newStateVector[bitIndex2];
    newStateVector[bitIndex2] = temp;
    return newStateVector;
  };
}

function negateBit(bitIndex) {
  return (stateVector) => {
    const newStateVector = [...stateVector];
    newStateVector[bitIndex] = -newStateVector[bitIndex];
    return newStateVector;
  };
}

function applyHadamard(bitIndex) {
  return (stateVector) => {
    const newStateVector = [...stateVector];
    const n = Math.sqrt(2);
    const a = (newStateVector[bitIndex] + newStateVector[bitIndex + 2]) / n;
    const b = (newStateVector[bitIndex] - newStateVector[bitIndex + 2]) / n;
    newStateVector[bitIndex] = a;
    newStateVector[bitIndex + 2] = b;
    return newStateVector;
  };
}
