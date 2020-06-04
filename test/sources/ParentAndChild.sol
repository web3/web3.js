pragma solidity ^0.5.0;

// This contract models event signature shadowing when
// one contract calls another. Events `similar` and `identical` have
// the same signature but their arguments are processed differently
// because of indexing.

contract Child  {
    // Three indexed args
    event Similar(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );

    // Two indexed args
    event Identical(
      address indexed childA,
      address indexed childB
    );

    function fireIdentical() public {
         emit Identical(address(0), address(0));
    }

    function fireSimilar() public {
         emit Similar(address(0), address(0), 1);
    }
}

contract Parent  {
    // Two (vs 3) indexed args, different names
    event Similar(
        address indexed owner,
        address indexed spender,
        uint256  value
    );

    // Two indexed args, named parent
    event Identical(
      address indexed parentA,
      address indexed parentB
    );

    function fireChildIdenticalEvent(address a) public {
        Child(a).fireIdentical();
    }

    function fireChildSimilarEvent(address a) public {
        Child(a).fireSimilar();
    }
}
