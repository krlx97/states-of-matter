#include "../include/EterniSVM.hpp"

#include "./globals.cpp"

/*********************
  Core
*********************/

// Creates a new Eternitas account.
void EterniSVM::signup (const Name &name, const PublicKey &publicKey) {
  require_auth(get_self());
  checkfreeze();

  check(name.length() >= 3, "Name cannot be less than 3 characters.");
  check(name.prefix() != "dev."_n, "Name cannot start with \"dev.\".");

  const AccountItr accountItr = accountsTable.find(name.value);

  check(accountItr == accountsTable.end(), "Account name taken.");

  accountsTable.emplace(get_self(), [&](Account &account) {
    account.profile.publicKey = publicKey;
    account.profile.name = name;
    account.profile.joinedAt = current_time_point().sec_since_epoch();
    account.lastUpdate = getCurrentSecond();
  });

  //Code to manage account deletion
  Uint64 cur_accounts = getglobalint(Name("accounts.cur"));
  Uint64 max_accounts = getglobalint(Name("accounts.max"));

  if(cur_accounts >= max_accounts) {
    check(max_accounts >= 1, "Contract error, accounts.max is set wrong. ");

    //code to delete old account
    auto idx_Account = accountsTable.get_index<"byrelevant"_n>();
    auto itr_Scnd_Account = idx_Account.end();
    itr_Scnd_Account--;

    //code to clear out token balances
    //code to clear our nft balances

    //enable account deletion, when tokens are handled
    //idx_Account.erase(itr_Scnd_Account);
    //setglobalint(Name("accounts.cur"), cur_accounts - 1);
  }

  setglobalint(Name("accounts.cur"), cur_accounts + 1);
}

// Creates a new Eternitas Developer account.
void EterniSVM::signupdev (const Name &name, const PublicKey &publicKey) {
  require_auth(get_self());
  checkfreeze();

  check(name.prefix() == "dev."_n, "Name must start with \"dev.\".");

  const AccountItr accountItr = accountsTable.find(name.value);

  check(accountItr == accountsTable.end(), "Account name taken.");

  accountsTable.emplace(get_self(), [&](Account &account) {
    account.profile.publicKey = publicKey;
    account.profile.name = name;
    account.profile.isActivated = true;
    account.profile.joinedAt = current_time_point().sec_since_epoch();
  });
}

// Activates the account, allowing it to transfer assets.
void EterniSVM::activate (const Name &name, const Signature &signature) {
  checkfreeze();
  
  const ExtendedAsset price = configTable.get().activatePrice;
  const FtSupplyItr ftSupplyItr = getFtSupplyItr(price.quantity.symbol);
  const AccountItr accountItr = svmAuth(name, signature);

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    Bool &isActivated = account.profile.isActivated;

    check(!isActivated, "Account is already activated.");
    deductBalance(account, price);

    isActivated = true;
  });

  ftSuppliesTable.modify(ftSupplyItr, get_self(), [&](FtSupply &ftSupply) {
    ftSupply.liquid -= price.quantity;
    ftSupply.payments += price.quantity;
  });
}

// Sets an avatar visible in any dapp running on Eternitas SVM.
void EterniSVM::setavatar (
  const Name &name,
  const Signature &signature,
  const Name &group,
  const Uint64 &serial
) {
  checkfreeze();

  const Name nftContract = configTable.get().nftGame;
  const NftSupplyItr nftSupplyItr = getNftSupplyItr(nftContract);
  const AccountItr accountItr = svmAuth(name, signature);

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    account.profile.avatarId = serial;
  });
}

/*********************
  Staking
*********************/

// Stakes a fungible token for vote power and rewards.
void EterniSVM::stake (
  const Name &name,
  const Signature &signature,
  const ExtendedAsset &token
) {
  checkfreeze();

  check(token.quantity.amount > 0, "Must stake positive amount.");

  const Symbol &symbol = token.quantity.symbol;

  check(symbol != TLOS, "TLOS cannot be staked.");

  const FtSupplyItr ftSupplyItr = getFtSupplyItr(symbol);
  const AccountItr accountItr = svmAuth(name, signature);

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    deductBalance(account, token);
    payFee(account);
    addStake(account, token);
  });

  ftSuppliesTable.modify(ftSupplyItr, get_self(), [&](FtSupply &ftSupply) {
    ftSupply.liquid -= token.quantity;
    ftSupply.staked += token.quantity;
  });
}

// Unstakes a fungible token, which can be claimed after 21 days.
void EterniSVM::unstake (
  const Name &name,
  const Signature &signature,
  const ExtendedAsset &token
) {
  checkfreeze();

  check(token.quantity.amount > 0, "Must unstake positive amount.");

  const Symbol &symbol = token.quantity.symbol;

  check(symbol != TLOS, "TLOS cannot be staked.");

  const FtSupplyItr ftSupplyItr = getFtSupplyItr(symbol);
  const AccountItr accountItr = svmAuth(name, signature);

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    deductStake(account, token);
    payFee(account);
  });

  ftSuppliesTable.modify(ftSupplyItr, get_self(), [&](FtSupply &ftSupply) {
    ftSupply.staked -= token.quantity;
    ftSupply.unstaking += token.quantity;
  });
}

// Claims token which vesting date has expired.
void EterniSVM::claim (
  const Name &name,
  const Signature &signature,
  const ExtendedSymbol &symbol,
  const Uint32 &date
) {
  checkfreeze();

  AccountItr accountItr = svmAuth(name, signature);
  FtSupplyItr ftSupplyItr = getFtSupplyItr(symbol.get_symbol());

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    auto &fungible = account.tokens.fungible;
    auto fungibleItr = fungible.find(symbol);

    if (fungibleItr != fungible.end()) {
      auto x = fungibleItr->second.claimable.at(date);

      check(x.is_valid(), "Invalid unstake.");

      payFee(account);
      addBalance(account, {x, symbol.get_contract()});

      account.tokens.fungible[symbol].unstaking -= x;
      account.tokens.fungible[symbol].claimable.erase(date);

      ftSuppliesTable.modify(ftSupplyItr, get_self(), [&](FtSupply &ftSupply) {
        ftSupply.liquid += x;
        ftSupply.unstaking -= x;
      });
    }
  });
}

// Flushes tokens from ft payments to accounts based on staked tokens.
void EterniSVM::flush (
  const Name &name,
  const Signature &signature,
  const Symbol &symbol
) {
  checkfreeze();

  check(symbol.is_valid(), "Invalid symbol");

  const AccountItr accountItr = svmAuth(name, signature);
  const FtSupplyItr ftSupplyItr = getFtSupplyItr(symbol);
  const FtSupply &ftSupply = *ftSupplyItr;

  check(ftSupply.staked.amount > 0, "Can't flush, no tokens staked yet");

  Asset toStake = ftSupply.payments / 100 * 60;
  Asset toLP = ftSupply.payments / 100 * 40;

  Asset tokenPerStake = toStake / ftSupply.staked.amount;
  Asset totalFlushed = Asset(0, symbol);

  for (
    AccountItr accountItr = accountsTable.begin();
    accountItr != accountsTable.end();
    ++accountItr
  ) {
    accountsTable.modify(accountItr, get_self(), [&](Account &account) {
      FtBalances &fungible = account.tokens.fungible;

      const FtBalances::iterator fungibleItr = fungible.find({symbol, "eternitkn131"_n});

      if (fungibleItr != fungible.end()) {
        Asset &stake = fungibleItr->second.staked;

        if (stake.amount <= 0) { return; }

        const Asset total = stake * tokenPerStake.amount;

        fungibleItr->second.liquid += total;
        fungibleItr->second.total += total;
        totalFlushed += total;
      }
    });
  }

  Asset rest = ftSupply.payments - totalFlushed;

  // accountsTable.modify(accountItr, get_self(), [&](Account &row) {
  //   row.assets.fungible.liquid[symbol] += rest;
  // });

  ftSuppliesTable.modify(ftSupply, get_self(), [&](FtSupply &row) {
    row.payments = rest;
  });
}

/*********************
  eosio.token VM
*********************/

void EterniSVM::swap (const Name &name, const Signature &signature, const Asset &asset) {
  checkfreeze();

  // amount is 1% smaller of price[n]_last amm.swaps pairs table
  // const String memo = fmt::format("swap,{},20", 9600);

  // const AccountItr accountItr = getAccountItr(name, signature);

  // accountsTable.modify(accountItr, get_self(), [&](Account &account) {
  //   addBalance(account, quantity);
  // });

  // action(
  //   permission_level{get_self(), "active"_n},
  //   "eosio.token"_n,
  //   "transfer"_n,
  //   make_tuple(get_self(), "amm.swaps"_n, asset, memo)
  // ).send();
}

// Transfers fungible tokens to Eternitas or Telos account.
void EterniSVM::transfer (
  const Name &from,
  const Name &to,
  const ExtendedAsset &quantity,
  const String &memo,
  const Signature &signature,
  const Bool &isWithdraw
) {
  checkfreeze();

  check(from != to, "Cannot transfer to self.");
  check(quantity.quantity.is_valid(), "Invalid asset.");
  check(quantity.quantity.amount > 0, "Must transfer positive quantity.");
  check(memo.size() <= 256, "Memo cannot have more than 256 characters.");

  const ExtendedSymbol &symbol = quantity.get_extended_symbol();
  const FtSupplyItr ftSupplyItr = getFtSupplyItr(quantity.quantity.symbol);
  const AccountItr accountItr = svmAuth(from, signature);

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    check(account.profile.isActivated, "Account is not activated.");

    deductBalance(account, quantity);
    payFee(account);

    account.tokens.fungible[symbol].total -= quantity.quantity;
  });

  // const FtSupplyItr ftTelosItr = getFtSupplyItr(TLOS);

  // ftSuppliesTable.modify(ftTelosItr, get_self(), [&](FtSupply &ftSupply) {
  //   ftSupply.payments += getFee();
  // });

  if (isWithdraw) {
    action(
      permission_level{get_self(), "active"_n},
      ftSupplyItr->total.contract,
      "transfer"_n,
      make_tuple(get_self(), to, quantity.quantity, memo)
    ).send();

    ftSuppliesTable.modify(ftSupplyItr, get_self(), [&](FtSupply &ftSupply) {
      ftSupply.total.quantity -= quantity.quantity;
      ftSupply.liquid -= quantity.quantity;
    });
  } else {
    const Account &receiver = accountsTable.get(to.value, "Receiver account not found.");

    accountsTable.modify(receiver, get_self(), [&](Account &account) {
      addBalance(account, quantity);

      account.tokens.fungible[symbol].total += quantity.quantity;
    });
  }
}

// Create a new virtual token, allowing it to be deposited to the SVM
void EterniSVM::create (const Name &contract, const Symbol &symbol) {
  require_auth(get_self());
  checkfreeze();

  const Asset token = Asset(0, symbol);
  const ExtendedAsset extendedToken = {token, contract};

  ftSuppliesTable.emplace(get_self(), [&](FtSupply &ftSupply) {
    ftSupply.total = extendedToken;
    ftSupply.liquid = token;
    ftSupply.staked = token;
    ftSupply.unstaking = token;
    ftSupply.payments = token;
  });
}

// On token transfer to contract, add same amount in virtual wallet to memo account.
void EterniSVM::onTransfer (
  const Name &from,
  const Name &to,
  Asset &quantity,
  const String &memo
) {
  checkfreeze();
  if (from == get_self()) { return; }
  if (memo == "amm.swaps: swap token" && get_first_receiver() == "eternitkn131"_n) { return; }

  check(to == get_self(), "Forbidden.");
  check(quantity.is_valid(), "Invalid asset.");
  check(quantity.amount > 0, "Asset amount cannot be negative.");
  check(memo.size() <= 256, "Memo cannot have more than 256 characters.");
  // check(checkTokenContract(get_first_receiver()), "Token contract not supported.");
  ExtendedAsset token = {quantity, get_first_receiver()};

  Uint64 nameVal = Name(memo).value;
  Uint64 symRaw = quantity.symbol.code().raw();
  const Account &account = accountsTable.get(nameVal, "Account not found.");
  const FtSupply &ftSupply = ftSuppliesTable.get(symRaw, "Token is not supported.");

  accountsTable.modify(account, get_self(), [&](Account &account) {
    addBalance(account, token);
    // addLiquid() ^
    account.tokens.fungible[token.get_extended_symbol()].total += token.quantity;
    // addTotal() ^
    // each should be separate function now, addTotal, addLiquid, addStake, addUnstaking
  });

  ftSuppliesTable.modify(ftSupply, get_self(), [&](FtSupply &row) {
    check(row.total.contract == get_first_receiver(), "Token is not supported.");

    row.total.quantity += quantity;
    row.liquid += quantity;
  });
}

/*********************
  marble VM
*********************/

void EterniSVM::mint (Uint64 i, Name name, Signature signature) {
  checkfreeze();
  check(i >= 0 && i <= 3, "Invalid NFT Group.");

  Name contract = configTable.get().nftGame;
  vector<Name> groups = {
    "forsakenseaf"_n,
    "cruelavet"_n,
    "enlightgl"_n,
    "graverobber"_n
  };

  Name &group = groups[i];
  NftSupplyItr nftSupplyItr = nftSuppliesTable.find(contract.value);

  check(nftSupplyItr != nftSuppliesTable.end(), "NFT not supported");

  AccountItr accountItr = svmAuth(name, signature);

  config cfg = nftConfig.get();
  Uint64 serial = cfg.last_serial + 1;

  shared_tags_table sharedTagsTable(ETERNITAS_NFT, group.value);
  shared_tags_table::const_iterator tagz = sharedTagsTable.find("author"_n.value);

  check(tagz != sharedTagsTable.end(), "Author not defined.");

  ExtendedAsset price = {{10000000, VMT}, "eternitkn131"_n};
  ExtendedAsset toAuthor = {{2500000, VMT}, "eternitkn131"_n};
  ExtendedAsset toFlush = {{7500000, VMT}, "eternitkn131"_n};

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    deductBalance(account, price);
    account.tokens.fungible[price.get_extended_symbol()].total -= price.quantity;

    account.tokens.nonFungible.serials.push_back(serial);
  });

  nftSuppliesTable.modify(nftSupplyItr, get_self(), [&](NftSupply &nftSupply) {
    nftSupply.serials.push_back(serial);
  });

  const FtSupplyItr ftVMTItr = getFtSupplyItr(VMT);

  ftSuppliesTable.modify(ftVMTItr, get_self(), [&](FtSupply &ftSupply) {
    ftSupply.liquid -= toFlush.quantity;
    ftSupply.payments += toFlush.quantity;
  });

  AccountItr authorItr = accountsTable.find(Name(tagz->content).value);

  check(authorItr != accountsTable.end(), "Author SVM account not found.");

  accountsTable.modify(authorItr, get_self(), [&](auto &acc) {
    addBalance(acc, toAuthor);
    acc.tokens.fungible[price.get_extended_symbol()].total += toAuthor.quantity;
  });

  action(
    permission_level{get_self(), "active"_n},
    ETERNITAS_NFT,
    "mintitem"_n,
    make_tuple(get_self(), group)
  ).send();
}

void EterniSVM::transferitem (
  name from,
  name to,
  vector<uint64_t> serials,
  string memo,
  Signature &signature,
  Bool &isWithdraw
) {
  checkfreeze();
  check(from != to, "Cannot transfer to self.");

  const NftSupplyItr nftSupplyItr = getNftSupplyItr(configTable.get().nftGame);
  const AccountItr accountItr = svmAuth(from, signature);

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    check(account.profile.isActivated, "Account is not activated.");

    auto &nftSerials = account.tokens.nonFungible.serials;
    auto begin = nftSerials.begin();
    auto end = nftSerials.end();

    for (const Uint64 &serial: serials) {
      Serials::iterator serialsItr = std::find(begin, end, serial);

      check(serialsItr != end, "You do not own the NFT.");

      nftSerials.erase(serialsItr);
    }

    payFee(account);
  });

  if (isWithdraw) {
    action(
      permission_level{get_self(), "active"_n},
      nftSupplyItr->contract,
      "transferitem"_n,
      make_tuple(get_self(), to, serials, memo)
    ).send();

    nftSuppliesTable.modify(nftSupplyItr, get_self(), [&](NftSupply &nftSupply) {
      auto begin = nftSupply.serials.begin();
      auto end = nftSupply.serials.end();

      for (const Uint64 &serial: serials) {
        Serials::iterator serialsItr = std::find(begin, end, serial);

        check(serialsItr != end, "Invalid NFT.");

        nftSupply.serials.erase(serialsItr);
      }
    });
  } else {
    const Account &receiver = accountsTable.get(to.value, "Receiver account not found.");

    accountsTable.modify(receiver, get_self(), [&](Account &account) {
      for (const Uint64 &serial: serials) {
        account.tokens.nonFungible.serials.push_back(serial);
      }
    });
  }
}

void EterniSVM::on_transferitem (
  name from,
  name to,
  vector<uint64_t> serials,
  string memo
) {
  if (from == get_self()) { return; }

  check(to == get_self(), "Forbidden.");

  const AccountItr accountItr = getAccountItr(Name(memo));
  const NftSupplyItr nftSupplyItr = getNftSupplyItr(configTable.get().nftGame);

  for (const Uint64 &serial: serials) {
    accountsTable.modify(accountItr, get_self(), [&](Account &account) {
      account.tokens.nonFungible.serials.push_back(serial);
    });

    nftSuppliesTable.modify(nftSupplyItr, get_self(), [&](NftSupply &nftSupply) {
      nftSupply.serials.push_back(serial);
    });
  }
}

/*********************
  Developer
*********************/

// Initializes contract settings.
void EterniSVM::configure () {
  require_auth(get_self());

  const Config config = {
    .cdtVersion = "3.0.0",
    .ftCore = "eosio.token"_n,
    .ftGame = "eternitkn131"_n,
    .nftGame = "eterninft131"_n,
    .activatePrice = {{100000, TLOS}, "eosio.token"_n},
    .fee = {{1000, TLOS}, "eosio.token"_n}
  };

  configTable.set(config, get_self());

  //GLOBALS initialization
  sysdefaults();
}

void EterniSVM::temp () {
  require_auth(get_self());

  const Account &account = accountsTable.get("krle"_n.value, "Account not found.");
  ExtendedSymbol symm = {VMT, "eternitkn131"_n};
  ExtendedSymbol sym2 = {TLOS, "eosio.token"_n};

  accountsTable.modify(account, get_self(), [&](Account &account) {
    account.tokens.fungible[symm].total.amount += 9990000;
    // account.tokens.fungible[sym2].total.amount += 10000;
  });
}

void EterniSVM::tokenairdrop (Name name) {
  checkfreeze();

  ExtendedAsset quantity = {{10000000, VMT}, "eternitkn131"_n};
  const String memo = "Test";

  action(
    permission_level{get_self(), "active"_n},
    configTable.get().ftGame,
    "issue"_n,
    make_tuple(get_self(), quantity.quantity, memo)
  ).send();

  const Account &account = accountsTable.get(name.value, "Account not found.");
  const FtSupply &ftSupply = ftSuppliesTable.get(VMT.code().raw(), "Token is not supported.");

  accountsTable.modify(account, get_self(), [&](Account &account) {
    addBalance(account, quantity);
    account.tokens.fungible[quantity.get_extended_symbol()].total += quantity.quantity;
  });

  ftSuppliesTable.modify(ftSupply, get_self(), [&](FtSupply &ftSupply) {
    ftSupply.total.quantity += quantity.quantity;
    ftSupply.liquid += quantity.quantity;
  });
}

//------------------------------------------------------------------------------

void EterniSVM::addBalance (Account &account, const ExtendedAsset &token) {
  const ExtendedSymbol &symbol = token.get_extended_symbol();

  FtBalances &fungible = account.tokens.fungible;
  FtBalances::iterator fungibleItr = fungible.find(symbol);

  if (fungibleItr == fungible.end()) {
    fungible[symbol] = {
      .total = token.quantity,
      .liquid = token.quantity,
      .staked = Asset(0, token.quantity.symbol),
      .unstaking = Asset(0, token.quantity.symbol),
      .claimable = {}
    };
  } else {
    Fungible2 &f2 = fungibleItr->second;

    f2.liquid += token.quantity;
  }
}

void EterniSVM::deductBalance (Account &account, const ExtendedAsset &token) {
  const ExtendedSymbol symbol = token.get_extended_symbol();

  FtBalances &fungible = account.tokens.fungible;
  FtBalances::iterator fungibleItr = fungible.find(symbol);

  check(fungibleItr != fungible.end(), "Insufficient balance.");

  Fungible2 &fungibleToken = fungibleItr->second;

  check(fungibleToken.liquid >= token.quantity, "Insufficient balance.");

  fungibleToken.liquid -= token.quantity;
}

void EterniSVM::addStake (Account &account, const ExtendedAsset &token) {
  // const Symbol &symbol = token.symbol;
  // FtBalance &ftStaked = account.tokens.fungible.staked;
  // FtBalance::const_iterator ftStakedItr = ftStaked.find(symbol);

  // if (ftStakedItr == ftStaked.end()) {
  //   ftStaked.emplace(symbol, token);
  // } else {
  //   ftStaked[symbol] += token;
  //   // ftStakedItr->second += token;
  // }


  const ExtendedSymbol &symbol = token.get_extended_symbol();

  FtBalances &fungible = account.tokens.fungible;
  FtBalances::iterator fungibleItr = fungible.find(symbol);

  if (fungibleItr != fungible.end()) {
    Fungible2 &f2 = fungibleItr->second;

    // f2.liquid -= token.quantity;
    f2.staked += token.quantity;
  }
}

void EterniSVM::deductStake (Account &account, const ExtendedAsset &token) {
  // const Symbol &symbol = token.symbol;
  // FtBalance &ftStaked = account.tokens.fungible.staked;
  // FtBalance::const_iterator ftStakedItr = ftStaked.find(symbol);

  // check(ftStakedItr != ftStaked.end(), "Overdrawn unstake amount.");

  // Asset &staked = ftStaked[symbol];

  // check(staked >= token, "Overdrawn unstake amount.");

  // staked -= token;

  // if (staked.amount <= 0) {
  //   ftStaked.erase(symbol);
  // }


  // Asset &ftStakedBalance = ftStakedItr->second;

  // check(ftStakedBalance >= token, "Overdrawn unstake amount.");

  // ftStakedBalance -= token;

  // if (ftStakedBalance.amount <= 0) {
  //   ftStaked.erase(token.symbol);
  // }

  // const Uint32 date = current_time_point().sec_since_epoch();

  // account.tokens.fungible.unstaking.emplace(date, token);





  const ExtendedSymbol &symbol = token.get_extended_symbol();

  FtBalances &fungible = account.tokens.fungible;
  FtBalances::iterator fungibleItr = fungible.find(symbol);

  if (fungibleItr != fungible.end()) {
    Fungible2 &f2 = fungibleItr->second;

    f2.staked -= token.quantity;
    f2.unstaking += token.quantity;
    f2.claimable[current_time_point().sec_since_epoch()] = token.quantity;
  }
}

void EterniSVM::payFee (Account &account) {
  const ExtendedAsset fee = configTable.get().fee;

  FtBalances &fungible = account.tokens.fungible;
  FtBalances::iterator ftLiquidItr = fungible.find(fee.get_extended_symbol());

  check(ftLiquidItr != fungible.end(), "Insufficient balance to pay the fees.");

  Asset &token = ftLiquidItr->second.liquid;
  Asset &total = ftLiquidItr->second.total;

  check(token >= fee.quantity, "Insufficient balance to pay the fees.");

  token -= fee.quantity;
  total -= fee.quantity;

  if (token.amount <= 0) {
    fungible.erase(fee.get_extended_symbol());
  }

  const FtSupplyItr ftSupplyItr = getFtSupplyItr(fee.quantity.symbol);

  ftSuppliesTable.modify(ftSupplyItr, get_self(), [&](FtSupply &ftSupply) {
    ftSupply.liquid -= fee.quantity;
    ftSupply.payments += fee.quantity;
  });
}

// Checks given signature with accounts public key, and returns account.
EterniSVM::AccountItr EterniSVM::svmAuth (
  const Name &name,
  const Signature &signature
) {
  const AccountItr accountItr = accountsTable.find(name.value);

  check(accountItr != accountsTable.end(), "Account not found");

  accountsTable.modify(accountItr, get_self(), [&](Account &account) {
    const String nonce = to_string(account.profile.nonce);
    const Checksum256 digest = sha256(nonce.c_str(), nonce.length());
    const PublicKey publicKey = recover_key(digest, signature);

    check(account.profile.publicKey == publicKey, "Invalid signature");

    //Implement throttle on Account to save CPU & prevent spam
    account.throttle = updateThrottle(getCurrentSecond(), account.lastUpdate, account.throttle, (Uint16) getglobalint(Name("throttle.perh")));
    account.lastUpdate = getCurrentSecond();

    account.profile.nonce += 1;
  });

  return accountItr;
}

EterniSVM::AccountItr EterniSVM::getAccountItr (const Name &name) {
  const AccountItr accountItr = accountsTable.find(name.value);

  check(accountItr != accountsTable.end(), "Account not found.");

  return accountItr;
}

EterniSVM::FtSupplyItr EterniSVM::getFtSupplyItr (const Symbol &symbol) {
  const FtSupplyItr ftSupplyItr = ftSuppliesTable.find(symbol.code().raw());

  check(ftSupplyItr != ftSuppliesTable.end(), "Token is not supported.");

  return ftSupplyItr;
}

EterniSVM::NftSupplyItr EterniSVM::getNftSupplyItr (const Name &contract) {
  const NftSupplyItr nftSupplyItr = nftSuppliesTable.find(contract.value);

  check(nftSupplyItr != nftSuppliesTable.end(), "NFT is not supported.");

  return nftSupplyItr;
}

// Checks whether token contract is supported.
Bool EterniSVM::checkTokenContract (Name name) {
  return name == EOSIO_TOKEN || name == ETERNITAS_TOKEN || name == "lptkns.swaps"_n;
}

vector<Uint16> EterniSVM::updateThrottle(Uint32 currentSecond, Uint32 lastUpdate, vector<Uint16> throttle, Uint16 maxPerHour) {

  Uint32 daysSinceEpoch = currentSecond / 86400;
  Uint32 secondOfDay = currentSecond % 86400;
  Uint16 hourOfDay = (Uint16) (secondOfDay / 3600) % 24; //0 to 23, inclusive

  Uint32 daysSinceEpoch_Last = lastUpdate / 86400;

  if(daysSinceEpoch == daysSinceEpoch_Last) { // same day
    throttle[hourOfDay]++;
  } else { // different day
    vector<Uint16> new_throttle{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
    throttle = new_throttle;
    throttle[hourOfDay]++;
  }

  check(throttle[hourOfDay] < maxPerHour, "Your account has exceeded the hourly activity limit. ");

  return throttle;
}