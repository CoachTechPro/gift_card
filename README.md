# Gift Card Dapp For Businesses

# Setup

1. Fork this repo to your personal GitHub account so that you can save your work into your personal Github account.

2. Point your browser to the following URL https://gitpod.io/#https://github.com/your-github-account/gift_card to start the IDE. You will be automatically prompted to create a Gitpod account (all types of Gitpod accounts (including free) will work). You can also choose to provide multiple developers push access to your personal github fork of this repo to collaborate with them (one developer working on the smart contract (C++) while the other working on the front-end decentralized application (EOSJS), etc.). Each such developer sharing access to the forked repo will get their own copy of the EOSIO blockchain components to enable independent development.

You can test drive the system by accessing the IDE at https://gitpod.io/#https://github.com/viraja1/gift_card (however you will not be able to save your work in the Github repository)

# Instructions

The following instructions assume that the Web IDE was started successfully (see [Setup](#setup)).

## Opening a terminal

To open a terminal, use the Terminal drop-down menu in the IDE user interface.

## Compile and deploy contract

Run this in a terminal:

```
cd contract/eosio.token
cleos create account eosio eosio.token EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
eosio-cpp -I include -o eosio.token.wasm src/eosio.token.cpp --abigen
cleos set contract eosio.token /workspace/gift_card/contract/eosio.token --abi eosio.token.abi -p eosio.token@active
```

## Creating users and using the contract

Run this in a terminal:
```
cleos create account eosio bob EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio jane EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos push action eosio.token create '[ "bob", "1000000000.0000 POINTS"]' -p eosio.token@active
cleos push action eosio.token issue '[ "bob", "100.0000 POINTS", "memo" ]' -p bob@active
cleos push action eosio.token transfer '[ "bob", "jane", "25.0000 POINTS", "m" ]' -p bob@active
cleos get currency balance eosio.token bob POINTS
cleos get currency balance eosio.token jane POINTS
```

## Viewing the front-end decentralized web app (EOSJS):

The source code for the React WebApp is at `webapp/src/index.tsx` within the IDE. To preview the WebApp run this in a terminal:

```
gp preview $(gp url 8000)

```

## Resetting the chain

To remove the existing chain and create another:

* Switch to the terminal running `nodeos`
* Press `ctrl+c` to stop it
* Run the following

```
rm -rf ~/eosio/chain
nodeos --config-dir ~/eosio/chain/config --data-dir ~/eosio/chain/data -e -p eosio --plugin eosio::chain_api_plugin

```

Note: if the web app is currently open, then it will cause errors like the following. You may ignore them:

```
FC Exception encountered while processing chain.get_table_rows
```