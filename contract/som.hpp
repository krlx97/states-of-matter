#include "uid.hpp"

using namespace std;
using namespace eosio;

CONTRACT som : public contract {
  public:
    using contract :: contract;

    som(name receiver, name code, datastream<const char *> ds) :
      contract(receiver, code, ds),
      players_table(receiver, receiver.value),
      lobbies_table(receiver, receiver.value),
      games_table(receiver, receiver.value) {};

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

    ACTION signin(public_key public_key, signature signature);
    ACTION signout(public_key public_key, signature signature);
    ACTION signup(name username, public_key public_key);

    ACTION savedeck(deck_cards_t cards, public_key public_key, signature signature);
    ACTION selectdeck(uint8_t deck_id, public_key public_key, signature signature);
    ACTION setdeckname(uint8_t id, name name, public_key public_key, signature signature);
    ACTION setdeckklass(uint8_t id, uint8_t klass, public_key public_key, signature signature);
    ACTION setavatar(uint8_t avatar_id, public_key public_key, signature signature);

    ACTION addfriend(name friendname, public_key public_key, signature signature);
    ACTION acceptfriend(name friendname, public_key public_key, signature signature);
    ACTION declfriend(name username, public_key public_key, signature signature);
    ACTION unfriend(name friendname, public_key public_key, signature signature);
    ACTION blockfriend(name friendname, public_key public_key, signature signature);
    ACTION unblckfriend(name friendname, public_key public_key, signature signature);

    ACTION makelobby(uint64_t lobby_id, public_key public_key, signature signature);
    ACTION destroylobby(public_key public_key, signature signature);
    ACTION joinlobby(uint64_t lobby_id, public_key public_key, signature signature);
    ACTION leavelobby(public_key public_key, signature signature);
    ACTION startgame(uint64_t lobby_id, public_key public_key, signature signature);
    ACTION endgame(uint64_t game_id, public_key public_key, signature signature);
    ACTION playcard(string field, uint16_t gid, uint16_t id, public_key public_key, signature signature);

    ACTION rmplayer(name username);
    ACTION rmlobby(uint64_t lobby_id);
    ACTION rmgame(uint64_t game_id);

    struct hero_t {
      uint16_t health;
      uint8_t damage;
      uint8_t special;
    };
    struct game_card_t {
      uint16_t gid;
      uint16_t id;
    };
    struct fields_t {
      game_card_t minion_a;
      game_card_t minion_b;
      game_card_t minion_c;
      game_card_t minion_d;
      game_card_t minion_e;
      game_card_t magic;
      game_card_t trap;
    };
    typedef vector<game_card_t> game_cards_t;
    struct game_player_t {
      name username;
      hero_t hero;
      fields_t fields;
      game_cards_t deck;
      game_cards_t hand;
      game_cards_t graveyard;
    };

  private:
    TABLE player {
      name username;
      public_key public_key;
      account_t account;
      decks_t decks;
      social_t social;

      TABLE_PRIMARY_KEY(username.value);
      TABLE_SECONDARY_PUBLIC_KEY(public_key);
    };

    TABLE lobby {
      uint64_t lobby_id;
      host_t host;
      challengee_t challengee;

      TABLE_PRIMARY_KEY(lobby_id);
    };

    TABLE game {
      uint64_t game_id;
      name player_a;
      name player_b;

      TABLE_PRIMARY_KEY(game_id);
    };

    typedef multi_index<"players"_n, player, index_by_public_key<player>> players;
    typedef multi_index<"lobbies"_n, lobby> lobbies;
    typedef multi_index<"games"_n, game> games;

    players players_table;
    lobbies lobbies_table;
    games games_table;
};