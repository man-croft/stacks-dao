# Snapshot the Chainstate

{% hint style="info" %}
**Intended audience**: Solo Stackers, Stacking pool operators, and node operators who need to create reliable chainstate backups.
{% endhint %}

Regular snapshots of your Stacks chainstate help you recover quickly when things go wrong. This guide shows you how to create and manage chainstate snapshots properly.

{% hint style="warning" %}
**Critical**: Always shut down your Stacks node properly before creating a snapshot. Creating snapshots while the node is running will result in corrupted chainstate data.
{% endhint %}

### Shutdown Procedure

To produce a valid chainstate backup, the node should be stopped gracefully before making a copy. The following steps will correctly shutdown the Stacks node:

{% stepper %}
{% step %}

#### Check node status before shutdown

```bash
