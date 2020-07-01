pragma solidity ^0.4.17;

contract Moodle{
    
    struct Report {
        string description;
        uint timestamp;
        address sender;
        string doc;
        uint tipo;
    }
    
    address public manager;
    uint index;
    Report[] public docs;
    mapping(string => uint) position;
    mapping(string => bool) isTrue;
    
    function Moodle() public {
        manager = msg.sender;
    }
    
    function createReport(string memory description, string memory valor, uint tipo) public {
        
        Report memory newReport = Report({
            description: description,
            timestamp: now,
            sender: msg.sender,
            doc: valor,
            tipo: tipo
        });
    
        position[valor] = index;
        isTrue[valor] = true;
        
        index +=1;
        
        docs.push(newReport);
    }
    
    function isValid(string memory valor) public view returns (string memory, uint, address, string memory, uint){
        if (isTrue[valor]) {
            uint i = position[valor];
            Report memory doc = docs[i];
            return (
                doc.description,
                doc.timestamp,
                doc.sender,
                doc.doc,
                doc.tipo
            );
        }
    }
    
    function getDoc(uint i) public view returns (string memory, uint, address, string memory, uint) {
        Report memory doc = docs[i];
        return (
            doc.description,
            doc.timestamp,
            doc.sender,
            doc.doc,
            doc.tipo
        );
    }
    
    function getLength() public view returns (uint) {
        return docs.length;
    }
    
}
