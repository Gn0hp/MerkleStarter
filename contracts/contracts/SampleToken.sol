pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleToken is ERC20("SampleToken", "SPTK"), Ownable {
    constructor (uint256 _amount) public {
        _mint(msg.sender, _amount);
    }
    
    function burn(address _account, uint256 _amount) public onlyOwner {
        _burn(_account, _amount);
    }
}