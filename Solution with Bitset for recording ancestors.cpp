
#include <span>
#include <queue>
#include <vector>
#include <bitset>
using namespace std;

class Solution {

    static constexpr array<int,2> RANGE_OF_NODES = {1,1000};
    int numberOfNodes{};

public:
    vector<vector<int>> getAncestors(int numberOfNodes, const vector<vector<int>>& edges) {
        this->numberOfNodes = numberOfNodes;
        vector<int> incomingEdgesPerNode = createArrayIncomingEdgesPerNode(edges);
        vector<vector<int>> directedAcyclicGraph = createDirectedAcyclicGraph(edges);

        return findAncestorsPerNodeWithTopologicalSort(directedAcyclicGraph, incomingEdgesPerNode);
    }

private:
    vector<vector<int>> findAncestorsPerNodeWithTopologicalSort(span<const vector<int>> directedAcyclicGraph, span<int> incomingEdgesPerNode) const {
        queue<int> queue = createQueueNodesWithoutIncomingEdges(incomingEdgesPerNode);
        vector<bitset<RANGE_OF_NODES[1] + 1>> ancestors(numberOfNodes);

        while (!queue.empty()) {
            int current = queue.front();
            queue.pop();

            for (const auto& next : directedAcyclicGraph[current]) {
                updateAncestors(current, next, ancestors);

                if (--incomingEdgesPerNode[next] == 0) {
                    queue.push(next);
                }
            }
        }
        return createListAllAncestorsPerNode(ancestors);
    }

    vector<int> createArrayIncomingEdgesPerNode(span<const vector<int>> edges) const {
        vector<int> incomingEdgesPerNode(numberOfNodes);
        for (const auto& edge : edges) {
            int to = edge[1];
            ++incomingEdgesPerNode[to];
        }
        return incomingEdgesPerNode;
    }

    vector<vector<int>> createDirectedAcyclicGraph(span<const vector<int>> edges) const {
        vector<vector<int>> directedAcyclicGraph(numberOfNodes);

        for (const auto& edge : edges) {
            int from = edge[0];
            int to = edge[1];
            directedAcyclicGraph[from].push_back(to);
        }
        return directedAcyclicGraph;
    }

    queue<int> createQueueNodesWithoutIncomingEdges(span<const int> incomingEdgesPerNode) const {
        queue<int> queue;
        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            if (incomingEdgesPerNode[nodeID] == 0) {
                queue.push(nodeID);
            }
        }
        return queue;
    }

    vector<vector<int>> createListAllAncestorsPerNode(span<const bitset<RANGE_OF_NODES[1] + 1>> ancestors) const {
        vector<vector<int>> allAncestorsPerNode(numberOfNodes);

        for (int nodeID = 0; nodeID < numberOfNodes; ++nodeID) {
            vector<int> ancestorsForCurrentNode;

            for (int candidateAncestorID = 0; candidateAncestorID < numberOfNodes; ++candidateAncestorID) {
                if (ancestors[nodeID][candidateAncestorID]) {
                    ancestorsForCurrentNode.push_back(candidateAncestorID);
                }
            }
            allAncestorsPerNode[nodeID] = ancestorsForCurrentNode;
        }
        return allAncestorsPerNode;
    }

    void updateAncestors(int current, int next, span<bitset<RANGE_OF_NODES[1] + 1>> ancestors) const {
        ancestors[next] |= ancestors[current];
        ancestors[next].set(current);
    }
};
