import Graph from "react-vis-network-graph";
import * as flickr from '../api/flickrAPI'
import { useEffect, useState } from 'react';
import init, { SocialNetwork } from "wasm-lib";

const Network = ({ username }) => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [socialNetwork, setSocialNetwork] = useState();

  const bfs = async (userID) => {
    let graph = { nodes: [], edges: [] }
    let visited = [userID]
    let queue = [userID]
    const MAX_ITERATIONS = 20;
    const MAX_NEIGHBOURS = 5;
    let i = 0;
    graph.nodes.push({ id: userID, label: userID, color: '#FF0000' })

    while (queue && i < MAX_ITERATIONS) {
      const node = queue.shift()
      console.log(`pop ${node}`)

      const neighbours = await flickr.getFavoriteUserIDs(node);

      const index = i;
      neighbours.slice(0, MAX_NEIGHBOURS).forEach(async (neighbour, j) => {
        if (visited.includes(neighbour)) {
          graph.edges.push({ from: neighbour, to: node, color: '#FF0000' })
        } else {
          visited.push(neighbour)
          queue.push(neighbour)
          const color = parseInt((255 / MAX_ITERATIONS) * index);
          console.log(color);
          graph.nodes.push({ id: neighbour, label: neighbour, color: `rgb(0, 100, ${color})` })
          graph.edges.push({ from: node, to: neighbour })
        }
      })
      i++
    }
    console.log(graph)
    return graph
  }

  useEffect(() => {
    const f = async () => {
      if (!username) { return }
      const userID = await flickr.getUserID(username);
      const graph = await bfs(userID)
      setGraph(graph)
    }
    f()
  }, [username])

  useEffect(() => {
    if (!graph) { return }
    init().then(() => {
      const socialNetwork = SocialNetwork.new();
      graph.nodes.forEach((x, i) => {
        socialNetwork.add_user(x.id)
      })
      setSocialNetwork(socialNetwork)
    }).catch(e => console.log(`Error al cargar SocialNetwork WASM: ${e}`));
  }, [graph])
  

  // Ejemplo de como debe estar graph
  // const graph = {
  //   nodes: [Uncaught Error: A duplicate id was found in the parameter array.
  //     { id: 1, label: "Node 1", title: "node 1 tootip text" },
  //     { id: 2, label: "Node 2", title: "node 2 tootip text" },
  //     { id: 3, label: "Node 3", title: "node 3 tootip text" },
  //     { id: 4, label: "Node 4", title: "node 4 tootip text" },
  //     { id: '5', label: "Node 5", title: "node 5 tootip text" }
  //   ],
  //   edges: [
  //     { from: 1, to: 2 },
  //     { from: 1, to: 3 },
  //     { from: 2, to: 4 },
  //     { from: 2, to: '5' }
  //   ]
  // };

  const options = {
    edges: {
      color: "#000000"
    },
    height: "500px"
  };

  return (
    <div>
      Cantidad de usuarios red Rust/WASM: { socialNetwork && socialNetwork.user_count() }
      {!graph ? <h1>cargando...</h1> :
        <Graph
          graph={graph}
          options={options}
        />
      }
    </div>
  )
};

export default Network;