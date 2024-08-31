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
- socket programming

### Picture of the internet
End-hosts are devices using the Internet.
- two types: servers and clients

What layers should be implemented on end hosts? Answer: every layer. Each layer depends on the ones below it.

*Access Networks* connect end hosts to Internet infrastructure. What ISPs do.
- a modem facilitates this; it connects your local WiFi network to the greater Internet

What layers should be implemented on access networks? Answer: only the Network and Link layers. The app and transport layers are implemented on the end-host by each specific app.

### Encapsulation
Data is broken into units at each layer. PDU: protocol data units.
- Transport header:
  - which app is the sender/receiver? I.E. what port
  - check for corruption
- Network header:
  - which computer is sender/receiver? I.E. what IP address
  - how long before we destroy this piece of data?
- Link header:
  - Which hardware (MAC) address?

Packets are data + transport header + network header. Frames are data + transport header + network header + link header. Frames are rewritten at every node. Packets are read and stay the same at every hop.

Network header needs:
- source IP
- destination IP
- Time to live (TTL): number of hops before you stop circulating
- in total, 20 bytes

At intermediate routers, the network header is examiend to identify the next router.

### End to End Principle
Motivating example: suppose Anna wants to send Bob a file through the Internet. It's bad if the file gets corrupted as it travels to Bob. Should we implement fault tolerance at the network layer or the transport layer?

Answer: implement at transport layer. Why? Bob must put the file back together and examine it for correctness anyway. So it is prohibitively expensive to do the same thing at the network layer.

The e2e principle says that functionality should be implemented at a lower layer iff:
- it can be done completely at that layer
- it can be done correctly
- you never have to repeat it at a higher layer

In this case, implementing in the network layer:
- doesn't reduce the App/Transport complexity
- increases network complexity
- imposes costs on all apps, not just file sharing

Question: Who benefits from e2e? Who benefits from violating it?

**For next week: Fate-sharing**
