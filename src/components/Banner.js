import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Navbar, Nav, } from "react-bootstrap";
import { ArrowRightCircle, QrCode } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { mintNFT, verifyNFT, nftused, tokenURI ,totalSupply} from "../utils/interact.js";
import QRCodeStyling from "qr-code-styling";
import qr_logo from "../assets/img/qr_logo.png";
import emailjs from "emailjs-com";
import React from 'react';
import { connectWallet, getCurrentWalletConnected } from "../utils/interact";
import { CopyToClipboard } from "react-copy-to-clipboard";





export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  // eslint-disable-next-line no-unused-vars
  const [index, setIndex] = useState(1);
  const toRotate = ["BlockChain", "NFT Developer", "Web3 Developer"];
  const period = 2000;

 

  const serviceID = 'service_ht3538';
  const templateID = 'template_3j0swxb';
  const public_key = 'hHDC_0ICfYvN290Ae';

  //qrcode url setting
  // const onUrlChange = (event) => {
  //   setUrl(event);
  // };

  // const onDownloadClick = () => {
  //   onUrlChange(totalSupplyOfcall());
  //   qrCode.download({
  //     extension: fileExt
  //   });
  // };  
  //qrcode
   
  //email
  const email_send = async () => {
    var tokenid = await totalSupplyOfcall();
    var img_url = '<img src="https://api.qrserver.com/v1/create-qr-code/?data='+tokenid+'&amp;size=200x200" alt="QRcode error" />';
    console.log(tokenid)
    const emailParams = {
      to_name: name,
      to_email: email,
      qr_html: img_url,
    };
    console.log(img_url)
    emailjs.send(serviceID, templateID, emailParams, public_key)
        .then((result) => {
            console.log(result);    
        }, (error) => {
            console.log(error)
        })
  };

  //email


  //qrcode 掃描
  const [data, setData] = useState('No result');
  var QRdata = 'No result';
  //qrcode 驗證
  const QRdata_verify = async (data) => {
    if (QRdata != data){//判斷data是否被改變
      QRdata = data;
      if (await OwnerOfcall(data) == true){
        onVerify(data);
      };
    }
  }
  
  

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };
  



  //mintNFT
  const [count, setcount] = useState(1);
  const onMint = async () => {
    setcount(1);
    console.log(count);
    const { success, status } = await mintNFT(count);
    console.log(status);
    alert(status);
    if (success) {
      alert(`購票資訊已送出。\n姓名：${name}\n電話：${phone}\nEmail：${email}\n請至Email查收您的入場QRcode`);
      email_send();
    }else {
      alert("購票失敗!");
    }

  };

  //verify nft 
  
  var tokenId = "";
  
  const onVerify = async (data) => {
    // 👇 "inputRef.current.value" is input value
    tokenId = data;
    console.log(tokenId);
    if (tokenId < 0 || tokenId > 100) {
      console.log("Please input tokenId for the range 0~99.");
      alert("Please input tokenId for the range 0~99.");
    } else {
      const { status } = await verifyNFT(tokenId);
      console.log(status);
      alert(status);
    }
  };

  //nftused return(uint256)
  const OwnerOfcall = async(data)=>{
    tokenId = data;
    console.log(tokenId);
    if (tokenId < 0 || tokenId > 100) {
      console.log("Please input tokenId for the range 0~99.");
      alert("Please input tokenId for the range 0~99.");
      return false;
    } else {
      
      const { status, success} = await nftused(tokenId);
      console.log(status);
      console.log(success);
      console.log(success.toString());
      const baseuri = await tokenURICall(data);
      fetch(baseuri)
        .then((response) => response.json())
        .then((json) => alert(status+"\n"+json.image));
      return success;
    }
    
  }
  //totalSupply return(uint256)
  const totalSupplyOfcall = async()=>{
    const { status } = await totalSupply();
    console.log(status);
    //alert(parseInt(status.toString())-1);
    return parseInt(status.toString())-1;
  }
  

  //tokenURI
  const tokenURICall = async(data)=>{
    tokenId = data;
    if (tokenId < 0 || tokenId > 100) {
      console.log("Please input tokenId for the range 0~99.");
      alert("Please input tokenId for the range 0~99.");
    } else {
      const { status } = await tokenURI(tokenId);
      //console.log(status);
      //alert(status);
    return status;
    }
  }



  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');





  ////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////



  //提交購票資訊
  const handleSubmit = () => {
    if(walletAddress && walletAddress.length > 0){
      onMint();
    }else{
      alert(`購票資訊已送出。\n姓名：${name}\n電話：${phone}\nEmail：${email}`);
    }
    
    
  };

  return (
    <section className="banner" id="home">
      <Container>
      <div className="App" align="center">
      <h1>購票資訊</h1>
      
        <label>
          姓名：
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <br />
        <label>
          電話：
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <br />
        <label>
          Email：
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        
        
        <br />


              
              <div text={walletAddress} title="Copy Wallet address">
                <button className="connectwallet" onClick={connectWalletPressed} >
                  <span>
                    {walletAddress && walletAddress.length > 0
                      ? `已連結錢包: ${walletAddress.substring(
                          0,
                          6
                        )}...${walletAddress.substring(38)}`
                      : "點擊以連結錢包"}
                  </span>
                </button>
              </div>


        <div>

          <button onClick={handleSubmit}>確認購買</button>
        </div>
        
    </div>
      </Container>
    </section>
  );
}

