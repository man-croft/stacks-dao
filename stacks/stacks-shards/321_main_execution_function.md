# Main execution function
main() {
  case "$SNAPSHOT_TYPE" in
    ebs)
      stop_service
      snapshot_ebs
      start_service
      ;;
    archive)
      stop_service
      snapshot_archive
      start_service
      ;;
    both)
      stop_service
      snapshot_archive  # Create archive first
      snapshot_ebs      # Then EBS snapshot
      start_service
      ;;
    *)
      echo "Invalid snapshot type: $SNAPSHOT_TYPE. Available options: ebs, archive, or both."
      exit 1
      ;;
  esac
  
  echo "Snapshot process completed successfully!"
}

