# Create EBS volume snapshot
snapshot_ebs() {
  echo "Creating EBS snapshot of $EBS_VOLUME_ID..."
  
  # Generate description with timestamp
  TIMESTAMP=$(date +"%Y%m%d")
  DESC="Stacks Node Snapshot - $TIMESTAMP"
  
  # Create snapshot with tags
  SNAPSHOT_ID=$(aws ec2 create-snapshot \
                  --volume-id "$EBS_VOLUME_ID" \
                  --description "$DESC" \
                  --tag-specifications "ResourceType=snapshot,Tags=[{Key=Name,Value=Stacks Snapshot},{Key=type,Value=chainstate}]" \
                  --query 'SnapshotId' --output text)

  echo "EBS Snapshot ID: $SNAPSHOT_ID"
}

