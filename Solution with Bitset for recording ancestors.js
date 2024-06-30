
/**
 * @param {number} numberOfNodes
 * @param {number[][]} edges
 * @return {number[][]}
 */
var getAncestors = function (numberOfNodes, edges) {
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

/**
 * @param {number} node
 * @param {number[][]} directedAcyclicGraph
 * @param {number[]} incomingEdgesPerNode
 * @return {void}
 */
function findAncestorsPerNodeWithTopologicalSort(node, directedAcyclicGraph, incomingEdgesPerNode) {
    for (let next of directedAcyclicGraph[node]) {
        updateAncestors(node, next);
        if (--incomingEdgesPerNode[next] === 0) {
            findAncestorsPerNodeWithTopologicalSort(next, directedAcyclicGraph, incomingEdgesPerNode);
        }
    }
}

/**
 * @param {number[][]} edges
 * @return {number[]}
 */
function createArrayIncomingEdgesPerNode(edges) {
    const incomingEdgesPerNode = new Array(this.numberOfNodes).fill(0);
    for (let edge of edges) {
        let to = edge[1];
        ++incomingEdgesPerNode[to];
    }
    return incomingEdgesPerNode;
}

/**
 * @param {number[][]} edges
 * @return {number[][]}
 */
function createDirectedAcyclicGraph(edges) {
    const directedAcyclicGraph = Array.from(new Array(this.numberOfNodes), () => new Array());
    for (let [from, to] of edges) {
        directedAcyclicGraph[from].push(to);
    }
    return directedAcyclicGraph;
}

/**
 * @param {number[]} incomingEdgesPerNode
 * @return {number[]}
 */
function createListNodesWithoutIncomingEdges(incomingEdgesPerNode) {
    const list = new Array();
    for (let nodeID = 0; nodeID < this.numberOfNodes; ++nodeID) {
        if (incomingEdgesPerNode[nodeID] === 0) {
            list.push(nodeID);
        }
    }
    return list;
}

/**
 * @return {number[][]}
 */
function createListAllAncestorsPerNode() {
    const allAncestorsPerNode = Array(this.numberOfNodes);

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

/**
 * @param {number} current
 * @param {number} next
 * @return {void}
 */
function updateAncestors(current, next) {
    this.ancestors[next].or(this.ancestors[current]);
    this.ancestors[next].setBit(current, true);
}

/*
 Customized Bitset:
 JavaScript does not have a Bitset, so instead of importing some from external libraries, I created one here. 
 The only Bitset operations needed for the application are bitwiseOr between two Bitsets and a method 
 to set a single bit, thus, to keep it simple, only these two methods for bitwise operations are implemented. 
 In addition, two helper methods for getting the row and index of a bit are also implemented.  
 */
class Bitset {

    // Setting BITS_PER_ROW too high will require each row to have a BigInt instead of a number.
    // Therefore, to keep it simple and have a number for each row, the value is distributed among more rows.
    static BITS_PER_ROW = 30;

    /**
     * @param {number} totalBits
     */
    constructor(totalBits) {
        this.lengthArrayBits = Math.ceil(totalBits / Bitset.BITS_PER_ROW);
        this.bits = new Array(this.lengthArrayBits).fill(0);
    }

    /**
     * @param {number} bit
     * @param {boolean} one
     * @return {void}
     */
    setBit(bit, one) {
        let row = this.getBitRow(bit);
        let indexInRow = this.getIndexBitInRow(bit);

        if (one) {
            this.bits[row] |= (1 << indexInRow);
        } else {
            let current = ~(1 << indexInRow);
            this.bits[row] &= current;
        }
    }

    /**
     * @param {Bitset} other
     * @return {void}
     */
    or(other) {
        if (other.lengthArrayBits !== this.lengthArrayBits) {
            throw Error("Bitsets must have equal length.");
        }
        for (let row = 0; row < this.lengthArrayBits; ++row) {
            this.bits[row] |= other.bits[row];
        }
    }

    /**
     * @param {number} bit
     * @return {number}
     */
    getBitRow(bit) {
        return Math.floor(bit / Bitset.BITS_PER_ROW);
    }

    /**
     * @param {number} bit
     * @return {number}
     */
    getIndexBitInRow(bit) {
        return (bit % Bitset.BITS_PER_ROW);
    }
}
