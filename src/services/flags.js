import fetch from 'node-fetch';

const getFlags = async (host, sdkKey) => {
    console.log(`'GET': ${host}/api/v1/flags`);
   
    let res = await fetch(`${host}/api/v1/flags`, {
        method: 'GET',
        headers: {
            'X-Api-Key': `${sdkKey}`
        },

    })
    const body = await res.json();
    if (res.status == 200) {
        return body.data.flags;
    } else {
        throw new Error(body.data);
    }
}

export default getFlags;