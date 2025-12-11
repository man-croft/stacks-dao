# Dual Stack with Asigna

A guide in getting started with Dual Stacking using the Asigna wallet.

{% hint style="warning" %}
This guide is specifically for entities or teams that use [Asigna](https://www.asigna.io/). This assumes you have the Asigna wallet setup with its browser extension and a multi-signature setup.
{% endhint %}

The Dual Stacking Web App is the primary user interface for participating in Dual Stacking — a mechanism that allows Bitcoin holders to earn BTC-denominated rewards through sBTC, and maximize those rewards by either stacking STX or using sBTC in DeFi.

{% hint style="danger" %}
Ensure that you are using the official Dual Stacking app located at [app.stacks.co](https://app.stacks.co/).
{% endhint %}

For this guide, we'll walkthrough how you can use your Asigna wallet in enrolling Dual Stacking and participating in DeFi for boosted rewards. This guide assumes you have a dedicated Stacks vault setup with multi-signature in your Asigna wallet.

If you need assistance in setting up your vaults in Asigna, check out their dedicated [docs](https://asigna.gitbook.io/asigna).

Before enrolling in Dual Stacking, you'll need sBTC. Peg in BTC to sBTC through the [sBTC bridge](https://app.stacks.co/) (where it remains 1:1 Bitcoin-backed at all times). Check out the dedicated [guide](https://docs.stacks.co/build/sbtc/how-to-use-the-sbtc-bridge-with-asigna) on how you can mint sBTC to your Asigna wallet.

### Walkthrough for enrolling in Dual Stacking

Here are the necessary steps to enroll your sBTC using Asigna:

{% stepper %}
{% step %}
**Connect Asigna to the Dual Stacking app**

Upon popup of the connect wallet modal, select the Asigna option to connect with. As per the usual flow of connecting your Asigna wallet with other Stacks apps, you'll most likely also need to connect the Asigna web wallet view with the Asigna browser extension before connecting with the app.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-3aeef02d164de0e2239c3e3dd384e2f7b779a8f6%2Fimage%2078%20(1).png?alt=media" alt=""><figcaption><p>Select which safe (Stacks vault) you want to connect with.</p></figcaption></figure></div>
{% endstep %}

{% step %}
**Enroll now for Dual Stacking**

On the dashboard, you'll be able to see stats regarding your current sBTC in wallet, sBTC in DeFi, STX currently stacked, and estimated APY you could be earning.

Let's get started by enrolling your sBTC into Dual Stacking.

Your Asigna extension will appear with a popup asking you to review the transaction for approval. This will create the transaction which you will later sign and broadcast in your Asigna web wallet view.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-351df29025ba910e53bd60aa529177bda1cd7c29%2Fimage%2080.png?alt=media" alt=""><figcaption><p>Click on 'Enroll now' under the 'Enroll for rewards' step and approve transaction in the extension popup.</p></figcaption></figure></div>
{% endstep %}

{% step %}
**Sign transaction in Asigna web view**

If you navigate back to your Asigna web wallet view, you'll see the transaction queued up for signatures. In this scenario, we have a 2-of-2 multi-signature scheme setup so we'll need to sign the transaction by both parties involved.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-17b1bfe101456e57433d582307a194afee6e055a%2FGroup%20316124783.png?alt=media" alt=""><figcaption><p>The first signature of the 2-of-2 setup will need to be signed in the Asigna web wallet view.</p></figcaption></figure></div>

Once the first signature is completed, the second signature will also need to take place in that respective signer's Asigna web wallet view. After signing, that same signer will then need to hit 'Execute' to complete the broadcasting of the transaction.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-3dbb1bbb7046ba43b774aee277e358cf1417edff%2FGroup%20316124783%20(1).png?alt=media" alt=""><figcaption><p>The second signature of the 2-of-2 setup will need to be signed in the Asigna web wallet view. After all signatures are completed, hit 'Execute' to broadcast the transaction and navigate back to the Dual Stacking app.</p></figcaption></figure></div>

Execute the signed transaction to broadcast it to the Stacks network.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-fe418d2a94b97797942e3cf7505e5a6686a72f70%2Fimage%2085.png?alt=media" alt=""><figcaption></figcaption></figure></div>

Your enroll transaction will look like this [here](https://explorer.hiro.so/txid/0x3b4ea853df54825adad3ab475d93be18c6a12f04033c665d4597984786feb608?chain=mainnet).
{% endstep %}

{% step %}
**You are now enrolled in Dual Stacking**

You'll notice your sBTC now enrolled in Dual Stacking and when the rewards cycle will start for your enrolled sBTC.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-1baf7eb30e86b887beeaa961aa665b412e39d22c%2Fimage%2063.png?alt=media" alt=""><figcaption><p>You are now Dual Stacking!</p></figcaption></figure></div>

The dashboard will also provide a view of your Dual Stacking portfolio.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-d253139871df5d1d97eea8a413c61bf95bfc526b%2Fimage%2086.png?alt=media" alt=""><figcaption></figcaption></figure></div>

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-bda195f724b6fbda41913982508d629f99c6329a%2Fimage%2064.png?alt=media" alt=""><figcaption><p>View when your sBTC will start earning rewards and the breakdown of rewards composition.</p></figcaption></figure></div>
{% endstep %}

{% step %}
**Boost rewards by stacking STX**

So what's next? You could then boost your rewards by stacking STX. Let's start by stacking STX via [StackingDAO](https://www.stackingdao.com/). StackingDAO is a popular stacking option in Stacks as it is a liquid stacking method.

{% hint style="info" %}
There are other options for stacking your STX that you can find [here](https://app.leather.io/stacking).
{% endhint %}

Navigate to the StackingDAO embedded app within your Asigna web wallet view, connect your wallet, and start stacking. There are many methods to start liquid stacking or native stacking within StackingDAO. In this example, we'll use our STX to liquid stack with sBTC yield.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-510d2f5c99fa612e6d5759dfbd6ab06def77fc4e%2Fimage%2092.png?alt=media" alt=""><figcaption><p>Liquid stacking with sBTC yield allows us to stay liquid and earn sBTC while stacking.</p></figcaption></figure></div>

Complete the same 2-of-2 multi-signature flow in your Asigna web wallet views.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-ec171c271c508df3bb8c632f49805d3fd018b18a%2Fimage%2094.png?alt=media" alt=""><figcaption><p>After all signatures are completed, execute the transaction to broadcast it to the network.</p></figcaption></figure></div>

Navigate back to the Dual Stacking app, and you'll then notice the Dual Stacking app has instantly detect your stacked positions and include that as part of your portfolio's reward composition for boosted rewards.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-08abb6b42c2fe5a1003a04833127e83ee14a427a%2Fimage%2095.png?alt=media" alt=""><figcaption><p>Notice the change in estimated APY and total portfolio value after stacking.</p></figcaption></figure></div>

Let's then boost reward with Stacks DeFi. This will help reach the maximum APY boost for your sBTC.
{% endstep %}

{% step %}
**Deploy your sBTC to Stacks DeFi protocols**

You'll notice near the bottom of the dashboard page, there is a section highlighting popular DeFi protocols in Stacks. Each one of these protocols are eligible for the boosted rewards you can realize.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-ce091cec2b9f7544f47f640f6b314c8ba35f9c53%2Fimage%2069.png?alt=media" alt=""><figcaption></figcaption></figure></div>

Let's deploy sBTC with Zest.

{% hint style="info" %}
As with using the embedded StackingDAO app, we'll also be using the embedded Zest app found in the Asigna web wallet view.
{% endhint %}

Supplying sBTC in Zest will provide users with a supply APY. Confirm the 'Supply' transaction via the same signature flow with Asigna.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Fgit-blob-a9a9a34bd765b9c5a86d6836ef9e1774a3ff8d5c%2Fimage%2074.png?alt=media" alt=""><figcaption></figcaption></figure></div>

After deploying sBTC into Zest, navigate back to the Dual Stacking web app to see your current estimated APY and rewards composition.

Check back on the Dual Stacking dashboard to stay current with your rewards and rewards composition. All rewards are distributed in sBTC, redeemable 1:1 for BTC anytime.
{% endstep %}
{% endstepper %}

***

Reach out to us on [Discord](https://discord.com/invite/stacks-621759717756370964) for any further questions regarding Dual Stacking.


