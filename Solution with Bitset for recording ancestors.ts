
function getAncestors(numberOfNodes: number, edges: number[][]): number[][] {
    this.numberOfNodes = numberOfNodes;
    this.ancestors = new Array(this.numberOfNodes);
    for (let i = 0; i < numberOfNodes; ++i) {
        this.ancestors[i] = new Bitset(this.numberOfNodes);
    }

    const incomingEdgesPerNode = createArrayIncomingEdgesPerNode(edges);
    const directedAcyclicGraph = createDirectedAcyclicGraph(edges);
    const nodesWithoutIncomingEdges = createListNodesWithoutIncomingEdges(incomingEdgesPerNode);

    for (let i = 0; i < nodesWithoutIncomingEdges.length; ++i) {
        findAncestorsPerNodeWithTopologicalSort(nodesWithoutIncomingEdges[i], directedAcyclicGraph, incomingEdgesPerNode);
    }

    return createListAllAncestorsPerNode();
};

function findAncestorsPerNodeWithTopologicalSort(node: number, directedAcyclicGraph: number[][], incomingEdgesPerNode: number[]): void {
    for (let next of directedAcyclicGraph[node]) {
        updateAncestors(node, next);
        if (--incomingEdgesPerNode[next] === 0) {
            findAncestorsPerNodeWithTopologicalSort(next, directedAcyclicGraph, incomingEdgesPerNode);
        }
    }
}


function createArrayIncomingEdgesPerNode(edges: number[][]): number[] {
    const incomingEdgesPerNode = new Array(this.numberOfNodes).fill(0);
    for (let edge of edges) {
        let to = edge[1];
        ++incomingEdgesPerNode[to];
    }
    return incomingEdgesPerNode;
}


function createDirectedAcyclicGraph(edges: number[][]): number[][] {
    const directedAcyclicGraph: number[][] = Array.from(new Array(this.numberOfNodes), () => new Array());
    for (let [from, to] of edges) {
        directedAcyclicGraph[from].push(to);
    }
    return directedAcyclicGraph;
}

function createListNodesWithoutIncomingEdges(incomingEdgesPerNode: number[]): number[] {
    const list: number[] = new Array();
    for (let nodeID = 0; nodeID < this.numberOfNodes; ++nodeID) {
        if (incomingEdgesPerNode[nodeID] === 0) {
            list.push(nodeID);
        }
    }
    return list;
}

function createListAllAncestorsPerNode(): number[][] {
    const allAncestorsPerNode: number[][] = Array(this.numberOfNodes);

    for (let nodeID = 0; nodeID < this.numberOfNodes; ++nodeID) {
        const ancestorsForCurrentNode = new Array();

        for (let candidateAncestorID = 0; candidateAncestorID < this.numberOfNodes; ++candidateAncestorID) {
            let bitRow = this.ancestors[nodeID].getBitRow(candidateAncestorID);
            let indexBitInRow = this.ancestors[nodeID].getIndexBitInRow(candidateAncestorID);

            if ((this.ancestors[nodeID].bits[bitRow] & (1 << indexBitInRow)) !== 0) {
                ancestorsForCurrentNode.push(candidateAncestorID);
            }
        }
        allAncestorsPerNode[nodeID] = ancestorsForCurrentNode;
    }
    return allAncestorsPerNode;
}

function updateAncestors(current: number, next: number): void {
    this.ancestors[next].or(this.ancestors[current]);
    this.ancestors[next].setBit(current, true);
}

/*
Customized Bitset:
TypeScript does not have a Bitset, so instead of importing some from external libraries, I created one here. 
The only Bitset operations needed for the application are bitwiseOr between two Bitsets and a method 
to set a single bit, thus, to keep it simple, only these two methods for bitwise operations are implemented. 
In addition, two helper methods for getting the row and index of a bit are also implemented.  
*/
class Bitset {

    // Setting BITS_PER_ROW too high will require each row to have a BigInt instead of a number.
    // Therefore, to keep it simple and have a number for each row, the value is distributed among more rows.
    static BITS_PER_ROW = 30;
    lengthArrayBits: number;
    bits: number[];

    constructor(totalBits: number) {
        this.lengthArrayBits = Math.ceil(totalBits / Bitset.BITS_PER_ROW);
        this.bits = new Array(this.lengthArrayBits).fill(0);
    }

    setBit(bit: number, one: boolean): void {
        let row = this.getBitRow(bit);
        let indexInRow = this.getIndexBitInRow(bit);

        if (one) {
            this.bits[row] |= (1 << indexInRow);
        } else {
            let current = ~(1 << indexInRow);
            this.bits[row] &= current;
        }
    }

    or(other: Bitset): void {
        if (other.lengthArrayBits !== this.lengthArrayBits) {
            throw Error("Bitsets must have equal length.");
        }
        for (let row = 0; row < this.lengthArrayBits; ++row) {
            this.bits[row] |= other.bits[row];
        }
    }

    getBitRow(bit: number): number {
        return Math.floor(bit / Bitset.BITS_PER_ROW);
    }

    getIndexBitInRow(bit: number): number {
        return (bit % Bitset.BITS_PER_ROW);
    }
}
