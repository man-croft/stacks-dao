# The signer now uses RPC polling for block detection
```

### Core Signer Parameters

Defines the signer's identity and network participation:

```toml
[signer]
private_key = "your-private-key"  # 32 or 33-byte hex format
network = "mainnet"
deployer = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4"
```

### P2P Network Configuration

Controls how the signer communicates with other network participants:

```toml
[signer.p2p]
listen_on = ["tcp://0.0.0.0:4122"]
```

The signer operates on port 4122 by default and supports both TCP and QUIC protocols for peer communication. The signer will attempt QUIC connections first for improved performance, automatically falling back to TCP if QUIC is unavailable or blocked on the network.

### Reference configuration

See [here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/sbtc-signer/signer-config.toml.in).

## Set up your containers

See [here](https://github.com/stacks-network/sbtc/blob/main/docker/mainnet/docker-compose.yml) for a Docker Compose including all the required components.

{% hint style="warning" %}
When deploying with Docker, always use [immutable image tags](https://docs.docker.com/reference/cli/docker/image/pull/#pull-an-image-by-digest-immutable-identifier) - the image digests are provided below. Verify the attestation of these images using this [guide](https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds#verifying-artifact-attestations-with-the-github-cli).

We publish our images on [GitHub Container Registry](https://github.com/stacks-sbtc/sbtc/pkgs/container/sbtc).
{% endhint %}

## Monitoring

Monitoring Details TBD

## Troubleshooting

Troubleshooting Guide TBD


