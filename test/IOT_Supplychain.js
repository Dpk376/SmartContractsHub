<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/web3@1.3.0/dist/web3.min.js"></script>
  <script>
    // Connect to the Ethereum network
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // Set the contract address
    var contractAddress = "0x1234567890abcdef";

    // Set the contract ABI
    var contractABI = [{...}];

    // Connect to the contract
    var contract = new web3.eth.Contract(contractABI, contractAddress);

    // Add product
    function addProduct() {
      var productName = document.getElementById("productName").value;
      var productId = document.getElementById("productId").value;
      var productDescription = document.getElementById("productDescription").value;

      contract.methods.addProduct(productName, productId, productDescription).send({ from: web3.eth.defaultAccount }).then(function(receipt){
        console.log(receipt);
      });
    }

    // Update location
    function updateLocation() {
      var location = document.getElementById("location").value;

      contract.methods.updateLocation(location).send({ from: web3.eth.defaultAccount }).then(function(receipt){
        console.log(receipt);
      });
    }

    // Update temperature
    function updateTemperature() {
      var temperature = document.getElementById("temperature").value;

      contract.methods.updateTemperature(temperature).send({ from: web3.eth.defaultAccount }).then(function(receipt){
        console.log(receipt);
      });
    }

    // Update condition
    function updateCondition() {
      var condition = document.getElementById("condition").value;

      contract.methods.updateCondition(condition).send({ from: web3.eth.defaultAccount }).then(function(receipt){
        console.log(receipt);
      });
    }
  </script>
</head>
<body>
  <h1>Supply Chain Management</h1>
  <h2>Add Product</h2>
  <form>
    Product Name: <input type="text" id="productName"><br>
    Product ID: <input type="text" id="productId"><br>
    Product Description: <input type="text" id="productDescription"><br>
    <input type="button" value="Add Product" onclick="addProduct()">
  </form>

  <h2>Update Location</h2>
  <form>
    Location: <input type="text" id="location"><br>
    <input type="button" value="Update Location" onclick="updateLocation()">
  </form
