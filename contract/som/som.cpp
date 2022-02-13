#include "som.hpp"
#include "base58.c"

ACTION som::signin (auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    if (row.account.lobby_id > 0) {
      row.account.status = INLOBBY;
    } else if (row.account.game_id > 0) {
      row.account.status = INGAME;
    } else {
      row.account.status = ONLINE;
    }
  });
}

ACTION som::signout (auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.status = OFFLINE;
  });
}

ACTION som::signup (name username, public_key public_key) {
  players::const_iterator player = players_table.find(username.value);

  check(player == players_table.end(), "Username taken.");

  account_t account = {OFFLINE, 0, 1, 0, 0, 0, 0};
  decks_t decks = {
    {0, "solid"_n,  SOLID,  {}},
    {1, "liquid"_n, LIQUID, {}},
    {2, "gas"_n,    GAS,    {}},
    {3, "plasma"_n, PLASMA, {}}
  };
  social_t social = {{}, {}, {}};
  wallet_t wallet = {
    asset(0, symbol("TLOS", 4)),
    asset(0, symbol("SOM", 4)),
    asset(0, symbol("SOMA", 0)),
    asset(0, symbol("ATMOS", 4))
  };

  players_table.emplace(_self, [&](auto &row) {
    row.username = username;
    row.public_key = public_key;
    row.nonce = 0;
    row.account = account;
    row.decks = decks;
    row.social = social;
    row.wallet = wallet;
  });
}

ACTION som::savedeck (deck_cards_t cards, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    for (deck_t &deck: row.decks) {
      if (deck.id == row.account.deck_id) {
        deck.cards = cards;
        break;
      }
    }
  });
}

ACTION som::selectdeck (uint8_t deck_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.deck_id = deck_id;
  });
}

ACTION som::setdeckname (uint8_t id, name name, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    for (deck_t &deck: row.decks) {
      if (deck.id == id) {
        deck.name = name;
        break;
      }
    }
  });
}

ACTION som::setdeckklass (uint8_t id, uint8_t klass, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    for (deck_t &deck: row.decks) {
      if (deck.id == id) {
        deck.klass = klass;
        deck.cards = {};
        break;
      }
    }
  });
}

ACTION som::setavatar (uint8_t avatar_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.avatar_id = avatar_id;
  });
}

ACTION som::addfriend (name friendname, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  players::const_iterator frnd = players_table.find(friendname.value);

  check(frnd != players_table.end(), "Friend name not found.");
  check(player->username != frnd->username, "You can't add yourself as a friend.");
  check(find(frnd->social.blocked.begin(), frnd->social.blocked.end(), player->username) == frnd->social.blocked.end(), "This player has blocked you.");
  check(find(player->social.blocked.begin(), player->social.blocked.end(), frnd->username) == player->social.blocked.end(), "You have blocked this player.");
  check(find(frnd->social.requests.begin(), frnd->social.requests.end(), player->username) == frnd->social.requests.end(), "You already sent the request to this player.");
  check(find(player->social.requests.begin(), player->social.requests.end(), frnd->username) == player->social.requests.end(), "This player has already sent you the request.");
  check(find(player->social.friends.begin(), player->social.friends.end(), frnd->username) == player->social.friends.end(), "This player is already your friend.");

  players_table.modify(frnd, _self, [&](auto &row) {
    row.social.requests.push_back(player->username);
  });
}

ACTION som::acceptfriend (name friendname, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  players::const_iterator frnd = players_table.find(friendname.value);

  check(frnd != players_table.end(), "Friend name not found.");

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &requests = row.social.requests;
    vector<name>::iterator i = find(requests.begin(), requests.end(), friendname);

    requests.erase(i);
    row.social.friends.push_back(friendname);
  });

  players_table.modify(frnd, _self, [&](auto &row) {
    row.social.friends.push_back(player->username);
  });
}

ACTION som::declfriend (name username, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &requests = row.social.requests;
    vector<name>::iterator i = find(requests.begin(), requests.end(), username);

    requests.erase(i);
  });
}

ACTION som::unfriend (name friendname, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  players::const_iterator frnd = players_table.find(friendname.value);

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &friends = row.social.friends;
    vector<name>::iterator i = find(friends.begin(), friends.end(), friendname);

    friends.erase(i);
  });

  players_table.modify(frnd, _self, [&](auto &row) {
    vector<name> &friends = row.social.friends;
    vector<name>::iterator i = find(friends.begin(), friends.end(), auth.username);

    friends.erase(i);
  });
}

ACTION som::blockfriend (name friendname, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  players::const_iterator frnd = players_table.find(friendname.value);

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &friends = row.social.friends;
    vector<name> &blocked = row.social.blocked;
    vector<name>::iterator i = find(friends.begin(), friends.end(), friendname);

    friends.erase(i);
    blocked.push_back(friendname);
  });

  players_table.modify(frnd, _self, [&](auto &row) {
    vector<name> &friends = row.social.friends;
    vector<name>::iterator i = find(friends.begin(), friends.end(), auth.username);

    friends.erase(i);
  });
}

ACTION som::unblckfriend (name friendname, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &blocked = row.social.blocked;
    vector<name>::iterator i = find(blocked.begin(), blocked.end(), friendname);

    blocked.erase(i);
  });
}

ACTION som::makelobby (uint64_t lobby_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  check(player->account.lobby_id == 0,  "You are already in a lobby.");
  check(player->account.game_id == 0,   "You can't create a lobby while in-game.");

  lobbies_table.emplace(_self, [&](auto &row) {
    row.lobby_id = lobby_id;
    row.host = {
      player->username,
      player->account.avatar_id
    };
    row.challengee = {};
  });

  players_table.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = lobby_id;
    row.account.status = INLOBBY;
  });
}

ACTION som::destroylobby (auth_t auth) {
  players::const_iterator player = authenticate(auth);
  lobbies::const_iterator lobby = lobbies_table.find(player->account.lobby_id);
  players::const_iterator challengee = players_table.find(lobby->challengee.username.value);

  check(player->username == lobby->host.username, "You are not the host.");

  players_table.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = 0;
    row.account.status = ONLINE;
  });

  if (challengee != players_table.end()) {
    players_table.modify(challengee, _self, [&](auto &row) {
      row.account.lobby_id = 0;
      row.account.status = ONLINE;
    });
  }

  lobbies_table.erase(lobby);
}

ACTION som::joinlobby (uint64_t lobby_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  lobbies::const_iterator lobby = lobbies_table.find(lobby_id);

  check(lobby->challengee.username == ""_n, "Lobby is full.");
  check(player->account.lobby_id == 0,      "You are already in a lobby.");
  check(player->account.game_id == 0,       "You can't join a lobby while in-game.");

  lobbies_table.modify(lobby, _self, [&](auto &row) {
    row.challengee = {
      player->username,
      player->account.avatar_id
    };
  });

  players_table.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = lobby_id;
    row.account.status = INLOBBY;
  });
}

ACTION som::leavelobby (auth_t auth) {
  players::const_iterator player = authenticate(auth);
  lobbies::const_iterator lobby = lobbies_table.find(player->account.lobby_id);

  check(player->account.lobby_id != 0, "You are not in a lobby.");

  lobbies_table.modify(lobby, _self, [&](auto &row) {
    row.challengee = {};
  });

  players_table.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = 0;
    row.account.status = ONLINE;
  });
}

ACTION som::startgame (uint64_t lobby_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  lobbies::const_iterator lobby = lobbies_table.find(lobby_id);
  players::const_iterator challengee = players_table.find(lobby->challengee.username.value);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = 0;
    row.account.game_id = lobby_id;
    row.account.status = INGAME;
  });

  players_table.modify(challengee, _self, [&](auto &row) {
    row.account.lobby_id = 0;
    row.account.game_id = lobby_id;
    row.account.status = INGAME;
  });

  lobbies_table.erase(lobby);

  games_table.emplace(_self, [&](auto &row) {
    row.game_id = lobby_id;
    row.player_a = player->username;
    row.player_b = challengee->username;
  });
}

ACTION som::endgame (uint64_t game_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);
  games::const_iterator game = games_table.find(game_id);
  players::const_iterator challengee = players_table.find(game->player_b.value);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.game_id = 0;
    row.account.status = ONLINE;
  });

   players_table.modify(challengee, _self, [&](auto &row) {
    row.account.game_id = 0;
    row.account.status = ONLINE;
  });

  games_table.erase(game);
}

ACTION som::rmplayer (name username) {
  players::const_iterator player = players_table.find(username.value);
  players_table.erase(player);
}

ACTION som::rmlobby (uint64_t lobby_id) {
  lobbies::const_iterator lobby = lobbies_table.find(lobby_id);
  lobbies_table.erase(lobby);
}

ACTION som::rmgame (uint64_t game_id) {
  games::const_iterator game = games_table.find(game_id);
  games_table.erase(game);
}

ACTION som::rmstat (uint64_t chain_id) {
  stats::const_iterator stat = stats_table.find(chain_id);
  stats_table.erase(stat);
}

ACTION som::create (name contract, symbol symbol) {
  require_auth(_self);

  auto symbol_index = stats_table.get_index<BY_SYMBOL>();
  uint128_t merged = merge_contract_symbol(contract, symbol);
  auto stat = symbol_index.find(merged);

  check(stat == symbol_index.end(), "Token is already registered.");
  check(symbol.is_valid(),          "Invalid symbol.");

  stats_table.emplace(_self, [&](som::stat &row) {
    row.chain_id = stats_table.available_primary_key();
    row.symbol = symbol;
    row.contract = contract;
    row.supply = asset(0, symbol);
  });
}

void som::issue (name from, name to, asset quantity, string memo) {
  if (from == _self) { return; }

  players::const_iterator player = players_table.find(name(memo).value);

  auto symbol_index = stats_table.get_index<BY_SYMBOL>();
  uint128_t merged = merge_contract_symbol(get_first_receiver(), quantity.symbol);
  auto stat = symbol_index.find(merged);

  check(player != players_table.end(),  "Player not found.");
  check(stat != symbol_index.end(),     "Token not found.");
  check(quantity.symbol.is_valid(),     "Invalid symbol.");
  check(quantity.is_valid(),            "Invalid asset.");
  check(quantity.amount > 0,            "Must issue positive quantity.");
  check(memo.size() <= 256,             "Memo has more than 256 bytes.");
  check(to == _self,                    "Stop trying to hack the contract.");

  symbol_index.modify(stat, _self, [&](auto &row) { row.supply += quantity; });

  add_balance(player, quantity);
}

ACTION som::transfer (
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
) {
  players::const_iterator player = authenticate({from, sig});
  auto receiver = players_table.find(to.value);
  auto stat = stats_table.find(chain_id);

  check(stat != stats_table.end(),        "Token not found.");
  check(from != to,           "cannot transfer to self");
  check(quantity.is_valid(),  "invalid quantity");
  check(fee.is_valid(),       "invalid quantity");
  check(quantity.amount > 0,  "must transfer positive quantity");
  check(fee.amount >= 0,      "fee must be non-negative");
  check(memo.size() <= 256,   "Memo has more than 256 bytes.");
  check(stat->symbol == quantity.symbol,  "quantity and chain_id symbols don't match. check decimal places");
  check(stat->symbol == fee.symbol,       "fee and chain_id symbols don't match. check decimal places");

  for (int i = 0; i < player->wallet.size(); i += 1) {
    if (player->wallet[i].symbol == quantity.symbol) {
      check(quantity.amount <= player->wallet[i].amount,              "Insufficient balance.");
      check(quantity.amount + fee.amount <= player->wallet[i].amount, "Insufficient balance to cover the fees.");
      break;
    }
  }

  sub_balance(player, quantity);

  if (isWithdraw) {
    action(
      permission_level{_self, "active"_n},
      stat->contract,
      "transfer"_n,
      make_tuple(_self, to, quantity, memo)
    ).send();

    stats_table.modify(stat, _self, [&](auto &row) { row.supply -= quantity; });
  } else {
    check(receiver != players_table.end(), "Receiver not found.");
    add_balance(receiver, quantity);
  }

  if (fee.amount > 0) {
    auto admin = players_table.find("admin"_n.value);
    sub_balance(player, fee);
    add_balance(admin, fee);
  }
}

som::players::const_iterator som::authenticate (auth_t auth) {
  players::const_iterator player = players_table.find(auth.username.value);

  check(player != players_table.end(), "Player not found.");

  string msg = format_string("%i", player->nonce + 1);
  checksum256 digest = sha256(msg.c_str(), msg.length());

  assert_recover_key(digest, auth.signature, player->public_key);

  players_table.modify(player, _self, [&](auto &row) { row.nonce += 1; });

  return player;
}

void som::sub_balance (players::const_iterator player, asset asset) {
  players_table.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.wallet.size(); i += 1) {
      if (row.wallet[i].symbol == asset.symbol) {
        check(row.wallet[i].amount >= asset.amount, "Overdrawn balance.");

        row.wallet[i] -= asset;
        break;
      }
    }
  });
}

void som::add_balance (players::const_iterator player, asset asset) {
  players_table.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.wallet.size(); i += 1) {
      if (row.wallet[i].symbol == asset.symbol) {
        row.wallet[i] += asset;
        break;
      }
    }
  });
}

extern "C" {
  void apply (uint64_t receiver, uint64_t code, uint64_t action) {
    auto _self = receiver;

    if (code != _self && action == "transfer"_n.value) {
      execute_action(name(receiver), name(code), &som::issue);
    } else if (code == _self && action == "create"_n.value) {
      execute_action(name(receiver), name(code), &som::create);
    } else if (code == _self && action == "transfer"_n.value) {
      execute_action(name(receiver), name(code), &som::transfer);
    } else if (code == receiver) {
      switch (action) {
        EOSIO_DISPATCH_HELPER(
          som,
          (signin)
          (signout)
          (signup)
          (savedeck)
          (selectdeck)
          (setdeckname)
          (setdeckklass)
          (setavatar)
          (addfriend)
          (acceptfriend)
          (declfriend)
          (unfriend)
          (blockfriend)
          (unblckfriend)
          (makelobby)
          (destroylobby)
          (joinlobby)
          (leavelobby)
          (startgame)
          (endgame)
          (rmplayer)
          (rmlobby)
          (rmgame)
          (rmstat)
        );
      }
    }
  }
}
