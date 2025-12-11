# Verify if the node is responsive
curl http://localhost:20443/v2/info
```

{% endstep %}

{% step %}

#### Initiate graceful shutdown

* For Docker: `docker stop stacks-node` (allows at least 10 seconds for graceful shutdown)
* For systemd: `systemctl stop stacks-node`
* For manual processes:

```bash
kill $(ps aux | grep stacks-node | grep -v grep | awk '{print $2}')
```

{% endstep %}

{% step %}

#### Verify complete shutdown

```bash
