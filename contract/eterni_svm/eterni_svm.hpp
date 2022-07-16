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
using eosio::require_auth;
using eosio::sha256;
using eosio::signature;
using eosio::singleton;
using eosio::symbol;

using std::make_tuple;
using std::string;
using std::to_string;
using std::vector;

#define ON_NOTIFY(action) [[eosio::on_notify(action)]]

CONTRACT eterni_svm: public contract {
  public:
    using contract::contract;

    eterni_svm (name receiver, name code, datastream<const char *> ds):
      contract(receiver, code, ds),
      settings_table(receiver, receiver.value),
      accounts_table(receiver, receiver.value),
      supplies_table(receiver, receiver.value) {};

    ACTION authenticate (const name &name, const signature &signature);
    ACTION activate (const name &name, const signature &signature);
    ACTION flush (const asset &currency, const symbol &governance_symbol);
    ACTION signup (const name &name, const public_key &public_key);
    ACTION setavatar (const name &name, const signature &signature, const uint16_t &avatar_id);
    ACTION transfer (
      const name &from,
      const name &to,
      const asset &quantity,
      const string &memo,
      const signature &signature,
      const bool &is_withdraw
    );
    ACTION init ();
    ACTION create (const name &contract, const symbol &symbol);

    ACTION temp ();

    ON_NOTIFY("*::transfer") void issue (
      const name &from,
      const name &to,
      const asset &quantity,
      const string &memo
    );

  private:
    TABLE setting {
      name token_contract;
      vector<asset> fees;
    };

    TABLE account {
      public_key public_key;
      uint64_t nonce;
      name name;
      uint16_t avatar_id;
      uint32_t joined_at;
      bool is_activated;
      vector<asset> assets;

      uint64_t primary_key () const {
        return name.value;
      }
    };

    TABLE supply {
      name contract;
      asset asset;

      uint64_t primary_key () const {
        return asset.symbol.code().raw();
      }
    };

    using settings = singleton<"settings"_n, setting>;
    using settings_fix = multi_index<"settings"_n, setting>; // bug fix
    using accounts = multi_index<"accounts"_n, account>;
    using supplies = multi_index<"supplies"_n, supply>;

    settings settings_table;
    accounts accounts_table;
    supplies supplies_table;

    void sub_balance (accounts::const_iterator account_iterator, asset asset);
    void add_balance (accounts::const_iterator account_iterator, asset asset);
    void flushloop (
      const asset &currency_per_governance,
      const symbol &governance_symbol,
      accounts::const_iterator itr
    );
};
