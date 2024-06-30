
package main

import (
    "container/list"
    "fmt"
    "math/big"
)

var numberOfNodes int

func getAncestors(totalNodes int, edges [][]int) [][]int {
    numberOfNodes = totalNodes
    incomingEdgesPerNode := createArrayIncomingEdgesPerNode(edges)
    directedAcyclicGraph := createDirectedAcyclicGraph(edges)

    return findAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph, incomingEdgesPerNode)
}

func findAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph [][]int, incomingEdgesPerNode []int) [][]int {
    queue := createQueueNodesWithoutIncomingEdges(incomingEdgesPerNode)
    ancestors := make([]big.Int, numberOfNodes)
    for nodeID := 0; nodeID < numberOfNodes; nodeID++ {
        ancestors[nodeID] = big.Int{}
    }

    for queue.Len() > 0 {
        current := queue.Front().Value.(int)
        queue.Remove(queue.Front())

        for _, next := range directedAcyclicGraph[current] {
            updateAncestors(current, next, ancestors)
            incomingEdgesPerNode[next]--
            if incomingEdgesPerNode[next] == 0 {
                queue.PushBack(next)
            }
        }
    }
    return createListAllAncestorsPerNode(ancestors)
}

func createArrayIncomingEdgesPerNode(edges [][]int) []int {
    incomingEdgesPerNode := make([]int, numberOfNodes)
    for _, edge := range edges {
        to := edge[1]
        incomingEdgesPerNode[to]++
    }
    return incomingEdgesPerNode
}

func createDirectedAcyclicGraph(edges [][]int) [][]int {
    directedAcyclicGraph := make([][]int, numberOfNodes)
    for nodeID := 0; nodeID < numberOfNodes; nodeID++ {
        directedAcyclicGraph = append(directedAcyclicGraph, []int{})
    }

    for _, edge := range edges {
        from := edge[0]
        to := edge[1]
        directedAcyclicGraph[from] = append(directedAcyclicGraph[from], to)
    }
    return directedAcyclicGraph
}

func createQueueNodesWithoutIncomingEdges(incomingEdgesPerNode []int) *list.List {
    queue := list.New()
    for nodeID := 0; nodeID < numberOfNodes; nodeID++ {
        if incomingEdgesPerNode[nodeID] == 0 {
            queue.PushBack(nodeID)
        }
    }
    return queue
}

func createListAllAncestorsPerNode(ancestors []big.Int) [][]int {
    allAncestorsPerNode := make([][]int, numberOfNodes)

    for nodeID := 0; nodeID < numberOfNodes; nodeID++ {
        ancestorsForCurrentNode := []int{}

        for candidateAncestorID := 0; candidateAncestorID < numberOfNodes; candidateAncestorID++ {
            if ancestors[nodeID].Bit(candidateAncestorID) == 1 {
                ancestorsForCurrentNode = append(ancestorsForCurrentNode, candidateAncestorID)
            }
        }
        allAncestorsPerNode[nodeID] = ancestorsForCurrentNode
    }
    return allAncestorsPerNode
}

func updateAncestors(current int, next int, ancestors []big.Int) {
    ancestors[next].Or(&ancestors[next], &ancestors[current])
    ancestors[next].SetBit(&ancestors[next], current, 1)
}
