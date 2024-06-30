
import java.util.ArrayList;
import java.util.BitSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Solution {
    
    private int numberOfNodes;
    
    public List<List<Integer>> getAncestors(int numberOfNodes, int[][] edges) {
        this.numberOfNodes = numberOfNodes;
        int[] incomingEdgesPerNode = createArrayIncomingEdgesPerNode(edges);
        List<Integer>[] directedAcyclicGraph = createDirectedAcyclicGraph(edges);
        
        return findAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph, incomingEdgesPerNode);
    }
    
    private List<List<Integer>> findAncestorsPerNodeWithTopologicalSort(List<Integer>[] directedAcyclicGraph, int[] incomingEdgesPerNode) {
        Queue<Integer> queue = createQueueNodesWithoutIncomingEdges(incomingEdgesPerNode);
        BitSet[] ancestors = new BitSet[numberOfNodes];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            ancestors[nodeID] = new BitSet(numberOfNodes);
        }
        
        while (!queue.isEmpty()) {
            int current = queue.poll();
            
            for (int next : directedAcyclicGraph[current]) {
                updateAncestors(current, next, ancestors);
                if (--incomingEdgesPerNode[next] == 0) {
                    queue.add(next);
                }
            }
        }
        return createListAllAncestorsPerNode(ancestors);
    }
    
    private int[] createArrayIncomingEdgesPerNode(int[][] edges) {
        int[] incomingEdgesPerNode = new int[numberOfNodes];
        for (int[] edge : edges) {
            int to = edge[1];
            ++incomingEdgesPerNode[to];
        }
        return incomingEdgesPerNode;
    }
    
    private List<Integer>[] createDirectedAcyclicGraph(int[][] edges) {
        List<Integer>[] directedAcyclicGraph = new ArrayList[numberOfNodes];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            directedAcyclicGraph[nodeID] = new ArrayList<>();
        }
        
        for (int[] edge : edges) {
            int from = edge[0];
            int to = edge[1];
            directedAcyclicGraph[from].add(to);
        }
        return directedAcyclicGraph;
    }
    
    private Queue<Integer> createQueueNodesWithoutIncomingEdges(int[] incomingEdgesPerNode) {
        Queue<Integer> queue = new LinkedList<>();
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            if (incomingEdgesPerNode[nodeID] == 0) {
                queue.add(nodeID);
            }
        }
        return queue;
    }
    
    private List<List<Integer>> createListAllAncestorsPerNode(BitSet[] ancestors) {
        List<List<Integer>> allAncestorsPerNode = new ArrayList<>();
        
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            List<Integer> ancestorsForCurrentNode = new ArrayList<>();
            
            for (int candidateAncestorID = 0; candidateAncestorID < numberOfNodes; ++candidateAncestorID) {
                if (ancestors[nodeID].get(candidateAncestorID)) {
                    ancestorsForCurrentNode.add(candidateAncestorID);
                }
            }
            allAncestorsPerNode.add(ancestorsForCurrentNode);
        }
        return allAncestorsPerNode;
    }
    
    private void updateAncestors(int current, int next, BitSet[] ancestors) {
        ancestors[next].or(ancestors[current]);
        ancestors[next].set(current);
    }
}
