# Ensure no stacks-node processes are running
ps aux | grep stacks-node
```

{% endstep %}
{% endstepper %}

### Overview of Snapshot Methods

There are two primary approaches for creating Stacks chainstate snapshots:

1. **File-based snapshots** - compress up the chainstate folder
2. **Volume snapshots** - snapshot the entire disk/volume

Each method has its advantages depending on your infrastructure setup and recovery requirements.

### File-Based Snapshots

This method involves compressing the chainstate directory and storing it locally, or uploading to a cloud storage service.

#### Steps (see [Example Automation Code section](#example-automation-code) below)

1. **Stop the Stacks node gracefully**
2. **Create compressed archive**
3. **Upload to cloud storage or save it locally**
4. **Restart the Stacks node**

### Volume-Based Snapshots

This method creates block-level snapshots of the entire storage volume containing the chainstate. Different filesystems have different tools:

* **ZFS**: Use `zfs snapshot` - [OpenZFS documentation](https://openzfs.github.io/openzfs-docs/man/v2.3/8/zfs-snapshot.8.html)
* **XFS**: Use `xfsdump` - [XFS documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/storage_administration_guide/xfsbackuprestore)
* **ext4**: Use LVM snapshots - [LVM guide](https://kerneltalks.com/disk-management/how-to-guide-lvm-snapshot/)

You can also use cloud provider snapshot tools (AWS EBS, Azure Disk, GCP Persistent Disk).

#### Steps

1. **Stop the Stacks node gracefully**
2. **Create volume snapshot** using ZFS or cloud provider tools
3. **Restart the Stacks node**

### How to Restore

After restoring the chainstate, you can check for corruption by waiting for a few blocks to download and ensuring the node syncs correctly.

#### From File Snapshots

1. Stop the Stacks node
2. Download and extract the snapshot
3. Replace the chainstate directory
4. Restart the node

#### From Volume Snapshots

1. Stop the Stacks node
2. Create a new volume from the snapshot
3. Attach the volume to your instance
4. Update mount points if necessary
5. Restart the node

### Example Automation Code

Here's a simple script that handles both file and volume snapshots on AWS.

{% code title="snapshot.sh" %}

```
#!/bin/bash
set -euo pipefail

