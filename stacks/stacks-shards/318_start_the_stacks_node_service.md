# Start the Stacks node service
start_service() {
  echo "Starting $SERVICE_NAME..."
  sudo systemctl start "$SERVICE_NAME"
}

