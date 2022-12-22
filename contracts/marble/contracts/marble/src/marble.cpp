#include "../include/marble.hpp"

//marble core
#include "./core/config.cpp"
#include "./core/groups.cpp"
#include "./core/behaviors.cpp"
#include "./core/items.cpp"

//marble layers
#include "./layers/tags.cpp"
#include "./layers/attributes.cpp"
#include "./layers/events.cpp"
#include "./layers/frames.cpp"
#include "./layers/bonds.cpp"
#include "./layers/wallets.cpp"

EOSIO_DISPATCH(marble, (init)(setversion)(setadmin)(newgroup)

(newtag)
(updatetag)
(locktag)
(rmvtag)


(mintitem)

(newattribute)
(rmvattribute)

(newframe)
(applyframe)
(quickbuild)
(cleanframe)
(rmvframe)

(transferitem)
);
