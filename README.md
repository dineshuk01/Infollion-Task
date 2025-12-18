# Load Balancer using Consistent Hashing (Node.js)

This project is a **simple, beginner-friendly implementation of a load balancer** built using **Node.js and Express**. 

The focus of this project is **clarity, correctness, and real-world understanding**, rather than over-engineering.

---

##  What is this project about?

In real systems, a load balancer decides **which backend server (node)** should handle an incoming request. If this decision is random, it can cause problems like:

* Same user hitting different servers
* Session data getting lost
* Poor scalability

This project fixes that problem by:

* Making sure the **same IP always goes to the same node**
* Handling **node failures gracefully**
* Keeping everything **in-memory and easy to understand**

---

##  How the Load Balancer Works (In Simple Terms)

1. A request comes in with an IP address
2. The IP is converted into a number using a simple hash function
3. That number decides which node should handle the request
4. If the selected node is unhealthy, traffic is redirected to a healthy node
5. Every request is logged and counted

This approach is inspired by **consistent hashing**, which is commonly used in real-world systems.

---

![WorkFlow](Infllion-Task/Load-Balancer Workflow.png)


##  Features

* IP-based consistent routing (same IP → same node)
* Node health checks with fallback
* Request logging in console
* Simple metrics dashboard
* Express-based API
* Fully in-memory (no database)
* Rate Limiting Logic

---

---

## ▶️ How to Run This Project Locally

### 1️⃣ Prerequisites

* Node.js (v16 or above recommended)
* npm (comes with Node.js)

Check installation:

```bash
node -v
npm -v
```

---

### 2️⃣ Install Dependencies

Inside the project folder, run:

```bash
npm init -y
npm install express
```

---

### 3️⃣ Start the Server

```bash
node server.js
```

If everything is correct, you will see:

```
Load Balancer API running on port 3000
```

---

##  Testing the API (Postman / Browser)

### ➤ Route a Request

```
GET http://localhost:3000/route
```

Optional header (to simulate same client):

```
X-Forwarded-For: 10.0.0.1
```

Response example:

```json
{
  "ip": "10.0.0.1",
  "routedTo": "Node-B"
}
```

---

### ➤ View Metrics

```
GET http://localhost:3000/metrics
```

Response example:

```json
{
  "totalRequests": 5,
  "perNode": {
    "Node-A": 2,
    "Node-B": 3
  }
}
```

---

### ➤ Simulate Traffic

```
GET http://localhost:3000/simulate/10
```

This will generate random IPs and route them internally.

---

##  Important Notes

* Everything runs **in-memory** 
* No concurrency handling 
* Logic is intentionally kept simple and readable

---

##  Why Consistent Hashing?

Consistent hashing helps ensure that:

* Same IP is routed to the same node
* When nodes change, only a small portion of traffic is affected
* System remains stable while scaling

This is why it is widely used in systems like **load balancers, caches, and distributed systems**.

---

## Rate Limiting 

To prevent a single client from overwhelming the system, a basic rate limiting mechanism is implemented.

How it works:

* Each IP is allowed a fixed number of requests (for example, 5)

* The limit applies within a fixed time window (for example, 1 minute)

* If the limit is exceeded, the API responds with HTTP 429 – Too Many Requests

* The counter automatically resets after the time window

---

