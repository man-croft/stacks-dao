# Adjust to 0.0.0.0:9153 if running in Docker.
prometheus_bind = "127.0.0.1:9153"
```

The pre-compiled binaries already include the monitoring feature. However, if you are compiling the application binaries yourself, remember to enable the Cargo feature `monitoring_prom` while building them, for example:

```bash
cargo build --features monitoring_prom,slog_json --release
```

Once both binaries are running with the updated configuration, you can peek at the metrics being exposed:

```bash
curl 127.0.0.1:30001/metrics

