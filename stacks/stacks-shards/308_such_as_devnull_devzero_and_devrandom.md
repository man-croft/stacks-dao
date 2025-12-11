# such as /dev/null, /dev/zero and /dev/random.
PrivateDevices=true

[Install]
WantedBy=multi-user.target
```

{% endcode %}

Read more about systemd hardening: <https://www.ctrl.blog/entry/systemd-service-hardening.html>
{% endstep %}

{% step %}

#### Restrict access to unnecessary ports and protocols

The stacks-signer requires outbound TCP access to the stacks-node, but typically no other inbound network exposure is needed (except for OS updates and administrative access). Restrict network access to the minimum required for operation.
{% endstep %}

{% step %}

#### Harden the operating system

A few practical OS hardening measures:

* Run stacks-signer as an unprivileged user (not root).
* Set permissions on the stacks-signer key/config to be readable only by the user running the stacks-signer process, e.g.:
  * sudo chmod 600 signer/signer-config.toml
* Require public-key authentication for SSH and disable SSH root login.
* Consider running sshd on a non-standard port to reduce noise from port scanners and credential-stuffing attacks.
  {% endstep %}
  {% endstepper %}

This post outlines essential operational security best practices for Stacks Signers, key actors in the Nakamoto architecture.

By implementing these strategies, signer operators can effectively mitigate risks and maintain the security and reliability of the Stacks network.


