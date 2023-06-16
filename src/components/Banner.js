import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle, QrCode } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { mintNFT, verifyNFT, nftused, tokenURI ,totalSupply} from "../utils/interact.js";
import QRCodeStyling from "qr-code-styling";
import qr_logo from "../assets/img/qr_logo.png";
import emailjs from "emailjs-com";
import React from 'react';
import { QrReader } from 'react-qr-reader';
// import { Email } from "./smtp.js";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image:
  qr_logo,
  dotsOptions: {
    color: "#000000",
    type: "rounded"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5
  },
});


export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  // eslint-disable-next-line no-unused-vars
  const [index, setIndex] = useState(1);
  const toRotate = ["BlockChain", "NFT Developer", "Web3 Developer"];
  const period = 2000;

  //qrcode
  // const [url, setUrl] = useState("");
  // const [fileExt] = useState("png");
  // const ref = useRef(null);
  const [ticketurl, seturl] = useState("");
  const serviceID = 'service_ht3538';
  const templateID = 'template_3j0swxb';
  const public_key = 'hHDC_0ICfYvN290Ae';

  // useEffect(() => {
  //   qrCode.append(ref.current);
  // }, []);

  // useEffect(() => {
  //   qrCode.update({
  //     data: url
  //   });
  // }, [url]);
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
  // const email_send = async () => {
  //   var tokenid = await totalSupplyOfcall();
  //   var img_url = '<img src="https://api.qrserver.com/v1/create-qr-code/?data='+tokenid+'&amp;size=200x200" alt="QRcode error" />';
  //   console.log(tokenid)
  //   const emailParams = {
  //     to_name: "kaikai",
  //     to_email: "karta2398980@gmail.com",
  //     qr_html: img_url,
  //   };
  //   console.log(img_url)
  //   emailjs.send(serviceID, templateID, emailParams, public_key)
  //       .then((result) => {
  //           console.log(result);    
  //       }, (error) => {
  //           console.log(error)
  //       })
  // };

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
  // const [count, setcount] = useState(1);
  // const onMint = async () => {
  //   setcount(1);
  //   console.log(count);
  //   const { status } = await mintNFT(count);
  //   console.log(status);
  //   alert(status);
  // };

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
      alert(status);
      fetch(baseuri)
        .then((response) => response.json())
        .then((json) => seturl(json.image));
      //alert(status+"   門票網址：https://sapphire-subsequent-pelican-620.mypinata.cloud/ipfs/QmTaGeVoQ6juoukCPfj87vteCqXGijXoa3aEzTcsW1y3kp/00.png");
      return success;
    }
    
  }
  //totalSupply return(uint256)
  const totalSupplyOfcall = async()=>{
    const { status } = await totalSupply();
    console.log(status);
    alert(parseInt(status.toString())-1);
    return parseInt(status.toString())-1;
  }
  

  //tokenURI
  const tokenURICall = async(data)=>{
    
    tokenId = data;
    console.log(tokenId);
    if (tokenId < 0 || tokenId > 100) {
      console.log("Please input tokenId for the range 0~99.");
      alert("Please input tokenId for the range 0~99.");
    } else {
      const { status } = await tokenURI(tokenId);
      console.log(status);
      //alert("https://sapphire-subsequent-pelican-620.mypinata.cloud/ipfs/QmTaGeVoQ6juoukCPfj87vteCqXGijXoa3aEzTcsW1y3kp/00.png");
      // fetch(status)
      //   .then((response) => response.json())
      //   .then((json) => alert(json.image));
    return status;
    }
  }
  
  const ticketURL = () => {
    //const url = ticketurl;
    //console.log(url);
    const url = "https://sapphire-subsequent-pelican-620.mypinata.cloud/ipfs/QmTaGeVoQ6juoukCPfj87vteCqXGijXoa3aEzTcsW1y3kp/00.png";
    var newTab = window.open(url, '_blank');
    // eslint-disable-next-line no-unused-expressions
    newTab.location;
  }








  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
        <Col xs={12} md={6} xl={7}>
            
              <div>
            
                <h4>TokenId: {data}</h4>
                <QrReader
                  onResult={(result, error) => {
                    if (!!result) {
                      setData(result?.text);
                      QRdata_verify(result?.text);
                    }

                    if (!!error) {
                      console.info(error);
                    }
                  }}
                  scanDelay={200}
                  style={{ width: '100%' }}
                />
              </div>

          </Col>
          <Col xs={12} md={6} xl={7}>
            
                {/* <div>             
                  <button onClick={onMint}>
                    購買NFT門票! <ArrowRightCircle size={30} />
                  </button>
                  
                </div> */}
                <div>
                  <button onClick={ticketURL}>
                    查看門票  <ArrowRightCircle size={30} />
                  </button>
                </div>
                
              
          </Col>
                
        </Row>

      </Container>
    </section>
  );
}

