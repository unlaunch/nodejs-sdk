import fetch from 'node-fetch';

const postImpressions = async (host, sdkKey, data) => {
    console.log(`'POST': ${host}/api/v1/impressions`);
    // console.log(`RES BODY: ${data}`)

    let res = await fetch(`${host}/api/v1/impressions`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Api-Key': `${sdkKey}`
        },
        body: JSON.stringify(data)
    })
 
    if (res.status == 200) {
        console.log('Successfully pushed impressions');
    } else {
        throw new Error(body.data);
    }
}

export default postImpressions;