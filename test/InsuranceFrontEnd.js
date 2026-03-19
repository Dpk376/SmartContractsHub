import React, { useState } from 'react';
import { useWeb3 } from 'web3-react';
import { abi, address } from './Insurance.json'; // import ABI and address of the deployed contract

function Insurance() {
    const [policyAmount, setPolicyAmount] = useState();
    const [policyPeriod, setPolicyPeriod] = useState();
    const [hasClaimed, setHasClaimed] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const context = useWeb3();
    const contract = new context.library.eth.Contract(abi, address);

    const handleBuyPolicy = async (e) => {
        e.preventDefault();
        try {
            await contract.methods.buyPolicy(policyAmount).send({ from: context.account, value: policyAmount });
            setErrorMessage("Policy bought successfully");
        } catch (error) {
            setErrorMessage("Error buying policy: " + error.message);
        }
    }

    const handleClaim = async (e) => {
        e.preventDefault();
        try {
            await contract.methods.claim().send({ from: context.account });
            setErrorMessage("Claimed successfully");
            setHasClaimed(true);
        } catch (error) {
            setErrorMessage("Error claiming policy: " + error.message);
        }
    }

    return (
        <div>
            <form>
                <label>Enter policy amount:</label>
                <input type="text" onChange={e => setPolicyAmount(e.target.value)} />
                <button onClick={handleBuyPolicy}>Buy Policy</button>
            </form>

            <form>
                <label>Check policy period:</label>
                <button onClick={async () => setPolicyPeriod(await contract.methods.getPolicyPeriod().call())}>Check</button>
                {policyPeriod && <p>Your policy period is: {policyPeriod}</p>}
            </form>

            {!hasClaimed && 
                <form>
                    <label>Make a claim:</label>
                    <button onClick={handleClaim}>Claim</button>
                </form>
            }
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default Insurance;
