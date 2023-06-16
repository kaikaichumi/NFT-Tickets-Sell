import { ImgurClient } from 'imgur';

// CommonJS syntax
const client = new ImgurClient({ accessToken: "ad43bca8e978a396cdc4da98604e53c821fc9a1b" });
export const ImageUpload = async()=>{
    

    await client.upload('../assets/img/qr_logo.png');
}