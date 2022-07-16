#pragma once
// #include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>
#include <eosio/eosio.hpp>
#include <eosio/singleton.hpp>
#include <eosio/symbol.hpp>
#include <eosio/time.hpp>

using eosio::action;
using eosio::asset;
using eosio::contract;
using eosio::datastream;
using eosio::name;
using eosio::permission_level;
using eosio::public_key;
using eosio::signature;
using eosio::symbol;
using eosio::check;

using eosio::time_point_sec;

using eosio::singleton;
using eosio::multi_index;

using std::string;
using std::make_tuple;
using std::vector;

CONTRACT eterni_som: public contract {
  public:
    using contract::contract;

    eterni_som (name receiver, name code, datastream<const char*> ds):
      contract(receiver, code, ds),
      settings_table(receiver, receiver.value),
      players_table(receiver, receiver.value) {};

    ACTION init ();
    ACTION signin (const name &name, const signature &signature);
    ACTION rmplayer (const name &name);
    ACTION resetdb ();
    ACTION flush ();

  private:
    TABLE setting {
      name svm_contract;
      asset mint_price;
      asset daily_flush;
      uint32_t last_flush_epoch;
      uint8_t flushes_to_halving;

      uint64_t primary_key() const {
        return 0;
      }
    };

    TABLE player {
      name name;
      uint8_t status;
      uint16_t xp;
      uint16_t lv;
      uint8_t deckId;
      uint16_t avatarId;
      uint64_t lobbyId;
      uint64_t gameId;
      struct games {
        struct casual {
          uint64_t wins;
          uint64_t loses;
        } casual;
        struct ranked {
          uint64_t wins;
          uint64_t loses;
          uint16_t elo;
        } ranked;
      } games;

      uint64_t primary_key () const {
        return name.value;
      }
    };

    using settings = singleton<"settings"_n, setting>;
    using settings_fix = multi_index<"settings"_n, setting>; // bug: https://github.com/EOSIO/eosio.cdt/issues/280
    using players = multi_index<"players"_n, player>;

    settings settings_table;
    players players_table;
};
