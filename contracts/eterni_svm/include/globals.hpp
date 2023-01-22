//----------------------------------
// globals.hpp
// MIT License
// Ted @ dailytelosbp -- info@dailytelos.net
//----------------------------------

//***************************************************
//**** GLOBALS - Contract Management             ****
//***************************************************
public:
// Administrator ACTIONS for GLOBALS

//Sets Global String
ACTION sysglobalstr(Name &var, String &sval);

//Sets Global Int
ACTION sysglobalint(Name &var, Uint64 &nval);

//Deletes Global
ACTION sysdelglobal(Name &var); 

//Freezes / Unfreezes Contract
// 0 - Unfreeze
// 1 - Freezes contract, except for get_self()
// 2 - Freezes everyone
ACTION sysfreeze(Uint64 &freeze);

private:

//Put inside action functions, cancels execution if contract frozen
void checkfreeze();

String getglobalstr(Name var);
void setglobalstr(Name var, String sval);

Uint64 getglobalint(Name var);
void setglobalint(Name var, Uint64 nval);

void delglobal(Name var);

void sysdefaults();

TABLE globalvars {
    Name          var;
    String        sval;
    Uint64      nval;

    auto primary_key() const { return var.value; };
};

typedef multi_index <Name("globals"), globalvars> global_index;