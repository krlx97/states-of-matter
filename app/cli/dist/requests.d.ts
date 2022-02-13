declare const requests: ({
    name: string;
    req: {
        username: string;
        publicKey?: undefined;
        signature?: undefined;
    };
    res: {
        privateKeyHash: string;
    };
} | {
    name: string;
    req: {
        username: string;
        publicKey: string;
        signature: string;
    };
    res: {
        privateKeyHash: string;
    };
})[];
export default requests;
