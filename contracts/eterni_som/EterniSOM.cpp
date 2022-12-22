#include "EterniSOM.hpp"

void EterniSOM::init () {
  require_auth(get_self());

  const Config config = {
    .svmContract = "eternisvm131"_n,
    .currencySymbol = Symbol("VMT", 4),
    .mintPrice = Asset(10000000, Symbol("VMT", 4)),
    .lastFlushEpoch = 1656415610
  };

  configTable.set(config, get_self());
}

void EterniSOM::signin (const Name &name, const Signature &signature) {
  // const Config config = configTable.get();

  // action(
  //   permission_level{get_self(), "active"_n},
  //   config.svmContract,
  //   "authenticate"_n,
  //   make_tuple(name, signature)
  // ).send();

  const PlayerItr playerItr = playersTable.find(name.value);

  if (playerItr == playersTable.end()) {
    playersTable.emplace(get_self(), [&](Player &player) {
      player.name = name;
      player.selectedSkins = {
        {SEAFARER, 0},
        {AVET, 0},
        {GUIDING_LIGHTS, 0},
        {GRAVEDIGGER, 0},
        {SPELLWEAVER, 0},
        {PUPPETEER, 0},
        {REBIRTH, 0},
        {EXHAUST, 0},
        {RELOAD, 0},
        {MIRRORS_EDGE, 0},
        {SMITE, 0},
        {ANTI_MAGE, 0},
        {SOLID_HERO, 0},
        {SOLID_1, 0},
        {SOLID_2, 0},
        {SOLID_3, 0},
        {SOLID_4, 0},
        {SOLID_5, 0},
        {SOLID_6, 0},
        {SOLID_7, 0},
        {SOLID_8, 0},
        {SOLID_9, 0},
        {SOLID_10, 0},
        {SOLID_11, 0},
        {SOLID_12, 0},
        {LIQUID_HERO, 0},
        {LIQUID_1, 0},
        {LIQUID_2, 0},
        {LIQUID_3, 0},
        {LIQUID_4, 0},
        {LIQUID_5, 0},
        {LIQUID_6, 0},
        {LIQUID_7, 0},
        {LIQUID_8, 0},
        {LIQUID_9, 0},
        {LIQUID_10, 0},
        {LIQUID_11, 0},
        {LIQUID_12, 0},
        {GAS_HERO, 0},
        {GAS_1, 0},
        {GAS_2, 0},
        {GAS_3, 0},
        {GAS_4, 0},
        {GAS_5, 0},
        {GAS_6, 0},
        {GAS_7, 0},
        {GAS_8, 0},
        {GAS_9, 0},
        {GAS_10, 0},
        {GAS_11, 0},
        {GAS_12, 0},
        {PLASMA_HERO, 0},
        {PLASMA_1, 0},
        {PLASMA_2, 0},
        {PLASMA_3, 0},
        {PLASMA_4, 0},
        {PLASMA_5, 0},
        {PLASMA_6, 0},
        {PLASMA_7, 0},
        {PLASMA_8, 0},
        {PLASMA_9, 0},
        {PLASMA_10, 0},
        {PLASMA_11, 0},
        {PLASMA_12, 0}
      };
    });
  }
}

void EterniSOM::temp () {
  require_auth(get_self());
}

void EterniSOM::selectskin (const Name &name, const Signature &signature, const Uint64 &serial) {
  items_table items("eterninft131"_n, "eterninft131"_n.value);
  auto nft = items.find(serial);
  check(nft != items.end(), "NFT not found.");



  // const Config config = configTable.get();
  // action(
  //   permission_level{get_self(), "active"_n},
  //   config.svmContract,
  //   "authenticate"_n,
  //   make_tuple(name, signature)
  // ).send();



  const AccountItr accountItr = accountsTable.find(name.value);
  const Account &account = *accountItr;
  auto &serials = account.tokens.nonFungible.serials;
  check(std::count(serials.begin(), serials.end(), serial), "You do not own the NFT.");



  shared_attributes_table shrd("eterninft131"_n, nft->group.value);
  auto cardId = shrd.find("cardid"_n.value);

  check(cardId != shrd.end(), "This is not a card NFT skin.");

  auto skinId = shrd.find("skinid"_n.value);

  playersTable.modify(playersTable.find(name.value), get_self(), [&](Player &player) {
    player.selectedSkins[cardId->points] = skinId->points;
  });
}

void EterniSOM::deselectskin (
  const Uint8 &cardId,
  const Name &name,
  const Signature &signature
) {
  // const Config config = configTable.get();
  // action(
  //   permission_level{get_self(), "active"_n},
  //   config.svmContract,
  //   "authenticate"_n,
  //   make_tuple(name, signature)
  // ).send();

  playersTable.modify(playersTable.find(name.value), get_self(), [&](Player &player) {
    // check(player.selectedSkins[cardId] != 0, "Default skin already selected.");

    player.selectedSkins[cardId] = 0;
  });
}
