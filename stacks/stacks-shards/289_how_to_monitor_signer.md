# How to Monitor Signer

We will use [Grafana Cloud](https://grafana.com/) to observe and monitor both the Signer and its corresponding Stacks node.

## Requirements

Grafana's application observability docs have a [great quick-start](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/). We will use:

* Grafana Cloud to collect metrics and visualize them.
* Grafana Alloy, on the Signer host, to push the metrics.

### Creating a Grafana Cloud account

Before we begin, create a [Grafana Cloud](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/grafana-cloud/) account (they offer a free tier that you can use).

Once done, access your dashboard and follow these steps:

{% stepper %}
{% step %}

#### Add a new connection

Click on "Connections", then "Add new connection".
{% endstep %}

{% step %}

#### Select Hosted Prometheus metrics

Select "Hosted Prometheus metrics".
{% endstep %}

{% step %}

#### Choose via Grafana Alloy

Select "Via Grafana Alloy", then on step 2 choose "Run Grafana Alloy" to generate an API token.
{% endstep %}
{% endstepper %}

Note the token `GCLOUD_RW_API_KEY` and the parameters `GCLOUD_HOSTED_METRICS_URL` and `GCLOUD_HOSTED_METRICS_ID`; we will use them later.

### Configuring the Signer and the Stacks node

Ensure both your Signer configuration and your node configuration include the following lines:

```toml
