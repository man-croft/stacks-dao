# Auth Id should be a random string less than 14 characters
stacks-signer generate-stacking-signature \
  --method stack-stx \
  --max-amount 1000000000000 \
  --auth-id 71948271489 \
  --period 1 \
  --reward-cycle 100 \
  --pox-address bc1... \
  --config ./config.toml \
  --json
```

These arguments match those described in section [Overview of signer keys and signatures](#overview-of-signer-keys-and-signatures), with the addition of:

* `--json`, to optionally output the resulting signature in JSON

You can use the following command to generate a random `32` bit integer as `auth-id`:

```bash
python3 -c 'import secrets; print(secrets.randbits(32))'
```

Once the `generate-stacking-signature` command is run, the CLI will output a JSON:

```json
{"authId":"1234","maxAmount":"12345","method":"stack-stx","period":1,"poxAddress":"bc1...","rewardCycle":100,"signerKey":"aaaaaaaa","signerSignature":"bbbbbbbbbbb"}
```

You will use the JSON when calling Stacking transactions from your Stacker address as outlined above. Remember that this may be different than your signer address.

#### Generating your signature with Leather Earn

Leather Earn is a web application that provides an easy-to-use interface for stacking and generating signatures. We'll cover using Leather Earn for stacking at the end of this document, here we will cover how to use it to generate a signature.

{% hint style="info" %}
At the time of writing, this has only been tested using the [Leather](https://leather.io/) wallet.
{% endhint %}

You can visit [earn.leather.io](https://earn.leather.io/) to generate a signer key signature. Make sure you’re connected to the correct network.\
To generate a signer key signature, it’s important that you’ve logged in Leather with the same secret key that was used to [generate your signer key](https://github.com/stacks-network/docs/blob/master/docs/operate/stacking-stx/broken-reference/README.md), not the account that will serve as your pool operator address. Once you’ve setup that account on Leather, you can log in to Leather Earn.\
Click the link “Signer key signature” at the bottom of the page. This will open the “generate a signer key signature” page.

The fields are:

* Reward cycle:
  * For all solo stacking transactions, this must equal the current reward cycle, not the cycle in which they will start stacking. The field defaults to the current reward cycle.
  * For stack-aggregation-commit-indexed, this field must equal the cycle used in that function’s “reward cycle” argument. Typically, that equates to current\_cycle + 1.
* Bitcoin address: the PoX reward address that can be used
* Topic: the stacking function that will use this signature
* Max amount: max amount of STX that can be used. Defaults to “max possible amount”
* Auth ID: defaults to random int
* Duration: must match the number of cycles used in the stacking transaction. For stack-aggregation-commit-indexed, use “1”.

{% hint style="warning" %}
Each of these fields must be exactly matched in order for the Stacking transaction to work. Future updates to Leather Earn will verify the signature before the transaction is made.
{% endhint %}

Click the “generate signature” button to popup a Leather page where you can generate the signature. Once you submit that popup, Leather Earn will have the signer key and signature you generated.

After you sign that message, you'll see the information you can use in your Stacking transactions, including the signer public key and signature.

You can click the “copy” icon next to “signer details to share with stackers”. This will copy a JSON string, which can be directly pasted into the Leather Earn page where you make your Stacking transaction. Alternatively, this information can be entered manually.

We'll cover the Leather Earn pages for actually making those transactions in the next section of this document.

#### Using a hardware or software wallet to generate signatures

When the signer is configured with a `stacks_private_key`, the signer may want to be able to use that key in a wallet to make stacking signatures.

If the signer uses a tool like [@stacks/cli](https://docs.hiro.so/get-started/command-line-interface) to generate the key, the CLI also outputs a mnemonic (aka “seed phrase”) that can be imported into a wallet. Because the Stacks CLI uses the standard derivation path for generating Stacks keys, any Stacks wallet will default to having that same private key when the wallet is imported from a derivation path. Similarly, if a hardware wallet is setup with that mnemonic, then the Signer can use a wallet like Leather to make stacking signatures.

The workflow for setting up a wallet to generate signatures:

{% stepper %}
{% step %}
Use @stacks/cli to generate the keychain and private key.

* Typically, when using a hardware wallet, it’s better to generate the mnemonic on the hardware wallet. For this use case, however, the signer software needs the private key, and hardware wallets (by design) don’t allow exporting private keys.
  {% endstep %}

{% step %}
Take the `privateKey` from the CLI output and add it to your signer’s configuration.
{% endstep %}

{% step %}
Take the mnemonic (24 words) and either:

* Setup a new hardware wallet with this mnemonic, or
* Store it somewhere securely, like a password manager. When the signer needs to generate signatures for Stacking transactions, they can import it into either Leather or XVerse.
  {% endstep %}
  {% endstepper %}

When the user needs to generate signatures:

{% stepper %}
{% step %}
Set up your wallet with your signer key’s private key. Either:

* Setup your Leather wallet with a Ledger hardware wallet, or
* Import your mnemonic into Leather, XVerse, or another Stacks wallet.
  {% endstep %}

{% step %}
Open an app that has stacking signature functionality built-in.
{% endstep %}

{% step %}
Connect your wallet to the app (aka sign in).
{% endstep %}

{% step %}
In the app, enter your PoX address and “submit”.

* The app will popup a window in your wallet that prompts you to sign the information and will show clear information about what you’re signing.
  {% endstep %}

{% step %}
Create the signature.

* If using a Ledger, confirm on your device.
  {% endstep %}

{% step %}
The app will display two results:

* Your signer key, which is the public key associated with your signer’s key.
* Your signer signature.
  {% endstep %}

{% step %}
Finally, make a Stacking transaction using the signer key and signer signature.
{% endstep %}
{% endstepper %}

Now that you have your signer signature generated, it's time to start stacking. This process will vary depending on your chosen method. We've included instructions for solo stacking using [Leather Earn](https://earn.leather.io/) below.

### Step 3: Stack your STX

#### stack-stx

To start, you'll visit [Leather Earn](https://earn.leather.io/) and click the “Stack independently” button on the home page.

This page will allow you to input the following input:

* The amount of STX you want to lock
* The duration (in number of cycles) to lock for
* Your BTC address where you will receive Stacking rewards
* New fields:
  * Your signer public key
  * Your signer key signature (this is what you generated in the previous step)
  * Auth ID
  * Max amount

#### stack-extend

If you want to extend the time that your STX will be locked for, you can use the stack-extend page on Leather Earn.

If you’re already stacking, the home page will provide a link to “view stacking details”. From there, you can choose to extend.

On this page are the following fields:

* The number of cycles you want to extend for
* Your BTC address to receive rewards
* New fields:
  * Signer public key
  * Signer key signature
  * Auth ID
  * Max amount

#### stack-increase

If you want to increase the amount of STX locked, you can use the stack-increase page on Leather Earn.

If you’re already stacking, the home page will provide a link to “view stacking details”. From there, you can choose to increase.

On this page are the following fields:

* The amount of STX you want to increase by
* New fields:
  * Signer public key
  * Signer key signature
  * Auth ID
  * Max amount


