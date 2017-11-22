pragma solidity ^0.4.2;

contract TokenRecipient {
    event ReceivedEther(address sender, uint amount);
    event ReceivedTokens(address _form, uint256 _value, address _token, bytes _extraData);

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public {
        Token t = Token(_token);
        require(t.transferFrom(_from, this, _value));
        ReceivedTokens(_from, _value, _token, _extraData);
    }    

    function () payable public {
        ReceivedEther(msg.sender, msg.value);
    }
}

interface Token {
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
}
