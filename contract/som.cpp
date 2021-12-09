#include "som.hpp"

ACTION som::signin(public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  name username = player->username;

  string msg = format_string("signin:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  index.modify(player, _self, [&](auto &row) {
    if (row.account.lobby_id > 0) { row.account.status = INLOBBY; }
    else if (row.account.game_id > 0) { row.account.status = INGAME; }
    else { row.account.status = ONLINE; }
  });
}

ACTION som::signout(public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  name username = player->username;

  string msg = format_string("signout:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  index.modify(player, _self, [&](auto &row) { row.account.status = OFFLINE; });
}

ACTION som::signup(name username, public_key public_key) {
  auto player = players_table.find(username.value);

  check(player == players_table.end(), "Username taken.");

  account_t account = {OFFLINE, 0, 1, 0, 0, 0, 0};
  decks_t decks = {
    {0, "solid"_n, SOLID, {}},
    {1, "liquid"_n, LIQUID, {}},
    {2, "gas"_n, GAS, {}},
    {3, "plasma"_n, PLASMA, {}}
  };
  social_t social = {{}, {}, {}};

  players_table.emplace(_self, [&](auto &row) {
    row.username = username;
    row.public_key = public_key;
    row.account = account;
    row.decks = decks;
    row.social = social;
  });
}

ACTION som::savedeck(
  deck_cards_t cards,
  public_key public_key,
  signature signature
) {
  string msg = format_string("savedeck:%d", cards.size());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.decks.size(); i += 1) {
      if (row.decks[i].id == row.account.deck_id) {
        row.decks[i].cards = cards;
        break;
      }
    }
  });
}

ACTION som::selectdeck(
  uint8_t deck_id,
  public_key public_key,
  signature signature
) {
  string msg = format_string("selectdeck:%u", deck_id);
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    row.account.deck_id = deck_id;
  });
}

ACTION som::setdeckname(
  uint8_t id,
  name name,
  public_key public_key,
  signature signature
) {
  string msg = format_string("setdeckname:%s", name.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.decks.size(); i += 1) {
      if (row.decks[i].id == id) {
        row.decks[i].name = name;
        break;
      }
    }
  });
}

ACTION som::setdeckklass(
  uint8_t id,
  uint8_t klass,
  public_key public_key,
  signature signature
) {
  string msg = format_string("setdeckklass:%u", klass);
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.decks.size(); i += 1) {
      if (row.decks[i].id == id) {
        row.decks[i].klass = klass;
        row.decks[i].cards = {};
        break;
      }
    }
  });
}

ACTION som::setavatar(
  uint8_t avatar_id,
  public_key public_key,
  signature signature
) {
  string msg = format_string("setavatar:%u", avatar_id);
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    row.account.avatar_id = avatar_id;
  });
}

ACTION som::addfriend(
  name friendname,
  public_key public_key,
  signature signature
) {
  string msg = format_string("addfriend:%s", friendname.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto frnd = players_table.find(friendname.value);

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

ACTION som::acceptfriend(
  name friendname,
  public_key public_key,
  signature signature
) {
  string msg = format_string("acceptfriend:%s", friendname.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto frnd = players_table.find(friendname.value);

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.social.requests.size(); i += 1) {
      if (row.social.requests[i] == friendname) {
        row.social.requests.erase(row.social.requests.begin() + i);
        break;
      }
    }

    row.social.friends.push_back(friendname);
  });

  players_table.modify(frnd, _self, [&](auto &row) {
    row.social.friends.push_back(player->username);
  });
}

ACTION som::declfriend(
  name username,
  public_key public_key,
  signature signature
) {
  string msg = format_string("declfriend:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.social.requests.size(); i += 1) {
      if (row.social.requests[i] == username) {
        row.social.requests.erase(row.social.requests.begin() + i);
        break;
      }
    }
  });
}

ACTION som::unfriend(
  name friendname,
  public_key public_key,
  signature signature
) {
  string msg = format_string("unfriend:%s", friendname.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto frnd = players_table.find(friendname.value);

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.social.friends.size(); i += 1) {
      if (row.social.friends[i] == friendname) {
        row.social.friends.erase(row.social.friends.begin() + i);
        break;
      }
    }
  });

  players_table.modify(frnd, _self, [&](auto &row) {
    for (int i = 0; i < row.social.friends.size(); i += 1) {
      if (row.social.friends[i] == player->username) {
        row.social.friends.erase(row.social.friends.begin() + i);
        break;
      }
    }
  });
}

ACTION som::blockfriend(
  name friendname,
  public_key public_key,
  signature signature
) {
  string msg = format_string("blockfriend:%s", friendname.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto frnd = players_table.find(friendname.value);

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.social.friends.size(); i += 1) {
      if (row.social.friends[i] == friendname) {
        row.social.friends.erase(row.social.friends.begin() + i);
        row.social.blocked.push_back(friendname);
        break;
      }
    }
  });

  players_table.modify(frnd, _self, [&](auto &row) {
    for (int i = 0; i < row.social.friends.size(); i += 1) {
      if (row.social.friends[i] == player->username) {
        row.social.friends.erase(row.social.friends.begin() + i);
        break;
      }
    }
  });
}

ACTION som::unblckfriend(
  name friendname,
  public_key public_key,
  signature signature
) {
  string msg = format_string("unblckfriend:%s", friendname.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  index.modify(player, _self, [&](auto &row) {
    for (int i = 0; i < row.social.blocked.size(); i += 1) {
      if (row.social.blocked[i] == friendname) {
        row.social.blocked.erase(row.social.blocked.begin() + i);
        break;
      }
    }
  });
}





// sig: makelobby:{username}
ACTION som::makelobby(uint64_t lobby_id, public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  name username = player->username;

  string msg = format_string("makelobby:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  check(player->account.lobby_id == 0, "You are already in a lobby.");
  check(player->account.game_id == 0, "You can't create a lobby while in-game.");

  lobbies_table.emplace(_self, [&](auto &row) {
    row.lobby_id = lobby_id;
    row.host = {
      player->username,
      player->account.avatar_id
    };
    row.challengee = {};
  });

  index.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = lobby_id;
    row.account.status = INLOBBY;
  });
}

// sig: destroylobby:{username}
ACTION som::destroylobby(public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  uint64_t lobby_id = player->account.lobby_id;

  auto lobby = lobbies_table.find(lobby_id);
  auto challengee = players_table.find(lobby->challengee.username.value);

  name username = player->username;

  string msg = format_string("destroylobby:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  check(username == lobby->host.username, "You are not the host.");

  index.modify(player, _self, [&](auto &row) {
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

// sig: joinlobby:{username}
ACTION som::joinlobby(uint64_t lobby_id, public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto lobby = lobbies_table.find(lobby_id);

  name username = player->username;

  string msg = format_string("joinlobby:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  check(lobby->challengee.username == ""_n, "Lobby is full.");
  check(player->account.lobby_id == 0, "You are already in a lobby.");
  check(player->account.game_id == 0, "You can't join a lobby while in-game.");

  lobbies_table.modify(lobby, _self, [&](auto &row) {
    row.challengee = {
      player->username,
      player->account.avatar_id
    };
  });

  index.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = lobby_id;
    row.account.status = INLOBBY;
  });
}

// sig: leavelobby:{username}
ACTION som::leavelobby(public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  name username = player->username;
  uint64_t lobby_id = player->account.lobby_id;

  auto lobby = lobbies_table.find(lobby_id);

  string msg = format_string("leavelobby:%s", username.to_string().c_str());
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  check(lobby_id != 0, "You are not in a lobby.");

  lobbies_table.modify(lobby, _self, [&](auto &row) {
    row.challengee = {};
  });

  index.modify(player, _self, [&](auto &row) {
    row.account.lobby_id = 0;
    row.account.status = ONLINE;
  });
}






ACTION som::startgame(
  uint64_t lobby_id,
  public_key public_key,
  signature signature
) {
  string msg = format_string("startgame:%u", lobby_id);
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto lobby = lobbies_table.find(lobby_id);
  auto challengee = players_table.find(lobby->challengee.username.value);

  index.modify(player, _self, [&](auto &row) {
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

ACTION som::endgame(
  uint64_t game_id,
  public_key public_key,
  signature signature
) {
  string msg = format_string("endgame:%u", game_id);
  checksum256 digest = sha256(msg.c_str(), msg.length());
  assert_recover_key(digest, signature, public_key);

  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));
  auto game = games_table.find(game_id);
  auto challengee = players_table.find(game->player_b.value);

  index.modify(player, _self, [&](auto &row) {
    row.account.game_id = 0;
    row.account.status = ONLINE;
  });

   players_table.modify(challengee, _self, [&](auto &row) {
    row.account.game_id = 0;
    row.account.status = ONLINE;
  });

  games_table.erase(game);
}

//sig: playcard:{username}
ACTION som::playcard(string field, uint16_t gid, uint16_t id, public_key public_key, signature signature) {
  auto index = players_table.get_index<by_public_key>();
  auto player = index.find(public_key_to_fixed_bytes(public_key));

  // name username = player->username;

  // string msg = format_string("playcard:%s", username.to_string().c_str());
  // checksum256 digest = sha256(msg.c_str(), msg.length());
  // assert_recover_key(digest, signature, public_key);

  // uint64_t game_id = player->account.game_id;

  // auto game = games_table.find(game_id);

  // games_table.modify(game, _self, [&](auto &row) {
  //   if (row.player_a.username == username) {
  //     for (int i = 0; i < row.player_a.hand.size(); i += 1) {
  //       if (row.player_a.hand[i].gid == gid) {
  //         row.player_a.fields.minion_b = {gid, id};
  //         row.player_a.hand.erase(row.player_a.hand.begin() + i);
  //         break;
  //       }
  //     }
  //   } else {
  //     for (int i = 0; i < row.player_b.hand.size(); i += 1) {
  //       if (row.player_b.hand[i].gid == gid) {
  //         row.player_b.fields.minion_b = {gid, id};
  //         row.player_b.hand.erase(row.player_b.hand.begin() + i);
  //         break;
  //       }
  //     }
  //   }
  // });
}

ACTION som::rmplayer(name username) {
  auto player = players_table.find(username.value);
  players_table.erase(player);
}
ACTION som::rmlobby(uint64_t lobby_id) {
  auto lobby = lobbies_table.find(lobby_id);
  lobbies_table.erase(lobby);
}
ACTION som::rmgame(uint64_t game_id) {
  auto game = games_table.find(game_id);
  games_table.erase(game);
}

EOSIO_DISPATCH(
  som,
  // Auth
  (signin)
  (signout)
  (signup)
  // Client
  (savedeck)
  (selectdeck)
  (setdeckname)
  (setdeckklass)
  (setavatar)
  // Social
  (addfriend)
  (acceptfriend)
  (declfriend)
  (unfriend)
  (blockfriend)
  (unblckfriend)
  // Lobbies
  (makelobby)
  (destroylobby)
  (joinlobby)
  (leavelobby)
  (startgame)
  (endgame)
  (playcard)
  // Dev
  (rmplayer)
  (rmlobby)
  (rmgame)
);