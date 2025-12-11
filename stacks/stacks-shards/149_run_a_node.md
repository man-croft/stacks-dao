# Run a Node

<figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2Fgit-blob-b80d52e8b70eb9c3e790a912afacb358bdb87830%2FFrame%20316126262.jpg?alt=media" alt=""><figcaption></figcaption></figure>

This section walks through the technical setup steps required to run Stacks network nodes and miners. There are multiple options available for running a node, including Docker, Digital Ocean, and Render.

Running your own Stacks node is a great way to increase the decentralization of the ecosystem and avoid relying on third-party centralized providers.

## Minimum viable requirements

While you can run a node using these specs, it's recommended to assign more than the minimum for better performance.

{% hint style="warning" %}

* ⚠️ docker-compose version `2.2.2` or greater is **required** — <https://docs.docker.com/compose/install/>
* **8 GB memory** if running only a Stacks node
* **16 GB memory** if running Stacks + Bitcoin node
* **2 vCPU**
* **1 TB disk** for Stacks node
* **1 TB disk** for Bitcoin node
  {% endhint %}


