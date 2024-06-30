
import java.util.*
import kotlin.collections.ArrayList

class Solution {

    private var numberOfNodes: Int = 0

    fun getAncestors(numberOfNodes: Int, edges: Array<IntArray>): List<List<Int>> {
        this.numberOfNodes = numberOfNodes
        val incomingEdgesPerNode = createArrayIncomingEdgesPerNode(edges)
        val directedAcyclicGraph = createDirectedAcyclicGraph(edges)

        return findAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph, incomingEdgesPerNode)
    }

    private fun findAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph: ArrayList<ArrayList<Int>>, incomingEdgesPerNode: IntArray): List<List<Int>> {
        val queue = createQueueNodesWithoutIncomingEdges(incomingEdgesPerNode)
        val ancestors = ArrayList<BitSet>(numberOfNodes)
        for (nodeID in 0..<numberOfNodes) {
            ancestors.add(BitSet(numberOfNodes))
        }

        while (!queue.isEmpty()) {
            val current = queue.poll()

            for (next in directedAcyclicGraph[current]) {
                updateAncestors(current, next, ancestors)
                if (--incomingEdgesPerNode[next] == 0) {
                    queue.add(next)
                }
            }
        }
        return createListAllAncestorsPerNode(ancestors)
    }

    private fun createArrayIncomingEdgesPerNode(edges: Array<IntArray>): IntArray {
        val incomingEdgesPerNode = IntArray(numberOfNodes)
        for (edge in edges) {
            val to = edge[1]
            ++incomingEdgesPerNode[to]
        }
        return incomingEdgesPerNode
    }

    private fun createDirectedAcyclicGraph(edges: Array<IntArray>): ArrayList<ArrayList<Int>> {
        val directedAcyclicGraph = ArrayList<ArrayList<Int>>(numberOfNodes)
        for (nodeID in 0..<numberOfNodes) {
            directedAcyclicGraph.add(ArrayList<Int>())
        }

        for ((from, to) in edges) {
            directedAcyclicGraph[from].add(to)
        }
        return directedAcyclicGraph
    }

    private fun createQueueNodesWithoutIncomingEdges(incomingEdgesPerNode: IntArray): Queue<Int> {
        val queue = LinkedList<Int>()
        for (nodeID in 0..<numberOfNodes) {
            if (incomingEdgesPerNode[nodeID] == 0) {
                queue.add(nodeID)
            }
        }
        return queue
    }

    private fun createListAllAncestorsPerNode(ancestors: ArrayList<BitSet>): List<List<Int>> {
        val allAncestorsPerNode = ArrayList<List<Int>>()

        for (nodeID in 0..<numberOfNodes) {
            val ancestorsForCurrentNode = ArrayList<Int>()

            for (candidateAncestorID in 0..<numberOfNodes) {
                if (ancestors[nodeID][candidateAncestorID]) {
                    ancestorsForCurrentNode.add(candidateAncestorID)
                }
            }
            allAncestorsPerNode.add(ancestorsForCurrentNode)
        }
        return allAncestorsPerNode
    }

    private fun updateAncestors(current: Int, next: Int, ancestors: ArrayList<BitSet>) {
        ancestors[next].or(ancestors[current])
        ancestors[next].set(current)
    }
}
