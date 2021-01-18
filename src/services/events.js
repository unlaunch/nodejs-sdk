import fetch from 'node-fetch';

const postMetrics = async (host, sdkKey, events) => {
    console.log(`'POST': ${host}/api/v1/events`);
    // console.log(`RES BODY: ${events}`)

    let res = await fetch(`${host}/api/v1/events`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Api-Key': `${sdkKey}`
        },
        body: JSON.stringify(events)
    })

    if (res.status == 200) {
        console.log('Successfully pushed metrics');
    } else {
        throw new Error(body.data);
    }
}

export default postMetrics;