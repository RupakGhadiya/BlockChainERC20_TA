export default function TxList({ txs }) {
    if (txs.length === 0) return null;
    return (
      <>
        {txs.map((item) => (
          <div key={item.txHash} className="alert-info mt-5 rounded-xl py-2 px-4" style={{color:"grey", marginTop:"1rem", border:"4px solid grey", textAlign:"center", borderRadius:"20px", backgroundColor:"black"}}>
            <div>
              <p>Transection Successfull</p>
              {/* <p>From: {item.from}</p> */}
              {/* <p>To: {item.to}</p> */}
              <p>Amount: {item.amount}</p>
            </div>
          </div>
        ))}
      </>
    );
  }
  