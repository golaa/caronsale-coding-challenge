import sha from "sha.js";

export const hashPasswordWithCycles = (plainTextPassword: string, cycles: number = 5): string => {
    let hash = `${plainTextPassword}`;

    for(let i = 0; i < cycles; i++) {
        hash = sha('sha512').update(hash).digest('hex');
    }

    return hash;
};
