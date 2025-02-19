# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

-   ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
-   🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
-   🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
-   🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
-   🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

-   [Node (>= v18.18)](https://nodejs.org/en/download/)
-   Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
-   [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

-   Edit your smart contracts in `packages/hardhat/contracts`
-   Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
-   Edit your deployment scripts in `packages/hardhat/deploy`

## 🚰 Base Sepolia Faucet

This project includes a signature-based faucet for Base Sepolia ETH. Users must sign a message to prove wallet ownership before receiving testnet ETH.

### Features

-   Message signing verification
-   Rate limiting (24-hour cooldown per wallet)
-   Base Sepolia ETH distribution
-   Serverless deployment ready

### Setup Instructions

1. Configure Environment Variables

    ```bash
    # In packages/nextjs/.env
    AIRDROP_PRIVATE_KEY=your_private_key_here  # Private key of the faucet wallet
    BASE_SEPOLIA_RPC_URL=your_rpc_url_here     # Base Sepolia RPC URL
    ```

2. Fund the Faucet Wallet

    - Send Base Sepolia ETH to the wallet address derived from your `AIRDROP_PRIVATE_KEY`
    - Monitor the balance to ensure sufficient funds for airdrops

3. Customize Faucet Settings (Optional)
    ```typescript
    // In packages/nextjs/app/api/faucet/route.ts
    const AIRDROP_AMOUNT = "0.01"; // Adjust amount per request
    const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // Adjust cooldown period
    ```

### Components

1. **Faucet API** (`packages/nextjs/app/api/faucet/route.ts`)

    - Handles signature verification
    - Manages rate limiting
    - Processes ETH transfers

    ```typescript
    // Example request
    POST /api/faucet
    {
      "address": "0x...",
      "message": "Hello Web3!",
      "signature": "0x..."
    }
    ```

2. **Message Signing Interface** (`packages/nextjs/components/MessageSigning.tsx`)
    - User interface for message signing
    - Displays wallet address
    - Shows transaction status
    - Handles error messages

### Security Considerations

1. **Rate Limiting**

    - One request per wallet address every 24 hours
    - In-memory storage (resets on server restart)
    - Consider implementing persistent storage for production

2. **Signature Verification**

    - Ensures wallet ownership
    - Prevents unauthorized requests
    - Uses viem for cryptographic operations

3. **Environment Variables**
    - Never commit private keys
    - Use secure key management in production
    - Rotate keys periodically

### Deployment

1. **Vercel Deployment**

    - Add environment variables in Vercel dashboard
    - Ensure RPC URL is reliable and rate-limit aware
    - Monitor faucet wallet balance

2. **Production Considerations**
    - Implement persistent rate limiting storage
    - Add monitoring and alerting
    - Consider implementing additional anti-abuse measures

### Customization

1. **Message Format**

    ```typescript
    // Customize the default message
    const [message, setMessage] = useState("Hello Web3!");
    ```

2. **UI Modifications**

    ```typescript
    // Add custom fields or validation
    <div className="max-w-2xl mx-auto p-6 space-y-6">
        {isConnected && <Address address={address} />}
        // Add your custom UI elements
    </div>
    ```

3. **Airdrop Logic**
    ```typescript
    // Modify airdrop amount or conditions
    const AIRDROP_AMOUNT = "0.01";
    // Add custom verification logic
    ```

### Troubleshooting

1. **Rate Limit Issues**

    - Check the cooldown period
    - Verify wallet address formatting
    - Monitor server restarts

2. **Transaction Failures**

    - Ensure faucet wallet is funded
    - Check RPC URL stability
    - Verify gas settings

3. **Signature Verification**
    - Ensure correct message format
    - Check wallet connection
    - Verify chain configuration

## 📝 Message Signing Demo

This project includes a demonstration of Ethereum message signing and verification, combining frontend components with smart contract functionality.

### Components Overview

1. **Message Signing Interface** (`packages/nextjs/components/MessageSigning.tsx`)

    - User interface for message signing
    - Real-time signature verification
    - MetaMask integration

    ```typescript
    const MessageSigning = () => {
        const [message, setMessage] = useState("Hello Web3!");
        // Customize the default message and UI as needed
    };
    ```

2. **Smart Contract Verification** (`packages/hardhat/contracts/YourContract.sol`)
    - On-chain signature verification
    - Message hash generation
    ```solidity
    function verify(
        address signer,
        string memory message,
        bytes memory signature
    ) public pure returns (bool) {
        // Customize verification logic here
    }
    ```

### Customization Options

1. **Message Format**

    - Modify `getMessageHash` in YourContract.sol
    - Add custom message structures

    ```solidity
    function getMessageHash(string memory message) public pure returns (bytes32) {
        // Customize message hashing logic
        return keccak256(abi.encodePacked(message));
    }
    ```

2. **UI Modifications**

    - Update the MessageSigning component
    - Add new fields or validation

    ```typescript
    // Add custom message format
    const [message, setMessage] = useState({
        text: "Hello Web3!",
        timestamp: Date.now(),
    });
    ```

3. **Security Considerations**
    - Client-side and on-chain verification
    - Signature replay protection
    - Nonce-based signing (optional)

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
