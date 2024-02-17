import "../styles/globals.css";
import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";

function MyApp({ Component, pageProps }) {
  return (
    <VotingProvider>
      <div>
        <NavBar></NavBar>
      </div>
      <Component {...pageProps} />
    </VotingProvider>
  );
}

export default MyApp;
