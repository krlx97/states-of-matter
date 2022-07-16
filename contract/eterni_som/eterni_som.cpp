#include "eterni_som.hpp"

ACTION eterni_som::init () {
  require_auth(get_self());

  const setting setting = {
    .svm_contract = "eternisvm111"_n,
    .mint_price = asset(10000000, symbol("LMT", 4)),
    .daily_flush = asset(2500000000, symbol("LMT", 4)),
    .last_flush_epoch = 1656415610,
    .flushes_to_halving = 200
  };

  settings_table.set(setting, get_self());
}

ACTION eterni_som::signin (const name &name, const signature &signature) {
  const setting setting = settings_table.get();

  action(
    permission_level{get_self(), "active"_n},
    setting.svm_contract,
    "authenticate"_n,
    make_tuple(name, signature)
  ).send();

  const players::const_iterator player_iterator = players_table.find(name.value);

  if (player_iterator == players_table.end()) {
    players_table.emplace(get_self(), [&](player &player) {
      player.name = name;
      player.status = 0;
      player.xp = 0;
      player.lv = 0;
      player.deckId = 0;
      player.avatarId = 0;
      player.lobbyId = 0;
      player.gameId = 0;
      player.games = {
        .casual = {.wins = 0, .loses = 0},
        .ranked = {.wins = 0, .loses = 0, .elo = 1000}
      };
    });
  }
}

ACTION eterni_som::rmplayer (const name &name) {
  require_auth(get_self());
  players_table.erase(players_table.find(name.value));
}

ACTION eterni_som::resetdb () {
  require_auth(get_self());

  for (
    players::const_iterator player_iterator = players_table.begin();
    player_iterator != players_table.end();
  ) {
    player_iterator = players_table.erase(player_iterator);
  }

  settings_table.remove();
}

ACTION eterni_som::flush () {
  setting setting = settings_table.get();
  eosio::time_point_sec time = eosio::current_time_point();
  uint32_t epoch = time.sec_since_epoch();

  check(epoch > setting.last_flush_epoch, "Flush isn't available yet.");

  action(
    permission_level{get_self(), "active"_n},
    setting.svm_contract,
    "flush"_n,
    make_tuple(setting.daily_flush, symbol("DMT", 0))
  ).send();

  setting.flushes_to_halving -= 1;
  setting.last_flush_epoch += 86400;

  if (setting.flushes_to_halving <= 0) {
    setting.flushes_to_halving = 200;
    setting.daily_flush = setting.daily_flush / 2;
  }

  settings_table.set(setting, get_self());
}

EOSIO_DISPATCH(eterni_som, (init)(signin)(rmplayer)(resetdb)(flush));
