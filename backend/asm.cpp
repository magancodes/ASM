/*
						TITLE : Claims 				 
						
						NAME  	        : Moulik Jain
						ROLL NUMBER     : 2201CS49
						Declaration of Authorship:
						This txt file is part of the assignment of the course CS210 at 
						Department of Computer Science and Engineering, IIT Patna .  
*/

#include <bits/stdc++.h>
using namespace std;

struct errorInfo 
{
	int location;
	
    string msg;
	
    bool operator< (const errorInfo &other) 
    {
		return location < other.location;
	}
};

struct warningInfo 
{
	int location;
	
    string msg;

    bool operator< (const warningInfo &other) 
    {
		return location < other.location;
	}
};

struct lineInfo 
{
	int pctr;
	
    string label;
    
    string mnemonic; 
    
    string operand;
};

struct listInfo 
{
	string address; 
    
    string macCode; 
    
    string statement; 
};

vector<errorInfo> error_list;						

vector<warningInfo> warning_list;					

vector<lineInfo> Lines;							

vector<listInfo> List;							

vector<string> mc_code;					            // Machines codes in 8 bit hex form

map<string, pair<int, int> > label_info;		    // {label, {address, lineNum}}

map<string, pair<string, int> > operand_table;		// {instruction, opcode, type of operand}

map<string, vector<int> > label_line; 		        // {labels, {list of line numbers where this label is ever used}}

map<string, string> variable_val; 				    // {variables(label), value associated}

vector<string> instruction_read; 					// stores each line 



bool isDigit(char c) 
{
    switch (c) 
    {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return true;
        default:
            return false;
    }
}


bool isAlphabet(char c) 
{
    char cc = tolower(c);
    const char alphabets[] = "abcdefghijklmnopqrstuvwxyz";
    for (int i = 0; alphabets[i] != '\0'; ++i) 
    {
        if (cc == alphabets[i]) 
        {
            return true;
        }
    }
    return false;
}

bool isValidLabel(string labelName) 
{
    bool isLabelValid = true;
    // Check if the first character is an alphabet
    isLabelValid &= isAlphabet(labelName[0]);
    // Check if the rest of the characters are alphanumeric or underscore
    for (size_t index = 1; index < labelName.length(); ++index) 
    {
        char currentChar = labelName[index];
        isLabelValid &= (isalnum(currentChar) || currentChar == '_');
    }
    return isLabelValid;
}


bool isDecimal(string x) 
{
	bool ok = true;
    int flag = 1;
	for (int i=0;i<x.size();i++)
    {
        char c = x[i];
        if(!isDigit(c))
        {
            flag = 0;
            break;
        }

	}
    if(flag == 1) return true;
    else return false;
	
}

bool isOctal(string octalNumber) 
{
    bool isNumberValid = true;    
    // Check if the string has at least two characters and starts with '0'
    if (octalNumber.size() < 2 || octalNumber[0] != '0') 
    {
        return false;
    } 
    // Check if each character is in the range '0' to '7'
    for (size_t index = 1; index < octalNumber.size(); ++index) 
    {
        if (octalNumber[index] < '0' || octalNumber[index] > '7') {
            return false;
        }
    }
    return true;
}

bool isHexadecimal(string hexadecimalNumber) 
{
    bool isNumberValid = true;
    // Check if the string has at least three characters and starts with '0x' or '0X'
    if (hexadecimalNumber.size() < 3 || (hexadecimalNumber[0] != '0' || (tolower(hexadecimalNumber[1]) != 'x'))) 
    {
        return false;
    }
    // Check if each character after '0x' or '0X' is a valid hexadecimal digit
    for (size_t index = 2; index < hexadecimalNumber.size(); ++index) 
    {
        char currentChar = tolower(hexadecimalNumber[index]);
        if (!isxdigit(currentChar))
        {
            return false;
        }
    }
    return true;
}

string octalToDec(string octalNumber) 
{
    int decimalResult = 0;
    int powerOfEight = 1;
    // Iterate through the string from right to left
    for (int i = octalNumber.size() - 1; i >= 0; --i) 
    {
        // Convert character to integer value
        int digit = octalNumber[i] - '0';
        // Update result by multiplying digit with power of 8
        decimalResult += digit * powerOfEight;
        // Update power of 8 for the next digit
        powerOfEight *= 8;
    }
    // Convert result to string and return
    return to_string(decimalResult);
}


string hexToDec(string hexNumber) 
{
    int decimalResult = 0;
    int powerOfSixteen = 1;
    // Iterate through the string from right to left
    for (int i = hexNumber.size() - 1; i >= 0; --i, powerOfSixteen *= 16) 
    {
        // Calculate the value of the current hexadecimal digit
        int digitValue;
        if (isdigit(hexNumber[i])) {
            digitValue = hexNumber[i] - '0';
        } else {
            digitValue = tolower(hexNumber[i]) - 'a' + 10;
        }
        // Update result by multiplying digit value with power of 16
        decimalResult += powerOfSixteen * digitValue;
    }
    // Convert result to string and return
    return to_string(decimalResult);
}


string decToHex(int decimalNumber)
{
    unsigned int number = decimalNumber;
    string hexResult = "";
    for (int i = 0; i < 8; ++i, number /= 16) 
    {
        int remainder = number % 16;
        char hexChar;
        if (remainder <= 9) {
            hexChar = char(remainder + '0');
        } else {
            hexChar = char(remainder - 10 + 'A');
        }
        hexResult += hexChar;
    }
    reverse(hexResult.begin(), hexResult.end());
    return hexResult;
}

string get_name_of_file(string inf)
{
    string nfile="";
    int dot = -1;
    for(int i=0;i<inf.length();i++)
    {
        if(inf[i] !='.')
        {
            continue;
        }
        else
        {
            dot = i;
            break;
        }
    }
    
    for(int i=0;i<dot;i++) nfile+=inf[i];

    return nfile;
}
int main(int argc,char ** argv) 
{
	    
	if(argc < 2 || argc > 2)
    {
        cout << "Incorrect File Naming Format \n";
        return 0;
    }
    string nfile = get_name_of_file(argv[1]);
    ifstream infile(argv[1]);
    if(!infile.is_open())
    {
        cout << "File is Empty \n";
        return 0;
    }
    string instruction;
    while(getline(infile,instruction))
    {
        instruction_read.push_back(instruction);
    }
    infile.close();



    operand_table["data"] = {"",1};
    operand_table["ldc"]  =  {"00", 1};
    operand_table["adc"]  =  {"01", 1};
    operand_table["ldl"]  = {"02", 2};
    operand_table["stl"]  = {"03", 2};
    operand_table["ldnl"] = {"04", 2};
    operand_table["stnl"] = {"05", 2};
    operand_table["add"]  = {"06", 0};
    operand_table["sub"]  = {"07", 0};
    operand_table["shl"]  =  {"08", 0};
    operand_table["shr"]  =  {"09", 0};
    operand_table["adj"]  =  {"0A", 1};
    operand_table["a2sp"] =  {"0B", 0};
    operand_table["sp2a"] =  {"0C", 0};
    operand_table["call"] =  {"0D", 2};
    operand_table["return"] =  {"0E", 0};
    operand_table["brz"]  =  {"0F", 2};
    operand_table["brlz"] =  {"10", 2};
    operand_table["br"]   =  {"11", 2};
    operand_table["HALT"] =  {"12", 0};
    operand_table["SET"]  =  {"", 1};

    int l1 = 0;
    int p1 = 0;
    int flag_halt = 0;
    for(int i=0;i<instruction_read.size();i++)
    {
        l1++;
        string current = instruction_read[i];
        if(current.empty()) continue;
        vector <string> ans;
        stringstream curr(current);
        string seg;
        while(curr >> seg)
        {
            if(seg == "HALT")flag_halt = 1;
            if(!seg.empty())
            {
                if(seg[0] != ';')
                {
                    if(seg.back() != ':')
                    {
                        if(seg.find(':') != string::npos)
                        {
                            int posi = -1;
                            for(int i=0;i<seg.size();i++)
                            {
                                if(seg[i] == ':')
                                {
                                    posi = i;
                                    break;
                                }
                            }
                            ans.push_back(seg.substr(0, posi + 1));
                            seg = seg.substr( posi + 1) ;
                        }
                    }
                    if(seg.back() == ';')
                    {
                        seg.pop_back();
                        ans.push_back(seg);
                        break;
                    }
                    ans.push_back(seg);
                }
                else break;
            }
            else continue;
        }
        string op = "";
        string operation = "";
        string label = "";
        if(operation == "HALT" || label == "HALT" || op == "HALT") flag_halt = 1;
        int ind = 0;
		
		if(ans.empty())continue;

        if( ans[ind].back() == ':')
        {
            label = ans[ind];
            label.pop_back();
            ind++;
        }
        if(ind < ans.size())
        {
            operation = ans[ind];
            ind++;
        }
        if(ind < ans.size())
        {
            op = ans[ind];
            ind++;
        }

        if(!label.empty())
        {
            if(!isValidLabel(label))
            {
                error_list.push_back({l1,"Invalid Label Name"});
            }
            else
            {
                if(label_info.count(label))
                {
                    if(label_info[label].first != -1)
                    {
                        error_list.push_back({l1,"Duplicate Label used "});
                    } 
                }
                if(!label_info.count(label) || label_info[label].first == -1)
                {
                    label_info[label] = {p1,l1};
                }
            }
        }

        bool flag = false;

        if(!operation.empty())
        {
            if(operand_table.count(operation))
            {
                if(operand_table[operation].second == 1 || operand_table[operation].second == 2)
                {
                    if(op.empty())
                    {
                        error_list.push_back({l1,"Operand is missing"});
                    }
                    else if(ans.size() - ind > 0)
                    {
                        error_list.push_back({l1,"Extra Operand present "});
                    }
                    else
                    {
 						string check = "";
                        if(!isValidLabel(op))
                        {
                            string tempop = op;
                            if(op[0] == '+')
                            {
                                check += '+';
                                tempop = "";
                                for(int i=1;i<op.size();i++)
                                {
                                    tempop += op[i];
                                }
                            }
                            if(op[0] == '-')
                            {
                                check += '-';
                                tempop = "";
                                for(int i=1;i<op.size();i++)
                                {
                                    tempop += op[i];
                                }
                            }
                            
                            int foc = 0;
                            int fdc = 0;
                            int fhx = 0;
                            if(isOctal(tempop))foc = 1;
                            if(isHexadecimal(tempop))fhx = 1;
                            if(isDecimal(tempop))fdc = 1;
							string tem = "";
                            if(foc == 1 )
                            {
                                for(int i=1;i<tempop.size();i++)tem += tempop[i];
								tem = octalToDec(tem);
								check += tem;
                            }
                            else if(fhx == 1)
                            {
                                for(int i=2;i<tempop.size();i++)tem += tempop[i];
								tem = hexToDec(tem);
								check += tem;

                            }
                            else if(fdc == 1)
                            {
                                for(int i=0;i<tempop.size();i++)check += tempop[i];

                            }
                            else check = "";
                        }
                        else
                        {
                            check = op;
                            if(label_info.count(op))
                            {
                                label_line[op].push_back(l1);
                            }
                            else
                            {
                                label_info[op] = {-1,l1};
                                label_line[op].push_back(l1);
                            }
                        }
                       
                        string s1 = check;
                        if(!s1.empty())
                        {
                            op = s1;
                            flag = true ;
                        }
                        else
                        {
                            error_list.push_back({l1,"Invalid Label Format"});
                        }
                       
                    }
                }
                else
                {
                    if(operand_table[operation].second == 0)
                    {
						if(op.empty())flag = true;
						else error_list.push_back({l1,"Extra Operand in  zero operand operation"});
                    }
                }
            }   
            else
            {
                error_list.push_back({l1,"Invalid Operation Name"});
            }
        }

        Lines.push_back({p1, label, operation, op});
		p1 += flag;
		if(flag)
		{
			if(operation == "SET")
			{
				if(!label.empty()) variable_val[label] = op;
				else error_list.push_back({l1,"Missing label name "});
			}
		}

    }

	for (auto label : label_info)
	{
		if (label.second.first == -1) 
		{
			for (auto lineNum : label_line[label.first]) 
			{
				error_list.push_back({lineNum, "Label not declared "});
			}
		}
		else if (!label_line.count(label.first)) 
		{
			warning_list.push_back({label.second.second, "Unused Label "});
		}
	}
	sort(error_list.begin(), error_list.end());
	sort(warning_list.begin(), warning_list.end());

	string error_file = nfile + ".log";
	ofstream coutErrors(error_file);
	for (int i=0;i<warning_list.size();i++)
    {
        auto output = warning_list[i];
		coutErrors << "Line: " << output.location << " WARNING: " << output.msg << endl;
	}
    if(!flag_halt) coutErrors << "WARNING !! : HALT not found " << endl;
	if (!error_list.empty()) 
    {
	    for (int i=0;i<error_list.size();i++) 
        {
            auto output = error_list[i];
	    	coutErrors << "Line: " << output.location << " ERROR: " << output.msg << endl;
	    }
	    coutErrors.close();
	}
    else 
    {
		coutErrors << "No errors!" << endl;
		coutErrors.close();
    }
    int ff = 0;
    if(error_list.empty())ff = 1;

	if (ff) 
	{						
		int i = 0;
        while(i < Lines.size())
        {
            int p1     =   Lines[i].pctr;
            string l   =   Lines[i].label;
            string m   =   Lines[i].mnemonic;
            string op  =   Lines[i].operand;
			if(!m.empty())
			{
				if(operand_table[m].second == 2)
				{
					string result = "        ";
					string x,y;
					if(label_info.count(op))
					{
						int ox = label_info[op].first - (p1+1) ;
						x = decToHex(ox);
						y = "";
						for(int j=2;j<x.size();j++) y += x[j];
						y += operand_table[m].first ;
					}
					else
					{
						int ox = (int)stoi(op) ;
						x = decToHex(ox);
						y = "";
						for(int j=2;j<x.size();j++) y += x[j];
						y += operand_table[m].first ;
					}
					result = y;
				
				 	mc_code.push_back(result);
            	    string z = l;if(!l.empty())z += ": ";z += m;if(!m.empty())z += " ";z+=op;
					string a = decToHex(p1);
            	    List.push_back({a,result,z});
				}
				else if(operand_table[m].second == 1)
				{
					if(m == "data")
					{
						string result = "        ";
						int x1 = (int)stoi(op);
						result = decToHex(x1);
						mc_code.push_back(result);
						string z = l;if(!l.empty())z += ": ";z += m;if(!m.empty())z += " ";z+=op;
						string a = decToHex(p1);
						List.push_back({a,result,z});
					}
					else if(m == "SET")
					{
						string result = "        ";
						int x1 = (int)stoi(op);
						result = decToHex(x1);
						//mc_code.push_back(result);
						string z = l;if(!l.empty())z += ": ";z += m;if(!m.empty())z += " ";z+=op;
						string a = decToHex(p1);
						List.push_back({a,result,z});
					}
					else
					{
						string result = "        ";
						string x,y;
						if(label_info.count(op))
						{
							int x1 = label_info[op].first;
							x = decToHex(x1);
							y = "";
							for(int j=2;j<x.size();j++) y += x[j];
							y += operand_table[m].first ;
						}
						else
						{
							int x2 = (int)stoi(op);
							x = decToHex(x2);
							y = "";
							for(int j=2;j<x.size();j++) y += x[j];
							y += operand_table[m].first ;
						}
						result = y;
						int c1 = variable_val.count(op);
						if(c1) 
						{
							int x1 = (int)stoi(variable_val[op]);
							string a,b;
							a = decToHex(x1);
							b = "";
							for(int j=2;j<a.size();j++) b+= a[j];
							b += operand_table[m].first;
							result = b;
						}
						mc_code.push_back(result);
						string z = l;if(!l.empty())z += ": ";z += m;if(!m.empty())z += " ";z+=op;
						string a = decToHex(p1);
						List.push_back({a,result,z});
					}

				}
				else if(operand_table[m].second == 0)
				{
					string result = "        ";
					result = "000000" ;
					result += operand_table[m].first;
					mc_code.push_back(result);
					string z = l;if(!l.empty())z += ": ";z += m;if(!m.empty())z += " ";z+=op;
					string a = decToHex(p1);
					List.push_back({a,result,z});
				}

			}
            else 
            {
                string result = "        ";
                mc_code.push_back(result);
				string z = l;if(!l.empty())z += ": ";z += m;if(!m.empty())z += " ";z+=op;
				string a = decToHex(p1);
				List.push_back({a,result,z});
            }

			i++;
        }
		string list_file = nfile + ".lst";
		ofstream coutList(list_file);
		for (int i=0;i<List.size();i++) 
		{
            auto output = List[i];
			coutList << output.address << " " << output.macCode << " " << output.statement << endl;
		}
		coutList.close();
		
        ofstream machine_code;
		string machine_file = nfile + ".o"; 
		machine_code.open(machine_file, ios::binary | ios::out);
		for (int i=0;i<mc_code.size();i++) 
		{
            auto output = mc_code[i];
			if (!output.empty())
            {
                if(output != "        ")
                {
                    unsigned int cur = (unsigned int)stoi(hexToDec(output));
                    static_cast<int>(cur);
                    machine_code.write((const char*)&cur, sizeof(unsigned int));
                }
            }
		}
		machine_code.close();
	}
	return 0;
}
