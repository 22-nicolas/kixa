import NodeCache from "node-cache";

const cache = new NodeCache({
    checkperiod: 120
});

export default cache;