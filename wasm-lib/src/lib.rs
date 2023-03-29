mod utils;

use wasm_bindgen::prelude::*;
use petgraph::graph::Graph;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-lib!");
}

#[wasm_bindgen]
pub struct SocialNetwork {
    graph: Graph<String, u32>
}

#[wasm_bindgen]
impl SocialNetwork {
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self { graph: Graph::new() }
    }

    pub fn add_user(&mut self, user: String) {
        self.graph.add_node(user);
    } 

    pub fn user_count(&self) -> usize {
        self.graph.node_count()
    }

    pub fn contains_user(&self, user: String) -> bool {
        self.graph.node_weights().any(|x| x == &user)
    }
}