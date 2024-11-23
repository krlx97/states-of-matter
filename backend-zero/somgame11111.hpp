
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

    struct lobby_player {
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
    // dev
    ACTION rmplayer (name username);
    ACTION rmlobby (uint64_t lobby_id);
    ACTION rmgame (uint64_t game_id);
    ACTION rmstat (uint64_t chain_id);
    ACTION resetwallet (name username);


    // aura
    ACTION flushtoken (name username, asset quantity);


    // dev end
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




    struct Current {
      name player;
      uint8_t turn;
    };
    struct GameHero {
      uint8_t id;
      name name;
      uint8_t klass;
      uint8_t effect;
      uint8_t health;
      uint8_t mana;
      uint8_t max_health;
      uint8_t max_mana;
    };
    struct GameMinion {
      uint8_t id;
      uint8_t gid;
      name name;
      uint8_t klass;
      uint8_t type;
      uint8_t mana_cost;
      uint8_t effect;
      uint8_t damage;
      uint8_t health;
      uint8_t max_health;
      bool can_attack;
      bool can_trigger_effect;
    };
    struct GameMinions {
      GameMinion a;
      GameMinion b;
      GameMinion c;
      GameMinion d;
    };
    struct GamePlayer {
      name username;
      GameHero hero;
      GameMinions minions;
      trap: GameTrap | undefined;
      hand: GameCards;
      deck: GameCards;
      graveyard: GameCards;
    };

  private:
    TABLE player {
      name username;
      uint8_t status;
      uint16_t xp;
      uint16_t lv;
      uint8_t deck_id;
      uint8_t avatar_id;
      uint32_t lobby_id;
      uint32_t game_id;

      uint64_t primary_key () const {
        return username.value;
      }
    };

    TABLE lobby {
      uint64_t lobby_id;
      lobby_player host;
      lobby_player challengee;

      uint64_t primary_key () const { return lobby_id; }
    };

    TABLE game {
      uint64_t id;
      uint8_t type;
      Current current;
      GamePlayer playerA;
      GamePlayer playerB;

      uint64_t primary_key () const {
        return id;
      }
    };

    typedef multi_index<"players"_n, player> players;
    typedef multi_index<"lobbies"_n, lobby> lobbies;
    typedef multi_index<"games"_n, game> games;

    players players_table;
    lobbies lobbies_table;
    games games_table;

    players::const_iterator authenticate (auth_t auth);
};
