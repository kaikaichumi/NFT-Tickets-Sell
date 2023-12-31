import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import navIcon4 from "../assets/img/nav-icon4.svg";
import navIcon5 from "../assets/img/OpenSea_icon.png";
import navIcon6 from "../assets/img/nav-icon6.svg";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BrowserRouter as Router } from "react-router-dom";

const NavBar = ({ signOut }) => {
  //Navbar list
  const [activeLink, setActiveLink] = useState("home")
  const [scrolled, setScrolled] = useState(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    //Navbar scroll
    function onScroll() {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    //walletAddressListener is used switch address 
    async function walletListener() {
      //TODO: implement
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
      addWalletListener();
    }
    walletListener();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

 

  //Wallet
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("The web3 is connected!");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a
            target="_blank"
            href={`https://metamask.io/download.html`}
            rel="noreferrer"
          >
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }



  const connectWalletPressed = async () => {
    //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    console.log(status)
  };
  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <Nav className="LOGO">NFT tickets Sell</Nav>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              
              {/* <Nav.Link
                href="#projects"
                className={
                  activeLink === "projects"
                    ? "active navbar-link"
                    : "navbar-link"
                }
                onClick={() => onUpdateActiveLink("projects")}
              >
                NFT Collections
              </Nav.Link> */}
            </Nav>
            <span className="navbar-text">
              <div className="social-icon">
              <a
                  href="https://testnets.opensea.io/"
                  target="_blank"
                  title="Opensea"
                  rel="noreferrer"
                >
                  <img src={navIcon5} alt="" />
                </a>
                
                <a
                  href="https://kaikaichumi.github.io/NFT-Tickets/"
                  target="_blank"
                  title="NFT-Tickets"
                  rel="noreferrer"
                >
                  <img src={navIcon4} alt="" />
                </a>
                
                
                
              </div>
              
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  );
};


export default NavBar;