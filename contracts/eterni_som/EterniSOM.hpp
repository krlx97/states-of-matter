#pragma once

#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>
#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
#include <eosio/symbol.hpp>
#include <eosio/time.hpp>

using eosio::action;
using Asset = eosio::asset;
using eosio::check;
using Checksum256 = eosio::checksum256;
using eosio::current_time_point;
using Contract = eosio::contract;
using eosio::datastream;
using Name = eosio::name;
using eosio::multi_index;
using eosio::permission_level;
using PublicKey = eosio::public_key;
using eosio::recover_key;
using eosio::sha256;
using Signature = eosio::signature;
using eosio::singleton;
using Symbol = eosio::symbol;
using eosio::time_point_sec;

using ExtendedAsset = eosio::extended_asset;
using ExtendedSymbol = eosio::extended_symbol;

using std::make_tuple;
using std::map;
using String = std::string;
using std::to_string;
using std::vector;

using Bool = bool;
using Uint8 = uint8_t;
using Uint16 = uint16_t;
using Uint32 = uint32_t;
using Uint64 = uint64_t;

#define SVM eosio::name("eternisvm121")

CONTRACT EterniSOM: public Contract {
  public:
    const Symbol TLOS = {"TLOS", 4};
    const Symbol VMT = {"VMT", 4};
    const Name EOSIO_TOKEN = "eosio.token"_n;
    const Name ETERNITAS_SVM = "eternisvm121"_n;
    const Name ETERNITAS_TOKEN = "eternitkn121"_n;
    const Name ETERNITAS_NFT = "eterninft121"_n;

    EterniSOM (Name receiver, Name code, datastream<const char *> ds):
      Contract::contract(receiver, code, ds),
      configTable(receiver, receiver.value),
      playersTable(receiver, receiver.value),
      accountsTable("eternisvm131"_n, "eternisvm131"_n.value) {};

    enum CardId: Uint8 {
      SEAFARER = 6,
      AVET,
      GUIDING_LIGHTS,
      GRAVEDIGGER,
      SPELLWEAVER,
      PUPPETEER,
      REBIRTH = 21,
      EXHAUST,
      RELOAD,
      MIRRORS_EDGE = 31,
      SMITE,
      ANTI_MAGE,
      SOLID_HERO = 50,
      SOLID_1 = 56,
      SOLID_2,
      SOLID_3,
      SOLID_4,
      SOLID_5,
      SOLID_6,
      SOLID_7 = 71,
      SOLID_8,
      SOLID_9,
      SOLID_10 = 81,
      SOLID_11,
      SOLID_12,
      LIQUID_HERO = 100,
      LIQUID_1 = 106,
      LIQUID_2,
      LIQUID_3,
      LIQUID_4,
      LIQUID_5,
      LIQUID_6,
      LIQUID_7 = 121,
      LIQUID_8,
      LIQUID_9,
      LIQUID_10 = 131,
      LIQUID_11,
      LIQUID_12,
      GAS_HERO = 150,
      GAS_1 = 156,
      GAS_2,
      GAS_3,
      GAS_4,
      GAS_5,
      GAS_6,
      GAS_7 = 171,
      GAS_8,
      GAS_9,
      GAS_10 = 181,
      GAS_11,
      GAS_12,
      PLASMA_HERO = 200,
      PLASMA_1 = 206,
      PLASMA_2,
      PLASMA_3,
      PLASMA_4,
      PLASMA_5,
      PLASMA_6,
      PLASMA_7 = 221,
      PLASMA_8,
      PLASMA_9,
      PLASMA_10 = 231,
      PLASMA_11,
      PLASMA_12
    };

    using SelectedSkins = map<Uint8, Uint8>;

    ACTION init ();
    ACTION signin (const Name &name, const Signature &signature);
    ACTION temp ();
    ACTION selectskin (
      const Name &name,
      const Signature &signature,
      const Uint64 &serial
    );
    ACTION deselectskin (
      const Uint8 &cardId,
      const Name &name,
      const Signature &signature
    );

  private:
    TABLE Config {
      Name svmContract;
      Symbol currencySymbol;
      Asset mintPrice;
      Uint32 lastFlushEpoch;
    };

    using ConfigSingleton = singleton<"config"_n, Config>;
    using ConfigIndex = multi_index<"config"_n, Config>; // bug fix

    ConfigSingleton configTable;

    TABLE Player {
      Name name;
      SelectedSkins selectedSkins;

      Uint64 primary_key () const {
        return name.value;
      }
    };

    using PlayerIndex = multi_index<"players"_n, Player>;
    using PlayerItr = PlayerIndex::const_iterator;

    PlayerIndex playersTable;

    /*********************
      External
    *********************/

    // ETERNITAS NFT ITEMS
    TABLE item {
      Uint64 serial;
      Name group;
      Name owner;
      //uint64_t mint; //edition?

      uint64_t primary_key() const { return serial; }
      uint64_t by_group() const { return group.value; }
      uint64_t by_owner() const { return owner.value; }
    };
    typedef multi_index<"items"_n, item,
      eosio::indexed_by<"bygroup"_n, eosio::const_mem_fun<item, uint64_t, &item::by_group>>,
      eosio::indexed_by<"byowner"_n, eosio::const_mem_fun<item, uint64_t, &item::by_owner>>
    > items_table;

    // ETERNITAS NFT SHAREDATTRS
    struct SharedAttribute {
      Name attribute_name;
      int64_t points;
      bool locked;

      uint64_t primary_key () const {
        return attribute_name.value;
      }
    };
    typedef multi_index<"sharedattrs"_n, SharedAttribute> shared_attributes_table;
    // shared_attributes_table sharedTable;

    // ETERNITAS WALLET ACCOUNT
    using FtUnstaking = map<Uint32, Asset>;
    using NftBalance = vector<Uint64>;

    struct Profile {
      Uint64 nonce;
      PublicKey publicKey;
      Name name;
      Uint32 joinedAt;
      Uint16 avatarId;
      Bool isActivated;
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

    struct Tokens {
      FtBalances fungible;
      NonFungible2 nonFungible;
    };

    struct Account {
      Profile profile;
      Tokens tokens;

      Uint64 primary_key () const {
        return profile.name.value;
      }
    };

    using AccountIndex = multi_index<"accounts"_n, Account>;
    using AccountItr = AccountIndex::const_iterator;

    AccountIndex accountsTable;
};
