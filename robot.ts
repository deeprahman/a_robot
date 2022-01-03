console.log("\n");
interface TypeRoadGraph{
    [key:string]:string[]
}

type TypeParcel={
    place:string,
    address:string
}

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
    "Shop-Town Hall"
];

/**
 * 
 * @param edges 
 * @returns 
 */
function buildGraph(edges: string[]):TypeRoadGraph {
    let graph = Object.create(null);
    function addEdge(from: string, to: string) {
        if (graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}
const roadGraph: TypeRoadGraph = buildGraph(roads);

console.log(roadGraph);
console.log("\n");

class VillageState {

    place: string;
    parcels: TypeParcel[];

    constructor(place: string, parcels:TypeParcel[]) {
        this.place = place;
        this.parcels = parcels;
    }
    move(destination:string): VillageState {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(parcel => {
                if (parcel.place != this.place) return parcel;
                return { place: destination, address: parcel.address };
            }).filter(parcel => parcel.place != parcel.address);
            return new VillageState(destination, parcels);
        }
    }
}

let first = new VillageState(
    "Post Office",
    [{ place: "Marketplace", address: "Alice's House" }]
);
let next = first.move("Alice's House");

console.log(next);