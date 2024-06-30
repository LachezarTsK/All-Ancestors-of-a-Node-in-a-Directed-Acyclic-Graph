
using System;
using System.Collections.Generic;

public class Solution
{
    int numberOfNodes;

    public IList<IList<int>> GetAncestors(int numberOfNodes, int[][] edges)
    {
        this.numberOfNodes = numberOfNodes;
        int[] incomingEdgesPerNode = CreateArrayIncomingEdgesPerNode(edges);
        IList<int>[] directedAcyclicGraph = CreateDirectedAcyclicGraph(edges);

        return FindAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph, incomingEdgesPerNode);
    }

    private IList<IList<int>> FindAncestorsPerNodeWithTopologicalSort(IList<int>[] directedAcyclicGraph, int[] incomingEdgesPerNode)
    {
        Queue<int> queue = CreateQueueNodesWithoutIncomingEdges(incomingEdgesPerNode);
        BitArray[] ancestors = new BitArray[numberOfNodes];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID)
        {
            ancestors[nodeID] = new BitArray(numberOfNodes);
        }

        while (queue.Count > 0)
        {
            int current = queue.Dequeue();

            foreach (int next in directedAcyclicGraph[current])
            {
                UpdateAncestors(current, next, ancestors);
                if (--incomingEdgesPerNode[next] == 0)
                {
                    queue.Enqueue(next);
                }
            }
        }
        return CreateListAllAncestorsPerNode(ancestors);
    }

    private int[] CreateArrayIncomingEdgesPerNode(int[][] edges)
    {
        int[] incomingEdgesPerNode = new int[numberOfNodes];
        foreach (int[] edge in edges)
        {
            int to = edge[1];
            ++incomingEdgesPerNode[to];
        }
        return incomingEdgesPerNode;
    }

    private IList<int>[] CreateDirectedAcyclicGraph(int[][] edges)
    {
        IList<int>[] directedAcyclicGraph = new List<int>[numberOfNodes];
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID)
        {
            directedAcyclicGraph[nodeID] = new List<int>();
        }

        foreach (int[] edge in edges)
        {
            int from = edge[0];
            int to = edge[1];
            directedAcyclicGraph[from].Add(to);
        }
        return directedAcyclicGraph;
    }

    private Queue<int> CreateQueueNodesWithoutIncomingEdges(int[] incomingEdgesPerNode)
    {
        Queue<int> queue = new Queue<int>();
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID)
        {
            if (incomingEdgesPerNode[nodeID] == 0)
            {
                queue.Enqueue(nodeID);
            }
        }
        return queue;
    }

    private IList<IList<int>> CreateListAllAncestorsPerNode(BitArray[] ancestors)
    {
        IList<IList<int>> allAncestorsPerNode = new List<IList<int>>();

        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID)
        {
            List<int> ancestorsForCurrentNode = new List<int>();

            for (int candidateAncestorID = 0; candidateAncestorID < numberOfNodes; ++candidateAncestorID)
            {
                if (ancestors[nodeID][candidateAncestorID])
                {
                    ancestorsForCurrentNode.Add(candidateAncestorID);
                }
            }
            allAncestorsPerNode.Add(ancestorsForCurrentNode);
        }
        return allAncestorsPerNode;
    }

    private void UpdateAncestors(int current, int next, BitArray[] ancestors)
    {
        ancestors[next].Or(ancestors[current]);
        ancestors[next].Set(current, true);
    }
}
