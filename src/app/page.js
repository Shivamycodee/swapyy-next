import styles from "./page.module.css";
import NavbarComp from "../components/NavbarComp.jsx";
import Swap from "../components/Swap.jsx";
import CFWallet from "../components/CFWallet.jsx";
import TransferUSDC from '../components/transfer.jsx';
import "bootstrap/dist/css/bootstrap.min.css";


export default function Home() {
  return (
    <main className={styles.main}>
      <NavbarComp />

      <div className="main-content-holder">
        
        <div>
          <Swap />
        </div>


        <div>
          <CFWallet />
        </div>
        
       <div>
        <TransferUSDC/>
       </div>


      </div>
    </main>
  );
}
