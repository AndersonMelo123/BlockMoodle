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
    Report[] public docs;

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
        docs.push(newReport);
    }
    
    function getLength() public view returns (uint) {
        return docs.length;
    }
}