# Create compressed archive and upload to S3
snapshot_archive() {
  echo "Creating archive snapshot..."
  
  # Generate timestamp and version info for filename
  TIMESTAMP=$(date +"%Y%m%d")
  DIR_NAME=$(basename "$SNAPSHOT_DIR")
  VERSION=$(stacks-node version 2>&1 | tail -n 1 | awk '{print $2}')
  DEST="$SNAPSHOT_BASE/$DIR_NAME-$VERSION-$TIMESTAMP.tar.zst"
  
  # Create compressed archive (using zstd for better compression)
  tar -cf - -C "$(dirname $SNAPSHOT_DIR)" "$(basename $SNAPSHOT_DIR)" | pzstd -o "$DEST"
  echo "Archive created at: $DEST"

  # Upload to S3
  echo "Uploading to S3..."
  aws s3 cp "$DEST" "$S3_BUCKET/"
  echo "S3 upload complete: $S3_BUCKET/$(basename "$DEST")"
  
  # Clean up local archive
  rm "$DEST"
}

