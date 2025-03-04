export const getTest = async () => {
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/test`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return resp.json();
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postLocation = async (data: any) => {
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/location/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return resp;
    } catch (error) {
        console.log(error);
    }
}