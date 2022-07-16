#include "eterni_token.hpp"

void eterni_token::create (const name &issuer, const asset &maximum_supply) {
  require_auth(get_self());

  symbol sym = maximum_supply.symbol;

  check(sym.is_valid(), "invalid symbol name");
  check(maximum_supply.is_valid(), "invalid supply");
  check(maximum_supply.amount > 0, "max-supply must be positive");

  stats::const_iterator existing = stats_table.find(sym.code().raw());

  check(existing == stats_table.end(), "token with symbol already exists");

  stats_table.emplace(get_self(), [&](currency_stats &stat) {
    stat.supply.symbol = maximum_supply.symbol;
    stat.max_supply = maximum_supply;
    stat.issuer = issuer;
  });
}

void eterni_token::issue (const name &to, const asset &quantity, const string &memo) {
  symbol sym = quantity.symbol;

  check(sym.is_valid(), "invalid symbol name");
  check(memo.size() <= 256, "memo has more than 256 bytes");

  stats::const_iterator stat_iterator = stats_table.find(sym.code().raw());

  check(stat_iterator != stats_table.end(), "token with symbol does not exist, create token before issue");

  const currency_stats &st = *stat_iterator;

  check(to == st.issuer, "tokens can only be issued to issuer account");

  require_auth(st.issuer);

  check(quantity.is_valid(), "invalid quantity");
  check(quantity.amount > 0, "must issue positive quantity");
  check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
  check(quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

  stats_table.modify(st, same_payer, [&](currency_stats& s) {
    s.supply += quantity;
  });

  add_balance(st.issuer, quantity, st.issuer);
}

void eterni_token::retire (const asset &quantity, const string &memo) {
  symbol sym = quantity.symbol;

  check(sym.is_valid(), "invalid symbol name");
  check(memo.size() <= 256, "memo has more than 256 bytes");

  stats::const_iterator existing = stats_table.find(sym.code().raw());

  check(existing != stats_table.end(), "token with symbol does not exist");

  const auto &st = *existing;

  require_auth(st.issuer);

  check(quantity.is_valid(), "invalid quantity");
  check(quantity.amount > 0, "must retire positive quantity");
  check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");

  stats_table.modify(st, same_payer, [&](auto& s) {
    s.supply -= quantity;
  });

  sub_balance(st.issuer, quantity);
}

void eterni_token::transfer (const name &from, const name &to, const asset &quantity, const string &memo) {
  check(from != to, "cannot transfer to self");

  require_auth(from);

  check(is_account(to), "to account does not exist");

  const symbol_code sym_code = quantity.symbol.code();
  const currency_stats &st = stats_table.get(sym_code.raw());

  require_recipient(from);
  require_recipient(to);

  check(quantity.is_valid(), "invalid quantity");
  check(quantity.amount > 0, "must transfer positive quantity");
  check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
  check(memo.size() <= 256, "memo has more than 256 bytes");

  name payer = has_auth(to) ? to : from;

  sub_balance(from, quantity);
  add_balance(to, quantity, payer);
}

void eterni_token::sub_balance (const name &owner, const asset &value) {
  accounts from_acnts(get_self(), owner.value);

  const account& from = from_acnts.get(value.symbol.code().raw(), "no balance object found");
  check(from.balance.amount >= value.amount, "overdrawn balance");

  from_acnts.modify(from, owner, [&](auto& a) {
    a.balance -= value;
  });
}

void eterni_token::add_balance (const name &owner, const asset &value, const name &ram_payer) {
  accounts to_acnts(get_self(), owner.value);
  auto to = to_acnts.find(value.symbol.code().raw());

  if (to == to_acnts.end()) {
    to_acnts.emplace(ram_payer, [&](account &a){
      a.balance = value;
    });
  } else {
    to_acnts.modify(to, same_payer, [&](account &a) {
      a.balance += value;
    });
  }
}

void eterni_token::open (const name &owner, const symbol &symbol, const name &ram_payer) {
  require_auth(ram_payer);

  check(is_account(owner), "owner account does not exist");

  auto sym_code_raw = symbol.code().raw();
  stats statstable( get_self(), sym_code_raw );
  const auto& st = statstable.get( sym_code_raw, "symbol does not exist" );
  check( st.supply.symbol == symbol, "symbol precision mismatch" );

  accounts acnts( get_self(), owner.value );
  auto it = acnts.find( sym_code_raw );

  if (it == acnts.end()) {
    acnts.emplace( ram_payer, [&]( auto& a ){
      a.balance = asset{0, symbol};
    });
  }
}

void eterni_token::close (const name &owner, const symbol &symbol) {
  require_auth(owner);

  accounts acnts(get_self(), owner.value);
  accounts::const_iterator it = acnts.find(symbol.code().raw());

  check(it != acnts.end(), "Balance row already deleted or never existed. Action won't have any effect.");
  check(it->balance.amount == 0, "Cannot close because the balance is not zero.");

  acnts.erase(it);
}
