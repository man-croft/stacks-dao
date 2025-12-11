# for mainnet, replace `testnet` with `mainnet`
https://api.testnet.hiro.so/
```

{% hint style="warning" %}
If you run a local node, it exposes an HTTP server on port `20443`. The info endpoint would be `localhost:20443/v2/info`.
{% endhint %}

***

### Stacks Node RPC API endpoints

The Stacks Blockchain RPC API is exposed by every running Stacks node. Below is an interactive list of common RPC endpoints.

## Broadcast raw transaction

> Broadcast raw transactions on the network. You can use the \[@stacks/transactions]\(<https://github.com/blockstack/stacks.js)\\>
> project to generate a raw transaction payload.\
> \
> The node performs static validation checks on transactions before accepting them into the mempool, including:\
> \- Transaction format validation\
> \- Signature verification\
> \- Nonce checking\
> \- Fee validation\
> \- Size limits<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Transactions","description":"Operations related to broadcasting and retrieving transactions."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/transactions":{"post":{"summary":"Broadcast raw transaction","tags":["Transactions"],"description":"Broadcast raw transactions on the network. You can use the [@stacks/transactions](https://github.com/blockstack/stacks.js)\nproject to generate a raw transaction payload.\n\nThe node performs static validation checks on transactions before accepting them into the mempool, including:\n- Transaction format validation\n- Signature verification\n- Nonce checking\n- Fee validation\n- Size limits\n","operationId":"broadcastTransaction","requestBody":{"content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}},"application/json":{"schema":{"type":"object","required":["tx"],"properties":{"tx":{"type":"string","pattern":"^[0-9a-f]+$","description":"Hex-encoded transaction"},"attachment":{"type":"string","pattern":"^[0-9a-f]+$","description":"Optional hex-encoded attachment for contract-call transactions"}}}}}},"responses":{"200":{"description":"Transaction ID of successful post of a raw tx to the node's mempool.","content":{"application/json":{"schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}}},"400":{"description":"Bad request","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TransactionSubmissionError"}}}},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"TransactionSubmissionError":{"$ref":"#/x-ext/42bf70d"}},"responses":{"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get specific data-map inside a contract

> Attempt to fetch data from a contract data map. The contract is\
> identified with \[Stacks Address] and \[Contract Name] in the URL path.\
> The map is identified with \[Map Name].\
> \
> The key to lookup in the map is supplied via the POST body. This should\
> be supplied as the hex string serialization of the key (which should be\
> a Clarity value). Note, this is a JSON string.\
> \
> The response is a JSON object with the following properties:\
> \- \`data\`: The hex serialization of the map response. Note that map\
> &#x20; responses are Clarity option types, for non-existent values, this is\
> &#x20; a serialized none, and for all other responses, it is a serialized\
> &#x20; (some ...) object.\
> \- \`proof\`: The hex serialization of the Merkle proof for the data.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/map_entry/{contract_address}/{contract_name}/{map_name}":{"post":{"summary":"Get specific data-map inside a contract","tags":["Smart Contracts"],"operationId":"getContractDataMapEntry","description":"Attempt to fetch data from a contract data map. The contract is\nidentified with [Stacks Address] and [Contract Name] in the URL path.\nThe map is identified with [Map Name].\n\nThe key to lookup in the map is supplied via the POST body. This should\nbe supplied as the hex string serialization of the key (which should be\na Clarity value). Note, this is a JSON string.\n\nThe response is a JSON object with the following properties:\n- `data`: The hex serialization of the map response. Note that map\n  responses are Clarity option types, for non-existent values, this is\n  a serialized none, and for all other responses, it is a serialized\n  (some ...) object.\n- `proof`: The hex serialization of the Merkle proof for the data.\n","parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"name":"map_name","in":"path","required":true,"schema":{"$ref":"#/components/schemas/ClarityName"}},{"$ref":"./components/parameters/proof.yaml"},{"$ref":"./components/parameters/tip.yaml"}],"requestBody":{"description":"Hex string serialization of the lookup key (which should be a Clarity value)","required":true,"content":{"application/json":{"schema":{"type":"string"}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ClarityData"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"ClarityName":{"$ref":"#/x-ext/f80f851"},"ClarityData":{"$ref":"#/x-ext/0679af2"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get contract interface

> Get contract interface using a \`contract\_address\` and \`contract name\`

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/contracts/interface/{contract_address}/{contract_name}":{"get":{"summary":"Get contract interface","description":"Get contract interface using a `contract_address` and `contract name`","tags":["Smart Contracts"],"operationId":"getContractInterface","parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Contract interface","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ContractInterface"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"ContractInterface":{"$ref":"#/x-ext/480dca7"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get contract source

> Returns the Clarity source code of a given contract, along with the\
> block height it was published in, and the MARF proof for the data.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/contracts/source/{contract_address}/{contract_name}":{"get":{"summary":"Get contract source","tags":["Smart Contracts"],"operationId":"getContractSource","description":"Returns the Clarity source code of a given contract, along with the\nblock height it was published in, and the MARF proof for the data.\n","parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"$ref":"./components/parameters/proof.yaml"},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ContractSource"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"ContractSource":{"$ref":"#/x-ext/e51fc16"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Call read-only function

> Call a read-only public function on a given contract.\
> \
> The contract is identified with \[Stacks Address] and \[Contract Name] in the URL path.\
> The function is identified with \[Function Name].\
> \
> The arguments to the function are supplied via the POST body.\
> This should be a JSON object with two main properties:\
> \- \`sender\` which should be a standard Stacks address\
> \- \`arguments\` which should be an array of hex-encoded Clarity values.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}":{"post":{"summary":"Call read-only function","description":"Call a read-only public function on a given contract.\n\nThe contract is identified with [Stacks Address] and [Contract Name] in the URL path.\nThe function is identified with [Function Name].\n\nThe arguments to the function are supplied via the POST body.\nThis should be a JSON object with two main properties:\n- `sender` which should be a standard Stacks address\n- `arguments` which should be an array of hex-encoded Clarity values.\n","tags":["Smart Contracts"],"operationId":"callReadOnlyFunction","parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"name":"function_name","in":"path","required":true,"schema":{"$ref":"#/components/schemas/ClarityName"}},{"$ref":"./components/parameters/tip.yaml"}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ReadOnlyFunctionArgs"}}}},"responses":{"200":{"description":"Function executed successfully","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ReadOnlyFunctionResult"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"ClarityName":{"$ref":"#/x-ext/f80f851"},"ReadOnlyFunctionArgs":{"$ref":"#/x-ext/a589553"},"ReadOnlyFunctionResult":{"$ref":"#/x-ext/653d32f"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Call read-only function in fast mode (no cost and memory tracking)

> Call a read-only public function on a given smart contract without cost tracking.\
> \
> The contract is identified with \[Stacks Address] and \[Contract Name] in the URL path.\
> The function is identified with \[Function Name].\
> \
> The arguments to the function are supplied via the POST body.\
> This should be a JSON object with two main properties:\
> \- \`sender\` which should be a standard Stacks address\
> \- \`arguments\` which should be an array of hex-encoded Clarity values.\
> \
> \*\*This API endpoint requires a basic Authorization header.\*\*<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[{"rpcAuth":[]}],"components":{"securitySchemes":{"rpcAuth":{"type":"apiKey","in":"header","name":"authorization","description":"Plain-text secret value that must exactly equal the node's\nconfigured password.\n"}},"schemas":{"ClarityName":{"$ref":"#/x-ext/f80f851"},"ReadOnlyFunctionArgs":{"$ref":"#/x-ext/a589553"},"ReadOnlyFunctionResult":{"$ref":"#/x-ext/653d32f"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"Timeout":{"description":"Timeout","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}},"paths":{"/v3/contracts/fast-call-read/{contract_address}/{contract_name}/{function_name}":{"post":{"summary":"Call read-only function in fast mode (no cost and memory tracking)","description":"Call a read-only public function on a given smart contract without cost tracking.\n\nThe contract is identified with [Stacks Address] and [Contract Name] in the URL path.\nThe function is identified with [Function Name].\n\nThe arguments to the function are supplied via the POST body.\nThis should be a JSON object with two main properties:\n- `sender` which should be a standard Stacks address\n- `arguments` which should be an array of hex-encoded Clarity values.\n\n**This API endpoint requires a basic Authorization header.**\n","tags":["Smart Contracts"],"operationId":"fastCallReadOnlyFunction","parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"name":"function_name","in":"path","required":true,"schema":{"$ref":"#/components/schemas/ClarityName"}},{"$ref":"./components/parameters/tip.yaml"}],"requestBody":{"description":"map of arguments and the simulated tx-sender where sender is either a Contract identifier or a normal Stacks address, and arguments is an array of hex serialized Clarity values.","required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ReadOnlyFunctionArgs"}}}},"responses":{"200":{"description":"Function executed successfully","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ReadOnlyFunctionResult"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"408":{"$ref":"#/components/responses/Timeout"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}}}
```

## Get account info

> Get the account data for the provided principal\
> \
> Where balance is the hex encoding of a unsigned 128-bit integer (big-endian), nonce is a unsigned 64-bit integer, and the proofs are provided as hex strings.\
> \
> For non-existent accounts, this does not 404, rather it returns an object with balance and nonce of 0.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Accounts","description":"Endpoints for retrieving account information."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/accounts/{principal}":{"get":{"summary":"Get account info","tags":["Accounts"],"operationId":"getAccountInfo","description":"Get the account data for the provided principal\n\nWhere balance is the hex encoding of a unsigned 128-bit integer (big-endian), nonce is a unsigned 64-bit integer, and the proofs are provided as hex strings.\n\nFor non-existent accounts, this does not 404, rather it returns an object with balance and nonce of 0.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"./components/parameters/proof.yaml"},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AccountData"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"AccountData":{"$ref":"#/x-ext/83aa21e"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get approximate fees for the given transaction

> Get an estimated fee for the supplied transaction.  This\
> estimates the execution cost of the transaction, the current\
> fee rate of the network, and returns estimates for fee\
> amounts.\
> \
> \* \`transaction\_payload\` is a hex-encoded serialization of\
> &#x20; the TransactionPayload for the transaction.\
> \* \`estimated\_len\` is an optional argument that provides the\
> &#x20; endpoint with an estimation of the final length (in bytes)\
> &#x20; of the transaction, including any post-conditions and\
> &#x20; signatures\
> \
> If the node cannot provide an estimate for the transaction\
> (e.g., if the node has never seen a contract-call for the\
> given contract and function) or if estimation is not\
> configured on this node, a 400 response is returned.\
> The 400 response will be a JSON error containing a \`reason\`\
> field which can be one of the following:\
> \
> \* \`DatabaseError\` - this Stacks node has had an internal\
> &#x20; database error while trying to estimate the costs of the\
> &#x20; supplied transaction.\
> \* \`NoEstimateAvailable\` - this Stacks node has not seen this\
> &#x20; kind of contract-call before, and it cannot provide an\
> &#x20; estimate yet.\
> \* \`CostEstimationDisabled\` - this Stacks node does not perform\
> &#x20; fee or cost estimation, and it cannot respond on this\
> &#x20; endpoint.\
> \
> The 200 response contains the following data:\
> \
> \* \`estimated\_cost\` - the estimated multi-dimensional cost of\
> &#x20; executing the Clarity VM on the provided transaction.\
> \* \`estimated\_cost\_scalar\` - a unitless integer that the Stacks\
> &#x20; node uses to compare how much of the block limit is consumed\
> &#x20; by different transactions. This value incorporates the\
> &#x20; estimated length of the transaction and the estimated\
> &#x20; execution cost of the transaction. The range of this integer\
> &#x20; may vary between different Stacks nodes. In order to compute\
> &#x20; an estimate of total fee amount for the transaction, this\
> &#x20; value is multiplied by the same Stacks node"s estimated fee\
> &#x20; rate.\
> \* \`cost\_scalar\_change\_by\_byte\` - a float value that indicates how\
> &#x20; much the \`estimated\_cost\_scalar\` value would increase for every\
> &#x20; additional byte in the final transaction.\
> \* \`estimations\` - an array of estimated fee rates and total fees to\
> &#x20; pay in microSTX for the transaction. This array provides a range of\
> &#x20; estimates (default: 3) that may be used. Each element of the array\
> &#x20; contains the following fields:\
> &#x20;   \* \`fee\_rate\` - the estimated value for the current fee\
> &#x20;     rates in the network\
> &#x20;   \* \`fee\` - the estimated value for the total fee in\
> &#x20;     microSTX that the given transaction should pay. These\
> &#x20;     values are the result of computing:\
> &#x20;     \`fee\_rate\` x \`estimated\_cost\_scalar\`.\
> &#x20;     If the estimated fees are less than the minimum relay\
> &#x20;     fee \`(1 ustx x estimated\_len)\`, then that minimum relay\
> &#x20;     fee will be returned here instead.\
> \
> \
> Note: If the final transaction"s byte size is larger than\
> supplied to \`estimated\_len\`, then applications should increase\
> this fee amount by:\
> \
> &#x20; \`fee\_rate\` x \`cost\_scalar\_change\_by\_byte\` x (\`final\_size\` - \`estimated\_size\`)<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Fees","description":"Endpoints for fee estimation."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/fees/transaction":{"post":{"summary":"Get approximate fees for the given transaction","tags":["Fees"],"description":"Get an estimated fee for the supplied transaction.  This\nestimates the execution cost of the transaction, the current\nfee rate of the network, and returns estimates for fee\namounts.\n\n* `transaction_payload` is a hex-encoded serialization of\n  the TransactionPayload for the transaction.\n* `estimated_len` is an optional argument that provides the\n  endpoint with an estimation of the final length (in bytes)\n  of the transaction, including any post-conditions and\n  signatures\n\nIf the node cannot provide an estimate for the transaction\n(e.g., if the node has never seen a contract-call for the\ngiven contract and function) or if estimation is not\nconfigured on this node, a 400 response is returned.\nThe 400 response will be a JSON error containing a `reason`\nfield which can be one of the following:\n\n* `DatabaseError` - this Stacks node has had an internal\n  database error while trying to estimate the costs of the\n  supplied transaction.\n* `NoEstimateAvailable` - this Stacks node has not seen this\n  kind of contract-call before, and it cannot provide an\n  estimate yet.\n* `CostEstimationDisabled` - this Stacks node does not perform\n  fee or cost estimation, and it cannot respond on this\n  endpoint.\n\nThe 200 response contains the following data:\n\n* `estimated_cost` - the estimated multi-dimensional cost of\n  executing the Clarity VM on the provided transaction.\n* `estimated_cost_scalar` - a unitless integer that the Stacks\n  node uses to compare how much of the block limit is consumed\n  by different transactions. This value incorporates the\n  estimated length of the transaction and the estimated\n  execution cost of the transaction. The range of this integer\n  may vary between different Stacks nodes. In order to compute\n  an estimate of total fee amount for the transaction, this\n  value is multiplied by the same Stacks node\"s estimated fee\n  rate.\n* `cost_scalar_change_by_byte` - a float value that indicates how\n  much the `estimated_cost_scalar` value would increase for every\n  additional byte in the final transaction.\n* `estimations` - an array of estimated fee rates and total fees to\n  pay in microSTX for the transaction. This array provides a range of\n  estimates (default: 3) that may be used. Each element of the array\n  contains the following fields:\n    * `fee_rate` - the estimated value for the current fee\n      rates in the network\n    * `fee` - the estimated value for the total fee in\n      microSTX that the given transaction should pay. These\n      values are the result of computing:\n      `fee_rate` x `estimated_cost_scalar`.\n      If the estimated fees are less than the minimum relay\n      fee `(1 ustx x estimated_len)`, then that minimum relay\n      fee will be returned here instead.\n\n\nNote: If the final transaction\"s byte size is larger than\nsupplied to `estimated_len`, then applications should increase\nthis fee amount by:\n\n  `fee_rate` x `cost_scalar_change_by_byte` x (`final_size` - `estimated_size`)\n","operationId":"getFeeTransaction","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/FeeTransactionRequest"}}}},"responses":{"200":{"description":"Estimated fees for the transaction","content":{"application/json":{"schema":{"$ref":"#/components/schemas/FeeTransactionResponse"}}}},"400":{"description":"Fee estimation error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/FeeTransactionError"}}}},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"FeeTransactionRequest":{"$ref":"#/x-ext/e8d85ae"},"FeeTransactionResponse":{"$ref":"#/x-ext/60d0d71"},"FeeTransactionError":{"$ref":"#/x-ext/cdeb85d"}},"responses":{"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get estimated fee

> Get an estimated fee rate for STX transfer transactions. This is a fee\
> rate per byte, returned as a JSON integer (microSTX per byte).<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Fees","description":"Endpoints for fee estimation."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/fees/transfer":{"get":{"summary":"Get estimated fee","tags":["Fees"],"operationId":"getFeeTransfer","description":"Get an estimated fee rate for STX transfer transactions. This is a fee\nrate per byte, returned as a JSON integer (microSTX per byte).\n","responses":{"200":{"description":"Fee rate in microSTX per byte","content":{"application/json":{"schema":{"type":"integer","minimum":1,"description":"Fee rate in microSTX per byte"}}}},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get Core API info

> Get Core API information

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Info","description":"General informational endpoints about the node."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/info":{"get":{"summary":"Get Core API info","description":"Get Core API information","tags":["Info"],"operationId":"getNodeInfo","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/NodeInfo"}}}},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"NodeInfo":{"$ref":"#/x-ext/315b0be"}},"responses":{"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get PoX details

> Get Proof of Transfer (PoX) information. Can be used for Stacking.

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Info","description":"General informational endpoints about the node."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/pox":{"get":{"summary":"Get PoX details","description":"Get Proof of Transfer (PoX) information. Can be used for Stacking.","tags":["Info"],"operationId":"getPoxInfo","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/PoxInfo"}}}}},"parameters":[{"$ref":"./components/parameters/tip.yaml"}]}}},"components":{"schemas":{"PoxInfo":{"$ref":"#/x-ext/0b86914"}}}}
```

## Get trait implementation details

> Determine whether or not a specified trait is implemented (either\
> explicitly or implicitly) within a given contract.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/traits/{contract_address}/{contract_name}/{trait_contract_address}/{trait_contract_name}/{trait_name}":{"get":{"summary":"Get trait implementation details","description":"Determine whether or not a specified trait is implemented (either\nexplicitly or implicitly) within a given contract.\n","tags":["Smart Contracts"],"operationId":"checkTraitImplementation","parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"name":"trait_contract_address","in":"path","required":true,"description":"Stacks address of the trait-defining contract.\n","schema":{"type":"string","pattern":"^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{28,41}$","minLength":28,"maxLength":41}},{"name":"trait_contract_name","in":"path","required":true,"description":"Contract name of the trait-defining contract.","schema":{"type":"string","pattern":"^[a-zA-Z]([a-zA-Z0-9]|[-_]){0,127}$","minLength":1,"maxLength":128}},{"name":"trait_name","in":"path","required":true,"schema":{"$ref":"#/components/schemas/ClarityName"}},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/IsTraitImplemented"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"}}}}},"components":{"schemas":{"ClarityName":{"$ref":"#/x-ext/f80f851"},"IsTraitImplemented":{"$ref":"#/x-ext/5c89f26"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get the MARF value for a given key

> Attempt to fetch the value of a MARF key. The key is a 64-character\
> hex string representing the MARF node hash.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/clarity/marf/{marf_key_hash}":{"get":{"summary":"Get the MARF value for a given key","tags":["Smart Contracts"],"operationId":"getClarityMarfValue","description":"Attempt to fetch the value of a MARF key. The key is a 64-character\nhex string representing the MARF node hash.\n","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ClarityData"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"}},"parameters":[{"name":"marf_key_hash","in":"path","required":true,"description":"The 64-character hex-encoded hash of the MARF key.","schema":{"type":"string","pattern":"^[0-9a-f]{64}$","minLength":64,"maxLength":64}},{"$ref":"./components/parameters/proof.yaml"},{"$ref":"./components/parameters/tip.yaml"}]}}},"components":{"schemas":{"ClarityData":{"$ref":"#/x-ext/0679af2"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get the contract metadata for the metadata key

> Attempt to fetch the metadata of a contract. The contract is identified\
> with \[Contract Address] and \[Contract Name] in the URL path. The metadata\
> key is identified with \[Clarity Metadata Key].\
> \
> In the response, \`data\` is formatted as JSON.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/clarity/metadata/{contract_address}/{contract_name}/{clarity_metadata_key}":{"get":{"summary":"Get the contract metadata for the metadata key","tags":["Smart Contracts"],"operationId":"getClarityMetadata","description":"Attempt to fetch the metadata of a contract. The contract is identified\nwith [Contract Address] and [Contract Name] in the URL path. The metadata\nkey is identified with [Clarity Metadata Key].\n\nIn the response, `data` is formatted as JSON.\n","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ClarityMetadata"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}},"parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"name":"clarity_metadata_key","in":"path","required":true,"description":"Metadata key","schema":{"type":"string"}},{"$ref":"./components/parameters/tip.yaml"}]}}},"components":{"schemas":{"ClarityMetadata":{"$ref":"#/x-ext/017aaeb"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get the value of a constant inside a contract

> Attempt to fetch the value of a constant inside a contract. The contract\
> is identified with \[Stacks Address] and \[Contract Name] in the URL path.\
> The constant is identified with \[Constant Name].\
> \
> In the response, \`data\` is the hex serialization of the constant value.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/constant_val/{contract_address}/{contract_name}/{constant_name}":{"get":{"summary":"Get the value of a constant inside a contract","tags":["Smart Contracts"],"operationId":"getConstantValue","description":"Attempt to fetch the value of a constant inside a contract. The contract\nis identified with [Stacks Address] and [Contract Name] in the URL path.\nThe constant is identified with [Constant Name].\n\nIn the response, `data` is the hex serialization of the constant value.\n","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ConstantValue"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}},"parameters":[{"$ref":"#/x-ext/7ec52b8"},{"$ref":"#/x-ext/5e1231d"},{"name":"constant_name","in":"path","required":true,"schema":{"$ref":"#/components/schemas/ClarityName"}},{"$ref":"./components/parameters/tip.yaml"}]}}},"components":{"schemas":{"ConstantValue":{"$ref":"#/x-ext/1cfd730"},"ClarityName":{"$ref":"#/x-ext/f80f851"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Validate a proposed Stacks block

> Used by stackers to validate a proposed Stacks block from a miner.\
> \*\*This API endpoint requires a basic Authorization header.\*\*<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Mining","description":"Endpoints related to Stacks block production and mining."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[{"rpcAuth":[]}],"components":{"securitySchemes":{"rpcAuth":{"type":"apiKey","in":"header","name":"authorization","description":"Plain-text secret value that must exactly equal the node's\nconfigured password.\n"}},"schemas":{"BlockProposalResponse":{"$ref":"#/x-ext/c3c2835"}},"responses":{"Unauthorized":{"description":"Unauthorized. Invalid or missing authentication token.","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}},"paths":{"/v3/block_proposal":{"post":{"summary":"Validate a proposed Stacks block","tags":["Mining"],"operationId":"postBlockProposal","description":"Used by stackers to validate a proposed Stacks block from a miner.\n**This API endpoint requires a basic Authorization header.**\n","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["block","chain_id"],"properties":{"block":{"type":"string","description":"Hex-encoded block data"},"chain_id":{"type":"integer","description":"Chain ID for the block"}}}}}},"responses":{"202":{"description":"Block proposal has been accepted for processing.\nThe result will be returned via the event observer.\n","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockProposalResponse"}}}},"400":{"description":"Bad Request","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockProposalResponse"}},"text/plain":{"schema":{"type":"string"}}}},"401":{"$ref":"#/components/responses/Unauthorized"},"429":{"description":"There is an ongoing proposal validation being processed, the new\nrequest cannot be accepted until the prior request has been processed.\n","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockProposalResponse"}}}},"500":{"$ref":"#/components/responses/InternalServerError"}}}}}}
```

## Fetch the stacker and signer set information for a given cycle.

> Used to get stacker and signer set information for a given cycle.\
> \
> This will only return information for cycles started in Epoch-2.5\
> where PoX-4 was active and subsequent cycles.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Signers","description":"Endpoints for retrieving signer information."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/stacker_set/{cycle_number}":{"get":{"summary":"Fetch the stacker and signer set information for a given cycle.","tags":["Signers"],"operationId":"getStackerSet","description":"Used to get stacker and signer set information for a given cycle.\n\nThis will only return information for cycles started in Epoch-2.5\nwhere PoX-4 was active and subsequent cycles.\n","parameters":[{"name":"cycle_number","in":"path","required":true,"description":"reward cycle number","schema":{"type":"integer"}},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Information for the given reward cycle","content":{"application/json":{"schema":{"$ref":"#/components/schemas/GetStackerSet"}}}},"400":{"description":"Could not fetch the given reward set","content":{"application/json":{"schema":{"type":"object","required":["response","err_msg"],"properties":{"response":{"type":"string","enum":["error"],"description":"Response status"},"err_type":{"type":"string","description":"Error type classification"},"err_msg":{"type":"string","description":"Detailed error message"}}}}}}}}}},"components":{"schemas":{"GetStackerSet":{"$ref":"#/x-ext/cded7df"}}}}
```

## Get Nakamoto block by ID

> Get a specific Nakamoto block (Stacks 3.x+) by its index block hash. This endpoint streams\
> the block data from the Nakamoto staging blocks database where Nakamoto blocks are stored\
> with additional metadata including tenure information.\
> \
> \*\*Compatibility\*\*: Works with Nakamoto blocks only. For Stacks 2.x blocks, use \`/v2/blocks/{block\_id}\`.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/blocks/{block_id}":{"get":{"summary":"Get Nakamoto block by ID","tags":["Blocks"],"operationId":"getNakamotoBlockById","description":"Get a specific Nakamoto block (Stacks 3.x+) by its index block hash. This endpoint streams\nthe block data from the Nakamoto staging blocks database where Nakamoto blocks are stored\nwith additional metadata including tenure information.\n\n**Compatibility**: Works with Nakamoto blocks only. For Stacks 2.x blocks, use `/v2/blocks/{block_id}`.\n","parameters":[{"name":"block_id","in":"path","description":"The block\"s ID hash","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"The raw SIP-003-encoded block will be returned.","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Fetch a Nakamoto block by its height and optional tip

> Fetch a Nakamoto block by its height and optional tip.

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/blocks/height/{block_height}":{"get":{"summary":"Fetch a Nakamoto block by its height and optional tip","tags":["Blocks"],"operationId":"getNakamotoBlockByHeight","description":"Fetch a Nakamoto block by its height and optional tip.","parameters":[{"name":"block_height","in":"path","description":"The block's height","required":true,"schema":{"type":"integer"}},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"The raw SIP-003-encoded block will be returned.","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Fetch metadata about the ongoing Nakamoto tenure

> Fetch metadata about the ongoing Nakamoto tenure. This information is\
> sufficient to obtain and authenticate the highest complete tenure, as\
> well as obtain new tenure blocks.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/info":{"get":{"summary":"Fetch metadata about the ongoing Nakamoto tenure","tags":["Blocks"],"operationId":"getTenureInfo","description":"Fetch metadata about the ongoing Nakamoto tenure. This information is\nsufficient to obtain and authenticate the highest complete tenure, as\nwell as obtain new tenure blocks.\n","responses":{"200":{"description":"Metadata about the ongoing tenure","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TenureInfo"}}}}}}}},"components":{"schemas":{"TenureInfo":{"$ref":"#/x-ext/a981077"}}}}
```

## Fetch a sequence of Nakamoto blocks in a tenure

> Fetch a sequence of Nakamoto blocks in a tenure. The blocks will be\
> served in order from highest to lowest. The blocks will be encoded in\
> their SIP-003 wire format, and concatenated together.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/{block_id}":{"get":{"summary":"Fetch a sequence of Nakamoto blocks in a tenure","tags":["Blocks"],"operationId":"getTenures","description":"Fetch a sequence of Nakamoto blocks in a tenure. The blocks will be\nserved in order from highest to lowest. The blocks will be encoded in\ntheir SIP-003 wire format, and concatenated together.\n","parameters":[{"name":"block_id","in":"path","description":"The tenure-start block ID of the tenure to query","required":true,"schema":{"type":"string"}},{"name":"stop","in":"query","description":"The block ID hash of the highest block in this tenure that is already\nknown to the caller. Neither the corresponding block nor any of its\nancestors will be served. This is used to fetch tenure blocks that the\ncaller does not have.\n","required":false,"schema":{"type":"string"}}],"responses":{"200":{"description":"SIP-003-encoded Nakamoto blocks, concatenated together","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}}}}}}}
```

## Get the list of Stacks blocks in a tenure

> Get the list of blocks in a tenure. The blocks will be\
> shown in order from highest to lowest.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/blocks/{consensus_hash}":{"get":{"summary":"Get the list of Stacks blocks in a tenure","tags":["Blocks"],"operationId":"getTenureBlocks","description":"Get the list of blocks in a tenure. The blocks will be\nshown in order from highest to lowest.\n","parameters":[{"name":"consensus_hash","in":"path","description":"The hex-encoded consensus hash of the tenure to query (40 hexadecimal characters, without 0x prefix)","required":true,"schema":{"type":"string","pattern":"^[0-9a-f]{40}$"}}],"responses":{"200":{"description":"List of Stacks blocks in the tenure","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TenureBlocks"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"TenureBlocks":{"$ref":"#/x-ext/a706cc5"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get the list of Nakamoto Stacks blocks in a tenure given Bitcoin block hash

> Get the list of Nakamoto blocks in a tenure given the Bitcoin block hash. The blocks will be\
> shown in order from highest to lowest. This is only for Nakamoto blocks, Epoch2 ones will not be shown.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/blocks/hash/{burnchain_block_hash}":{"get":{"summary":"Get the list of Nakamoto Stacks blocks in a tenure given Bitcoin block hash","tags":["Blocks"],"operationId":"getTenureBlocksByHash","description":"Get the list of Nakamoto blocks in a tenure given the Bitcoin block hash. The blocks will be\nshown in order from highest to lowest. This is only for Nakamoto blocks, Epoch2 ones will not be shown.\n","parameters":[{"name":"burnchain_block_hash","in":"path","description":"The hex-encoded Bitcoin block hash of the tenure to query (64 hexadecimal characters, without 0x prefix)","required":true,"schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"responses":{"200":{"description":"List of Stacks blocks in the tenure","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TenureBlocks"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"TenureBlocks":{"$ref":"#/x-ext/a706cc5"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get the list of Nakamoto Stacks blocks in a tenure given Bitcoin block height

> Get the list of Nakamoto blocks in a tenure given the Bitcoin block height. The blocks will be\
> shown in order from highest to lowest. This is only for Nakamoto blocks, Epoch2 ones will not be shown.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/blocks/height/{burnchain_block_height}":{"get":{"summary":"Get the list of Nakamoto Stacks blocks in a tenure given Bitcoin block height","tags":["Blocks"],"operationId":"getTenureBlocksByHeight","description":"Get the list of Nakamoto blocks in a tenure given the Bitcoin block height. The blocks will be\nshown in order from highest to lowest. This is only for Nakamoto blocks, Epoch2 ones will not be shown.\n","parameters":[{"name":"burnchain_block_height","in":"path","description":"The Bitcoin block height of the tenure to query","required":true,"schema":{"type":"integer"}}],"responses":{"200":{"description":"List of Stacks blocks in the tenure","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TenureBlocks"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"TenureBlocks":{"$ref":"#/x-ext/a706cc5"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get latest sortition information

> Get sortition information about the latest burnchain block processed by this node.\
> Returns a single-element array with the latest sortition.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/sortitions":{"get":{"summary":"Get latest sortition information","tags":["Blocks"],"operationId":"getLatestSortitions","description":"Get sortition information about the latest burnchain block processed by this node.\nReturns a single-element array with the latest sortition.\n","responses":{"200":{"description":"Latest sortition information","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Sortitions"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"Sortitions":{"$ref":"#/x-ext/8229df6"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get latest and last winning sortitions

> Get sortition information about the latest burn block with a winning miner\
> AND the previous such burn block. Returns an array with two sortition objects.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/sortitions/latest_and_last":{"get":{"summary":"Get latest and last winning sortitions","tags":["Blocks"],"operationId":"getLatestAndLastWinningSortitions","description":"Get sortition information about the latest burn block with a winning miner\nAND the previous such burn block. Returns an array with two sortition objects.\n","responses":{"200":{"description":"Latest and last sortition information","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Sortitions"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"Sortitions":{"$ref":"#/x-ext/8229df6"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get sortition by consensus hash

> Get sortition information for a specific consensus hash.\
> Returns a single-element array with the matching sortition.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/sortitions/consensus/{consensus_hash}":{"get":{"summary":"Get sortition by consensus hash","tags":["Blocks"],"operationId":"getSortitionByConsensusHash","description":"Get sortition information for a specific consensus hash.\nReturns a single-element array with the matching sortition.\n","parameters":[{"name":"consensus_hash","in":"path","required":true,"description":"Hex-encoded consensus hash (40 characters)","schema":{"type":"string","pattern":"^(0x)?[0-9a-f]{40}$"}}],"responses":{"200":{"description":"Sortition information for the consensus hash","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Sortitions"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"Sortitions":{"$ref":"#/x-ext/8229df6"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get sortition by burn header hash

> Get sortition information for a specific burn header hash.\
> Returns a single-element array with the matching sortition.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/sortitions/burn/{burn_header_hash}":{"get":{"summary":"Get sortition by burn header hash","tags":["Blocks"],"operationId":"getSortitionByBurnHeaderHash","description":"Get sortition information for a specific burn header hash.\nReturns a single-element array with the matching sortition.\n","parameters":[{"name":"burn_header_hash","in":"path","required":true,"description":"Hex-encoded burn header hash (64 characters)","schema":{"type":"string","pattern":"^(0x)?[0-9a-f]{64}$"}}],"responses":{"200":{"description":"Sortition information for the burn header hash","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Sortitions"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"Sortitions":{"$ref":"#/x-ext/8229df6"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get sortition by burn block height

> Get sortition information for a specific burn block height.\
> Returns a single-element array with the matching sortition.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/sortitions/burn_height/{height}":{"get":{"summary":"Get sortition by burn block height","tags":["Blocks"],"operationId":"getSortitionByBurnBlockHeight","description":"Get sortition information for a specific burn block height.\nReturns a single-element array with the matching sortition.\n","parameters":[{"name":"height","in":"path","required":true,"description":"Burn block height (integer)","schema":{"type":"integer","minimum":0}}],"responses":{"200":{"description":"Sortition information for the burn block height","content":{"application/json":{"schema":{"$ref":"#/components/schemas/Sortitions"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"Sortitions":{"$ref":"#/x-ext/8229df6"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get number of blocks signed by signer during a given reward cycle

> Get number of blocks signed by signer during a given reward cycle

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."},{"name":"Signers","description":"Endpoints for retrieving signer information."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/signer/{signer_pubkey}/{cycle_number}":{"get":{"summary":"Get number of blocks signed by signer during a given reward cycle","tags":["Blocks","Signers"],"operationId":"getSignerBlocksSigned","description":"Get number of blocks signed by signer during a given reward cycle","parameters":[{"name":"signer_pubkey","in":"path","required":true,"description":"Hex-encoded compressed Secp256k1 public key of signer","schema":{"type":"string","pattern":"^0[23][0-9a-f]{64}$"}},{"name":"cycle_number","in":"path","required":true,"description":"Reward cycle number","schema":{"type":"integer","minimum":0}},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Number of blocks signed","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SignerBlocksSigned"}}}}}}}},"components":{"schemas":{"SignerBlocksSigned":{"$ref":"#/x-ext/21ab5ae"}}}}
```

## Retrieve transaction details by TXID

> Get a JSON with the transaction details including the \`index\_block\_hash\`,\
> the hex-encoded transaction body, and the \`result\`.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Transactions","description":"Operations related to broadcasting and retrieving transactions."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/transaction/{txid}":{"get":{"summary":"Retrieve transaction details by TXID","tags":["Transactions"],"description":"Get a JSON with the transaction details including the `index_block_hash`,\nthe hex-encoded transaction body, and the `result`.\n","operationId":"getTransactionById","parameters":[{"name":"txid","in":"path","required":true,"description":"Transaction ID (64 hexadecimal characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"responses":{"200":{"description":"Transaction JSON with index_block_hash, transaction body and result","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TransactionInfo"}}}},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"},"501":{"description":"Transaction indexing not enabled","content":{"text/plain":{"schema":{"type":"string"}}}}}}}},"components":{"schemas":{"TransactionInfo":{"$ref":"#/x-ext/a3084c1"}},"responses":{"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Query the health of the node.

> Get node health information.\
> A node is considered healthy if its Stacks tip height matches the maximum Stacks tip height observed among its connected peers.\
> This endpoint returns:\
> \- \`difference\_from\_max\_peer\`: The difference in Stacks height between this node and its most advanced peer.\
> \- \`max\_stacks\_height\_of\_neighbors\`: The maximum Stacks height observed among the node"s connected peers.\
> \- \`node\_stacks\_tip\_height\`: The current Stacks tip height of this node.\
> \- \`max\_stacks\_neighbor\_address\`: The address of the most advanced peer. Null if no peer data is available.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Info","description":"General informational endpoints about the node."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/health":{"get":{"summary":"Query the health of the node.","description":"Get node health information.\nA node is considered healthy if its Stacks tip height matches the maximum Stacks tip height observed among its connected peers.\nThis endpoint returns:\n- `difference_from_max_peer`: The difference in Stacks height between this node and its most advanced peer.\n- `max_stacks_height_of_neighbors`: The maximum Stacks height observed among the node\"s connected peers.\n- `node_stacks_tip_height`: The current Stacks tip height of this node.\n- `max_stacks_neighbor_address`: The address of the most advanced peer. Null if no peer data is available.\n","tags":["Info"],"operationId":"getNodeHealth","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/GetHealth"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"GetHealth":{"$ref":"#/x-ext/3d3a088"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get attachment by hash

> Get an attachment by its hash. Attachments are content stored in the Atlas network.\
> \
> The attachment hash is a 40-character hex string (SHA-1 hash).<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Atlas","description":"Operations related to the Atlas global namespace."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/attachments/{hash}":{"get":{"summary":"Get attachment by hash","tags":["Atlas"],"operationId":"getAttachment","description":"Get an attachment by its hash. Attachments are content stored in the Atlas network.\n\nThe attachment hash is a 40-character hex string (SHA-1 hash).\n","parameters":[{"name":"hash","in":"path","required":true,"description":"Hex-encoded SHA-1 hash of the attachment (40 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{40}$"}}],"responses":{"200":{"description":"The attachment content","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AttachmentData"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"}}}}},"components":{"schemas":{"AttachmentData":{"$ref":"#/x-ext/2c09e89"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get attachment inventory

> Get inventory of attachments for a given index block hash and page range.\
> This returns a bitfield indicating which attachments are available.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Atlas","description":"Operations related to the Atlas global namespace."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/attachments/inv":{"get":{"summary":"Get attachment inventory","tags":["Atlas"],"operationId":"getAttachmentsInventory","description":"Get inventory of attachments for a given index block hash and page range.\nThis returns a bitfield indicating which attachments are available.\n","parameters":[{"name":"index_block_hash","in":"query","required":true,"description":"Hex-encoded index block hash (64 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}},{"name":"pages_indexes","in":"query","required":true,"description":"Comma-separated list of page indexes to query","schema":{"type":"string","pattern":"^[0-9]+(,[0-9]+){0,7}$","description":"max 8 pages per request"}}],"responses":{"200":{"description":"Attachment inventory bitfield","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AttachmentInventory"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"}}}}},"components":{"schemas":{"AttachmentInventory":{"$ref":"#/x-ext/81f45e7"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get stream of confirmed microblocks (Epoch 2.x)

> Get microblocks that were confirmed by the given anchored block.\
> The microblocks are returned as a binary stream of concatenated microblock data.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."},{"name":"Microblocks","description":"Operations for retrieving and submitting microblocks."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/microblocks/confirmed/{block_id}":{"get":{"summary":"Get stream of confirmed microblocks (Epoch 2.x)","tags":["Blocks","Microblocks"],"operationId":"getConfirmedMicroblocks","description":"Get microblocks that were confirmed by the given anchored block.\nThe microblocks are returned as a binary stream of concatenated microblock data.\n","parameters":[{"name":"block_id","in":"path","required":true,"description":"Hex-encoded Stacks block ID (64 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Stream of confirmed microblocks","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## GET /v2/microblocks/{microblock\_id}

> Get a stream of microblocks beginning\
> with the given microblock (Epoch 2.x).<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."},{"name":"Microblocks","description":"Operations for retrieving and submitting microblocks."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/microblocks/{microblock_id}":{"get":{"summary":"Get a stream of microblocks beginning\nwith the given microblock (Epoch 2.x).\n","tags":["Blocks","Microblocks"],"operationId":"getMicroblockById","parameters":[{"name":"microblock_id","in":"path","required":true,"description":"Hex-encoded microblock hash (64 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"responses":{"200":{"description":"The microblock data","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get stream of unconfirmed microblocks (Epoch 2.x)

> Get unconfirmed microblocks starting from a specific sequence number.\
> The microblocks are returned as a binary stream.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."},{"name":"Microblocks","description":"Operations for retrieving and submitting microblocks."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/microblocks/unconfirmed/{block_id}/{seq}":{"get":{"summary":"Get stream of unconfirmed microblocks (Epoch 2.x)","tags":["Blocks","Microblocks"],"operationId":"getUnconfirmedMicroblocks","description":"Get unconfirmed microblocks starting from a specific sequence number.\nThe microblocks are returned as a binary stream.\n","parameters":[{"name":"block_id","in":"path","required":true,"description":"Hex-encoded parent block ID (64 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}},{"name":"seq","in":"path","required":true,"description":"Starting sequence number (0-65535)","schema":{"type":"integer","minimum":0,"maximum":65535}}],"responses":{"200":{"description":"Stream of unconfirmed microblocks","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Submit a microblock (Epoch 2.x)

> Submit a microblock to the node for validation and relay.\
> The body \*\*must\*\* be the SIP-003 binary serialization of a \`Microblock\`\
> and sent with \`Content-Type: application/octet-stream\`.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."},{"name":"Microblocks","description":"Operations for retrieving and submitting microblocks."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/microblocks":{"post":{"summary":"Submit a microblock (Epoch 2.x)","tags":["Blocks","Microblocks"],"operationId":"postMicroblock","description":"Submit a microblock to the node for validation and relay.\nThe body **must** be the SIP-003 binary serialization of a `Microblock`\nand sent with `Content-Type: application/octet-stream`.\n","requestBody":{"required":true,"content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"responses":{"200":{"description":"Index-block hash of the accepted microblock","content":{"application/json":{"schema":{"type":"string","description":"32-byte block-header hash (hex)","pattern":"^[0-9a-f]{64}$"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get StackerDB chunk (latest version)

> Get the latest version of a chunk of data from a StackerDB instance.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"StackerDB","description":"Endpoints for interacting with StackerDB instances."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/stackerdb/{principal}/{contract_name}/{slot_id}":{"get":{"summary":"Get StackerDB chunk (latest version)","tags":["StackerDB"],"operationId":"getStackerDbChunk","description":"Get the latest version of a chunk of data from a StackerDB instance.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"#/x-ext/5e1231d"},{"name":"slot_id","in":"path","required":true,"description":"Slot ID","schema":{"type":"integer","minimum":0}}],"responses":{"200":{"description":"StackerDB chunk data","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get StackerDB chunk (specific version)

> Get a specific version of a chunk of data from a StackerDB instance.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"StackerDB","description":"Endpoints for interacting with StackerDB instances."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/stackerdb/{principal}/{contract_name}/{slot_id}/{slot_version}":{"get":{"summary":"Get StackerDB chunk (specific version)","tags":["StackerDB"],"operationId":"getStackerDbChunkVersioned","description":"Get a specific version of a chunk of data from a StackerDB instance.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"#/x-ext/5e1231d"},{"name":"slot_id","in":"path","required":true,"description":"Slot ID","schema":{"type":"integer","minimum":0}},{"name":"slot_version","in":"path","required":true,"description":"Specific slot version","schema":{"type":"integer","minimum":0}}],"responses":{"200":{"description":"StackerDB chunk data","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get StackerDB metadata

> Get metadata about a StackerDB instance, including slot information.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"StackerDB","description":"Endpoints for interacting with StackerDB instances."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/stackerdb/{principal}/{contract_name}":{"get":{"summary":"Get StackerDB metadata","tags":["StackerDB"],"operationId":"getStackerDbMetadata","description":"Get metadata about a StackerDB instance, including slot information.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"#/x-ext/5e1231d"}],"responses":{"200":{"description":"StackerDB metadata","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StackerDbMetadata"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"StackerDbMetadata":{"$ref":"#/x-ext/6b3a047"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Write StackerDB chunk

> Write a chunk of data to a StackerDB instance.\
> \
> The request body should contain a JSON object with the chunk data including\
> slot\_id, slot\_version, signature, and hex-encoded data.\
> \
> The response indicates whether the chunk was accepted, and if not, provides\
> detailed error information. Note that failed writes return HTTP 200 with\
> accepted: false, not HTTP error codes.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"StackerDB","description":"Endpoints for interacting with StackerDB instances."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/stackerdb/{principal}/{contract_name}/chunks":{"post":{"summary":"Write StackerDB chunk","tags":["StackerDB"],"operationId":"postStackerDbChunk","description":"Write a chunk of data to a StackerDB instance.\n\nThe request body should contain a JSON object with the chunk data including\nslot_id, slot_version, signature, and hex-encoded data.\n\nThe response indicates whether the chunk was accepted, and if not, provides\ndetailed error information. Note that failed writes return HTTP 200 with\naccepted: false, not HTTP error codes.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"#/x-ext/5e1231d"}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/StackerDbChunkData"}}}},"responses":{"200":{"description":"Chunk submission result (both success and failure cases)","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StackerDbChunkAckData"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"StackerDbChunkData":{"$ref":"#/x-ext/0173c4f"},"StackerDbChunkAckData":{"$ref":"#/x-ext/a0abf33"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## List StackerDB replicas

> Get a list of replicas for a StackerDB instance.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"StackerDB","description":"Endpoints for interacting with StackerDB instances."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/stackerdb/{principal}/{contract_name}/replicas":{"get":{"summary":"List StackerDB replicas","tags":["StackerDB"],"operationId":"listStackerDbReplicas","description":"Get a list of replicas for a StackerDB instance.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"#/x-ext/5e1231d"}],"responses":{"200":{"description":"List of StackerDB replicas","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StackerDbReplicas"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"StackerDbReplicas":{"$ref":"#/x-ext/a0fd617"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get contract data variable

> Fetch a data variable from a smart contract.\
> Returns the raw hex-encoded value of the variable.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Smart Contracts","description":"Endpoints for interacting with Clarity smart contracts."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/data_var/{principal}/{contract_name}/{var_name}":{"get":{"summary":"Get contract data variable","tags":["Smart Contracts"],"operationId":"getContractDataVariable","description":"Fetch a data variable from a smart contract.\nReturns the raw hex-encoded value of the variable.\n","parameters":[{"$ref":"./components/parameters/principal.yaml"},{"$ref":"#/x-ext/5e1231d"},{"name":"var_name","in":"path","required":true,"description":"Variable name","schema":{"type":"string"}},{"$ref":"./components/parameters/proof.yaml"},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"The data variable value","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ClarityData"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"}}}}},"components":{"schemas":{"ClarityData":{"$ref":"#/x-ext/0679af2"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get recent 2.x block headers

> \*\*Deprecated\*\*: This endpoint is deprecated since Nakamoto.\*\*\
> Stream (as a JSON array) up to \`quantity\` most recent anchored Stacks block headers.\
> The result is ordered from the current tip backwards.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/headers/{quantity}":{"get":{"summary":"Get recent 2.x block headers","tags":["Blocks"],"operationId":"getBlockHeaders","description":"**Deprecated**: This endpoint is deprecated since Nakamoto.**\nStream (as a JSON array) up to `quantity` most recent anchored Stacks block headers.\nThe result is ordered from the current tip backwards.\n","parameters":[{"name":"quantity","in":"path","required":true,"description":"Number of headers to return (max 256)","schema":{"type":"integer","minimum":1,"maximum":256}},{"$ref":"./components/parameters/tip.yaml"}],"responses":{"200":{"description":"Array of block headers","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockHeaders"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"BlockHeaders":{"$ref":"#/x-ext/4f3e126"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get Stacks 2.x block by ID

> Get a specific Stacks 2.x era block by its block ID. This endpoint streams the block data\
> from the filesystem storage where traditional Stacks blocks are stored as individual files.\
> \
> \*\*Compatibility\*\*: Works with all Stacks 2.x blocks. For Nakamoto blocks (Stacks 3.x+), use \`/v3/blocks/{block\_id}\`.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/blocks/{block_id}":{"get":{"summary":"Get Stacks 2.x block by ID","tags":["Blocks"],"operationId":"getLegacyBlockById","description":"Get a specific Stacks 2.x era block by its block ID. This endpoint streams the block data\nfrom the filesystem storage where traditional Stacks blocks are stored as individual files.\n\n**Compatibility**: Works with all Stacks 2.x blocks. For Nakamoto blocks (Stacks 3.x+), use `/v3/blocks/{block_id}`.\n","parameters":[{"name":"block_id","in":"path","required":true,"description":"Hex-encoded block ID (64 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"responses":{"200":{"description":"The block data","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get neighbor peers

> Get information about the node"s neighbor peers in the network.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Info","description":"General informational endpoints about the node."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/neighbors":{"get":{"summary":"Get neighbor peers","tags":["Info"],"operationId":"getNetworkPeers","description":"Get information about the node\"s neighbor peers in the network.\n","responses":{"200":{"description":"List of neighbor peers","content":{"application/json":{"schema":{"$ref":"#/components/schemas/NetworkPeers"}}}}}}}},"components":{"schemas":{"NetworkPeers":{"$ref":"#/x-ext/91808da"}}}}
```

## Get tenure fork information

> Get information about tenure forking between two consensus hashes.\
> This is used to identify conflicting tenures in the Nakamoto consensus.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/fork_info/{start}/{stop}":{"get":{"summary":"Get tenure fork information","tags":["Blocks"],"operationId":"getTenureForkInfo","description":"Get information about tenure forking between two consensus hashes.\nThis is used to identify conflicting tenures in the Nakamoto consensus.\n","parameters":[{"name":"start","in":"path","required":true,"description":"Starting consensus hash (40 hexadecimal characters, without 0x prefix)","schema":{"type":"string","pattern":"^[0-9a-f]{40}$"}},{"name":"stop","in":"path","required":true,"description":"Stopping consensus hash (40 hexadecimal characters, without 0x prefix)","schema":{"type":"string","pattern":"^[0-9a-f]{40}$"}}],"responses":{"200":{"description":"Ordered list of tenure fork events from `stop` back to (and including) `start`","content":{"application/json":{"schema":{"type":"array","items":{"$ref":"#/components/schemas/TenureForkInfo"}}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"TenureForkInfo":{"$ref":"#/x-ext/a555259"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get tenure tip

> Get the tip block of a tenure identified by consensus hash.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/tenures/tip/{consensus_hash}":{"get":{"summary":"Get tenure tip","tags":["Blocks"],"operationId":"getTenureTip","description":"Get the tip block of a tenure identified by consensus hash.\n","parameters":[{"name":"consensus_hash","in":"path","required":true,"description":"Consensus hash (40 characters)","schema":{"type":"string","pattern":"^[0-9a-f]{40}$"}}],"responses":{"200":{"description":"Tenure tip block information","content":{"application/json":{"schema":{"$ref":"#/components/schemas/TenureTip"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"TenureTip":{"$ref":"#/x-ext/6031b30"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Get unconfirmed transaction

> Get an unconfirmed transaction by its transaction ID.\
> This looks in both the mempool and unconfirmed microblock stream.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Transactions","description":"Operations related to broadcasting and retrieving transactions."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/transactions/unconfirmed/{txid}":{"get":{"summary":"Get unconfirmed transaction","tags":["Transactions"],"operationId":"getUnconfirmedTransactionById","description":"Get an unconfirmed transaction by its transaction ID.\nThis looks in both the mempool and unconfirmed microblock stream.\n","parameters":[{"name":"txid","in":"path","required":true,"description":"Transaction ID (64 hexadecimal characters)","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"responses":{"200":{"description":"Unconfirmed transaction details","content":{"application/json":{"schema":{"$ref":"#/components/schemas/UnconfirmedTransaction"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"UnconfirmedTransaction":{"$ref":"#/x-ext/5d76628"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Upload a Stacks block

> Upload a Stacks block to the node for processing.\
> The block must be in binary format and associated with the given consensus hash.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Mining","description":"Endpoints related to Stacks block production and mining."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/blocks/upload/{consensus_hash}":{"post":{"summary":"Upload a Stacks block","tags":["Mining"],"operationId":"uploadLegacyBlock","description":"Upload a Stacks block to the node for processing.\nThe block must be in binary format and associated with the given consensus hash.\n","parameters":[{"name":"consensus_hash","in":"path","required":true,"description":"Consensus hash (40 hex characters)","schema":{"type":"string","pattern":"^[0-9a-f]{40}$"}}],"requestBody":{"required":true,"content":{"application/octet-stream":{"schema":{"type":"string","format":"binary","description":"Binary-encoded Stacks block"}}}},"responses":{"200":{"description":"Block upload result","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockUploadResponse"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"BlockUploadResponse":{"$ref":"#/x-ext/7ac8059"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Query mempool for missing transactions

> Query the mempool for transactions that might be missing from the requesting node.\
> This endpoint supports pagination and streaming of transaction data.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Transactions","description":"Operations related to broadcasting and retrieving transactions."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v2/mempool/query":{"post":{"summary":"Query mempool for missing transactions","tags":["Transactions"],"operationId":"queryMempool","description":"Query the mempool for transactions that might be missing from the requesting node.\nThis endpoint supports pagination and streaming of transaction data.\n","parameters":[{"name":"page_id","in":"query","description":"Transaction ID to start pagination from","schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"requestBody":{"required":true,"content":{"application/octet-stream":{"schema":{"type":"string","format":"binary","description":"Binary SIP-003 encoding of `MemPoolSyncData`\n(`BloomFilter` or `TxTags` variants).\n","properties":{"transactions":{"type":"array","items":{"type":"string","description":"Transaction IDs"}}}}}}},"responses":{"200":{"description":"Stream of missing transactions","content":{"application/octet-stream":{"schema":{"type":"string","format":"binary","description":"Binary stream of transactions and pagination data.\nThe stream contains serialized transactions followed by a page ID for continuation.\n"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

## Upload a Nakamoto block

> Upload a Nakamoto block to the node for processing.\
> \
> \- \*\*Body\*\* - must be the binary (SIP-003) serialization of a \`NakamotoBlock\`.\
> \- \*\*Authentication\*\* - only required when the query parameter \`broadcast=1\` is supplied.\
> &#x20; In that case the caller \*\*must\*\* include an \`Authorization\` header.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[{"rpcAuth":[]},{}],"components":{"securitySchemes":{"rpcAuth":{"type":"apiKey","in":"header","name":"authorization","description":"Plain-text secret value that must exactly equal the node's\nconfigured password.\n"}},"schemas":{"BlockUploadResponse":{"$ref":"#/x-ext/7ac8059"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"Unauthorized":{"description":"Unauthorized. Invalid or missing authentication token.","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}},"paths":{"/v3/blocks/upload":{"post":{"summary":"Upload a Nakamoto block","tags":["Blocks"],"operationId":"uploadNakamotoBlock","description":"Upload a Nakamoto block to the node for processing.\n\n- **Body** - must be the binary (SIP-003) serialization of a `NakamotoBlock`.\n- **Authentication** - only required when the query parameter `broadcast=1` is supplied.\n  In that case the caller **must** include an `Authorization` header.\n","parameters":[{"name":"broadcast","in":"query","description":"If set to `\"1\"` the node will broadcast the uploaded block to peers.\nWhen present the request must include a valid `Authorization` header.\n","schema":{"type":"string","enum":["1"]},"required":false}],"requestBody":{"required":true,"content":{"application/octet-stream":{"schema":{"type":"string","format":"binary","description":"Binary SIP-003 encoding of a `NakamotoBlock`"}}}},"responses":{"200":{"description":"Block upload result.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockUploadResponse"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"401":{"$ref":"#/components/responses/Unauthorized"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}}}
```

## Replay mining of a block and returns its content

> Replay the mining of a block (no data is written in the MARF) and returns its content.<br>

```json
{"openapi":"3.1.0","info":{"title":"Stacks 3.0+ RPC API","version":"1.0.0"},"tags":[{"name":"Blocks","description":"Operations for retrieving block and microblock data."}],"servers":[{"url":"http://localhost:20443","description":"Local Stacks Node"}],"security":[],"paths":{"/v3/blocks/replay/{block_id}":{"get":{"summary":"Replay mining of a block and returns its content","tags":["Blocks"],"operationId":"blockReplay","description":"Replay the mining of a block (no data is written in the MARF) and returns its content.\n","parameters":[{"name":"block_id","in":"path","description":"The block ID hash","required":true,"schema":{"type":"string","pattern":"^[0-9a-f]{64}$"}}],"responses":{"200":{"description":"Content of the replayed block","content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockReplay"}}}},"400":{"$ref":"#/components/responses/BadRequest"},"404":{"$ref":"#/components/responses/NotFound"},"500":{"$ref":"#/components/responses/InternalServerError"}}}}},"components":{"schemas":{"BlockReplay":{"$ref":"#/x-ext/777c51f"}},"responses":{"BadRequest":{"description":"Bad request","content":{"text/plain":{"schema":{"type":"string"}}}},"NotFound":{"description":"Not found","content":{"text/plain":{"schema":{"type":"string"}}}},"InternalServerError":{"description":"Internal Server Error","content":{"text/plain":{"schema":{"type":"string"}}}}}}}
```

***

For details about request/response schemas, consult the Stacks node OpenAPI spec:\
<https://raw.githubusercontent.com/stacks-network/stacks-core/master/docs/rpc/openapi.yaml>


