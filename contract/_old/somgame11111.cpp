#include "somgame11111.hpp"
#include "base58.c"

ACTION somgame11111::signin (auth_t auth) {
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

ACTION somgame11111::signout (auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.status = OFFLINE;
  });
}

ACTION somgame11111::signup (name username, public_key public_key) {
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
    asset(0, symbol("LMTTEST", 4)),
    asset(0, symbol("DMTTEST", 0)),
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

ACTION somgame11111::savedeck (deck_cards_t cards, auth_t auth) {
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

ACTION somgame11111::selectdeck (uint8_t deck_id, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    row.account.deck_id = deck_id;
  });
}

ACTION somgame11111::setdeckname (uint8_t id, name name, auth_t auth) {
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

ACTION somgame11111::setdeckklass (uint8_t id, uint8_t klass, auth_t auth) {
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

ACTION somgame11111::setavatar (uint8_t avatar_id, auth_t auth) {
  players::const_iterator i = authenticate(auth);

  players_table.modify(i, get_self(), [&](player& player) {
    player.avatar_id = avatar_id;
  });
}

ACTION somgame11111::addfriend (name friendname, auth_t auth) {
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

ACTION somgame11111::acceptfriend (name friendname, auth_t auth) {
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

ACTION somgame11111::declfriend (name username, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &requests = row.social.requests;
    vector<name>::iterator i = find(requests.begin(), requests.end(), username);

    requests.erase(i);
  });
}

ACTION somgame11111::unfriend (name friendname, auth_t auth) {
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

ACTION somgame11111::blockfriend (name friendname, auth_t auth) {
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

ACTION somgame11111::unblckfriend (name friendname, auth_t auth) {
  players::const_iterator player = authenticate(auth);

  players_table.modify(player, _self, [&](auto &row) {
    vector<name> &blocked = row.social.blocked;
    vector<name>::iterator i = find(blocked.begin(), blocked.end(), friendname);

    blocked.erase(i);
  });
}

ACTION somgame11111::makelobby (uint64_t lobby_id, auth_t auth) {
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

ACTION somgame11111::destroylobby (auth_t auth) {
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

ACTION somgame11111::joinlobby (uint64_t lobby_id, auth_t auth) {
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

ACTION somgame11111::leavelobby (auth_t auth) {
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

ACTION somgame11111::startgame (uint64_t lobby_id, auth_t auth) {
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

ACTION somgame11111::endgame (uint64_t game_id, auth_t auth) {
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

ACTION somgame11111::rmplayer (name username) {
  players::const_iterator player = players_table.find(username.value);
  players_table.erase(player);
}

ACTION somgame11111::rmlobby (uint64_t lobby_id) {
  lobbies::const_iterator lobby = lobbies_table.find(lobby_id);
  lobbies_table.erase(lobby);
}

ACTION somgame11111::rmgame (uint64_t game_id) {
  games::const_iterator game = games_table.find(game_id);
  games_table.erase(game);
}

ACTION somgame11111::flushtoken (name username, asset quantity) {
  require_auth(_self);

  players::const_iterator admin = players_table.find("admin"_n.value);
  players::const_iterator player = players_table.find(username.value);

  players_table.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.wallet.size(); i += 1) {
      if (row.wallet[i].symbol == quantity.symbol) {
        row.wallet[i] += quantity;
        break;
      }
    }
  });

  players_table.modify(admin, _self, [&](auto &row) {
    for (int i = 0; i < row.wallet.size(); i += 1) {
      if (row.wallet[i].symbol == quantity.symbol) {
        row.wallet[i] -= quantity;
        break;
      }
    }
  });
}

somgame11111::players::const_iterator somgame11111::authenticate (auth_t auth) {
  action(
    permission_level{get_self(), "active"_n},
    "eternichain1"_n,
    "authenticate"_n,
    make_tuple(auth.username, auth.signature)
  ).send();

  players::const_iterator i = players_table.find(auth.username.value);

  check(i != players_table.end(), "Player not found.");

  string msg = format_string("%i", i->nonce + 1);
  checksum256 digest = sha256(msg.c_str(), msg.length());

  assert_recover_key(digest, auth.signature, i->public_key);

  players_table.modify(i, get_self(), [&](player& player) {
    // player.nonce += 1;
  });

  return i;
}

EOSIO_DISPATCH(somgame11111,
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
  (flushtoken)
);
