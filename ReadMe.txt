
# install libraries
npm init -y
npm install express ejs body-parser mongoose socket.io web3 web3.js-browser

# recheck the verified contract
0xc6536a42a6C585e960785521e098A7311248Be08
https://ropsten.etherscan.io/address/0xc6536a42a6C585e960785521e098A7311248Be08#code

# status of contract
- Success
- Fail
- Pending

# steps to deploy contract
1. open contract scripts at https://remix.ethereum.org/
2. left menu, click Deploy & run transaction
    + Environment = Inject Web3
    + click button Deploy
3. copy ABI
    + left menu => click Solidity Compiler
    + at the bottom, click the copy icon (ABI)
4. verify contract
    + go to https://ropsten.etherscan.io/
    + click menu Misc > Verify Contract
    + key in address of contract
        * https://remix.ethereum.org/
        * left menu, click Deploy & run transaction
        * go to section Deployed Contracts
        * copy address of contract
    + Compiler Type = Solidity (Single file)
    + Compiler Version = v0.8.4+commit.c7e474f2
    + Open Source License Type = 3) MIT License (MIT)
    + click Continue button
    + copy source code of contract to the text field "Solidity Contract Code".
    + click Verify & Publish    