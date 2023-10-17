const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
    projectID: 'hunter-personal-playground',
    keyFile: 'serv-acct.json'
});

const ReadData = async (map: string) => {
    const vodsData = await db.collection('maps').doc(`${map}`).collection('vods').get();
    
    if (vodsData.empty) {
        console.log('Booooooo. This guy stinks!');
    }
    return vodsData;
}

export default async function Page({ params }: { params: { map: string } }) {
    
    const vodsData = await ReadData(params.map);
    vodsData.forEach((element: { id: any; data: () => any; }) => {
        console.log(element.data());
    });
    return <div>
        <h1>{params.map.charAt(0).toUpperCase() + params.map.slice(1)} VODs Page</h1>
    </div>
}