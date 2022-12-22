#pragma once

#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>
#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>

using eosio::action;
using eosio::assert_recover_key;
using eosio::asset;
using eosio::check;
using eosio::checksum256;
using eosio::contract;
using eosio::current_time_point;
using eosio::datastream;
using eosio::multi_index;
using eosio::name;
using eosio::permission_level;
using eosio::public_key;
using eosio::recover_key;
using eosio::require_auth;
using eosio::sha256;
using eosio::signature;
using eosio::singleton;
using eosio::symbol;

using std::make_tuple;
using std::map;
using std::string;
using std::to_string;
using std::vector;
//-----
using Asset = eosio::asset;
using ExtendedAsset = eosio::extended_asset;
using ExtendedSymbol = eosio::extended_symbol;
using Checksum256 = eosio::checksum256;
using Name = eosio::name;
using Contract = eosio::contract;
using PublicKey = eosio::public_key;
using Signature = eosio::signature;
using Symbol = eosio::symbol;
using String = std::string;

using Bool = bool;
using Uint8 = uint8_t;
using Uint16 = uint16_t;
using Uint32 = uint32_t;
using Uint64 = uint64_t;

#define ON_NOTIFY(action) [[eosio::on_notify(action)]]

CONTRACT EterniSVM: public Contract {
  public:
    const Symbol TLOS = {"TLOS", 4};
    const Symbol VMT = {"VMT", 4};
    const Symbol SPS = {"SPS", 4};
    const Name EOSIO_TOKEN = "eosio.token"_n;
    const Name ETERNITAS_TOKEN = "eternitkn131"_n;
    const Name ETERNITAS_NFT = "eterninft131"_n;

    EterniSVM (name receiver, name code, datastream<const char *> ds):
      Contract::contract(receiver, code, ds),
      configTable(receiver, receiver.value),
      accountsTable(receiver, receiver.value),
      ftSuppliesTable(receiver, receiver.value),
      nftSuppliesTable(receiver, receiver.value),
      itemsTable(ETERNITAS_NFT, ETERNITAS_NFT.value),
      nftConfig(ETERNITAS_NFT, ETERNITAS_NFT.value) {};

    using FtBalance = map<Symbol, Asset>;
    using FtUnstaking = map<Uint32, Asset>;
    using Serials = vector<Uint64>;
    using NftBalance = vector<Uint64>;
    

    struct Profile {
      Uint64 nonce;
      PublicKey publicKey;
      Name name;
      Uint32 joinedAt;
      Uint16 avatarId;
      Bool isActivated;
    };

    struct Fungible {
      FtBalance liquid;
      FtBalance staked;
      FtUnstaking unstaking;
    };
    struct Fungible2 {
      Asset total;
      Asset liquid;
      Asset staked;
      Asset unstaking;
      FtUnstaking claimable;
    };

    using FtBalances = map<ExtendedSymbol, Fungible2>;

    struct NonFungible2 {
      NftBalance serials;
    };

    struct NonFungible {
      NftBalance liquid;
    };

    struct Assets {
      Fungible fungible;
      NonFungible nonFungible;
    };

    struct Tokens {
      FtBalances fungible;
      NonFungible2 nonFungible;
    };

    /*********************
      Core
    *********************/

    ACTION signup (const Name &name, const PublicKey &publicKey);
    ACTION signupdev (const Name &name, const PublicKey &publicKey);
    ACTION activate (const Name &name, const Signature &signature);
    ACTION setavatar (
      const Name &name,
      const Signature &signature,
      const Name &group,
      const Uint64 &serial
    );

    /*********************
      Staking
    *********************/

    ACTION stake (
      const Name &name,
      const Signature &signature,
      const ExtendedAsset &token
    );
    ACTION unstake (
      const Name &name,
      const Signature &signature,
      const ExtendedAsset &token
    );
    ACTION claim (
      const Name &name,
      const Signature &signature,
      const ExtendedSymbol &symbol,
      const Uint32 &date
    );
    ACTION flush (
      const Name &name,
      const Signature &signature,
      const Symbol &symbol
    );

    /*********************
      eosio.token VM
    *********************/

    ACTION transfer (
      const Name &from,
      const Name &to,
      const ExtendedAsset &quantity,
      const String &memo,
      const Signature &signature,
      const Bool &isWithdraw
    );
    ACTION swap (const Name &name, const Signature &signature, const Asset &asset);
    ACTION create (const Name &contract, const Symbol &symbol);

    ON_NOTIFY("*::transfer") void onTransfer (
      const Name &from,
      const Name &to,
      Asset &quantity,
      const String &memo
    );

    /*********************
      marble VM
    *********************/

    ACTION mint (Uint64 i, Name name, Signature signature);
    ACTION transferitem (
      name from,
      name to,
      vector<uint64_t> serials,
      string memo,
      Signature &signature,
      Bool &isWithdraw
    );

    ON_NOTIFY("eterninft131::transferitem") void on_transferitem (
      name from,
      name to,
      vector<uint64_t> serials,
      string memo
    );

    /*********************
      Developer
    *********************/

    ACTION tokenairdrop (Name name);
    ACTION configure ();
    ACTION temp ();

  private:

    /*********************
      Internal
    *********************/

    TABLE Config {
      String cdtVersion;
      Name ftCore;
      Name ftGame;
      Name nftGame;
      ExtendedAsset activatePrice;
      ExtendedAsset fee;
    };

    TABLE Account {
      Profile profile;
      Tokens tokens;

      Uint64 primary_key () const {
        return profile.name.value;
      }
    };

    TABLE FtSupply {
      ExtendedAsset total;
      Asset liquid;
      Asset staked;
      Asset unstaking;
      Asset payments;

      Uint64 primary_key () const {
        return total.quantity.symbol.code().raw();
      }
    };

    TABLE NftSupply {
      Name contract;
      Serials serials;

      Uint64 primary_key () const {
        return contract.value;
      }
    };

    using ConfigSingleton = singleton<"config"_n, Config>;

    using ConfigIndex = multi_index<"config"_n, Config>; // bug fix
    using AccountIndex = multi_index<"accounts"_n, Account>;
    using FtSupplyIndex = multi_index<"ftsupplies"_n, FtSupply>;
    using NftSupplyIndex = multi_index<"nftsupplies"_n, NftSupply>;

    using AccountItr = AccountIndex::const_iterator;
    using FtSupplyItr = FtSupplyIndex::const_iterator;
    using NftSupplyItr = NftSupplyIndex::const_iterator;

    ConfigSingleton configTable;
    AccountIndex accountsTable;
    FtSupplyIndex ftSuppliesTable;
    NftSupplyIndex nftSuppliesTable;

    void addBalance (Account &account, const ExtendedAsset &token);
    void deductBalance (Account &account, const ExtendedAsset &token);
    void addStake (Account &account, const ExtendedAsset &token);
    void deductStake (Account &account, const ExtendedAsset &token);
    void payFee (Account &account);

    AccountItr svmAuth (const Name &name, const Signature &signature);
    AccountItr getAccountItr (const Name &name);
    FtSupplyItr getFtSupplyItr (const Symbol &symbol);
    NftSupplyItr getNftSupplyItr (const Name &contract);
    Bool checkTokenContract (Name name);

    /*********************
      External
    *********************/

    struct shared_tag {
      name tag_name;
      string content;
      string checksum;
      string algorithm;
      bool locked;

      uint64_t primary_key() const { return tag_name.value; }
    };
    typedef multi_index<name("sharedtags"), shared_tag> shared_tags_table;
    
    // eterninft131
    struct item {
      uint64_t serial;
      name group;
      name owner;

      uint64_t primary_key() const { return serial; }
      uint64_t by_group() const { return group.value; }
      uint64_t by_owner() const { return owner.value; }
    };

    typedef multi_index<
      name("items"),
      item,
      eosio::indexed_by<"bygroup"_n, eosio::const_mem_fun<item, uint64_t, &item::by_group>>,
      eosio::indexed_by<"byowner"_n, eosio::const_mem_fun<item, uint64_t, &item::by_owner>>
    > ItemsTable;

    ItemsTable itemsTable;

    // eterninft131
    struct config {
      string contract_name;
      string contract_version;
      name admin;
      uint64_t last_serial;
    };

    typedef singleton<"config"_n, config> config_table;

    config_table nftConfig;
};
