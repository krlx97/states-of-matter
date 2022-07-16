#include "eterni_svm.hpp"

void eterni_svm::authenticate (const name &name, const signature &signature) {
  accounts::const_iterator account_iterator = accounts_table.find(name.value);

  check(account_iterator != accounts_table.end(), "Account not found.");

  const account &account = *account_iterator;
  const string nonce = to_string(account.nonce);
  const checksum256 digest = sha256(nonce.c_str(), nonce.length());

  assert_recover_key(digest, signature, account.public_key);

  accounts_table.modify(account_iterator, get_self(), [&](eterni_svm::account &account) {
    account.nonce += 1;
  });
}

void eterni_svm::activate (const name &name, const signature &signature) {
  accounts::const_iterator account_iterator = accounts_table.find(name.value);
  const account &acc = *account_iterator;

  check(acc.is_activated == false, "Account already activated.");

  authenticate(name, signature);

  const accounts::const_iterator admin_iterator = accounts_table.find("admin"_n.value);
  const asset activate_cost = asset(100000, {"TLOS", 4});

  sub_balance(account_iterator, activate_cost);
  add_balance(admin_iterator, activate_cost);

  accounts_table.modify(account_iterator, get_self(), [&](account &account) {
    account.is_activated = true;
  });
}

void eterni_svm::flush (const asset &currency, const symbol &governance_symbol) {
  require_auth({"eternisom111"_n, "active"_n});

  const setting setting = settings_table.get();
  const string memo = "Daily mint.";

  action(
    permission_level{get_self(), "active"_n},
    setting.token_contract,
    "issue"_n,
    make_tuple(get_self(), currency, memo)
  ).send();

  const uint64_t symbol_raw = governance_symbol.code().raw();
  supplies::const_iterator currency_iterator = supplies_table.find(currency.symbol.code().raw());
  supply supply = supplies_table.get(symbol_raw);
  const asset governance = supply.asset;

  check(governance.amount > 0, "Can't flush, no governance tokens minted yet.");

  const asset currency_per_governance = currency / governance.amount;

  supplies_table.modify(currency_iterator, get_self(), [&](eterni_svm::supply &row) {
    row.asset += currency;
  });

  flushloop(currency_per_governance, governance_symbol, accounts_table.begin());
}

void eterni_svm::signup (const name &name, const public_key &public_key) {
  check(name.length() >= 3, "Name mustn't be less than 3 characters.");
  check(name.prefix() != "dev"_n, "Names starting with \"dev.\" are reserved.");

  const accounts::const_iterator account_iterator = accounts_table.find(name.value);

  check(account_iterator == accounts_table.end(), "Name taken.");

  accounts_table.emplace(get_self(), [&](account &account) {
    account = {
      .name = name,
      .public_key = public_key,
      .nonce = 0,
      .joined_at = current_time_point().sec_since_epoch(),
      .is_activated = false,
      .assets = {
        asset(0, {"TLOS", 4}),
        asset(0, {"LMT", 4}),
        asset(0, {"DMT", 0})
      }
    };
  });
}

void eterni_svm::setavatar (const name &name, const signature &signature, const uint16_t &avatar_id) {
  check(avatar_id >= 0 && avatar_id <= 4, "Invalid avatar.");

  authenticate(name, signature);

  accounts::const_iterator account_iterator = accounts_table.find(name.value);

  accounts_table.modify(account_iterator, get_self(), [&](account &account) {
    account.avatar_id = avatar_id;
  });
}

void eterni_svm::transfer (
  const name &from,
  const name &to,
  const asset &quantity,
  const string &memo,
  const signature &signature,
  const bool &is_withdraw
) {
  check(from != to, "Cannot transfer to self.");
  check(quantity.is_valid(), "Invalid asset.");
  check(quantity.amount > 0, "Must transfer positive quantity.");
  check(memo.size() <= 256, "Memo cannot have more than 256 characters.");

  const uint64_t symbol_raw = quantity.symbol.code().raw();
  supplies::const_iterator supplies_iterator = supplies_table.find(symbol_raw);
  check(supplies_iterator != supplies_table.end(), "Token not supported.");

  accounts::const_iterator sender_iterator = accounts_table.find(from.value);
  check(sender_iterator != accounts_table.end(), "Sender account not found.");

  authenticate(from, signature);

  const setting setting = settings_table.get();
  asset quantity_fee;

  for (const asset &fee: setting.fees) {
    if (fee.symbol == quantity.symbol) {
      quantity_fee = fee;
      break;
    }
  }

  const account &sender = *sender_iterator;

  for (const asset &asset: sender.assets) {
    if (asset.symbol == quantity.symbol) {
      check(asset.amount >= quantity.amount, "Insufficient balance.");
      check(asset.amount >= quantity.amount + quantity_fee.amount, "Insufficient balance to pay the fees.");
      break;
    }
  }

  sub_balance(sender_iterator, quantity + quantity_fee);
  add_balance(accounts_table.find("admin"_n.value), quantity_fee);

  if (is_withdraw) {
    check(sender_iterator->is_activated == true, "Account not activated.");

    const supply &supply = *supplies_iterator;

    action(
      permission_level{get_self(), "active"_n},
      supply.contract,
      "transfer"_n,
      make_tuple(get_self(), to, quantity, memo)
    ).send();

    supplies_table.modify(supplies_iterator, get_self(), [&](eterni_svm::supply &supply) {
      supply.asset -= quantity;
    });
  } else {
    const accounts::const_iterator receiver_iterator = accounts_table.find(to.value);
    check(receiver_iterator != accounts_table.end(), "Receiver account not found.");

    add_balance(receiver_iterator, quantity);
  }
}

void eterni_svm::init () {
  require_auth(get_self());

  const setting setting = {
    .token_contract = "eternitkn111"_n,
    .fees = {
      asset(1000, {"TLOS", 4}),
      asset(10000, {"LMT", 4})
    }
  };

  settings_table.set(setting, get_self());
}

void eterni_svm::create (const name &contract, const symbol &symbol) {
  require_auth(get_self());

  check(symbol.is_valid(), "Invalid symbol.");

  const uint64_t sumbol_raw = symbol.code().raw();
  const supplies::const_iterator supply_iterator = supplies_table.find(sumbol_raw);

  check(supply_iterator == supplies_table.end(), "Token is already registered.");

  supplies_table.emplace(get_self(), [&](supply &supply) {
    supply = {
      .contract = contract,
      .asset = asset(0, symbol)
    };
  });
}

void eterni_svm::issue (
  const name &from,
  const name &to,
  const asset &quantity,
  const string &memo
) {
  if (from == get_self()) { return; }

  check(quantity.symbol.is_valid(), "Invalid symbol.");
  check(quantity.is_valid(), "Invalid asset.");
  check(quantity.amount > 0, "Must issue positive quantity.");
  check(memo.size() <= 256, "Memo has more than 256 bytes.");
  check(to == get_self(), "Forbidden.");

  // need better solution for this
  const name receiver = get_first_receiver();

  check(receiver == "eosio.token"_n || receiver == "eternitkn111"_n, "Token not supported.");

  const uint64_t name_value = name(memo).value;
  const accounts::const_iterator account_itr = accounts_table.find(name_value);

  check(account_itr != accounts_table.end(), "Account not found.");

  const uint64_t symbol_raw = quantity.symbol.code().raw();
  const supplies::const_iterator supplies_itr = supplies_table.find(symbol_raw);

  check(supplies_itr != supplies_table.end(), "Token not found.");

  supplies_table.modify(supplies_itr, get_self(), [&](supply &supply) {
    supply.asset += quantity;
  });

  add_balance(account_itr, quantity);
}

void eterni_svm::sub_balance (accounts::const_iterator account_iterator, asset asset) {
  accounts_table.modify(account_iterator, get_self(), [&](account &account) {
    for (eosio::asset &account_asset: account.assets) {
      if (asset.symbol == account_asset.symbol) {
        check(account_asset.amount >= asset.amount, "Overdrawn balance.");
        account_asset -= asset;
        break;
      }
    }
  });
}

void eterni_svm::add_balance (accounts::const_iterator account_iterator, asset asset) {
  accounts_table.modify(account_iterator, get_self(), [&](account &account) {
    for (eosio::asset &account_asset: account.assets) {
      if (asset.symbol == account_asset.symbol) {
        account_asset += asset;
        break;
      }
    }
  });
}

void eterni_svm::temp () {
  require_auth(get_self());

  accounts_table.erase(
    accounts_table.find("tes"_n.value)
  );
}

void eterni_svm::flushloop (
  const asset &currency_per_governance,
  const symbol &governance_symbol,
  accounts::const_iterator itr
) {
  const account &account = *itr;

  for (const asset &tkn: account.assets) {
    if (tkn.symbol == governance_symbol) {
      const asset total = currency_per_governance * tkn.amount;
      add_balance(itr, total);
      break;
    }
  }

  ++itr;

  if (itr != accounts_table.end()) {
    flushloop(currency_per_governance, governance_symbol, itr);
  }
}
