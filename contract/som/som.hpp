
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

CONTRACT som: public contract {
  public:
    using contract::contract;

    som (name receiver, name code, datastream<const char *> ds):
      contract(receiver, code, ds),
      players_table(receiver, receiver.value),
      lobbies_table(receiver, receiver.value),
      games_table(receiver, receiver.value),
      stats_table(receiver, receiver.value) {};

    struct account_t {
      uint8_t status;
      uint16_t xp;
      uint16_t lv;
      uint8_t deck_id;
      uint8_t avatar_id;
      uint32_t lobby_id;
      uint32_t game_id;
    };

    struct deck_card_t {
      uint8_t id;
      uint8_t amount;
    };

    typedef vector<deck_card_t> deck_cards_t;

    struct deck_t {
      uint8_t id;
      name name;
      uint8_t klass;
      deck_cards_t cards;
    };

    typedef vector<deck_t> decks_t;
    typedef vector<asset> wallet_t;

    struct social_t {
      vector<name> friends;
      vector<name> requests;
      vector<name> blocked;
    };

    enum klass : uint8_t {NEUTRAL, SOLID, LIQUID, GAS, PLASMA};
    enum player_status : uint8_t {OFFLINE, ONLINE, INLOBBY, INQUEUE, INGAME};

    struct host_t {
      name username;
      uint8_t avatar_id;
    };

    struct challengee_t {
      name username;
      uint8_t avatar_id;
    };

    struct auth_t {
      name username;
      signature signature;
    };

    ACTION signin (auth_t auth);
    ACTION signout (auth_t auth);
    ACTION signup (name username, public_key public_key);

    ACTION savedeck (deck_cards_t cards, auth_t auth);
    ACTION selectdeck (uint8_t deck_id, auth_t auth);
    ACTION setdeckname (uint8_t id, name name, auth_t auth);
    ACTION setdeckklass (uint8_t id, uint8_t klass, auth_t auth);
    ACTION setavatar (uint8_t avatar_id, auth_t auth);

    ACTION addfriend (name friendname, auth_t auth);
    ACTION acceptfriend (name friendname, auth_t auth);
    ACTION declfriend (name username, auth_t auth);
    ACTION unfriend (name friendname, auth_t auth);
    ACTION blockfriend (name friendname, auth_t auth);
    ACTION unblckfriend (name friendname, auth_t auth);

    ACTION makelobby (uint64_t lobby_id, auth_t auth);
    ACTION destroylobby (auth_t auth);
    ACTION joinlobby (uint64_t lobby_id, auth_t auth);
    ACTION leavelobby (auth_t auth);
    ACTION startgame (uint64_t lobby_id, auth_t auth);
    ACTION endgame (uint64_t game_id, auth_t auth);

    ACTION rmplayer (name username);
    ACTION rmlobby (uint64_t lobby_id);
    ACTION rmgame (uint64_t game_id);
    ACTION rmstat (uint64_t chain_id);

    ACTION create (name contract, symbol symbol);
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
    TABLE player {
      name username;
      public_key public_key;
      uint64_t nonce;
      account_t account;
      decks_t decks;
      social_t social;
      wallet_t wallet;

      uint64_t primary_key () const { return username.value; }
    };

    TABLE lobby {
      uint64_t lobby_id;
      host_t host;
      challengee_t challengee;

      uint64_t primary_key () const { return lobby_id; }
    };

    TABLE game {
      uint64_t game_id;
      name player_a;
      name player_b;

      uint64_t primary_key () const { return game_id; }
    };

    TABLE stat {
      uint64_t chain_id;
      asset supply;
      name contract;
      symbol symbol;

      uint64_t primary_key () const { return chain_id; }

      uint64_t by_contract () const {
        return contract.value;
      }
      uint128_t by_symbol() const {
        return merge_contract_symbol(contract, symbol);
      }
    };

    typedef multi_index<"players"_n, player> players;
    typedef multi_index<"lobbies"_n, lobby> lobbies;
    typedef multi_index<"games"_n, game> games;

    typedef multi_index<
      "stats"_n,
      stat,
      indexed_by<"bycontract"_n, const_mem_fun<stat, uint64_t, &stat::by_contract>>,
      indexed_by<"bysymbol"_n, const_mem_fun<stat, uint128_t, &stat::by_symbol>>
    > stats;

    players players_table;
    lobbies lobbies_table;
    games games_table;
    stats stats_table;

    void sub_balance (players::const_iterator player, asset asset);
    void add_balance (players::const_iterator player, asset asset);
    players::const_iterator authenticate (auth_t auth);

    static uint128_t merge_contract_symbol (name contract, symbol sym) {
      uint128_t merged;
      uint64_t raw_sym = sym.raw();

      memcpy((uint8_t *)&merged, (uint8_t *)&contract.value, 8);
      memcpy((uint8_t *)&merged + 8, (uint8_t *)&raw_sym, 8);

      return merged;
    }
};
