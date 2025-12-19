const express = require("express");
const app = express();
const PORT = 3000;


// Random IP Generator 
function generateRandomIP() {
return Array.from({ length: 4 }, () =>
Math.floor(Math.random() * 256)
).join(".");
}


// List of Nodes 
let nodes = ["Node-A", "Node-B", "Node-C"];


// Node Health 
const nodeHealth = {
"Node-A": true,
"Node-B": true,
"Node-C": true
};

// Get Healthy Nodes Only
function getHealthyNodes() {
  return nodes.filter(node => nodeHealth[node]);
}



// Metrics
const metrics = {
totalRequests: 0,
perNode: {}
};


// Simple Hash Function
function hashIP(ip) {
let hash = 0;
for (let char of ip) {
hash += char.charCodeAt(0);
}
return hash;
}


// Identify Node 
function identifyNode(ip, selectedNode) {
console.log(`Incoming IP: ${ip} → Routed to: ${selectedNode}`);
}


// Load Balancer 
function LoadBalancer(ip) {
  const healthyNodes = getHealthyNodes();

  if (healthyNodes.length === 0) {
    console.log("No healthy nodes available");
    return null;
  }

  const hash = hashIP(ip);
  const index = hash % healthyNodes.length;
  const selectedNode = healthyNodes[index];

  identifyNode(ip, selectedNode);

  metrics.totalRequests++;
  metrics.perNode[selectedNode] =
    (metrics.perNode[selectedNode] || 0) + 1;

  return selectedNode;
}



// Simulate Traffic 
function simulateTraffic(requestCount = 5) {
for (let i = 0; i < requestCount; i++) {
const ip = generateRandomIP();
LoadBalancer(ip);
}
}



// RATE LIMITING 
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequests = 5;

// In-memory store
const rateLimitMap = {};

function rateLimiter(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const currentTime = Date.now();

  if (!rateLimitMap[ip]) {
    rateLimitMap[ip] = {
      count: 1,
      startTime: currentTime
    };
    return next();
  }

  const elapsed = currentTime - rateLimitMap[ip].startTime;

  // Reset window after 1 minute
  if (elapsed > rateLimitWindowMs) {
    rateLimitMap[ip] = {
      count: 1,
      startTime: currentTime
    };
    return next();
  }

  // Block if limit exceeded
  if (rateLimitMap[ip].count >= maxRequests) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests. Try again later."
    });
  }

  rateLimitMap[ip].count++;
  next();
}



// EXPRESS ROUTES

// Route a request (main API)
app.get("/route", rateLimiter , (req, res) => {
const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
const node = LoadBalancer(ip);


res.json({
ip,
routedTo: node
});
});


// Metrics endpoint
app.get("/metrics", (req, res) => {
res.json(metrics);
});


// Simulate traffic via API
app.get("/simulate/:count", (req, res) => {
const count = parseInt(req.params.count) || 5;
simulateTraffic(count);
res.json({ message: `${count} requests simulated` });
});


app.listen(PORT, () => {
console.log(`Load Balancer API running on port ${PORT}`);

});
