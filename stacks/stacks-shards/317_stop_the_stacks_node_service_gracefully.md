# Stop the Stacks node service gracefully
stop_service() {
  echo "Stopping $SERVICE_NAME..."
  sudo systemctl stop "$SERVICE_NAME"
}

