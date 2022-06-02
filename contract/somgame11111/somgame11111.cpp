#include "somgame11111.hpp"
#include "base58.c"

ACTION somgame11111::signup (name username, public_key public_key) {
  players::const_iterator player = players_table.find(username.value);

  check(player == players_table.end(), "Username taken.");

  wallet_t wallet = {
    asset(0, symbol("TLOS", 4)),
    asset(0, symbol("LMTTEST", 4)),
    asset(0, symbol("DMTTEST", 0)),
    asset(0, symbol("ATMOS", 4))
  };

  if (username == "admin"_n) {
    wallet = {
      asset(0, symbol("TLOS", 4)),
      asset(1000000000000, symbol("LMTTEST", 4)),
      asset(1000000000000000000, symbol("DMTTEST", 0)),
      asset(0, symbol("ATMOS", 4))
    };
  }

  players_table.emplace(_self, [&](auto &row) {
    row.username = username;
    row.public_key = public_key;
    row.nonce = 0;
    row.wallet = wallet;
  });
}

ACTION somgame11111::rmplayer (name username) {
  require_auth(_self);
  players_table.erase(players_table.find(username.value));
}

ACTION somgame11111::rmstat (uint64_t chain_id) {
  require_auth(_self);
  stats_table.erase(stats_table.find(chain_id));
}

ACTION somgame11111::flushtoken (name username, asset quantity) {
  require_auth(_self);
  sub_balance(players_table.find("admin"_n.value), quantity);
  add_balance(players_table.find(username.value), quantity);
}

ACTION somgame11111::create (name contract, symbol symbol) {
  require_auth(_self);

  auto symbol_index = stats_table.get_index<BY_SYMBOL>();
  uint128_t merged = merge_contract_symbol(contract, symbol);
  auto stat = symbol_index.find(merged);

  check(stat == symbol_index.end(), "Token is already registered.");
  check(symbol.is_valid(),          "Invalid symbol.");

  stats_table.emplace(_self, [&](auto& row) {
    row.chain_id = stats_table.available_primary_key();
    row.symbol = symbol;
    row.contract = contract;
    row.supply = asset(0, symbol);
  });
}

ACTION somgame11111::retire (name contract, symbol symbol) {
  require_auth(_self);

  auto symbol_index = stats_table.get_index<BY_SYMBOL>();
  uint128_t merged = merge_contract_symbol(contract, symbol);
  auto stat = symbol_index.find(merged);

  check(stat != symbol_index.end(), "Token doesn't exist.");
  check(symbol.is_valid(),          "Invalid symbol.");

  symbol_index.erase(stat);
}

void somgame11111::issue (name from, name to, asset quantity, string memo) {
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

ACTION somgame11111::transfer (
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

somgame11111::players::const_iterator somgame11111::authenticate (auth_t auth) {
  players::const_iterator player = players_table.find(auth.username.value);

  check(player != players_table.end(), "Player not found.");

  string msg = format_string("%i", player->nonce + 1);
  checksum256 digest = sha256(msg.c_str(), msg.length());

  assert_recover_key(digest, auth.signature, player->public_key);

  players_table.modify(player, _self, [&](auto &row) { row.nonce += 1; });

  return player;
}

void somgame11111::sub_balance (players::const_iterator itr, asset token) {
  players_table.modify(itr, _self, [&](auto& player) {
    for (asset& wallet: player.wallet) {
      if (wallet.symbol == token.symbol) {
        check(wallet.amount >= token.amount, "Overdrawn balance.");
        wallet -= token;
        break;
      }
    }

    // for (int i = 0; i < row.wallet.size(); i += 1) {
    //   if (row.wallet[i].symbol == asset.symbol) {
    //     check(row.wallet[i].amount >= asset.amount, "Overdrawn balance.");

    //     row.wallet[i] -= asset;
    //     break;
    //   }
    // }
  });
}

void somgame11111::add_balance (players::const_iterator itr, asset token) {
  players_table.modify(itr, _self, [&](auto& player) {
    for (int i = 0; i < player.wallet.size(); i += 1) {
      if (player.wallet[i].symbol == token.symbol) {
        player.wallet[i] += token;
        break;
      }
    }
  });
}

extern "C" {
  void apply (uint64_t receiver, uint64_t code, uint64_t action) {
    auto _self = receiver;

    if (code != _self && action == "transfer"_n.value) {
      execute_action(name(receiver), name(code), &somgame11111::issue);
    } else if (code == _self && action == "create"_n.value) {
      execute_action(name(receiver), name(code), &somgame11111::create);
    } else if (code == _self && action == "transfer"_n.value) {
      execute_action(name(receiver), name(code), &somgame11111::transfer);
    } else if (code == receiver) {
      switch (action) {
        EOSIO_DISPATCH_HELPER(
          somgame11111,
          (signup)
          (rmplayer)
          (rmstat)
          (flushtoken)
          (retire)
        );
      }
    }
  }
}
