#pragma once

#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>
#include <string>

namespace eosiosystem {
  class system_contract;
}

using eosio::action_wrapper;
using eosio::asset;
using eosio::check;
using eosio::contract;
using eosio::datastream;
using eosio::multi_index;
using eosio::name;
using eosio::same_payer;
using eosio::symbol;
using eosio::symbol_code;

using std::string;

CONTRACT eterni_token: public contract {
  public:
    using contract::contract;

    eterni_token (name receiver, name code, datastream<const char*> ds):
      contract(receiver, code, ds),
      accounts_table(receiver, receiver.value),
      stats_table(receiver, receiver.value) {};

    ACTION create (const name &issuer, const asset &maximum_supply);
    ACTION issue (const name &to, const asset &quantity, const string &memo);
    ACTION retire (const asset &quantity, const string &memo);
    ACTION transfer (const name &from, const name &to, const asset &quantity, const string &memo);
    ACTION open (const name &owner, const symbol &symbol, const name &ram_payer);
    ACTION close (const name &owner, const symbol &symbol);

    static asset get_supply (const name &token_contract_account, const symbol_code &sym_code) {
      stats statstable(token_contract_account, sym_code.raw());
      const currency_stats &st = statstable.get(sym_code.raw());
      return st.supply;
    }

    static asset get_balance (const name &token_contract_account, const name &owner, const symbol_code &sym_code) {
      accounts accountstable(token_contract_account, owner.value);
      const account &ac = accountstable.get(sym_code.raw());
      return ac.balance;
    }

    using create_action = action_wrapper<"create"_n, &eterni_token::create>;
    using issue_action = action_wrapper<"issue"_n, &eterni_token::issue>;
    using retire_action = action_wrapper<"retire"_n, &eterni_token::retire>;
    using transfer_action = action_wrapper<"transfer"_n, &eterni_token::transfer>;
    using open_action = action_wrapper<"open"_n, &eterni_token::open>;
    using close_action = action_wrapper<"close"_n, &eterni_token::close>;

  private:
    TABLE account {
      asset balance;

      uint64_t primary_key () const {
        return balance.symbol.code().raw();
      }
    };

    TABLE currency_stats {
      asset supply;
      asset max_supply;
      name issuer;

      uint64_t primary_key () const {
        return supply.symbol.code().raw();
      }
    };

    using accounts = multi_index<"accounts"_n, account>;
    using stats = multi_index<"stat"_n, currency_stats>;

    accounts accounts_table;
    stats stats_table;

    void sub_balance (const name &owner, const asset &value);
    void add_balance (const name &owner, const asset &value, const name &ram_payer);
};
