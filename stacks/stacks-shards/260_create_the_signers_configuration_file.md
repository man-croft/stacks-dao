# Create the signer's configuration file
cat <<EOF> ~/stacks-signer/signer-config.toml
node_host = "127.0.0.1:20443"
endpoint = "127.0.0.1:30000"
network = "testnet"
db_path = "$HOME/stacks-signer/data/signer.sqlite"
auth_password = "$AUTH_TOKEN"
stacks_private_key = "$PRIVATE_KEY"
metrics_endpoint = "127.0.0.1:9154"
block_proposal_timeout_ms = 180000
EOF
```

{% endtab %}
{% endtabs %}

**Verify the setup**

To ensure the signer has been set up correctly, you can run the following commands:

```bash
