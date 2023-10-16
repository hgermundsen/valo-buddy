import Image from "next/image";
const Firestore = require('@google-cloud/firestore');
const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const db = new Firestore({
    projectID: 'hunter-personal-playground',
    keyFile: 'serv-acct.json'
});

const ReadData = async (map: string) => {
    const stratsData = await db.collection('maps').doc(`${map}`).collection('strats').get();
    
    if (stratsData.empty) {
        console.log('Booooooo. This guy stinks!');
    }
    return stratsData;
}

export default async function Page({ params }: { params: { map: string } }) {
    
    const vodsData = await ReadData(params.map);
    let image: string;
    vodsData.forEach((element: { id: any; data: () => any; }) => {
        console.log(element.data());
        image = element.data().images[0];
    });
    return <div>
        <h1>{params.map.charAt(0).toUpperCase() + params.map.slice(1)} Strats Page</h1>
        <Image
            src={image}
            alt='A thing'
            width={370}
            height={208}
            quality={100}
            placeholder='blur'
            blurDataURL={image}
        />
    </div>
}