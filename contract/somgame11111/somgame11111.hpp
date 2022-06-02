
#include <eosio/eosio.hpp>
#include <eosio/crypto.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/symbol.hpp>

using namespace std;
using namespace eosio;

#define BY_PUBLIC_KEY "bypublickey"_n
#define BY_CONTRACT "bycontract"_n
#define BY_SYMBOL "bysymbol"_n

const string WITHDRAW_ADDRESS = "EOS1111111111111111111111111111111114T1Anm";

uint8_t WITHDRAW_KEY_BYTES[37] = {
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 134, 231, 181, 34
};

template <typename... Args>
inline std::string format_string (const char *format, Args... args) {
  //
  // https://stackoverflow.com/questions/2342162/stdstring-formatting-like-sprintf
  //

  size_t size = snprintf(nullptr, 0, format, args...) + 1; // Extra space for '\0'
  eosio::check(size > 0, "Error during formatting.");

  std::unique_ptr<char[]> buf(new char[size]);
  snprintf(buf.get(), size, format, args...);
  return std::string(buf.get(), buf.get() + size - 1); // We don't want the '\0' inside
}

CONTRACT somgame11111: public contract {
  public:
    using contract::contract;

    somgame11111 (name receiver, name code, datastream<const char *> ds):
      contract(receiver, code, ds),
      players_table(receiver, receiver.value),
      stats_table(receiver, receiver.value) {};

    struct auth_t {
      name username;
      signature signature;
    };

    typedef vector<asset> wallet_t;

    ACTION signup (name username, public_key public_key);
    ACTION rmplayer (name username);
    ACTION rmstat (uint64_t chain_id);
    ACTION flushtoken (name username, asset quantity);
    ACTION create (name contract, symbol symbol);
    ACTION retire (name contract, symbol symbol);
    ACTION transfer (
      uint64_t chain_id,
      name relayer,
      name from,
      name to,
      asset quantity,
      asset fee,
      uint64_t nonce,
      string memo,
      signature sig,
      bool isWithdraw
    );
    void issue (name from, name to, asset quantity, string memo);

  private:
    TABLE player_t {
      name username;
      public_key public_key;
      uint64_t nonce;
      wallet_t wallet;

      uint64_t primary_key () const {
        return username.value;
      }
    };

    TABLE stat_t {
      uint64_t chain_id;
      asset supply;
      name contract;
      symbol symbol;

      uint64_t primary_key () const {
        return chain_id;
      }

      uint64_t by_contract () const {
        return contract.value;
      }

      uint128_t by_symbol () const {
        return merge_contract_symbol(contract, symbol);
      }
    };

    typedef multi_index<"players"_n, player_t> players;
    typedef players::const_iterator player_itr;

    typedef multi_index<
      "stats"_n,
      stat_t,
      indexed_by<"bycontract"_n, const_mem_fun<stat_t, uint64_t, &stat_t::by_contract>>,
      indexed_by<"bysymbol"_n, const_mem_fun<stat_t, uint128_t, &stat_t::by_symbol>>
    > stats;

    players players_table;
    stats stats_table;

    void sub_balance (players::const_iterator itr, asset token);
    void add_balance (players::const_iterator itr, asset token);
    players::const_iterator authenticate (auth_t auth);

    static uint128_t merge_contract_symbol (name contract, symbol sym) {
      uint128_t merged;
      uint64_t raw_sym = sym.raw();

      memcpy((uint8_t *)&merged, (uint8_t *)&contract.value, 8);
      memcpy((uint8_t *)&merged + 8, (uint8_t *)&raw_sym, 8);

      return merged;
    }
};
