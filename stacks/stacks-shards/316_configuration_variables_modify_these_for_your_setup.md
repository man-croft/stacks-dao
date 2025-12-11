# Configuration variables - modify these for your setup
SERVICE_NAME="stacks-node"                   # systemd service name
SNAPSHOT_DIR="/var/stacks/mainnet"           # path to chainstate directory
SNAPSHOT_BASE="/tmp"                         # temporary directory for archives
EBS_VOLUME_ID="vol-1234567890abcdef0"        # EBS volume ID containing chainstate
S3_BUCKET="s3://my-stacks-snapshots"         # S3 bucket for archive storage
SNAPSHOT_TYPE="archive"                      # Options: ebs, archive, or both

