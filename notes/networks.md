# Networks
My notes for the fall 2024 CS:3640 class at the University of Iowa

## Week 1
**What is a network?**
A collection of nodes connected by edges

Examples:
-highways, brain

Goals: resource sharing, communication

Nodes are computing devices, edges are transmission media
- cellular networks, WiFi, ethernets

A network has one type of transmission media

**The Internet**
The internet is not a network; the internet ties different networks together. The internet is a set of protocols to allow different networks to communicate.

Design goals for networks: speed, cost, reliability

Design goals for the Internet: interoperability, scalability, fault-tolerance

### Abstraction/Layering
Most networks share certain common operations. These operations lie in a hierarchy. With modular design, we could reuse these

Layers:
- Application
- Transport
- Network
- Link

Each operation goes in one layer, and each layer provides the operation as a service to the next layer

#### LINK
- connects end devices to network gateways
- connects network gateways to each other
- receives and sends bits over link hardware

#### NETWORK
- end-to-end (source to destination) service
- identifies the path for data to take
- uses the link layer as a service
- figures out the next hop for data
- doesn't care how the data gets there; link layer implements

Network layer protocol: Internet Protocol
Best effort service makes no guarantees that data will reach destination:
- uncorrupted
- in the order they are sent
- at all

Why? Every device implements the Internet Protocol, so it must be simple and have as few requirement as possible!

#### TRANSPORT
- implements reliable delivvery, in order delivery, congestion detection, congestion control
- sometimes you don't need these! each device chooses what it wants
- ex: TCP, UDP

#### APPLICATION
-networking logic
socket programming