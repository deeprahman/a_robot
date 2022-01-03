interface TypeRoadGraph {
  [key: string]: string[];
}

type TypeParcel = {
  place: string;
  address: string;
};

type TypeRandomDirection = {
  direction:string
};

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

/**
 * @param edges
 * @returns
 */
function buildGraph(edges: string[]): TypeRoadGraph {
  let graph = Object.create(null);
  function addEdge(from: string, to: string) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}
const roadGraph: TypeRoadGraph = buildGraph(roads);

class VillageState {
  place: string;
  parcels: TypeParcel[];

  constructor(place: string, parcels: TypeParcel[]) {
    this.place = place;
    this.parcels = parcels;
  }
  move(destination: string): VillageState {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map((parcel) => {
        if (parcel.place != this.place) return parcel;
        return { place: destination, address: parcel.address };
      }).filter((parcel) => parcel.place != parcel.address);
      return new VillageState(destination, parcels);
    }
  }

  
}



let first = new VillageState(
  "Post Office",
  [{ place: "Post Office", address: "Alice's House" }, {
    place: "Alice's House",
    address: "Bob's House",
  }],
);
let next = first.move("Alice's House");
next = next.move("Bob's House");



/**
   * Creates the given number of parcels
   * Picks parcel address randomly and picks parcel place randomly
   * @param {number} parcelCount 
   * @returns 
   */
 function random(parcelCount = 5): VillageState {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place: string;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
}

/*
It must pick up
all parcels by visiting every location that has a parcel and deliver them by
visiting every location that a parcel is addressed to, but only after picking up
the parcel


*/

/**
 * Randomly picks a place
 * @param {string[]} array Contains all the places
 * @returns {string} Place
 */
function randomPick(array: string[]) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

/**
 * Randomly picks a neighbor of the Robots current location
 * @param {VillageState} state Contains the Robot's current location
 * @returns {TypeRandomDirection}
 */
function randomRobot(state: VillageState): TypeRandomDirection {
  return { direction: randomPick(roadGraph[state.place]) };
}

/*
The robot could
just walk in a random direction every turn. That means, with great likelihood,
it will eventually run into all parcels and then also at some point reach the
place where they should be delivered
*/

//we could say that a robot is a function that takes a
//VillageState object and returns the name of a nearby place.

/**
 * Run robot using random-walk
 * @param {VillageState} state
 * @param robot
 */
 function runRobot(state: VillageState, robot: (x:VillageState)=> TypeRandomDirection) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`); // Prints how much walks it needs to deliver all the packages
      break;
    }
    let action = robot(state);
    state = state.move(action.direction); // Move to the given destination and return the VillageState
    console.log(`Moved to ${action.direction}`);
  }
}

runRobot(random(),randomRobot);