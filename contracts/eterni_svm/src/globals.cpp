//----------------------------------
// globals.cpp
// MIT License
// Ted @ dailytelosbp -- info@dailytelos.net
//----------------------------------

//********************************************
// ************ GLOBALS - Public Actions   ***
//********************************************

ACTION EterniSVM::sysglobalstr(Name &var, String &sval) {
    require_auth( get_self() );
    checkfreeze();

    setglobalstr(var, sval);
}

ACTION EterniSVM::sysglobalint(Name &var, Uint64 &nval) {
    require_auth( get_self() );
    checkfreeze();

    setglobalint(var, nval);
}

ACTION EterniSVM::sysdelglobal(Name &var) {
    require_auth( get_self() );
    checkfreeze();

    global_index _globals( get_self(), get_self().value );
    auto itr = _globals.find(var.value);

    check(itr != _globals.end(), "Variable (" + var.to_string() + ") not found. ");

    delglobal(var);
}

ACTION EterniSVM::sysfreeze(Uint64 &freeze) {
    require_auth( get_self() );

    setglobalint(Name("freeze"), freeze);
    print("Contract frozen state updated to: " + to_string(freeze));
}


//********************************************
// ************ GLOBALS - Private Internal ***
//********************************************


void EterniSVM::checkfreeze() {

    Uint64 nfreeze = getglobalint(Name("freeze"));

    if(nfreeze == 0) { return; }
    if(nfreeze == 1) //require EterniSVM to execute
    {
        check(has_auth(get_self()), "Contract is currently undergoing maintenance. ");
        return;
    }
    if(nfreeze >= 2)
    { check(false, "Contract is currently undergoing maintenance. "); }
}

String EterniSVM::getglobalstr(Name var) {
    global_index _globals( get_self(), get_self().value );
    auto itr = _globals.find(var.value);

    if(itr == _globals.end()) { return ""; }

    return itr->sval;
}

void EterniSVM::setglobalstr(Name var, String sval) {

    global_index _globals( get_self(), get_self().value );
    auto itr = _globals.find(var.value);

    if(itr == _globals.end()) {
        //create new record
         _globals.emplace( get_self(), [&]( auto& global_row ) {
            global_row.var  = var;
            global_row.sval   = sval;
            global_row.nval   = 0;

            //print("Variable added: " + var.to_string() + " - " + sval);
        });
    }
    else { //modify record
        _globals.modify( itr, get_self(), [&]( auto& global_row ) {
            global_row.sval = sval;

            //print("Variable changed: " + var.to_string() + " - " + sval);
        });
    }
}

Uint64 EterniSVM::getglobalint(Name var) {
    global_index _globals( get_self(), get_self().value );
    auto itr = _globals.find(var.value);

    if(itr == _globals.end()) { return 0; }

    return itr->nval;
}

void EterniSVM::setglobalint(Name var, Uint64 nval) {

    global_index _globals( get_self(), get_self().value );
    auto itr = _globals.find(var.value);

    if(itr == _globals.end()) {
        //create new record
         _globals.emplace( get_self(), [&]( auto& global_row ) {
            global_row.var  = var;
            global_row.sval   = "";
            global_row.nval   = nval;

            //print("Variable added: " + var.to_string() + " - " + to_string(nval));
        });
    }
    else { //modify record
        _globals.modify( itr, get_self(), [&]( auto& global_row ) {
            global_row.nval = nval;

            //print("Variable changed: " + var.to_string() + " - " + to_string(nval));
        });
    }
}

void EterniSVM::delglobal(Name var) {

    global_index _globals( get_self(), get_self().value );
    auto itr = _globals.find(var.value);

	if( itr != _globals.end() ) {
		itr = _globals.erase( itr );
        return;
	}
}

void EterniSVM::sysdefaults() {
    require_auth( get_self() );
    
    delglobal(Name("freeze"));
    setglobalint(Name("freeze"), 1);

    //maximum user accounts, before auto-deletions begin
    if(getglobalint(Name("accounts.max")) == 0) 
    {
        delglobal(Name("accounts.max"));
        setglobalint(Name("accounts.max"), 20000);
    }

    //current number of accounts
    if(getglobalint(Name("accounts.cur")) == 0) 
    {
        delglobal(Name("accounts.cur"));
        setglobalint(Name("accounts.cur"), 0);
    }

    //maximum account activities per hour
    if(getglobalint(Name("throttle.perh")) == 0) 
    {
        delglobal(Name("throttle.perh"));
        setglobalint(Name("throttle.perh"), 100);
    }
}

