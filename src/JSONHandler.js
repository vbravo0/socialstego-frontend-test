// Idea sacada de https://stackoverflow.com/questions/58049423/load-tensorflowjs-from-json-object-not-json
// Formato de modelArtifacts aca https://unpkg.com/browse/@tensorflow/tfjs-core@3.3.0/src/io/types.ts

class JSONHandler {
    constructor(jsonString) {
        this.jsonString = jsonString;
    }

    async load() {
        return JSON.parse(this.jsonString);
    }
}

export default JSONHandler;